/**
 * sound.js — every sound in the learning games, synthesised in the browser.
 *
 * There is no audio file anywhere: tones come from the Web Audio API and words
 * from the built-in speechSynthesis. Both are browser APIs, not network calls,
 * so the "zero backend" rule from games/README.md still holds.
 *
 * One switch (localStorage) mutes everything, across all eight games.
 */

const KEY = 'sl_learn_sound';
let ctx = null;

export function soundOn() {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch (_) {
    return true;
  }
}

export function setSoundOn(on) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch (_) { /* private mode — the toggle still works for this page */ }
  try {
    window.dispatchEvent(new Event('sl-learn-sound'));
  } catch (_) { /* no window */ }
  if (!on) {
    try { window.speechSynthesis?.cancel(); } catch (_) { /* nothing speaking */ }
  }
}

function audio() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  // Browsers start the context suspended until a user gesture; every call
  // here happens inside a tap, so resuming is allowed.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, C6: 1046.5,
};

/** One soft note with a short attack and an exponential tail. */
export function tone(freq, { dur = 0.32, type = 'triangle', gain = 0.16, delay = 0 } = {}) {
  if (!soundOn()) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const osc = a.createOscillator();
  const env = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(env).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function chime() {
  tone(NOTES.C5, { dur: 0.22 });
  tone(NOTES.E5, { dur: 0.22, delay: 0.09 });
  tone(NOTES.G5, { dur: 0.4, delay: 0.18 });
}

/** The "not quite" sound: two low, quiet sine notes. Never a buzzer. */
export function hmm() {
  tone(NOTES.E4, { dur: 0.2, type: 'sine', gain: 0.1 });
  tone(NOTES.C4, { dur: 0.3, type: 'sine', gain: 0.1, delay: 0.14 });
}

export function tap() {
  tone(NOTES.G5, { dur: 0.07, type: 'sine', gain: 0.06 });
}

export function fanfare() {
  [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6].forEach((f, i) =>
    tone(f, { dur: i === 3 ? 0.7 : 0.18, delay: i * 0.12 })
  );
}

/** A drum hit: a sine whose pitch drops fast. */
export function drum() {
  if (!soundOn()) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const env = a.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(170, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.18);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.5, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  osc.connect(env).connect(a.destination);
  osc.start(t);
  osc.stop(t + 0.32);
}

/* ------------------------------------------------------------------ *
 * Speech — only when the device actually has a voice in that language.
 * ------------------------------------------------------------------ */
function voiceFor(lang) {
  try {
    const code = lang === 'he' ? 'he' : 'en';
    const voices = window.speechSynthesis?.getVoices() || [];
    // Some engines report Hebrew as "iw".
    return voices.find((v) => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith(code) || (code === 'he' && l.startsWith('iw'));
    }) || null;
  } catch (_) {
    return null;
  }
}

export function hasVoice(lang) {
  return !!voiceFor(lang);
}

export function speak(text, lang, { rate = 0.85 } = {}) {
  if (!soundOn()) return false;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const voice = voiceFor(lang);
  if (!synth || !voice) return false;
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = rate;
    synth.speak(u);
    return true;
  } catch (_) {
    return false;
  }
}
