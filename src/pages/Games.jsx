import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import Critter from '@/components/games/shared/art/Critter';
import Icon from '@/components/games/shared/art/Icon';
import ActivityBackdrop from '@/components/activities/shared/ActivityBackdrop';
import LearningGamesSection, { GAME_CARD_STYLE, GameCard } from '@/components/learning-games/LearningGamesSection';

const GAMES_META = {
  he: {
    title: 'משחקים | משחקי תפקידים ומשחקי חשיבה לילדים | StoryLeap',
    description:
      'משחקים תלת-ממדיים חינמיים לילדים: קליניקה, פיצרייה, מוסך, חנות ומשחק פעלים, ומשחקי חשיבה ולמידה. בלי ניקוד, בלי טיימר ובלי הפסד.',
  },
  en: {
    title: 'Games | Pretend-Play & Thinking Games for Kids | StoryLeap',
    description:
      'Free 3D games for kids: a clinic, a pizzeria, a garage, a shop and a verb game, plus thinking and learning games. No scores, no timers, no losing.',
  },
};

// The pretend-play games. `thumb` is drawn art (no emoji), shown on the card.
// Adding a game = adding an object here (plus its page + route in App.jsx).
export const GAMES = [
  {
    path: '/games/clinic',
    thumb: <Icon name="stethoscope" size={50} />,
    tint: '#FFE3E3',
    title: { en: 'My Clinic', he: 'הקליניקה שלי' },
    desc: { en: 'Animals come in; bring each one the tool it asks for', he: 'חיות באות לביקור — מביאים לכל אחת את הכלי שהיא צריכה' },
    access: 'free',
  },
  {
    path: '/games/pizzeria',
    thumb: <Icon name="pizza" size={50} />,
    tint: '#FFF1DE',
    title: { en: 'The Pizzeria', he: 'הפיצרייה' },
    desc: { en: 'Take the order, add toppings, bake, slice and serve', he: 'לוקחים הזמנה, מוסיפים תוספות, אופים, חותכים ומגישים' },
    access: 'free',
  },
  {
    path: '/games/garage',
    thumb: <Icon name="wrench" size={50} />,
    tint: '#E3F4FC',
    title: { en: 'The Garage', he: 'המוסך' },
    desc: { en: 'Fix what you can see is broken, paint the car, send it off', he: 'מתקנים את מה שרואים שהתקלקל, צובעים ושולחים לדרך' },
    access: 'free',
  },
  {
    path: '/games/store',
    thumb: <Icon name="basket" size={50} />,
    tint: '#E4F6E8',
    title: { en: 'The Store', he: 'החנות' },
    desc: { en: 'A game for two: fill the basket, count the coins, pay', he: 'משחק לשניים: ממלאים סל, סופרים מטבעות ומשלמים' },
    access: 'free',
  },
  {
    path: '/games/actions',
    thumb: <Critter species="topi" expression="happy" size={56} />,
    tint: '#FFE6F2',
    title: { en: 'What is Topi Doing?', he: 'מה טופי עושה?' },
    desc: { en: 'Tap a word and Topi acts it out — a verb game', he: 'לוחצים על מילה וטופי עושה אותה — משחק פעלים' },
    access: 'free',
  },
];

const STYLE = `
  .gh-hero{position:relative;overflow:hidden;border:2.5px solid #3A3357;border-radius:32px;margin-bottom:30px;box-shadow:0 8px 0 rgba(58,51,87,.12)}
  .gh-bg{position:absolute;inset:0;width:100%;height:100%}
  .gh-inner{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:26px 16px 12px}
  .gh-title{margin:0;font-size:clamp(32px,6vw,54px);font-weight:900;color:#1A1A6E;line-height:1.05;
    text-shadow:0 3px 0 #fff, 0 -2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff}
  .gh-sub{margin:0;max-width:560px;font-size:16px;font-weight:600;color:#2a2a44;background:rgba(255,255,255,.85);border-radius:14px;padding:6px 12px}
  .gh-crew{display:flex;align-items:flex-end;gap:6px}
  .gh-h2{margin:0 0 14px;font-size:24px;font-weight:900;color:#1A1A6E;text-align:center}
`;

export default function Games() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? GAMES_META.he : GAMES_META.en;

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />
      <style>{GAME_CARD_STYLE + STYLE}</style>

      <header className="gh-hero">
        <ActivityBackdrop scene="meadow" id="gh-hero" className="gh-bg" />
        <div className="gh-inner">
          <h1 className="gh-title">{isHe ? 'משחקים' : 'Games'}</h1>
          <p className="gh-sub">
            {isHe
              ? 'עולמות קטנים שבהם הילד זז, פוגש חיות ועושה דברים. אין ניקוד, אין טיימר ואי אפשר להפסיד.'
              : 'Little worlds where your child walks around, meets animals and does things. No scores, no timers and no way to lose.'}
          </p>
          <div className="gh-crew" aria-hidden="true">
            {['dog', 'panda', 'topi', 'fox', 'koala'].map((sp, i) => <Critter key={sp} species={sp} expression="happy" size={i === 2 ? 84 : 62} />)}
          </div>
        </div>
      </header>

      <h2 className="gh-h2">{isHe ? 'משחקי תפקידים' : 'Pretend play'}</h2>
      <div className="lgh-grid">
        {GAMES.map((g) => <GameCard key={g.path} game={g} lang={isHe ? 'he' : 'en'} />)}
      </div>

      <LearningGamesSection isHe={isHe} />
    </div>
  );
}
