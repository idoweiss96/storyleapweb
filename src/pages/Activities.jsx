import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import ActivityGameCard from '@/components/activities/ActivityGameCard';

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
export const GAMES = [
  {
    path: '/activities/feelings-explorer',
    emoji: '🧭',
    title: { en: 'Why Do I Feel This Way?', he: 'למה אני מרגיש/ה ככה?' },
    desc: {
      en: 'Step closer to a feeling until you find what happened',
      he: 'מתקרבים לרגש צעד-צעד עד שמגלים מה בדיוק קרה',
    },
  },
  {
    path: '/activities/emotion-wheel',
    emoji: '🎡',
    title: { en: 'The Emotion Wheel', he: 'גלגל הרגשות' },
    desc: {
      en: 'Spin the wheel and talk about the feeling it lands on',
      he: 'מסובבים את הגלגל ומדברים על הרגש שיצא',
    },
    access: 'free',
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
    access: 'free',
  },
  {
    path: '/activities/emotion-thermometer',
    emoji: '🌡️',
    title: { en: 'The Feelings Thermometer', he: 'מד החום של הרגשות' },
    desc: {
      en: 'Mark how strong a feeling is, and see what can help',
      he: 'מסמנים כמה הרגש חזק, ומגלים מה יכול לעזור',
    },
    access: 'free',
  },
  {
    path: '/activities/routine-board',
    emoji: '📋',
    title: { en: 'My Routine Board', he: 'לוח סדר היום שלי' },
    desc: {
      en: 'Build the day in order and print a board to hang up',
      he: 'בונים את היום לפי הסדר ומדפיסים לוח לתלייה',
    },
  },
  {
    path: '/activities/first-then',
    emoji: '➡️',
    title: { en: 'First, Then', he: 'קודם, ואז' },
    desc: {
      en: 'Two steps for the moments when moving on is hard',
      he: 'שני שלבים לרגעים שקשה לעבור בהם למשהו אחר',
    },
  },
  {
    path: '/activities/choice-board',
    emoji: '🔀',
    title: { en: 'The Choice Board', he: 'לוח הבחירה' },
    desc: {
      en: 'Two to four options for a tricky moment in the day',
      he: 'שתיים עד ארבע אפשרויות לרגע קשה ביום',
    },
  },
  {
    path: '/activities/break-card',
    emoji: '✋',
    title: { en: 'My Break Card', he: 'כרטיס ההפסקה שלי' },
    desc: {
      en: 'A card to show instead of having to explain',
      he: 'כרטיס קטן להראות במקום להסביר',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/body-map',
    emoji: '🧍',
    title: { en: 'My Body Map', he: 'מפת הגוף שלי' },
    desc: {
      en: 'Mark on the body where you feel the feeling',
      he: 'מסמנים על הגוף איפה מרגישים את הרגש',
    },
  },
  {
    path: '/activities/emotion-cards',
    emoji: '🃏',
    title: { en: 'Our Emotion Cards', he: 'קלפי הרגשות שלנו' },
    desc: {
      en: 'Build a deck, print it and cut out real cards',
      he: 'בונים חפיסה, מדפיסים וגוזרים קלפים אמיתיים',
    },
  },
  {
    path: '/activities/emotion-checkin',
    emoji: '🗓️',
    title: { en: 'The Weekly Check-in', he: 'הצ׳ק-אין השבועי' },
    desc: {
      en: 'A printable chart to mark how each day went',
      he: 'לוח להדפסה שמסמנים בו כל יום איך היה',
    },
  },
  {
    path: '/activities/task-analysis',
    emoji: '🪜',
    title: { en: 'Break Down a Task', he: 'פירוק משימה' },
    desc: {
      en: 'Split one hard task into small steps and see which are hard',
      he: 'מפרקים משימה קשה לצעדים ורואים אילו מהם באמת קשים',
    },
  },
  {
    path: '/activities/adl-sequence',
    emoji: '🧼',
    title: { en: 'Picture Sequence', he: 'רצף בתמונות' },
    desc: {
      en: 'Ready-made strips for washing, brushing teeth and dressing',
      he: 'רצפים מוכנים לשטיפת ידיים, צחצוח שיניים והתלבשות',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/routine-checklist',
    emoji: '✅',
    title: { en: 'Routine Checklist', he: 'צ׳ק-ליסט שגרה' },
    desc: {
      en: 'A tick-box list, in a day or a whole-week version',
      he: 'רשימה עם משבצות סימון, ליום אחד או לשבוע שלם',
    },
  },
  {
    path: '/activities/visual-timer',
    emoji: '⏱️',
    title: { en: 'The Visual Timer', he: 'הטיימר החזותי' },
    desc: {
      en: 'Time you can see instead of count',
      he: 'זמן שרואים במקום לספור',
    },
  },
  {
    path: '/activities/breathing',
    emoji: '🫧',
    title: { en: 'Breathing', he: 'נשימות' },
    desc: {
      en: 'Follow the circle and breathe with it',
      he: 'עוקבים אחרי העיגול ונושמים איתו',
    },
  },
  {
    path: '/activities/safe-place',
    emoji: '🏝️',
    title: { en: 'My Safe Place', he: 'המקום הבטוח שלי' },
    desc: {
      en: 'Build a place to return to in your mind when things are hard',
      he: 'בונים מקום שאפשר לחזור אליו בדמיון כשקשה',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/visual-rules',
    emoji: '📜',
    title: { en: 'Our House Rules', he: 'כללי הבית שלנו' },
    desc: {
      en: 'Up to six rules, phrased as what we do',
      he: 'עד שישה כללים, מנוסחים כמה שכן עושים',
    },
  },
  {
    path: '/activities/calm-corner',
    emoji: '🪴',
    title: { en: 'The Calm Corner', he: 'פינת הרוגע' },
    desc: {
      en: 'Set up a corner to go to, and agree how it works',
      he: 'מקימים פינה ללכת אליה, ומסכימים איך היא עובדת',
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
            <ActivityGameCard key={game.path} game={game} isHe={isHe} />
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