import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { PATIENTS, TOOLS, UI } from './clinicContent';

const STYLE = `
  .cl *{box-sizing:border-box}

  .cl-room{
    position:relative;
    display:flex;flex-direction:column;align-items:center;gap:14px;
    padding:26px 18px 22px;
    background:linear-gradient(160deg,#fff 0%,#FFF8FB 100%);
    border:2px solid #EDE9F8;border-radius:22px;
    box-shadow:0 4px 18px rgba(26,26,110,.08);
  }
  .cl-counter{
    font-size:12.5px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.42);
  }
  .cl-patient{font-size:84px;line-height:1;display:block}
  .cl-patient.happy{animation:cl-cheer .7s ease}
  .cl-name{font-size:20px;font-weight:700;color:#1A1A6E}

  .cl-bubble{
    position:relative;max-width:340px;text-align:center;
    font-size:16px;line-height:1.5;color:#1a1a2e;
    background:#fff;border:2px solid #FFD6EC;border-radius:18px;
    padding:13px 17px;
  }
  .cl-bubble::after{
    content:'';position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(45deg);
    width:14px;height:14px;background:#fff;
    border-top:2px solid #FFD6EC;border-left:2px solid #FFD6EC;
  }
  .cl-bubble.nudge{border-color:#F5C842;background:#FFF8EC;color:#7A5000}

  .cl-dots{display:flex;gap:7px}
  .cl-dot{
    width:11px;height:11px;border-radius:999px;
    background:#EDE9F8;transition:background .2s;
  }
  .cl-dot.on{background:linear-gradient(135deg,#FF6FB5,#4FC3E8)}

  .cl-tools-title{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:24px 0 10px;
  }
  .cl-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:9px}
  .cl-tool{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:88px;padding:11px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:15px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .cl-tool:hover:not(:disabled){border-color:#FF6FB5;background:#FFF8FB;transform:translateY(-2px)}
  .cl-tool:disabled{opacity:.35;cursor:not-allowed}
  .cl-tool:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .cl-tool-emoji{font-size:30px;line-height:1}
  .cl-tool-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}
  .cl-tool.used{border-color:#4FC3E8;background:#F2FBFE}

  .cl-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:22px}
  .cl-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:44px;padding:0 22px;
    font-family:inherit;font-size:15px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);
    border:0;border-radius:12px;cursor:pointer;
  }
  .cl-btn.ghost{
    color:#1A1A6E;background:#fff;border:1.5px solid #EDE9F8;
  }
  .cl-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}

  .cl-done{
    display:flex;flex-direction:column;align-items:center;gap:12px;
    padding:44px 22px;text-align:center;
    background:linear-gradient(160deg,#fff 0%,#FFF0F7 100%);
    border:2px solid #FFD6EC;border-radius:22px;
  }
  .cl-done-emoji{font-size:62px;line-height:1}
  .cl-done h2{font-size:21px;font-weight:700;color:#1A1A6E;margin:0}
  .cl-done p{font-size:15px;line-height:1.55;color:rgba(26,26,46,.6);max-width:360px;margin:0}

  @keyframes cl-cheer{
    0%,100%{transform:translateY(0) rotate(0)}
    30%{transform:translateY(-14px) rotate(-7deg)}
    65%{transform:translateY(-6px) rotate(7deg)}
  }

  @media (prefers-reduced-motion:reduce){
    .cl-patient.happy{animation:none}
    .cl-tool,.cl-tool:hover{transition:none;transform:none}
  }
`;

export default function Clinic({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [used, setUsed] = useState([]);
  const [nudge, setNudge] = useState(false);

  const patient = PATIENTS[index];
  // Past the last patient the room is empty and we show the closing card.
  const finished = index >= PATIENTS.length;

  if (finished) {
    return (
      <div className="cl">
        <style>{STYLE}</style>
        <div className="cl-done">
          <span className="cl-done-emoji">🏥</span>
          <h2>{copy.allDoneTitle}</h2>
          <p>{copy.allDoneText}</p>
          <button
            type="button"
            className="cl-btn site-chrome"
            onClick={() => {
              setIndex(0);
              setStep(0);
              setUsed([]);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            {copy.startOver}
          </button>
        </div>
      </div>
    );
  }

  const info = patient[lang] || patient.he;
  const treated = step >= patient.steps.length;
  const current = treated ? null : patient.steps[step];
  const currentCopy = current ? current[lang] || current.he : null;
  const lastDone = step > 0 ? patient.steps[step - 1] : null;
  const lastDoneCopy = lastDone ? lastDone[lang] || lastDone.he : null;

  // What the patient is saying right now, in priority order.
  let line = info.problem;
  if (treated) line = info.farewell;
  else if (nudge) line = copy.notYet;
  else if (currentCopy && step > 0) line = `${lastDoneCopy.done}. ${currentCopy.ask}`;
  else if (currentCopy) line = `${info.problem}. ${currentCopy.ask}`;

  const applyTool = (toolId) => {
    if (treated) return;
    if (toolId !== current.tool) {
      setNudge(true);
      return;
    }
    setNudge(false);
    setUsed((prev) => [...prev, toolId]);
    setStep((prev) => prev + 1);
  };

  const nextPatient = () => {
    setIndex((prev) => prev + 1);
    setStep(0);
    setUsed([]);
    setNudge(false);
  };

  return (
    <div className="cl">
      <style>{STYLE}</style>

      <div className="cl-room">
        <span className="cl-counter">
          {copy.patientOf.replace('{n}', String(index + 1)).replace('{total}', String(PATIENTS.length))}
        </span>

        <span className={`cl-patient${treated ? ' happy' : ''}`} role="img" aria-label={info.name}>
          {patient.emoji}
        </span>
        <span className="cl-name">{info.name}</span>

        <p className={`cl-bubble${nudge ? ' nudge' : ''}`} aria-live="polite">
          {line}
        </p>

        <div className="cl-dots" role="presentation">
          {patient.steps.map((s, i) => (
            <span key={s.tool} className={`cl-dot${i < step ? ' on' : ''}`} />
          ))}
        </div>

        {treated && (
          <button type="button" className="cl-btn site-chrome" onClick={nextPatient}>
            {copy.nextPatient}
          </button>
        )}
      </div>

      <h3 className="cl-tools-title">{copy.toolsTitle}</h3>
      <div className="cl-tools">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`cl-tool site-chrome${used.includes(tool.id) ? ' used' : ''}`}
            onClick={() => applyTool(tool.id)}
            disabled={treated}
          >
            <span className="cl-tool-emoji" role="img" aria-hidden="true">
              {tool.emoji}
            </span>
            <span className="cl-tool-text">{tool[lang] || tool.he}</span>
          </button>
        ))}
      </div>

      <div className="cl-actions">
        <button
          type="button"
          className="cl-btn ghost site-chrome"
          onClick={() => {
            setStep(0);
            setUsed([]);
            setNudge(false);
          }}
        >
          <RotateCcw className="w-4 h-4" />
          {copy.startOver}
        </button>
      </div>
    </div>
  );
}
