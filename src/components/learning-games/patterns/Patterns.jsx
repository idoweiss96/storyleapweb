import React from 'react';
import WorldView from '../world3d/WorldView';
import { StationWorld } from './stationWorld';
import { LEVELS, ROUNDS, UI } from './patternsContent';

export default function Patterns({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={StationWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      host="penguin"
      hud={(s) => [{ key: 'r', node: copy.round.replace('{n}', Math.min(s.round + 1, ROUNDS)).replace('{total}', ROUNDS) }]}
    />
  );
}
