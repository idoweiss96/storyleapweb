import React from 'react';
import WorldView from '../world3d/WorldView';
import { MemoryWorld } from './memoryWorld';
import { LEVELS, UI } from './memoryContent';

export default function Memory({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={MemoryWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      hud={(s) => [{ key: 'p', node: copy.pairs.replace('{n}', s.pairs).replace('{total}', s.total) }]}
      doneText={(s) => copy.doneText.replace('{total}', s.total)}
    />
  );
}
