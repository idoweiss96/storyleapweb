import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Critter from '../shared/art/Critter';
import Icon from '../shared/art/Icon';
import Scene from '../shared/art/Scene';
import { PATIENTS, TOOLS, UI } from './clinicContent';

const STYLE = `
  .cl *{box-sizing:border-box}

  .cl-counter{
    font-size:12.5px;font-weight:700;letter-spacing:.02em;
    color:#5B5578;background:rgba(255,255,255,.85);
    border-radius:999px;padding:4px 14px;
  }
  .cl-critter{filter:drop-shadow(0 8px 14px rgba(26,26,110,.18))}
  .cl-critter.happy{animation:cl-cheer .7s ease}
  .cl-name{font-size:19px;font-weight:800;color:#1A1A6E}

  .cl-bubble{
    position:relative;max-width:330px;text-align:center;
    font-size:15.5px;line-height:1.5;color:#1a1a2e;
    background:#fff;border:2.4px solid #3A3357;border-radius:18px;
    padding:12px 16px;
    box-shadow:0 4px 0 rgba(58,51,87,.14);
  }
  .cl-bubble::after{
    content:'';position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(45deg);
    width:14px;height:14px;background:#fff;
    border-top:2.4px solid #3A3357;border-left:2.4px solid #3A3357;
  }
  .cl-bubble.nudge{background:#FFF8EC;color:#7A5000}

  .cl-dots{display:flex;gap:7px}
  .cl-dot{
    width:12px;height:12px;border-radius:999px;
    background:rgba(255,255,255,.9);border:2px solid #3A3357;transition:background .2s;
  }
  .cl-dot.on{background:#FF6FB5}

  .cl-tools-title{
    font-size:13px;font-weight:700;letter-spacing:.02em;
    color:rgba(26,26,46,.45);margin:24px 0 10px;
  }
  .cl-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:9px}
  .cl-tool{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
    min-height:96px;padding:11px 6px;text-align:center;
    background:#fff;border:2.4px solid #3A3357;border-radius:16px;
    box-shadow:0 3px 0 rgba(58,51,87,.16);
    font-family:inherit;cursor:pointer;transition:.12s;
  }
  .cl-tool:hover:not(:disabled){background:#FFF4FA;transform:translateY(-3px);box-shadow:0 6px 0 rgba(58,51,87,.16)}
  .cl-tool:active:not(:disabled){transform:translateY(0);box-shadow:0 2px 0 rgba(58,51,87,.16)}
  .cl-tool:disabled{opacity:.4;cursor:not-allowed}
  .cl-tool:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}
  .cl-tool-text{font-size:12px;font-weight:700;color:#3A3357;line-height:1.3}
  .cl-tool.used{background:#EAF8FD}

  .cl-actions{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:22px}
  .cl-btn{
    display:inline-flex;align-items:center;gap:7px;
    min-height:46px;padding:0 24px;
    font-family:inherit;font-size:15px;font-weight:700;color:#fff;
    background:#FF6FB5;border:2.4px solid #3A3357;border-radius:14px;
    box-shadow:0 4px 0 #3A3357;cursor:pointer;transition:.12s;
  }
  .cl-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 #3A3357}
  .cl-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #3A3357}
  .cl-btn.ghost{color:#3A3357;background:#fff}
  .cl-btn:focus-visible{outline:3px solid #1A1A6E;outline-offset:2px}

  .cl-done h2{font-size:21px;font-weight:800;color:#1A1A6E;margin:0}
  .cl-done p{font-size:15px;line-height:1.55;color:#4A4468;max-width:340px;margin:0;text-align:center}

  @keyframes cl-cheer{
    0%,100%{transform:translateY(0) rotate(0)}
    30%{transform:translateY(-14px) rotate(-7deg)}
    65%{transform:translateY(-6px) rotate(7deg)}
  }

  @media (prefers-reduced-motion:reduce){
    .cl-critter.happy{animation:none}
    .cl-tool,.cl-tool:hover,.cl-btn,.cl-btn:hover{transition:none;transform:none}
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
        <Scene variant="clinic" minHeight={300}>
          <div className="cl-done" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Critter species="bear" expression="happy" size={110} />
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
        </Scene>
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

  // The patient wears whatever has already been used on them.
  const accessory = used.includes('bandage') ? 'bandage' : used.includes('ice') ? 'ice' : null;
  const expression = treated ? 'happy' : nudge ? 'surprised' : 'hurt';

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

      <Scene variant="clinic" minHeight={370}>
        <span className="cl-counter">
          {copy.patientOf.replace('{n}', String(index + 1)).replace('{total}', String(PATIENTS.length))}
        </span>

        <div className={`cl-critter${treated ? ' happy' : ''}`}>
          <Critter species={patient.species} expression={expression} accessory={accessory} size={150} label={info.name} />
        </div>
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
      </Scene>

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
            {/* The tool id doubles as the Icon name. */}
            <Icon name={tool.id} size={36} />
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
