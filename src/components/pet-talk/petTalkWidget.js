// petTalkWidget — הדמות המצוירת שמדברת עם הילד.
//
// בלי React ובלי תלויות, כדי שאותו קובץ ירוץ גם באתר (דרך PetTalk.jsx) וגם בדף
// הבדיקה המקומי (pet-talk/dev/index.html).
//
//   const w = mountPetTalk(el, { talk: async (payload) => response, name: 'פוצי' });
//   w.destroy();
//
// talk מקבל { audio_b64, mime, history, child_gender } ומחזיר את התשובה של הפונקציה petTalk.
// childGender: 'm' / 'f' אם האתר יודע (למשל מהפרופיל), אחרת הדמות מסיקה מהדיבור.
//
// זרימה: לחיצה → מקשיבה (עוצרת לבד אחרי שקט) → חושבת → מדברת (הפה זז לפי
// עוצמת הקול) → חוזרת למנוחה. לחיצה בזמן הקשבה = סיום, בזמן דיבור = עצירה.

const SILENCE_MS = 1300;      // שקט אחרי דיבור שמסיים את ההקלטה
const NO_SPEECH_MS = 7000;    // אם הילד לא התחיל לדבר עד אז — מוותרים
const MAX_RECORD_MS = 12000;
const SPEECH_RMS = 0.035;     // סף "יש דיבור"; מעליו רעש רקע רגיל לא עובר
const HISTORY_TURNS = 6;

const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

const STYLE_ID = 'pet-talk-style';
const CSS = `
.pt-root{--pt-fur:#F6B26B;--pt-fur-dark:#E08E45;--pt-belly:#FFE3C2;--pt-ink:#3B2A20;--pt-cheek:#FF9AA2;
  --pt-accent:#7C5CFF;--pt-bg:#FFF8EF;--pt-text:#3B2A20;
  direction:rtl;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:14px;
  width:100%;max-width:420px;margin:0 auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.pt-bubble{min-height:2.9em;max-width:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:22px;background:#fff;color:var(--pt-text);
  box-shadow:0 4px 18px rgba(59,42,32,.10);font-size:clamp(17px,4.6vw,21px);line-height:1.45;text-align:center;
  position:relative;transition:opacity .25s}
.pt-bubble:after{content:"";position:absolute;bottom:-9px;left:50%;margin-left:-9px;border:9px solid transparent;
  border-bottom:0;border-top-color:#fff}
.pt-bubble.pt-empty{opacity:0}
.pt-stage{position:relative;width:min(78vw,300px);aspect-ratio:1/1;cursor:pointer;border:0;background:none;padding:0}
.pt-stage:focus-visible{outline:3px solid var(--pt-accent);outline-offset:6px;border-radius:50%}
.pt-ring{position:absolute;inset:4%;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.18),rgba(124,92,255,0) 70%);
  transform:scale(.85);opacity:0;transition:opacity .2s}
.pt-listening .pt-ring{opacity:1}
.pt-svg{position:relative;width:100%;height:100%;overflow:visible}
.pt-body{transform-origin:150px 270px;animation:pt-breathe 3.6s ease-in-out infinite}
@keyframes pt-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.015,.985)}}
.pt-eye{transform-box:fill-box;transform-origin:center;animation:pt-blink 4.8s infinite}
@keyframes pt-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.pt-pupils{transition:transform .35s ease}
.pt-thinking .pt-pupils{transform:translate(6px,-7px)}
.pt-ear-l,.pt-ear-r{transition:transform .35s cubic-bezier(.3,1.6,.5,1)}
.pt-ear-l{transform-origin:92px 78px}.pt-ear-r{transform-origin:208px 78px}
.pt-listening .pt-ear-l{transform:rotate(14deg)}.pt-listening .pt-ear-r{transform:rotate(-14deg)}
.pt-head{transform-origin:150px 150px;transition:transform .4s ease}
.pt-thinking .pt-head{transform:rotate(-6deg)}
.pt-listening .pt-head{transform:translateY(-3px)}
.pt-dots{opacity:0;transition:opacity .2s}
.pt-thinking .pt-dots{opacity:1}
.pt-dots circle{animation:pt-dot 1.2s infinite ease-in-out}
.pt-dots circle:nth-child(2){animation-delay:.2s}.pt-dots circle:nth-child(3){animation-delay:.4s}
@keyframes pt-dot{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-6px);opacity:1}}
.pt-smile{transition:opacity .08s}
.pt-mouth-open{transform-box:fill-box;transform-origin:center top}
.pt-mic{display:flex;align-items:center;justify-content:center;gap:10px;min-width:190px;min-height:60px;padding:0 26px;
  border:0;border-radius:999px;background:var(--pt-accent);color:#fff;font:inherit;font-size:20px;font-weight:700;
  box-shadow:0 6px 18px rgba(124,92,255,.35);cursor:pointer;transition:transform .12s,background .2s}
.pt-mic:active{transform:scale(.96)}
.pt-mic:disabled{background:#B9AEE8;box-shadow:none;cursor:default}
.pt-listening .pt-mic{background:#FF6B6B;box-shadow:0 6px 18px rgba(255,107,107,.35)}
.pt-mic svg{width:24px;height:24px;flex:none}
.pt-note{min-height:1.4em;font-size:14px;color:#8A7563;text-align:center}
@media (prefers-reduced-motion:reduce){.pt-body,.pt-eye,.pt-dots circle{animation:none}}
`;

const MIC_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>';
const STOP_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>';

// גור עגול ופרוותי. viewBox 300×300; הפה סביב (150,196).
const CHARACTER_SVG = `
<svg class="pt-svg" viewBox="0 0 300 300" aria-hidden="true">
  <ellipse cx="150" cy="286" rx="92" ry="10" fill="#3B2A20" opacity=".10"/>
  <g class="pt-body">
    <ellipse cx="150" cy="248" rx="84" ry="42" fill="var(--pt-fur)"/>
    <ellipse cx="150" cy="256" rx="50" ry="28" fill="var(--pt-belly)"/>
    <ellipse cx="104" cy="280" rx="22" ry="12" fill="var(--pt-fur-dark)"/>
    <ellipse cx="196" cy="280" rx="22" ry="12" fill="var(--pt-fur-dark)"/>
    <g class="pt-head">
      <g class="pt-ear-l"><path d="M96 70 C58 58 38 110 52 160 C60 184 84 176 92 150 C100 120 110 92 96 70Z" fill="var(--pt-fur-dark)"/></g>
      <g class="pt-ear-r"><path d="M204 70 C242 58 262 110 248 160 C240 184 216 176 208 150 C200 120 190 92 204 70Z" fill="var(--pt-fur-dark)"/></g>
      <ellipse cx="150" cy="150" rx="92" ry="86" fill="var(--pt-fur)"/>
      <path d="M128 70 q10 -18 22 -6 q12 -14 22 4" fill="none" stroke="var(--pt-fur-dark)" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="150" cy="190" rx="50" ry="38" fill="var(--pt-belly)"/>
      <ellipse cx="96" cy="182" rx="15" ry="9" fill="var(--pt-cheek)" opacity=".55"/>
      <ellipse cx="204" cy="182" rx="15" ry="9" fill="var(--pt-cheek)" opacity=".55"/>
      <g class="pt-eye"><ellipse cx="114" cy="140" rx="17" ry="20" fill="#fff"/></g>
      <g class="pt-eye"><ellipse cx="186" cy="140" rx="17" ry="20" fill="#fff"/></g>
      <g class="pt-pupils">
        <g class="pt-eye"><circle cx="116" cy="144" r="11" fill="var(--pt-ink)"/><circle cx="120" cy="139" r="4" fill="#fff"/></g>
        <g class="pt-eye"><circle cx="184" cy="144" r="11" fill="var(--pt-ink)"/><circle cx="188" cy="139" r="4" fill="#fff"/></g>
      </g>
      <path d="M140 168 q10 -7 20 0 q-2 9 -10 11 q-8 -2 -10 -11Z" fill="var(--pt-ink)"/>
      <path class="pt-smile" d="M132 186 q9 10 18 0 q9 10 18 0" fill="none" stroke="var(--pt-ink)" stroke-width="4" stroke-linecap="round"/>
      <g class="pt-mouth-open" style="transform:scaleY(0)">
        <path d="M130 186 h40 q0 30 -20 30 q-20 0 -20 -30Z" fill="#7A2E2E"/>
        <ellipse cx="150" cy="208" rx="11" ry="6" fill="#FF8A8A"/>
      </g>
    </g>
  </g>
  <g class="pt-dots" fill="var(--pt-accent)">
    <circle cx="226" cy="58" r="7"/><circle cx="248" cy="44" r="7"/><circle cx="270" cy="30" r="7"/>
  </g>
</svg>`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

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

export function mountPetTalk(el, { talk, name = 'פוצי', showText = true, childGender = 'u' } = {}) {
  if (typeof talk !== 'function') throw new Error('mountPetTalk: talk(payload) is required');
  injectStyle();

  const root = document.createElement('div');
  root.className = 'pt-root';
  root.innerHTML = `
    <div class="pt-bubble pt-empty" aria-live="polite"></div>
    <button type="button" class="pt-stage" aria-label="דברו עם ${name}"><div class="pt-ring"></div>${CHARACTER_SVG}</button>
    <button type="button" class="pt-mic"></button>
    <div class="pt-note"></div>`;
  el.appendChild(root);

  const $ = (sel) => root.querySelector(sel);
  const bubble = $('.pt-bubble');
  const stage = $('.pt-stage');
  const ring = $('.pt-ring');
  const mic = $('.pt-mic');
  const note = $('.pt-note');
  const smile = $('.pt-smile');
  const mouth = $('.pt-mouth-open');

  let state = 'idle';
  let ctx = null;
  let stream = null;
  let recorder = null;
  let recordTimer = null;
  let raf = 0;
  let source = null;
  let history = [];
  // 'm' / 'f' מהאתר, או מה שהפונקציה הסיקה מהדיבור ('אני עצובה') — נשלח בכל תור (R22)
  let gender = ['m', 'f'].includes(childGender) ? childGender : 'u';
  let destroyed = false;
  let stoppedByHand = false;

  function say(text) {
    if (!showText) return;
    bubble.textContent = text || '';
    bubble.classList.toggle('pt-empty', !text);
  }

  function setState(next, message = '') {
    state = next;
    root.classList.toggle('pt-listening', next === 'listening');
    root.classList.toggle('pt-thinking', next === 'thinking');
    root.classList.toggle('pt-speaking', next === 'speaking');
    note.textContent = message;
    if (next === 'listening') mic.innerHTML = `${STOP_ICON}<span>סיימתי</span>`;
    else if (next === 'speaking') mic.innerHTML = `${STOP_ICON}<span>שקט</span>`;
    else mic.innerHTML = `${MIC_ICON}<span>דברו איתי</span>`;
    mic.disabled = next === 'thinking';
  }

  function setMouth(open) {
    const v = Math.max(0, Math.min(1, open));
    mouth.style.transform = `scaleY(${v.toFixed(3)})`;
    smile.style.opacity = v > 0.12 ? '0' : '1';
  }

  // AudioContext חייב להיווצר מתוך לחיצה — אחרת iOS משתיק את התשובה שמגיעה אחר כך
  async function ensureContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  function stopLoop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function releaseMic() {
    clearTimeout(recordTimer);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  async function startListening() {
    await ensureContext();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState('idle', 'הדפדפן הזה לא תומך בהקלטה');
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      setState('idle', 'צריך לאשר גישה למיקרופון');
      return;
    }
    if (destroyed) return releaseMic();

    const mime = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported?.(m)) || '';
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const micSource = ctx.createMediaStreamSource(stream);
    micSource.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);

    const startedAt = performance.now();
    let heardAt = 0;
    let lastLoudAt = 0;

    recorder.onstop = async () => {
      stopLoop();
      micSource.disconnect();
      releaseMic();
      ring.style.transform = '';
      if (destroyed || state !== 'listening') return;
      // ילד שדיבר בשקט מתחת לסף ולחץ "סיימתי" — עדיין שולחים
      if (!heardAt && !(stoppedByHand && performance.now() - startedAt > 800)) {
        setState('idle', 'לא שמעתי... נסו שוב');
        return;
      }
      const blob = new Blob(chunks, { type: recorder.mimeType || mime || 'audio/webm' });
      await send(blob);
    };

    const loop = () => {
      const now = performance.now();
      const level = rms(analyser, buf);
      ring.style.transform = `scale(${(0.85 + Math.min(level * 6, 0.3)).toFixed(3)})`;
      if (level > SPEECH_RMS) {
        lastLoudAt = now;
        if (!heardAt) heardAt = now;
      }
      const silentFor = now - lastLoudAt;
      if ((heardAt && silentFor > SILENCE_MS) || (!heardAt && now - startedAt > NO_SPEECH_MS)) {
        return stopRecording();
      }
      raf = requestAnimationFrame(loop);
    };

    stoppedByHand = false;
    setState('listening', 'אני מקשיבה...');
    recorder.start();
    raf = requestAnimationFrame(loop);
    recordTimer = setTimeout(stopRecording, MAX_RECORD_MS);
  }

  function stopRecording() {
    stopLoop();
    clearTimeout(recordTimer);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }

  async function send(blob) {
    setState('thinking');
    try {
      const audio_b64 = await blobToB64(blob);
      const res = await talk({ audio_b64, mime: blob.type, history, child_gender: gender });
      if (destroyed) return;
      if (!res || res.state === 'no_speech') {
        setState('idle', 'לא שמעתי... נסו שוב');
        return;
      }
      if (res.state !== 'ok') throw new Error(res.error || 'failed');
      if (['m', 'f'].includes(res.child_gender)) gender = res.child_gender;
      history = [
        ...history,
        { role: 'user', content: res.child_text },
        { role: 'assistant', content: res.reply_text },
      ].slice(-HISTORY_TURNS);
      say(res.reply_text);
      if (res.audio_b64) {
        try {
          await play(res.audio_b64);
        } catch (e) {
          // קובץ קול פגום: התשובה כבר בבועה — לא "אופס"
          console.error('[pet-talk] audio', e);
          if (!destroyed) setState('idle');
        }
      } else {
        // הקול לא זמין — התשובה נשארת בבועה, והדמות חוזרת להקשיב
        setState('idle');
      }
    } catch (e) {
      console.error('[pet-talk]', e);
      if (!destroyed) setState('idle', 'אופס, משהו לא עבד. נסו שוב');
    }
  }

  async function play(b64) {
    await ensureContext();
    const buffer = await ctx.decodeAudioData(b64ToArrayBuffer(b64));
    if (destroyed) return;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const buf = new Float32Array(analyser.fftSize);
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    let smooth = 0;
    const loop = () => {
      // תנועת פה: עוצמה מוחלקת, כך שהפה נפתח עם הברות ולא רוטט
      const level = Math.min(1, rms(analyser, buf) * 7);
      smooth += (level - smooth) * (level > smooth ? 0.55 : 0.25);
      setMouth(smooth < 0.06 ? 0 : 0.25 + smooth * 0.75);
      raf = requestAnimationFrame(loop);
    };

    setState('speaking');
    source.onended = () => {
      stopLoop();
      setMouth(0);
      source = null;
      if (!destroyed && state === 'speaking') setState('idle');
    };
    source.start();
    raf = requestAnimationFrame(loop);
  }

  function stopSpeaking() {
    if (source) {
      try { source.stop(); } catch { /* כבר נעצר */ }
    }
  }

  function onPress() {
    if (state === 'idle') startListening();
    else if (state === 'listening') {
      stoppedByHand = true;
      stopRecording();
    }
    else if (state === 'speaking') stopSpeaking();
  }

  mic.addEventListener('click', onPress);
  stage.addEventListener('click', onPress);
  setState('idle');
  say(`היי! אני ${name}. לחצו עליי ודברו איתי`);

  return {
    destroy() {
      destroyed = true;
      stopLoop();
      stopSpeaking();
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      releaseMic();
      if (ctx) ctx.close().catch(() => {});
      root.remove();
    },
  };
}
