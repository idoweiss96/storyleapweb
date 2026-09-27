import React from 'react';
import { RotateCw } from 'lucide-react';
import WorldView from '../world3d/WorldView';
import { SiteWorld } from './siteWorld';
import { LEVELS, UI } from './shapesContent';

export default function Shapes({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={SiteWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="bear"
      hud={(s) => [{ key: 'p', node: copy.picture.replace('{n}', s.pIndex + 1).replace('{total}', s.total) }]}
      actions={(s, g) =>
        s.canTurn ? (
          <button type="button" className="w3-act blue" onClick={() => g.rotate()}>
            <RotateCw className="w-7 h-7" />
            {copy.rotate}
          </button>
        ) : null
      }
    />
  );
}
