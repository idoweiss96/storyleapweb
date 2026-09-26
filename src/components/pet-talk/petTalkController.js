// petTalkController — הלוגיקה של השיחה עם הדמות, בלי תצוגה.
//
// משמש את הדמות התלת-ממדית (petTalkDog3D.js + PetTalk3D.jsx). התצוגה מקבלת אירועים
// ומבקשת בכל פריים את עוצמת הקול (level) כדי להזיז פה/אוזניים.
//
//   const c = createPetTalkController({ talk, childGender, onChange });
//   c.press()          ← לחיצה על הדמות/כפתור: מקשיבה / מסיימת / משתיקה
//   c.sendText('היי')  ← הודעה כתובה
//   c.level()          ← 0..1: עוצמת המיקרופון (בהקשבה) או הקול של הדמות (בדיבור)
//   c.destroy()
//
// onChange({ state, reply, childText, note }) נקרא בכל שינוי.
// state: idle | listening | thinking | speaking

const SILENCE_MS = 1300;      // שקט אחרי דיבור שמסיים את ההקלטה (R14: לא קוטעים את הילד)
const NO_SPEECH_MS = 7000;
const MAX_RECORD_MS = 12000;
const SPEECH_RMS = 0.035;
const HISTORY_TURNS = 6;
const MAX_TEXT = 300;
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

function blobToB64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function b64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function rms(analyser, buf) {
  analyser.getFloatTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}

export function createPetTalkController({ talk, childGender = 'u', onChange = () => {} } = {}) {
  if (typeof talk !== 'function') throw new Error('createPetTalkController: talk(payload) is required');

  const s = { state: 'idle', reply: '', childText: '', note: '' };
  let ctx = null;
  let stream = null;
  let recorder = null;
  let recordTimer = null;
  let micAnalyser = null;
  let micBuf = null;
  let voiceAnalyser = null;
  let voiceBuf = null;
  let source = null;
  let loopRaf = 0;
  let stoppedByHand = false;
  let history = [];
  let gender = ['m', 'f'].includes(childGender) ? childGender : 'u';
  let destroyed = false;
  let smooth = 0;

  const emit = (patch) => {
    Object.assign(s, patch);
    if (!destroyed) onChange({ ...s });
  };

  // AudioContext חייב להיווצר מתוך לחיצה — אחרת iOS משתיק את התשובה שמגיעה אחר כך
  async function ensureContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  function releaseMic() {
    clearTimeout(recordTimer);
    cancelAnimationFrame(loopRaf);
    loopRaf = 0;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    micAnalyser = null;
  }

  async function startListening() {
    await ensureContext();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      emit({ state: 'idle', note: 'הדפדפן הזה לא תומך בהקלטה — אפשר לכתוב לי למטה' });
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch {
      emit({ state: 'idle', note: 'צריך לאשר גישה למיקרופון — או לכתוב לי למטה' });
      return;
    }
    if (destroyed) return releaseMic();

    const mime = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported?.(m)) || '';
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    micAnalyser = ctx.createAnalyser();
    micAnalyser.fftSize = 1024;
    micBuf = new Float32Array(micAnalyser.fftSize);
    const micSource = ctx.createMediaStreamSource(stream);
    micSource.connect(micAnalyser);

    const startedAt = performance.now();
    let heardAt = 0;
    let lastLoudAt = 0;

    recorder.onstop = async () => {
      micSource.disconnect();
      releaseMic();
      if (destroyed || s.state !== 'listening') return;
      if (!heardAt && !(stoppedByHand && performance.now() - startedAt > 800)) {
        emit({ state: 'idle', note: 'לא שמעתי... נסו שוב' });
        return;
      }
      const blob = new Blob(chunks, { type: recorder.mimeType || mime || 'audio/webm' });
      send({ audio_b64: await blobToB64(blob), mime: blob.type });
    };

    const loop = () => {
      const now = performance.now();
      const level = micAnalyser ? rms(micAnalyser, micBuf) : 0;
      if (level > SPEECH_RMS) {
        lastLoudAt = now;
        if (!heardAt) heardAt = now;
      }
      if ((heardAt && now - lastLoudAt > SILENCE_MS) || (!heardAt && now - startedAt > NO_SPEECH_MS)) return stopRecording();
      loopRaf = requestAnimationFrame(loop);
    };

    stoppedByHand = false;
    emit({ state: 'listening', note: 'אני מקשיבה...' });
    recorder.start();
    loopRaf = requestAnimationFrame(loop);
    recordTimer = setTimeout(stopRecording, MAX_RECORD_MS);
  }

  function stopRecording() {
    cancelAnimationFrame(loopRaf);
    clearTimeout(recordTimer);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }

  async function send(input) {
    emit({ state: 'thinking', note: '' });
    try {
      const res = await talk({ ...input, history, child_gender: gender });
      if (destroyed) return;
      if (!res || res.state === 'no_speech') {
        emit({ state: 'idle', note: 'לא שמעתי... נסו שוב' });
        return;
      }
      if (res.state !== 'ok') throw new Error(res.error || 'failed');
      if (['m', 'f'].includes(res.child_gender)) gender = res.child_gender;
      history = [...history, { role: 'user', content: res.child_text }, { role: 'assistant', content: res.reply_text }].slice(-HISTORY_TURNS);
      emit({ reply: res.reply_text, childText: res.child_text });
      if (res.audio_b64) {
        try {
          await play(res.audio_b64);
        } catch (e) {
          // קובץ קול פגום: התשובה כבר בבועה — לא "אופס"
          console.error('[pet-talk] audio', e);
          if (!destroyed) emit({ state: 'idle' });
        }
      } else {
        emit({ state: 'idle' });   // הקול לא זמין — התשובה נשארת בבועה
      }
    } catch (e) {
      console.error('[pet-talk]', e);
      if (!destroyed) emit({ state: 'idle', note: 'אופס, משהו לא עבד. נסו שוב' });
    }
  }

  async function play(b64) {
    await ensureContext();
    const buffer = await ctx.decodeAudioData(b64ToArrayBuffer(b64));
    if (destroyed) return;
    voiceAnalyser = ctx.createAnalyser();
    voiceAnalyser.fftSize = 512;
    voiceBuf = new Float32Array(voiceAnalyser.fftSize);
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(voiceAnalyser);
    voiceAnalyser.connect(ctx.destination);
    smooth = 0;
    source.onended = () => {
      source = null;
      voiceAnalyser = null;
      if (!destroyed && s.state === 'speaking') emit({ state: 'idle' });
    };
    emit({ state: 'speaking' });
    source.start();
  }

  return {
    get state() { return s.state; },

    press() {
      if (destroyed) return;
      if (s.state === 'idle') startListening();
      else if (s.state === 'listening') { stoppedByHand = true; stopRecording(); }
      else if (s.state === 'speaking' && source) { try { source.stop(); } catch { /* כבר נעצר */ } }
    },

    async sendText(text) {
      const t = String(text || '').trim().slice(0, MAX_TEXT);
      if (!t || destroyed || s.state === 'thinking') return false;
      if (s.state === 'listening') { recorder.onstop = null; stopRecording(); releaseMic(); }
      if (s.state === 'speaking' && source) { try { source.stop(); } catch { /* */ } }
      await ensureContext().catch(() => {});
      send({ text: t });
      return true;
    },

    // עוצמה מוחלקת לתנועת הפה (בדיבור) או לטבעת ההקשבה (במיקרופון)
    level() {
      if (s.state === 'speaking' && voiceAnalyser) {
        const l = Math.min(1, rms(voiceAnalyser, voiceBuf) * 7);
        smooth += (l - smooth) * (l > smooth ? 0.55 : 0.25);
        return smooth < 0.06 ? 0 : smooth;
      }
      if (s.state === 'listening' && micAnalyser) return Math.min(1, rms(micAnalyser, micBuf) * 6);
      return 0;
    },

    destroy() {
      destroyed = true;
      if (recorder && recorder.state !== 'inactive') { recorder.onstop = null; recorder.stop(); }
      if (source) { try { source.stop(); } catch { /* */ } }
      releaseMic();
      if (ctx) ctx.close().catch(() => {});
    },
  };
}
