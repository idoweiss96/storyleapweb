import React from 'react';
import { RotateCcw, Volume2 } from 'lucide-react';
import WorldView from '../world3d/WorldView';
import { useVoice } from '../shared/GameShell';
import { ParadeWorld } from './paradeWorld';
import { LEVELS, UI } from './syllablesContent';

const PART_COLORS = ['#FF6FB5', '#4FC3E8', '#F5B942', '#5BC98C'];

const STYLE = `
  .dp-parts{display:flex;gap:6px}
  .dp-part{font-size:24px;font-weight:900;color:#fff;padding:2px 12px;border-radius:12px;border:2.4px solid #3A3357;
    box-shadow:0 3px 0 rgba(58,51,87,.2);transition:transform .15s}
  .dp-part.beat{transform:scale(1.25) translateY(-5px)}
`;

export default function Syllables({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  const hasVoice = useVoice(lang);
  return (
    <WorldView
      GameClass={ParadeWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="fox"
      style={STYLE}
      hud={(s) => [{ key: 'r', node: copy.round.replace('{n}', Math.min(s.n + 1, s.total)).replace('{total}', s.total) }]}
      doneText={(s) => copy.doneText.replace('{total}', s.total)}
      renderOverlay={(s) =>
        s.phase === 'teach' ? (
          <div data-anchor="host">
            <div className={`w3-bubble ${s.result === 'right' ? 'good' : 'warm'}`}>
              <span className="dp-parts">
                {s.parts.map((p, i) => (
                  <span key={i} className={`dp-part${s.teachAt === i ? ' beat' : ''}`} style={{ background: PART_COLORS[i % 4] }}>{p}</span>
                ))}
              </span>
            </div>
          </div>
        ) : null
      }
      actions={(s, g) => (
        <>
          {hasVoice && (
            <button type="button" className="w3-act blue" onClick={() => g.sayWord()}>
              <Volume2 className="w-7 h-7" />
              {copy.listen}
            </button>
          )}
          {s.onDrum && s.phase === 'drum' && (
            <button type="button" className="w3-act" onClick={() => g.hit()} style={{ minWidth: 92, minHeight: 92, fontSize: 18 }}>
              <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
                <path d="M8 24v22c0 7 11 12 24 12s24-5 24-12V24" fill="#FF6FB5" stroke="#3A3357" strokeWidth="3" />
                <ellipse cx="32" cy="24" rx="24" ry="10" fill="#FFF4E6" stroke="#3A3357" strokeWidth="3" />
              </svg>
              {copy.drum}
            </button>
          )}
          {s.beats > 0 && s.phase === 'drum' && (
            <button type="button" className="w3-act blue" onClick={() => g.resetBeats()} style={{ minWidth: 60, minHeight: 60, fontSize: 13 }}>
              <RotateCcw className="w-5 h-5" />
              {copy.clear}
            </button>
          )}
        </>
      )}
    />
  );
}
