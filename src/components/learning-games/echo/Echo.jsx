import React from 'react';
import WorldView from '../world3d/WorldView';
import { ConcertWorld } from './concertWorld';
import { LEVELS, UI } from './echoContent';

const STYLE = `
  .cc-dots{position:absolute;top:56px;left:50%;transform:translateX(-50%);display:flex;gap:6px;pointer-events:none}
  .cc-dots i{width:16px;height:16px;border-radius:999px;border:2.4px solid #3A3357;background:#fff;display:block}
  .cc-dots i.on{background:#FF6FB5}
`;

export default function Echo({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={ConcertWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="bunny"
      style={STYLE}
      hud={(s) => [
        { key: 'l', node: copy.length.replace('{n}', s.len) },
        { key: 'b', node: copy.best.replace('{n}', s.best) },
      ]}
      renderOverlay={(s) =>
        s.phase === 'idle' ? null : (
          <div className="cc-dots" aria-hidden="true">
            {Array.from({ length: s.len }, (_, i) => <i key={i} className={s.phase === 'play' && i < s.idx ? 'on' : ''} />)}
          </div>
        )
      }
      doneText={(s) => copy.doneText.replace('{n}', s.best)}
    />
  );
}
