import React from 'react';
import { Car } from 'lucide-react';
import WorldView from '../../learning-games/world3d/WorldView';
import { GarageWorld } from './garageWorld';
import { UI } from './garageContent';

const LEVELS = [{ id: 'play', he: '', en: '' }];

/**
 * The garage as a 3D workshop: cars drive in showing their faults (mud, a flat
 * tyre, a dark headlight, an empty tank), tools hang on the wall, and paint
 * pads colour the car before it drives off. Same cars and faults as before —
 * see garageContent.js.
 */
export default function Garage({ lang = 'he' }) {
  const ui = UI[lang] || UI.he;
  const copy = { ...ui, doneTitle: ui.allDoneTitle, doneText: ui.allDoneText, again: ui.startOver };
  return (
    <WorldView
      GameClass={GarageWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="fox"
      hud={(s) => [{ key: 'c', node: ui.carOf.replace('{n}', Math.min(s.index + 1, s.total)).replace('{total}', s.total) }]}
      renderOverlay={(s) =>
        s.line ? (
          <div data-anchor="driver">
            <div className="w3-bubble" style={{ flexDirection: 'column', gap: 4, maxWidth: 260, fontSize: 14, lineHeight: 1.35 }}>
              <span>{s.line}</span>
            </div>
          </div>
        ) : null
      }
      actions={(s, g) =>
        s.phase === 'paint' ? (
          <button type="button" className="w3-act" onClick={() => g.drive()}>
            <Car className="w-7 h-7" />
            {ui.drive}
          </button>
        ) : null
      }
    />
  );
}
