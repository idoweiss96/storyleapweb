import React from 'react';
import Critter from '../games/shared/art/Critter';
import Icon from '../games/shared/art/Icon';
import LearnArt from './shared/LearnArt';
import * as memory from './memory/memoryContent';
import * as numberPath from './number-path/numberPathContent';
import * as numberLine from './number-line/numberLineContent';
import * as echo from './echo/echoContent';
import * as shapes from './shapes/shapesContent';
import * as opposites from './opposites/oppositesContent';
import * as patterns from './patterns/patternsContent';
import * as syllables from './syllables/syllablesContent';
import * as fruitStand from './fruit-stand/fruitStandContent';

/**
 * The single place to register a learning game.
 *
 * App.jsx maps over this list to create the routes, and the /games hub maps
 * over it to draw the cards — adding a game here is the whole wiring.
 *
 * `slug` is the last path segment, the same convention ActivityFeed uses to
 * look a saved entry back up, so a future "save to my space" needs no new key.
 * Components load lazily; the content files are small and load eagerly so the
 * hub and the page <title> never wait on a game's code.
 */
export const LEARNING_GAMES = [
  {
    slug: 'fruit-stand',
    load: () => import('./fruit-stand/FruitStand'),
    content: fruitStand,
    thumb: <Icon name="apple" size={54} />,
    tint: '#FFE3E3',
    skill: { he: 'ספירה וכמות', en: 'Counting' },
    ages: '3–11',
  },
  {
    slug: 'memory',
    load: () => import('./memory/Memory'),
    content: memory,
    thumb: <Critter species="fox" expression="happy" size={58} />,
    tint: '#FFE3F1',
    skill: { he: 'זיכרון עבודה', en: 'Working memory' },
    ages: '3–11',
  },
  {
    slug: 'number-path',
    load: () => import('./number-path/NumberPath'),
    content: numberPath,
    thumb: <Icon name="carrot" size={54} />,
    tint: '#E4F6E8',
    skill: { he: 'תחושת מספר', en: 'Number sense' },
    ages: '3–6',
  },
  {
    slug: 'number-line',
    load: () => import('./number-line/NumberLine'),
    content: numberLine,
    thumb: <LearnArt name="balloon" size={56} />,
    tint: '#E3F4FC',
    skill: { he: 'הערכת גודל', en: 'Estimation' },
    ages: '5–11',
  },
  {
    slug: 'echo',
    load: () => import('./echo/Echo'),
    content: echo,
    thumb: <LearnArt name="note" size={54} />,
    tint: '#EFE8FD',
    skill: { he: 'זיכרון רצפים', en: 'Sequence memory' },
    ages: '4–11',
  },
  {
    slug: 'shapes',
    load: () => import('./shapes/Shapes'),
    content: shapes,
    thumb: <LearnArt name="triangle" size={54} />,
    tint: '#FFF5DA',
    skill: { he: 'חשיבה מרחבית', en: 'Spatial thinking' },
    ages: '3–10',
  },
  {
    slug: 'opposites',
    load: () => import('./opposites/Opposites'),
    content: opposites,
    thumb: <LearnArt name="moon" size={54} />,
    tint: '#E8E6FA',
    skill: { he: 'עיכוב תגובה', en: 'Self-control' },
    ages: '3–9',
  },
  {
    slug: 'patterns',
    load: () => import('./patterns/Patterns'),
    content: patterns,
    thumb: <LearnArt name="star" size={54} />,
    tint: '#FDEBDD',
    skill: { he: 'דפוסים וחשיבה מתמטית', en: 'Patterns & maths' },
    ages: '3–11',
  },
  {
    slug: 'syllables',
    load: () => import('./syllables/Syllables'),
    content: syllables,
    thumb: <LearnArt name="drum" size={56} />,
    tint: '#FFE6EE',
    skill: { he: 'מודעות פונולוגית', en: 'Early reading' },
    ages: '3–7',
  },
].map((g) => ({
  ...g,
  path: `/games/${g.slug}`,
  title: { he: g.content.UI.he.title, en: g.content.UI.en.title },
  desc: { he: g.content.UI.he.subtitle, en: g.content.UI.en.subtitle },
}));

export function getLearningGame(slug) {
  return LEARNING_GAMES.find((g) => g.slug === slug) || null;
}
