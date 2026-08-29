import React, { useEffect, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Critter from '../shared/art/Critter';
import Icon from '../shared/art/Icon';
import Scene from '../shared/art/Scene';
import { ACTIONS, UI } from './actionsContent';

const STYLE = `
  .ac *{box-sizing:border-box}

  .ac-topi{
    position:relative;width:200px;height:190px;display:grid;place-items:center;
    filter:drop-shadow(0 10px 16px rgba(26,26,110,.2));
  }

  /* The motion name comes straight from the content file. */
  .ac-body[data-motion="jump"]{animation:ac-jump .8s ease-in-out infinite}
  .ac-body[data-motion="chew"]{animation:ac-chew .55s ease-in-out infinite}
  .ac-body[data-motion="tilt"]{animation:ac-tilt 1.7s ease-in-out infinite}
  .ac-body[data-motion="breathe"]{animation:ac-breathe 2.6s ease-in-out infinite}
  .ac-body[data-motion="run"]{animation:ac-run .32s linear infinite}
  .ac-body[data-motion="dance"]{animation:ac-dance .7s ease-in-out infinite}
  .ac-body[data-motion="scrub"]{animation:ac-scrub .28s linear infinite}
  .ac-body[data-motion="squeeze"]{animation:ac-squeeze 1.5s ease-in-out infinite}
  .ac-body[data-motion="wave"]{animation:ac-wave .8s ease-in-out infinite}

  .ac-prop{
    position:absolute;top:2%;inset-inline-end:0;line-height:0;
    animation:ac-float 1.7s ease-in-out infinite;
  }

  .ac-verb{
    font-size:30px;font-weight:800;color:#1A1A6E;text-align:center;line-height:1.2;
    background:rgba(255,255,255,.9);border-radius:999px;padding:4px 22px;
  }
  .ac-line{
    font-size:15px;font-weight:600;color:#3A3357;text-align:center;line-height:1.5;
    min-height:22px;
  }

  .ac-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:24px 0 10px}
  .ac-words{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:9px}
  .ac-word{
    display:flex;align-items:center;justify-content:center;gap:8px;
    min-height:60px;padding:10px 12px;text-align:center;
    font-family:inherit;font-size:15px;font-weight:800;color:#3A3357;
    background:#fff;border:2.4px solid #3A3357;border-radius:15px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
    cursor:pointer;transition:.12s;
  }
  .ac-word:hover{background:#FFF4FA;transform:translateY(-3px);box-shadow:0 6px 0 rgba(58,51,87,.16)}
  .ac-word:active{transform:translateY(0);box-shadow:0 2px 0 rgba(58,51,87,.16)}
  .ac-word:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .ac-word[aria-pressed="true"]{color:#fff;background:#FF6FB5}

  .ac-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .ac-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:46px;padding:0 22px;
    font-family:inherit;font-size:14.5px;font-weight:700;color:#3A3357;
    background:#fff;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .ac-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .ac-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .ac-btn[aria-pressed="true"]{color:#fff;background:#4FC3E8}
  .ac-btn:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  @keyframes ac-jump{0%,100%{transform:translateY(0)}45%{transform:translateY(-26px)}}
  @keyframes ac-chew{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.92)}}
  @keyframes ac-tilt{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
  @keyframes ac-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes ac-run{0%,100%{transform:translateX(-7px) rotate(-4deg)}50%{transform:translateX(7px) rotate(4deg)}}
  @keyframes ac-dance{0%,100%{transform:rotate(-9deg) translateY(0)}50%{transform:rotate(9deg) translateY(-9px)}}
  @keyframes ac-scrub{0%,100%{transform:translateX(-4px)}50%{transform:translateX(4px)}}
  @keyframes ac-squeeze{0%,100%{transform:scale(1)}50%{transform:scale(.9)}}
  @keyframes ac-wave{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
  @keyframes ac-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

  @media (prefers-reduced-motion:reduce){
    .ac-body[data-motion],.ac-prop{animation:none}
    .ac-word,.ac-word:hover,.ac-btn,.ac-btn:hover{transition:none;transform:none}
  }
`;

export default function Actions({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [actionId, setActionId] = useState(null);
  const [sound, setSound] = useState(false);
  const [runId, setRunId] = useState(0);

  const action = ACTIONS.find((a) => a.id === actionId) || null;
  const actionCopy = action ? action[lang] || action.he : null;

  // Speech runs entirely in the browser (no network, no key). If the device has
  // no voice for this language it simply stays silent.
  useEffect(() => {
    if (!sound || !actionCopy) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new window.SpeechSynthesisUtterance(actionCopy.verb);
    utterance.lang = lang === 'he' ? 'he-IL' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [actionId, runId, sound, lang, actionCopy]);

  // Stop any queued speech when leaving the page.
  useEffect(
    () => () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    },
    []
  );

  const play = (id) => {
    setActionId(id);
    setRunId((prev) => prev + 1);
  };

  return (
    <div className="ac">
      <style>{STYLE}</style>

      <Scene variant="stage" minHeight={380}>
        <div className="ac-topi">
          {/* Keyed on runId so tapping the same verb restarts the animation. */}
          <div key={runId} className="ac-body" data-motion={action ? action.motion : 'breathe'}>
            <Critter
              species="topi"
              expression={action ? action.face : 'neutral'}
              size={170}
              label={actionCopy ? actionCopy.line : copy.idle}
            />
          </div>
          {action && action.prop && (
            <span className="ac-prop">
              <Icon name={action.prop} size={44} />
            </span>
          )}
        </div>

        <p className="ac-verb" aria-live="polite">
          {actionCopy ? actionCopy.verb : copy.idleVerb}
        </p>
        <p className="ac-line">{actionCopy ? actionCopy.line : copy.idle}</p>
      </Scene>

      <h3 className="ac-title">{copy.wordsTitle}</h3>
      <div className="ac-words">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="ac-word site-chrome"
            aria-pressed={a.id === actionId}
            onClick={() => play(a.id)}
          >
            {a.prop && <Icon name={a.prop} size={22} />}
            {(a[lang] || a.he).verb}
          </button>
        ))}
      </div>

      <div className="ac-actions">
        <button
          type="button"
          className="ac-btn site-chrome"
          aria-pressed={sound}
          onClick={() => setSound((prev) => !prev)}
        >
          {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {sound ? copy.soundOn : copy.soundOff}
        </button>
        {action && (
          <button type="button" className="ac-btn site-chrome" onClick={() => play(action.id)}>
            <RotateCcw className="w-4 h-4" />
            {copy.again}
          </button>
        )}
      </div>
    </div>
  );
}
