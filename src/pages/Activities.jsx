import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';

const ACTIVITIES_META = {
  en: {
    title: 'The Activity Place | Free Games for Kids | StoryLeap',
    description: 'A collection of short, free games children can play on their own or together with a parent. From StoryLeap.',
  },
  he: {
    title: 'מקום הפעילויות | משחקים חינמיים לילדים | StoryLeap',
    description: 'אוסף משחקים קצרים וחינמיים שילדים יכולים לשחק לבד או יחד עם ההורים. מבית StoryLeap.',
  },
};

// The single place to register a game. Each entry renders one card in the grid.
// Shape: { path, emoji, title: { en, he }, desc: { en, he } }
// Adding a game = adding an object here (plus its page + route in App.jsx).
const GAMES = [
  {
    path: '/activities/emotion-wheel',
    emoji: '🎡',
    title: { en: 'The Emotion Wheel', he: 'גלגל הרגשות' },
    desc: {
      en: 'Spin the wheel and talk about the feeling it lands on',
      he: 'מסובבים את הגלגל ומדברים על הרגש שיצא',
    },
  },
  {
    path: '/activities/strength-cards',
    emoji: '💎',
    title: { en: 'My Strength Cards', he: 'קלפי החוזקות שלי' },
    desc: {
      en: 'Pick the cards that feel like you and print your strengths',
      he: 'בוחרים את הקלפים שמרגישים כמוך ומדפיסים את החוזקות',
    },
  },
  {
    path: '/activities/coping-cards',
    emoji: '🎈',
    title: { en: 'Cards That Help Me', he: 'הקלפים שעוזרים לי' },
    desc: {
      en: 'Build a personal calm-down kit and print it',
      he: 'בונים ערכת הרגעה אישית לרגעים קשים ומדפיסים',
    },
  },
  {
    path: '/activities/emotion-drawing',
    emoji: '🎨',
    title: { en: 'Draw the Feeling', he: 'ציור הרגש' },
    desc: {
      en: 'Pick a feeling and draw what it looks like',
      he: 'בוחרים רגש ומציירים איך הוא נראה',
    },
  },
  {
    path: '/activities/emotion-thermometer',
    emoji: '🌡️',
    title: { en: 'The Feelings Thermometer', he: 'מד החום של הרגשות' },
    desc: {
      en: 'Mark how strong a feeling is, and see what can help',
      he: 'מסמנים כמה הרגש חזק, ומגלים מה יכול לעזור',
    },
  },
];

export default function Activities() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? ACTIVITIES_META.he : ACTIVITIES_META.en;

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />

      <header className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-5"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isHe ? 'חינם לגמרי' : 'Completely free'}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
          {isHe ? 'מקום הפעילויות' : 'The Activity Place'}
        </h1>

        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
          {isHe
            ? 'אוסף משחקים קצרים לילדים — לשחק לבד או יחד איתכם, בכמה דקות של חיבור.'
            : 'A collection of short games for kids — to play alone or together with you, in a few minutes of connection.'}
        </p>
      </header>

      {GAMES.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game) => (
            <Link key={game.path} to={game.path} className="group">
              <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{game.emoji}</div>
                  <h2 className="text-base font-bold text-slate-800 mb-2">
                    {isHe ? game.title.he : game.title.en}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {isHe ? game.desc.he : game.desc.en}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg shadow-slate-100 rounded-2xl">
          <CardContent className="py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {isHe ? 'המשחקים בדרך' : 'Games are on the way'}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {isHe
                ? 'אנחנו בונים כאן משחקים קטנים לילדים. חזרו בקרוב — הם יופיעו בדיוק במקום הזה.'
                : "We're building small games for kids here. Come back soon — they'll show up right in this spot."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
