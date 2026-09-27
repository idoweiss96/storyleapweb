import React from 'react';
import WorldView from '../../learning-games/world3d/WorldView';
import Icon from '../shared/art/Icon';
import { ActionsWorld } from './actionsWorld';
import { ACTIONS, UI } from './actionsContent';

const LEVELS = [{ id: 'play', he: '', en: '' }];

const STYLE = `
  .ac-bar{position:absolute;inset-inline:8px;bottom:70px;display:flex;gap:8px;overflow-x:auto;padding:4px 4px 8px;pointer-events:auto;
    scrollbar-width:thin}
  .ac-verb{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:78px;padding:6px 10px;
    background:#fff;border:2.6px solid #3A3357;border-radius:16px;box-shadow:0 4px 0 #3A3357;font-family:inherit;font-weight:900;
    font-size:15px;color:#1A1A6E;cursor:pointer}
  .ac-verb:active{transform:translateY(3px);box-shadow:0 1px 0 #3A3357}
  .ac-verb[aria-pressed="true"]{background:#FFF0F7;border-color:#FF6FB5}
`;

/**
 * "What is Topi doing?" in 3D: Topi stands in a playground and acts out the
 * verb you tap. Same verbs as before — see actionsContent.js.
 */
export default function Actions({ lang = 'he' }) {
  const ui = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={ActionsWorld}
      levels={LEVELS}
      copy={ui}
      lang={lang}
      host="topi"
      style={STYLE}
      renderOverlay={(s, g) =>
        s.running ? (
          <div className="ac-bar" data-ui role="group" aria-label={ui.wordsTitle}>
            {ACTIONS.map((a) => (
              <button key={a.id} type="button" className="ac-verb" aria-pressed={s.acting === a.id} onClick={() => g.act(a.id)}>
                {a.prop ? <Icon name={a.prop} size={26} /> : <span style={{ height: 26 }} />}
                {(a[lang] || a.he).verb}
              </button>
            ))}
          </div>
        ) : null
      }
    />
  );
}
