import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { hasVoice, setSoundOn, soundOn } from './sound';

/**
 * GameShell — the pieces every learning game shares: the button and bubble
 * styles, the level picker, the sound switch and the celebration burst.
 *
 * This is presentation only. Game logic stays inside each game — eight games
 * with eight different actions do not share a rule engine.
 */

export const LG_STYLE = `
  .lg *{box-sizing:border-box}
  .lg{position:relative}

  .lg-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px}
  .lg-levels{display:flex;flex-wrap:wrap;gap:7px}
  .lg-chip{
    display:inline-flex;flex-direction:column;align-items:center;justify-content:center;
    min-height:46px;min-width:64px;padding:4px 14px;
    font-family:inherit;font-size:14px;font-weight:800;line-height:1.15;color:#3A3357;
    background:#fff;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 3px 0 rgba(58,51,87,.18);cursor:pointer;transition:.12s;
  }
  .lg-chip small{font-size:11px;font-weight:700;opacity:.65}
  .lg-chip:hover{transform:translateY(-2px);box-shadow:0 5px 0 rgba(58,51,87,.18)}
  .lg-chip[aria-pressed="true"]{background:linear-gradient(135deg,#FF6FB5,#FF8EC4);color:#fff}
  .lg-chip[aria-pressed="true"] small{opacity:.9}
  .lg-chip:focus-visible,.lg-btn:focus-visible,.lg-round:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  .lg-round{
    width:46px;height:46px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;
    background:#fff;border:2.4px solid #3A3357;color:#3A3357;box-shadow:0 3px 0 rgba(58,51,87,.18);cursor:pointer;
  }

  .lg-pill{
    font-size:13px;font-weight:800;letter-spacing:.02em;color:#4A4468;
    background:rgba(255,255,255,.9);border:2px solid rgba(58,51,87,.15);
    border-radius:999px;padding:4px 14px;
  }

  .lg-bubble{
    max-width:360px;text-align:center;margin:0;
    font-size:16px;font-weight:600;line-height:1.5;color:#1a1a2e;
    background:#fff;border:2.4px solid #3A3357;border-radius:18px;padding:11px 16px;
    box-shadow:0 4px 0 rgba(58,51,87,.14);
  }
  .lg-bubble.warm{background:#FFF8EC;color:#7A5000}
  .lg-bubble.good{background:#EFFBF3;color:#1F6B3F}

  .lg-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center}
  .lg-btn{
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    min-height:48px;padding:0 24px;
    font-family:inherit;font-size:16px;font-weight:800;color:#fff;
    background:#FF6FB5;border:2.4px solid #3A3357;border-radius:15px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .lg-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .lg-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .lg-btn:disabled{opacity:.45;cursor:not-allowed}
  .lg-btn.blue{background:#4FC3E8}
  .lg-btn.ghost{background:#fff;color:#3A3357}
  .lg-btn.big{min-height:58px;font-size:19px;padding:0 32px;border-radius:18px}

  .lg-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:30;border-radius:24px}
  .lg-confetti i{position:absolute;top:-16px;display:block;border-radius:3px;animation:lg-fall 1.9s cubic-bezier(.3,.6,.5,1) forwards}
  .lg-bounce{animation:lg-bounce .7s ease}
  .lg-shake{animation:lg-shake .45s ease}
  .lg-pop{animation:lg-pop .35s ease}

  @keyframes lg-fall{
    0%{transform:translateY(0) rotate(0);opacity:1}
    100%{transform:translateY(560px) rotate(620deg);opacity:0}
  }
  @keyframes lg-bounce{
    0%,100%{transform:translateY(0) rotate(0)}
    30%{transform:translateY(-14px) rotate(-6deg)}
    65%{transform:translateY(-5px) rotate(6deg)}
  }
  @keyframes lg-shake{
    0%,100%{transform:translateX(0)}
    25%{transform:translateX(-7px)}
    50%{transform:translateX(6px)}
    75%{transform:translateX(-3px)}
  }
  @keyframes lg-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}

  @media (prefers-reduced-motion:reduce){
    .lg-confetti{display:none}
    .lg-bounce,.lg-shake,.lg-pop{animation:none}
    .lg-chip,.lg-btn,.lg-chip:hover,.lg-btn:hover:not(:disabled){transition:none;transform:none}
  }
`;

export const SHELL_COPY = {
  he: { level: 'רמה', soundOn: 'להשתיק', soundOff: 'להפעיל צלילים' },
  en: { level: 'Level', soundOn: 'Mute', soundOff: 'Turn sound on' },
};

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * A replayable shake. Returns [className, trigger]. Toggling a class (instead
 * of re-keying the element) keeps keyboard focus on the button that was pressed.
 */
export function useShake(ms = 460) {
  const [on, setOn] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);
  const trigger = useCallback(() => {
    clearTimeout(t.current);
    setOn(false);
    requestAnimationFrame(() => {
      setOn(true);
      t.current = setTimeout(() => setOn(false), ms);
    });
  }, [ms]);
  return [on ? ' lg-shake' : '', trigger];
}

export function useSoundOn() {
  const [on, setOn] = useState(soundOn());
  useEffect(() => {
    const sync = () => setOn(soundOn());
    window.addEventListener('sl-learn-sound', sync);
    return () => window.removeEventListener('sl-learn-sound', sync);
  }, []);
  return on;
}

/** True once the device reports a voice for `lang`. Voices load late on Chrome. */
export function useVoice(lang) {
  const [ok, setOk] = useState(() => hasVoice(lang));
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return undefined;
    const sync = () => setOk(hasVoice(lang));
    sync();
    synth.addEventListener?.('voiceschanged', sync);
    return () => synth.removeEventListener?.('voiceschanged', sync);
  }, [lang]);
  return ok;
}

export function SoundToggle({ lang = 'he' }) {
  const on = useSoundOn();
  const copy = SHELL_COPY[lang] || SHELL_COPY.he;
  return (
    <button
      type="button"
      className="lg-round site-chrome"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      aria-label={on ? copy.soundOn : copy.soundOff}
      title={on ? copy.soundOn : copy.soundOff}
    >
      {on ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}

/**
 * Level chips + sound switch. `levels` items: { id, he, en, ages }.
 * The ages are a suggestion printed on the chip, never a gate.
 */
export function Toolbar({ levels, level, onLevel, lang = 'he' }) {
  const copy = SHELL_COPY[lang] || SHELL_COPY.he;
  return (
    <div className="lg-top site-chrome">
      <div className="lg-levels" role="group" aria-label={copy.level}>
        {levels.map((lv) => (
          <button
            key={lv.id}
            type="button"
            className="lg-chip"
            aria-pressed={lv.id === level}
            onClick={() => onLevel(lv.id)}
          >
            {lv[lang] || lv.he}
            {lv.ages && <small>{lang === 'he' ? `גיל ${lv.ages}` : `age ${lv.ages}`}</small>}
          </button>
        ))}
      </div>
      <SoundToggle lang={lang} />
    </div>
  );
}

const CONFETTI_COLORS = ['#FF6FB5', '#4FC3E8', '#F5C842', '#5BC98C', '#A78BFA', '#FF9F5A'];

/** A one-shot burst. Change `burst` (a counter) to fire it again. */
export function Celebrate({ burst }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.45,
        w: 7 + Math.random() * 7,
        h: 9 + Math.random() * 9,
        round: i % 3 === 0,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst]
  );
  if (!burst) return null;
  return (
    <div className="lg-confetti" aria-hidden="true" key={burst}>
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.round ? p.w : p.h,
            borderRadius: p.round ? 999 : 3,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
