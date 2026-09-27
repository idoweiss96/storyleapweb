import React from 'react';
import {
  Sparkles, Compass, CircleDot, Gem, LifeBuoy, Palette, Thermometer,
  ClipboardList, ArrowRight, Shuffle, Hand, PersonStanding, Layers, CalendarCheck,
  ListOrdered, Droplet, CheckSquare, Timer, Wind, Palmtree, ScrollText, Sprout,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import ActivityTile, { TILE_STYLE } from '@/components/activities/ActivityTile';
import ActivityBackdrop from '@/components/activities/shared/ActivityBackdrop';
import { GROUPS, themeFor } from '@/components/activities/shared/activityThemes';
import Critter from '@/components/games/shared/art/Critter';

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
    icon: Compass,
    color: 'sky',
    title: { en: 'Why Do I Feel This Way?', he: 'למה אני מרגיש/ה ככה?' },
    desc: {
      en: 'Step closer to a feeling until you find what happened',
      he: 'מתקרבים לרגש צעד-צעד עד שמגלים מה בדיוק קרה',
    },
  },
  {
    path: '/activities/emotion-wheel',
    icon: CircleDot,
    color: 'pink',
    title: { en: 'The Emotion Wheel', he: 'גלגל הרגשות' },
    desc: {
      en: 'Spin the wheel and talk about the feeling it lands on',
      he: 'מסובבים את הגלגל ומדברים על הרגש שיצא',
    },
    access: 'free',
  },
  {
    path: '/activities/strength-cards',
    icon: Gem,
    color: 'amber',
    title: { en: 'My Strength Cards', he: 'קלפי החוזקות שלי' },
    desc: {
      en: 'Pick the cards that feel like you and print your strengths',
      he: 'בוחרים את הקלפים שמרגישים כמוך ומדפיסים את החוזקות',
    },
  },
  {
    path: '/activities/coping-cards',
    icon: LifeBuoy,
    color: 'teal',
    title: { en: 'Cards That Help Me', he: 'הקלפים שעוזרים לי' },
    desc: {
      en: 'Build a personal calm-down kit and print it',
      he: 'בונים ערכת הרגעה אישית לרגעים קשים ומדפיסים',
    },
  },
  {
    path: '/activities/emotion-drawing',
    icon: Palette,
    color: 'purple',
    title: { en: 'Draw the Feeling', he: 'ציור הרגש' },
    desc: {
      en: 'Pick a feeling and draw what it looks like',
      he: 'בוחרים רגש ומציירים איך הוא נראה',
    },
    access: 'free',
  },
  {
    path: '/activities/emotion-thermometer',
    icon: Thermometer,
    color: 'rose',
    title: { en: 'The Feelings Thermometer', he: 'מד החום של הרגשות' },
    desc: {
      en: 'Mark how strong a feeling is, and see what can help',
      he: 'מסמנים כמה הרגש חזק, ומגלים מה יכול לעזור',
    },
    access: 'free',
  },
  {
    path: '/activities/routine-board',
    icon: ClipboardList,
    color: 'blue',
    title: { en: 'My Routine Board', he: 'לוח סדר היום שלי' },
    desc: {
      en: 'Build the day in order and print a board to hang up',
      he: 'בונים את היום לפי הסדר ומדפיסים לוח לתלייה',
    },
  },
  {
    path: '/activities/first-then',
    icon: ArrowRight,
    color: 'green',
    title: { en: 'First, Then', he: 'קודם, ואז' },
    desc: {
      en: 'Two steps for the moments when moving on is hard',
      he: 'שני שלבים לרגעים שקשה לעבור בהם למשהו אחר',
    },
  },
  {
    path: '/activities/choice-board',
    icon: Shuffle,
    color: 'violet',
    title: { en: 'The Choice Board', he: 'לוח הבחירה' },
    desc: {
      en: 'Two to four options for a tricky moment in the day',
      he: 'שתיים עד ארבע אפשרויות לרגע קשה ביום',
    },
  },
  {
    path: '/activities/break-card',
    icon: Hand,
    color: 'orange',
    title: { en: 'My Break Card', he: 'כרטיס ההפסקה שלי' },
    desc: {
      en: 'A card to show instead of having to explain',
      he: 'כרטיס קטן להראות במקום להסביר',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/body-map',
    icon: PersonStanding,
    color: 'indigo',
    title: { en: 'My Body Map', he: 'מפת הגוף שלי' },
    desc: {
      en: 'Mark on the body where you feel the feeling',
      he: 'מסמנים על הגוף איפה מרגישים את הרגש',
    },
  },
  {
    path: '/activities/emotion-cards',
    icon: Layers,
    color: 'fuchsia',
    title: { en: 'Our Emotion Cards', he: 'קלפי הרגשות שלנו' },
    desc: {
      en: 'Build a deck, print it and cut out real cards',
      he: 'בונים חפיסה, מדפיסים וגוזרים קלפים אמיתיים',
    },
  },
  {
    path: '/activities/emotion-checkin',
    icon: CalendarCheck,
    color: 'cyan',
    title: { en: 'The Weekly Check-in', he: 'הצ׳ק-אין השבועי' },
    desc: {
      en: 'A printable chart to mark how each day went',
      he: 'לוח להדפסה שמסמנים בו כל יום איך היה',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/task-analysis',
    icon: ListOrdered,
    color: 'orange',
    title: { en: 'Break Down a Task', he: 'פירוק משימה' },
    desc: {
      en: 'Split one hard task into small steps and see which are hard',
      he: 'מפרקים משימה קשה לצעדים ורואים אילו מהם באמת קשים',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/adl-sequence',
    icon: Droplet,
    color: 'blue',
    title: { en: 'Picture Sequence', he: 'רצף בתמונות' },
    desc: {
      en: 'Ready-made strips for washing, brushing teeth and dressing',
      he: 'רצפים מוכנים לשטיפת ידיים, צחצוח שיניים והתלבשות',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/routine-checklist',
    icon: CheckSquare,
    color: 'green',
    title: { en: 'Routine Checklist', he: 'צ׳ק-ליסט שגרה' },
    desc: {
      en: 'A tick-box list, in a day or a whole-week version',
      he: 'רשימה עם משבצות סימון, ליום אחד או לשבוע שלם',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/visual-timer',
    icon: Timer,
    color: 'amber',
    title: { en: 'The Visual Timer', he: 'הטיימר החזותי' },
    desc: {
      en: 'Time you can see instead of count',
      he: 'זמן שרואים במקום לספור',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/breathing',
    icon: Wind,
    color: 'sky',
    title: { en: 'Breathing', he: 'נשימות' },
    desc: {
      en: 'Follow the circle and breathe with it',
      he: 'עוקבים אחרי העיגול ונושמים איתו',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/safe-place',
    icon: Palmtree,
    color: 'emerald',
    title: { en: 'My Safe Place', he: 'המקום הבטוח שלי' },
    desc: {
      en: 'Build a place to return to in your mind when things are hard',
      he: 'בונים מקום שאפשר לחזור אליו בדמיון כשקשה',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/visual-rules',
    icon: ScrollText,
    color: 'slate',
    title: { en: 'Our House Rules', he: 'כללי הבית שלנו' },
    desc: {
      en: 'Up to six rules, phrased as what we do',
      he: 'עד שישה כללים, מנוסחים כמה שכן עושים',
    },
    access: 'coming_soon',
  },
  {
    path: '/activities/calm-corner',
    icon: Sprout,
    color: 'green',
    title: { en: 'The Calm Corner', he: 'פינת הרוגע' },
    desc: {
      en: 'Set up a corner to go to, and agree how it works',
      he: 'מקימים פינה ללכת אליה, ומסכימים איך היא עובדת',
    },
    access: 'coming_soon',
  },
];

export default function Activities() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? ACTIVITIES_META.he : ACTIVITIES_META.en;
  const groupOf = (game) => themeFor(game.path.split('/').filter(Boolean).pop()).group;

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />
      <style>{TILE_STYLE + HUB_STYLE}</style>

      <header className="ah-hero">
        <ActivityBackdrop scene="meadow" id="ah-hero" className="ah-bg" />
        <div className="ah-inner">
          <span className="ah-pill">
            <Sparkles className="w-4 h-4" />
            {isHe ? 'חינם לגמרי' : 'Completely free'}
          </span>
          <h1 className="ah-title">{isHe ? 'מקום הפעילויות' : 'The Activity Place'}</h1>
          <p className="ah-sub">
            {isHe
              ? 'אוסף משחקים קצרים לילדים, לשחק לבד או יחד איתכם, בכמה דקות של חיבור.'
              : 'A collection of short games for kids, to play alone or together with you, in a few minutes of connection.'}
          </p>
          <div className="ah-crew" aria-hidden="true">
            {['fox', 'bunny', 'bear', 'penguin', 'cat'].map((sp, i) => (
              <span key={sp} className="ah-member" style={{ animationDelay: `${i * 0.25}s` }}>
                <Critter species={sp} expression="happy" size={i === 2 ? 84 : 64} />
              </span>
            ))}
          </div>
        </div>
      </header>

      {GROUPS.map((group) => {
        const items = GAMES.filter((g) => groupOf(g) === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id} className="ah-group">
            <h2 className="ah-gtitle">
              <span className="ah-dot" style={{ background: group.color }} />
              {isHe ? group.he : group.en}
            </h2>
            <div className="ah-grid">
              {items.map((game) => (
                <ActivityTile key={game.path} game={game} isHe={isHe} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const HUB_STYLE = `
  .ah-hero{position:relative;overflow:hidden;border:2.5px solid #3A3357;border-radius:32px;margin-bottom:34px;
    box-shadow:0 8px 0 rgba(58,51,87,.12)}
  .ah-bg{position:absolute;inset:0;width:100%;height:100%}
  .ah-inner{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:26px 16px 10px}
  .ah-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;color:#fff;font-weight:800;font-size:14px;
    background:linear-gradient(135deg,#FF6FB5,#4FC3E8);border:2.2px solid #3A3357}
  .ah-title{margin:0;font-size:clamp(30px,6vw,52px);font-weight:900;color:#1A1A6E;line-height:1.05;
    text-shadow:0 3px 0 #fff, 0 -2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff}
  .ah-sub{margin:0;max-width:560px;font-size:16px;font-weight:600;color:#2a2a44;background:rgba(255,255,255,.85);
    border-radius:14px;padding:6px 12px}
  .ah-crew{display:flex;align-items:flex-end;gap:4px;margin-top:4px}
  .ah-member{filter:drop-shadow(0 5px 6px rgba(26,26,110,.22));animation:ah-bob 3s ease-in-out infinite}
  .ah-group{margin-bottom:34px}
  .ah-gtitle{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:22px;font-weight:900;color:#1A1A6E}
  .ah-dot{width:16px;height:16px;border-radius:999px;border:2.4px solid #3A3357}
  .ah-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
  @keyframes ah-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @media (prefers-reduced-motion:reduce){.ah-member{animation:none}}
`;
