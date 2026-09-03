import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, ListChecks, LayoutGrid, Eye, EyeOff, Printer, Scissors } from 'lucide-react';
import PageMeta from '@/components/SEO/PageMeta';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';

// Internal preview of the "לוח התארגנות" product (visual_schedule).
// Shows real output from the generation pipeline: one parent photo in,
// one wordless step-card per routine step out. Not linked from navigation,
// and noindex — this page exists to review the product, not to sell it.

const DEMO = {
  routine: 'מפנים אחרי האוכל',
  subtitle: 'לוח קצר לסוף כל ארוחה',
  category: 'סדר וארגון',
  ages: '2-7',
  color: '#e8635a',
  childName: 'נועה',
  cards: [
    { n: 1, label: 'מנגבים פה', src: '/vs-preview/card_01.jpg' },
    { n: 2, label: 'לוקחים את הצלחת', src: '/vs-preview/card_02.jpg' },
    { n: 3, label: 'שמים בכיור', src: '/vs-preview/card_03.jpg' },
    { n: 4, label: 'מנגבים את השולחן', src: '/vs-preview/card_04.jpg' },
  ],
};

const CATALOG = [
  {
    name: 'שגרות יום',
    color: '#f5a524',
    items: ['שגרת בוקר', 'שגרת ערב ולילה', 'יוצאים מהבית', 'חוזרים הביתה', 'שיעורי בית'],
  },
  {
    name: 'מיומנויות עצמאות',
    color: '#22a06b',
    items: ['שוטפים ידיים', 'מצחצחים שיניים', 'מתלבשים לבד', 'מקלחת או אמבטיה', 'שירותים (פיפי)',
            'עושים קקי באסלה', 'מסתרקים', 'נועלים נעליים', 'מקנחים את האף', 'אוכלים ליד השולחן'],
  },
  {
    name: 'מעברים ואירועים',
    color: '#5b8def',
    items: ['הולכים לרופא', 'רופא שיניים', 'הולכים להסתפר', 'חיסון או בדיקת דם', 'נוסעים במכונית',
            'טסים במטוס', 'סבא וסבתא', 'יום הולדת', 'עוברים דירה', 'תינוק חדש בבית',
            'היום הראשון בגן', 'ישנים אצל מישהו אחר', 'הולכים לסופר'],
  },
  {
    name: 'ויסות ורגשות',
    color: '#b06ab3',
    items: ['כשכועסים', 'נשימות הרגעה', 'כשמפחדים בלילה', 'פרידה בגן', 'מחכים בסבלנות', 'מסיימים מסך'],
  },
  {
    name: 'סדר וארגון',
    color: '#e8635a',
    items: ['מסדרים את החדר', 'מכינים את התיק', 'עוזרים במטבח', 'מפנים אחרי האוכל', 'עוזרים בכביסה'],
  },
];

const STEPS = [
  { icon: Upload, title: 'תמונה אחת', body: 'ההורה מעלה צילום רגיל של הילד/ה מהטלפון. זהו — אין צילומי במה, אין ביום.' },
  { icon: ListChecks, title: 'בוחרים שגרה', body: '39 שגרות מוכנות, מפורקות מראש לצעדים קטנים לפי עקרונות task analysis.' },
  { icon: LayoutGrid, title: 'לוח מוכן', body: 'כרטיס לכל צעד — עם הילד/ה עצמם מבצעים אותו. בלי מילה אחת בתמונה.' },
];

export default function VisualSchedulePreview() {
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <PageMeta
        title="לוח התארגנות — תצוגה מקדימה | StoryLeap"
        description="תצוגה מקדימה פנימית של מוצר לוח ההתארגנות החזותי: כרטיסי תמונה ללא מלל, עם הילד/ה עצמם."
      />
      <NoIndexMeta />

      <Link
        to="/activities"
        className="site-chrome inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>לכל הפעילויות</span>
      </Link>

      {/* ── כותרת ─────────────────────────────────────────── */}
      <header className="site-chrome text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-4"
              style={{ background: '#FFF8EC', color: '#7A5000', border: '1.5px solid #F5C842' }}>
          תצוגה מקדימה פנימית · לא מקושר לניווט
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          לוח התארגנות — סיפור ללא מלל
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          הילד/ה לא קוראים מילים — הם קוראים את עצמם. כל צעד בשגרה הופך לכרטיס תמונה
          אחד שבו הם מבצעים אותו בהצלחה.
        </p>
      </header>

      {/* ── איך זה עובד ───────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3 mb-12">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                   style={{ background: '#F1F5F9' }}>
                <Icon className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="font-bold text-slate-800">
                <span className="text-slate-400 me-1">{i + 1}.</span>{title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* ── הלוח עצמו ─────────────────────────────────────── */}
      <section className="mb-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ background: DEMO.color }} />
              <span className="text-xs font-semibold text-slate-400">{DEMO.category} · גיל {DEMO.ages}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              הלוח של {DEMO.childName} — {DEMO.routine}
            </h2>
            <p className="text-sm text-slate-500">{DEMO.subtitle}</p>
          </div>

          <button
            onClick={() => setShowLabels(v => !v)}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showLabels ? 'הסתר כיתוב' : 'הצג כיתוב (למבוגר)'}
          </button>
        </div>

        <div
          className="rounded-3xl p-5 md:p-7"
          style={{ background: '#fbf7f0', border: `3px solid ${DEMO.color}22` }}
        >
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
            {DEMO.cards.map(card => (
              <figure key={card.n} className="relative bg-white rounded-2xl p-3 shadow-sm"
                      style={{ border: `4px solid ${DEMO.color}` }}>
                <div
                  className="absolute -top-3 -start-2 w-9 h-9 rounded-full text-white font-bold flex items-center justify-center shadow-md z-10"
                  style={{ background: DEMO.color }}
                >
                  {card.n}
                </div>
                <img
                  src={card.src}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-square object-cover rounded-xl bg-slate-100"
                />
                {showLabels && (
                  <figcaption className="text-center font-bold text-slate-800 pt-2 text-sm md:text-base">
                    {card.label}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          ארבעת הכרטיסים נוצרו מתמונה אחת של הילדה. אותם פנים, אותו שיער, אותה חולצה
          ואותו מטבח בכל הכרטיסים — ואפס טקסט בתוך התמונה. כברירת מחדל אין גם כיתוב מתחת
          לכרטיס; המקרא העברי נדפס בעמוד נפרד, למבוגר בלבד.
        </p>
      </section>

      {/* ── מה מקבלים ─────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 my-12">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Printer className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-800">לוח לתלייה</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            עמוד A4 להדפסה ולתלייה בגובה העיניים של הילד/ה, ואחריו עמוד נפרד עם מדריך
            קצר להורה: איפה תולים, איך משתמשים, ומה עושים כשזה מפסיק לעבוד.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-800">כרטיסים לגזירה</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            גיליון כרטיסים בגודל 6 ס"מ ללמינציה והדבקת סקוץ'. הילד/ה מזיזים כרטיס פיזי
            אחרי כל צעד — הפעולה הזו היא מה שהופך את הלוח לכלי ולא לפוסטר.
          </p>
        </div>
      </div>

      {/* ── קטלוג השגרות ──────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">39 השגרות</h2>
        <p className="text-sm text-slate-500 mb-6">
          כל שגרה מפורקת ל-4 עד 8 צעדים. הצעד הראשון תמיד קל, והצעד האחרון הוא תמיד
          הסוף הגלוי — הכרטיס שהילד/ה נאחזים בו כשקשה.
        </p>

        <div className="space-y-5">
          {CATALOG.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <h3 className="font-bold text-slate-700">{cat.name}</h3>
                <span className="text-xs text-slate-400">({cat.items.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1.5 rounded-full bg-white border text-slate-600"
                    style={{ borderColor: `${cat.color}55` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className="site-chrome rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#475569' }}
      >
        <strong className="font-semibold">הבסיס המקצועי: </strong>
        תמיכות חזותיות מסווגות כאחת מ-27 הפרקטיקות מבוססות־הראיות ע"י ה-NPDC on ASD,
        על בסיס סקירה של 456 מחקרים. מחקרים מצאו שלוחות עם צילומים יעילים יותר מאיורי קו
        או טקסט, וההמלצה היא להשתמש בתמונות של הילד/ה עצמם מבצעים את הצעד — מה שהורה
        כמעט אף פעם לא מצליח לצלם בפועל.
      </div>
    </div>
  );
}
