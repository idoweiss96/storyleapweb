import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import ActivityGameCard from '@/components/activities/ActivityGameCard';
import Critter from '@/components/games/shared/art/Critter';
import Icon from '@/components/games/shared/art/Icon';

const GAMES_META = {
  he: {
    title: 'משחקים | משחקי תפקידים חינמיים לילדים | StoryLeap',
    description:
      'משחקי תפקידים חינמיים לילדים: קליניקה, פיצרייה, מוסך, חנות ומשחק פעלים. בלי ניקוד, בלי טיימר ובלי הפסד — רק משחק.',
  },
  en: {
    title: 'Games | Free Pretend-Play Games for Kids | StoryLeap',
    description:
      'Free pretend-play games for kids: a clinic, a pizzeria, a garage, a shop and a verb game. No scores, no timers, no losing — just play.',
  },
};

// The single place to register a game. Each entry renders one card in the grid.
// Shape: { path, emoji, title: { en, he }, desc: { en, he }, access }
// `emoji` is what ActivityGameCard renders above the title; the games pass a
// drawn Icon or Critter there instead of a character, so the hub matches the
// artwork inside the games.
// Adding a game = adding an object here (plus its page + route in App.jsx).
export const GAMES = [
  {
    path: '/games/clinic',
    emoji: <Icon name="stethoscope" size={46} />,
    title: { en: 'My Clinic', he: 'הקליניקה שלי' },
    desc: {
      en: 'Treat the animals that come in, one tool at a time',
      he: 'מטפלים בחיות שמגיעות לביקור, כלי אחרי כלי',
    },
    access: 'free',
  },
  {
    path: '/games/pizzeria',
    emoji: <Icon name="pizza" size={46} />,
    title: { en: 'The Pizzeria', he: 'הפיצרייה' },
    desc: {
      en: 'Add toppings, bake, slice and serve the order',
      he: 'מוסיפים תוספות, אופים, חותכים ומגישים את ההזמנה',
    },
    access: 'free',
  },
  {
    path: '/games/garage',
    emoji: <Icon name="wrench" size={46} />,
    title: { en: 'The Garage', he: 'המוסך' },
    desc: {
      en: 'Match the right tool to each fault, then paint the car',
      he: 'מתאימים כלי לכל תקלה, ואז צובעים את הרכב',
    },
    access: 'free',
  },
  {
    path: '/games/store',
    emoji: <Icon name="basket" size={46} />,
    title: { en: 'The Store', he: 'החנות' },
    desc: {
      en: 'A game for two: fill the basket, count the coins, pay',
      he: 'משחק לשניים: ממלאים סל, סופרים מטבעות ומשלמים',
    },
    access: 'free',
  },
  {
    path: '/games/actions',
    emoji: <Critter species="topi" expression="happy" size={52} />,
    title: { en: 'What is Topi Doing?', he: 'מה טופי עושה?' },
    desc: {
      en: 'Tap a word and Topi acts it out — a verb game',
      he: 'לוחצים על מילה וטופי עושה אותה — משחק פעלים',
    },
    access: 'free',
  },
];

export default function Games() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? GAMES_META.he : GAMES_META.en;

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />

      <header className="text-center mb-9">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{isHe ? 'משחקים' : 'Games'}</h1>
        <p className="text-base text-slate-500 max-w-lg mx-auto">
          {isHe
            ? 'משחקי "בוא נגיד ש…" לילדים קטנים. אין ניקוד, אין טיימר ואי אפשר להפסיד — משחקים כמה שרוצים ועוצרים מתי שרוצים.'
            : 'Pretend-play games for young children. No scores, no timers and no way to lose — play as long as you like and stop whenever you want.'}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((game) => (
          <ActivityGameCard key={game.path} game={game} isHe={isHe} />
        ))}
      </div>
    </div>
  );
}
