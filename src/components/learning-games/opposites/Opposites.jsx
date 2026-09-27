import React from 'react';
import WorldView from '../world3d/WorldView';
import { FarmWorld } from './farmWorld';
import { LEVELS, ROUNDS, UI } from './oppositesContent';

export default function Opposites({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;
  return (
    <WorldView
      GameClass={FarmWorld}
      levels={LEVELS}
      copy={copy}
      lang={lang}
      hud={(s) => [{ key: 'r', node: copy.round.replace('{n}', Math.min(s.round + 1, ROUNDS)).replace('{total}', ROUNDS) }]}
    />
  );
}
