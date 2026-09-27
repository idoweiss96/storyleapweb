import React from 'react';
import WorldView from '../../learning-games/world3d/WorldView';
import { ClinicWorld } from './clinicWorld';
import { UI } from './clinicContent';

const LEVELS = [{ id: 'play', he: '', en: '' }];

/**
 * The clinic as a 3D room: patients wait on the benches, walk to the
 * treatment mat and say what hurts; the doctor brings tools from the cabinets.
 * Same patients, steps and lines as before — see clinicContent.js.
 */
export default function Clinic({ lang = 'he' }) {
  const ui = UI[lang] || UI.he;
  const copy = { ...ui, doneTitle: ui.allDoneTitle, doneText: ui.allDoneText, again: ui.startOver };
  return (
    <WorldView
      GameClass={ClinicWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="bear"
      hud={(s) => [{ key: 'p', node: ui.patientOf.replace('{n}', Math.min(s.index + 1, s.total)).replace('{total}', s.total) }]}
      renderOverlay={(s) =>
        s.line ? (
          <div data-anchor="patient">
            <div className="w3-bubble" style={{ maxWidth: 260, fontSize: 15, lineHeight: 1.4 }}>{s.line}</div>
          </div>
        ) : null
      }
    />
  );
}
