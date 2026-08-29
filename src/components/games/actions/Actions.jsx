import React, { useEffect, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { ACTIONS, UI } from './actionsContent';

const STYLE = `
  .ac *{box-sizing:border-box}

  .ac-stage{
    display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:26px 18px 22px;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #EDE9F8;border-radius:22px;
    box-shadow:0 4px 18px rgba(26,26,110,.08);
  }

  .ac-creature{position:relative;width:190px;height:180px;display:grid;place-items:center}

  .ac-body{
    position:relative;width:134px;height:128px;
    background:linear-gradient(158deg,#FF8CC4 0%,#7CD3EE 100%);
    border-radius:48% 52% 44% 56% / 56% 58% 42% 44%;
    box-shadow:0 10px 24px rgba(26,26,110,.16);
  }
  .ac-arm{
    position:absolute;top:52%;width:17px;height:44px;border-radius:999px;
    background:linear-gradient(160deg,#FF8CC4,#7CD3EE);
    transform-origin:50% 12%;
  }
  .ac-arm.start{inset-inline-start:-13px}
  .ac-arm.end{inset-inline-end:-13px}

  .ac-eyes{position:absolute;top:34%;inset-inline:0;display:flex;justify-content:center;gap:24px}
  .ac-eye{
    width:22px;height:22px;border-radius:50%;background:#fff;
    display:grid;place-items:center;
  }
  .ac-eye::after{content:'';width:10px;height:10px;border-radius:50%;background:#1A1A6E}

  .ac-mouth{
    position:absolute;top:60%;left:50%;transform:translateX(-50%);
    width:34px;height:17px;border-radius:0 0 999px 999px;background:#1A1A6E;
  }
  .ac-tear{
    position:absolute;top:46%;inset-inline-start:34%;font-size:15px;
    animation:ac-tear 1.5s ease-in-out infinite;
  }

  /* Faces */
  .ac-body[data-face="asleep"] .ac-eye{height:5px;border-radius:999px;background:#1A1A6E}
  .ac-body[data-face="asleep"] .ac-eye::after{display:none}
  .ac-body[data-face="asleep"] .ac-mouth{width:15px;height:13px;border-radius:999px}
  .ac-body[data-face="calm"] .ac-mouth{width:22px;height:5px;border-radius:999px}
  .ac-body[data-face="laugh"] .ac-mouth{width:42px;height:27px}
  .ac-body[data-face="sing"] .ac-mouth{width:21px;height:24px;border-radius:999px}
  .ac-body[data-face="sad"] .ac-mouth{top:66%;width:28px;height:14px;border-radius:999px 999px 0 0}

  /* Motions */
  .ac-body[data-motion="jump"]{animation:ac-jump .8s ease-in-out infinite}
  .ac-body[data-motion="chew"]{animation:ac-chew .55s ease-in-out infinite}
  .ac-body[data-motion="tilt"]{animation:ac-tilt 1.7s ease-in-out infinite}
  .ac-body[data-motion="breathe"]{animation:ac-breathe 2.6s ease-in-out infinite}
  .ac-body[data-motion="run"]{animation:ac-run .32s linear infinite}
  .ac-body[data-motion="dance"]{animation:ac-dance .7s ease-in-out infinite}
  .ac-body[data-motion="scrub"]{animation:ac-scrub .28s linear infinite}
  .ac-body[data-motion="squeeze"]{animation:ac-squeeze 1.5s ease-in-out infinite}
  .ac-body[data-motion="wave"] .ac-arm.end{animation:ac-wave .5s ease-in-out infinite}

  .ac-prop{
    position:absolute;top:4%;inset-inline-end:0;font-size:40px;line-height:1;
    animation:ac-float 1.7s ease-in-out infinite;
  }

  .ac-verb{
    font-size:30px;font-weight:800;color:#1A1A6E;text-align:center;line-height:1.2;
  }
  .ac-line{
    font-size:15.5px;color:rgba(26,26,46,.55);text-align:center;line-height:1.5;
    min-height:23px;
  }

  .ac-title{font-size:13px;font-weight:700;color:rgba(26,26,46,.45);margin:24px 0 10px}
  .ac-words{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:9px}
  .ac-word{
    display:flex;align-items:center;justify-content:center;
    min-height:56px;padding:10px 12px;text-align:center;
    font-family:inherit;font-size:15px;font-weight:700;color:#1A1A6E;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    cursor:pointer;transition:.15s;
  }
  .ac-word:hover{border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .ac-word:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .ac-word[aria-pressed="true"]{
    color:#fff;border-color:transparent;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
  }

  .ac-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:20px}
  .ac-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:44px;padding:0 20px;
    font-family:inherit;font-size:14.5px;font-weight:600;color:#1A1A6E;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;cursor:pointer;
  }
  .ac-btn[aria-pressed="true"]{color:#fff;border-color:transparent;background:linear-gradient(135deg,#FF6FB5,#4FC3E8)}
  .ac-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  @keyframes ac-jump{0%,100%{transform:translateY(0)}45%{transform:translateY(-26px)}}
  @keyframes ac-chew{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.92)}}
  @keyframes ac-tilt{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
  @keyframes ac-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes ac-run{0%,100%{transform:translateX(-7px) rotate(-4deg)}50%{transform:translateX(7px) rotate(4deg)}}
  @keyframes ac-dance{0%,100%{transform:rotate(-9deg) translateY(0)}50%{transform:rotate(9deg) translateY(-9px)}}
  @keyframes ac-scrub{0%,100%{transform:translateX(-4px)}50%{transform:translateX(4px)}}
  @keyframes ac-squeeze{0%,100%{transform:scale(1)}50%{transform:scale(.9)}}
  @keyframes ac-wave{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(38deg)}}
  @keyframes ac-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
  @keyframes ac-tear{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(18px)}}

  @media (prefers-reduced-motion:reduce){
    .ac-body,.ac-body[data-motion],.ac-prop,.ac-tear,.ac-body[data-motion="wave"] .ac-arm.end{animation:none}
    .ac-word,.ac-word:hover{transition:none;transform:none}
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

      <div className="ac-stage">
        <div className="ac-creature">
          <div
            key={runId}
            className="ac-body"
            data-face={action ? action.face : 'calm'}
            data-motion={action ? action.motion : 'breathe'}
            role="img"
            aria-label={actionCopy ? actionCopy.line : copy.idle}
          >
            <span className="ac-arm start" />
            <span className="ac-arm end" />
            <div className="ac-eyes">
              <span className="ac-eye" />
              <span className="ac-eye" />
            </div>
            <span className="ac-mouth" />
            {action && action.face === 'sad' && (
              <span className="ac-tear" role="img" aria-hidden="true">
                💧
              </span>
            )}
          </div>
          {action && action.prop && (
            <span className="ac-prop" role="img" aria-hidden="true">
              {action.prop}
            </span>
          )}
        </div>

        <p className="ac-verb" aria-live="polite">
          {actionCopy ? actionCopy.verb : copy.idleVerb}
        </p>
        <p className="ac-line">{actionCopy ? actionCopy.line : copy.idle}</p>
      </div>

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
