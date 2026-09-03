/**
 * ConversationCardsPreview — תצוגה מקדימה של מוצר "כרטיסי שיח".
 *
 * Route: /conversation-cards-preview.  noindex.  לא מקושר מהניווט בפרודקשן.
 * זהו פיילוט: 6 כרטיסים שנוצרו מתמונת בדיקה אחת (Unsplash), כדי לראות איך
 * המוצר נראה בפועל לפני שמחליטים אם לבנות אותו.
 *
 * מקור התמונות והתוכן: conversation_cards/ בריפו StoryLeap.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Eye, Lightbulb, Heart, MessageCircle, Sparkles,
} from 'lucide-react';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import PageMeta from '@/components/SEO/PageMeta';
import { CARDS } from '@/components/conversation-cards/conversationCardsContent';
import { CARD_IMAGES } from '@/components/conversation-cards/cardImages';

/* ארבע שכבות השאלות — הסדר הוא המתודולוגיה, לא קישוט.
   מילולי → מסקנתי → אישי → פעולה. יחס ~3:1 בין מילולי למסקנתי
   (Van Kleeck), והשכבה האישית היא ה-distance prompt של CROWD. */
const LAYERS = [
  {
    id: 'literal',
    label: 'מה רואים',
    hint: 'שאלות על מה שנמצא בתמונה. פותחות את השיחה בלי מאמץ.',
    icon: Eye,
    color: '#4FC3E8',
    bg: '#EAF8FD',
  },
  {
    id: 'infer',
    label: 'מה קורה כאן',
    hint: 'שאלות שדורשות לצאת מהתמונה — לנחש, להסביר, להבין.',
    icon: Lightbulb,
    color: '#F5A524',
    bg: '#FFF8EC',
  },
  {
    id: 'self',
    label: 'ואצלך',
    hint: 'המעבר מהילד שבתמונה אל הילד שמולכם. כאן השיחה האמיתית מתחילה.',
    icon: Heart,
    color: '#FF6FB5',
    bg: '#FFF0F7',
  },
  {
    id: 'do',
    label: 'מה אפשר לעשות',
    hint: 'סוגרים בסוכנוּת — לא בתחושה שנתקעים.',
    icon: MessageCircle,
    color: '#22A06B',
    bg: '#EAF7F1',
  },
];

function LayerBlock({ layer, questions, open, onToggle }) {
  const Icon = layer.icon;
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: layer.bg, border: `1.5px solid ${layer.color}40` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-right"
        aria-expanded={open}
      >
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: layer.color }}
        >
          <Icon className="w-5 h-5 text-white" />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-slate-800">{layer.label}</span>
          <span className="block text-xs text-slate-500 mt-0.5">{layer.hint}</span>
        </span>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-lg shrink-0"
          style={{ background: '#ffffff90', color: layer.color }}
        >
          {open ? 'הסתר' : `${questions.length} שאלות`}
        </span>
      </button>

      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {questions.map((q, i) => (
            <li
              key={i}
              className="bg-white/80 rounded-xl px-4 py-2.5 text-slate-700 text-sm md:text-base"
            >
              {q}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ConversationCardsPreview() {
  const [index, setIndex] = useState(0);
  const [openLayer, setOpenLayer] = useState('literal');

  const card = CARDS[index];
  const image = CARD_IMAGES[card.key];

  const go = (delta) => {
    setIndex((i) => (i + delta + CARDS.length) % CARDS.length);
    setOpenLayer('literal');
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto py-6 md:py-10 px-4">
      <NoIndexMeta />
      <PageMeta
        title="כרטיסי שיח — תצוגה מקדימה | StoryLeap"
        description="פיילוט פנימי: כרטיסי סיטואציה מותאמים אישית לפיתוח שיח בין הורה לילד."
      />

      <Link
        to="/activities"
        className="site-chrome inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>חזרה לפעילויות</span>
      </Link>

      {/* ── כותרת ─────────────────────────────────────────── */}
      <header className="site-chrome text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-4 border border-purple-100">
          <Sparkles className="w-3.5 h-3.5" />
          פיילוט פנימי — מוצר בבחינה
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          כרטיסי שיח
        </h1>
        <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          סיטואציות שהילד/ה חיים בהן באמת — ובכל אחת מהן הם עצמם הדמות.
          ההורה מראה את הכרטיס ושואל. הכרטיס הוא לא צעצוע לילד, הוא פתיח להורה.
        </p>
      </header>

      {/* ── הסבר השיטה ───────────────────────────────────── */}
      <div className="site-chrome grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {LAYERS.map((l, i) => {
          const Icon = l.icon;
          return (
            <div
              key={l.id}
              className="rounded-xl p-3 text-center"
              style={{ background: l.bg, border: `1px solid ${l.color}35` }}
            >
              <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: l.color }} />
              <div className="text-xs font-bold text-slate-700">
                {i + 1}. {l.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ניווט בין הכרטיסים ───────────────────────────── */}
      <div className="site-chrome flex items-center justify-between mb-3">
        <button
          onClick={() => go(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-50"
        >
          <ArrowRight className="w-4 h-4" />
          הקודם
        </button>

        <div className="flex gap-1.5">
          {CARDS.map((c, i) => (
            <button
              key={c.key}
              onClick={() => { setIndex(i); setOpenLayer('literal'); }}
              aria-label={c.title}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                background: i === index ? '#7C5CBF' : '#CBD5E1',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-50"
        >
          הבא
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* ── הכרטיס ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden mb-4">
        <img
          src={image}
          alt={card.title}
          className="w-full block"
          style={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
        />

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              {card.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              גיל {card.ages}
            </span>
            <span className="text-xs text-slate-400 ms-auto">
              {index + 1} / {CARDS.length}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3">{card.title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{card.why}</p>
        </div>
      </div>

      {/* ── שכבות השאלות ─────────────────────────────────── */}
      <div className="space-y-3 mb-8">
        {LAYERS.map((l) => (
          <LayerBlock
            key={l.id}
            layer={l}
            questions={card[l.id]}
            open={openLayer === l.id}
            onToggle={() => setOpenLayer(openLayer === l.id ? null : l.id)}
          />
        ))}
      </div>

      {/* ── הערת פיילוט ──────────────────────────────────── */}
      <div
        className="site-chrome rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: '#F8F7FC', border: '1.5px solid #E4DEF3', color: '#4A4166' }}
      >
        <strong className="font-semibold block mb-1">מה אתם רואים כאן</strong>
        ששת הכרטיסים נוצרו מ<strong>תמונת בדיקה אחת</strong> (צילום סטוק מ-Unsplash) דרך
        אותו מנוע שמייצר את לוחות ההתארגנות. במוצר אמיתי זו תהיה תמונה של הילד/ה
        שההורה מעלה. שימו לב שהילד/ה נשארים אותה דמות בכל שישה הכרטיסים, ושבכל
        סיטואציה — גם הקשות — הם אף פעם לא בוכים ולא מושפלים: מצויר תמיד הרגע
        <em> שלפני</em> ההכרעה.
      </div>
    </div>
  );
}
