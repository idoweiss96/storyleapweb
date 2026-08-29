import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles, Star, BookOpen, Wand2, Heart, ArrowLeft, Dumbbell,
  ChevronRight, ChevronLeft, Quote, MessageCircle, Check,
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { navPathFor } from '@/lib/marketingRoutes';
import StoryGallery from '@/components/home/StoryGallery';
import ActivityPlaceTeaser from '@/components/home/ActivityPlaceTeaser';
import StartModal from '@/components/home/StartModal';
import PageMeta from '@/components/SEO/PageMeta';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import NavbarSL from '@/components/home-new/NavbarSL';

/*
 * HomeNew  -  UX-refinement prototype of the LIVE Home page (src/pages/Home.jsx).
 * Route: /HomeNew.  noindex.  Not linked from production navigation.
 *
 * DESIGN INTENT: ~90% the existing StoryLeap homepage, ~10% UX refinement.
 * Same fonts, same magical Layout background + stars, same StoryLeap colors,
 * gradients, buttons, cards, chips and emotional tone. The only changes:
 *   1. Hero hierarchy - the "what is your child going through?" Moment selector
 *      is moved up so headline + explanation + Moment question + first chips
 *      are visible without scrolling.
 *   2. First-viewport clutter removed - the "200+ stories" / "digital story
 *      ready in hours" pills are gone; the seasonal sale + crossed price moves
 *      to a slim top strip instead of sitting under the primary CTA.
 *   3. One quiet trust line replaces the promo pills.
 *   4. Simpler nav IA via NavbarSL (same visual style as the live header).
 *   5. Small "How it works (parent / child / together)" and "For Professionals"
 *      sections, built from the existing Card aesthetic.
 *   6. Story gallery moved lower so the page reads less like a story catalog.
 *
 * Nothing on the live Home page or any shared production component is modified.
 * While mounted, `hn2-active` on <html> hides ONLY the inherited header
 * (header.site-chrome) so NavbarSL can replace it; removed on unmount.
 */

const HOME_META = {
  en: {
    title: "StoryLeap - Helping Families Through Childhood's Moments",
    description:
      'StoryLeap helps families navigate the emotional moments of childhood, with guidance for parents, tools and activities for children, and personalized stories.',
  },
  he: {
    title: 'סטוריליפ - מלווים משפחות ברגעים הרגשיים של הילדות',
    description:
      'סטוריליפ מלווה משפחות ברגעים הרגשיים של הילדות, בעזרת הכוונה להורים, כלים ופעילויות לילדים, וסיפורים מותאמים אישית.',
  },
};

const CHIP_ITEMS = [
  { key: 'chip_new', icon: '🌱', className: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300' },
  { key: 'chip_fear', icon: '🌙', className: 'bg-violet-50 border-violet-200 text-violet-800 hover:bg-violet-100 hover:border-violet-300' },
  { key: 'chip_moving', icon: '🏠', className: 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100 hover:border-sky-300' },
  { key: 'chip_friendship', icon: '🤝', className: 'bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100 hover:border-pink-300' },
  { key: 'chip_separation', icon: '👋', className: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100 hover:border-teal-300' },
  { key: 'chip_emotions', icon: '💗', className: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300' },
  { key: 'chip_other', icon: '✨', className: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300' },
];

// Identical to the live Home page: emotional-challenge chips route to a prefilled
// CreateStory / PrepareStory, "something new" topics to PrepareStory.
function chipDestination(key) {
  switch (key) {
    case 'chip_new': return '/PrepareStory';
    case 'chip_moving': return '/PrepareStory?topic=moving_home';
    case 'chip_separation': return `${createPageUrl('CreateStory')}?from=chip_separation&challenge=separation_anxiety`;
    case 'chip_fear': return `${createPageUrl('CreateStory')}?from=chip_fear&challenge=fears`;
    case 'chip_friendship': return `${createPageUrl('CreateStory')}?from=chip_friendship&challenge=social_difficulty`;
    case 'chip_emotions': return `${createPageUrl('CreateStory')}?from=chip_emotions&challenge=emotional_regulation`;
    default: return `${createPageUrl('CreateStory')}?from=chip_other`;
  }
}

// Moments as data, so the selector can be a real "pick, then continue"
// interaction. Destinations are the same prefilled flows the live chips use;
// `bedtime` is the one addition. Wording comes from the shared dictionary where
// a key already exists.
const MOMENTS = [
  { key: 'chip_new', tone: 'peach', glyph: 'door', to: '/PrepareStory' },
  { key: 'chip_fear', tone: 'lavender', glyph: 'lantern', to: `${createPageUrl('CreateStory')}?from=chip_fear&challenge=fears` },
  { key: 'chip_moving', tone: 'blue', glyph: 'house', to: '/PrepareStory?topic=moving_home' },
  { key: 'chip_friendship', tone: 'blush', glyph: 'bubbles', to: `${createPageUrl('CreateStory')}?from=chip_friendship&challenge=social_difficulty` },
  { key: 'chip_separation', tone: 'mint', glyph: 'linked', to: `${createPageUrl('CreateStory')}?from=chip_separation&challenge=separation_anxiety` },
  { key: 'chip_emotions', tone: 'rose', glyph: 'cloud', to: `${createPageUrl('CreateStory')}?from=chip_emotions&challenge=emotional_regulation` },
  { key: 'bedtime', tone: 'night', glyph: 'pillow', to: `${createPageUrl('CreateStory')}?from=chip_bedtime&challenge=sleep_issues`, he: 'שעת השינה', en: 'Bedtime' },
  { key: 'chip_other', tone: 'neutral', glyph: 'book', to: `${createPageUrl('CreateStory')}?from=chip_other` },
];

// Soft StoryLeap colour identity per moment category. Full literal class strings
// so the Tailwind scanner keeps them. No icons, no emoji - colour is the cue.
const TONE = {
  peach:    { card: 'bg-amber-50/70 border-amber-100 hover:border-amber-200',   sel: 'bg-amber-50 border-amber-300 ring-2 ring-amber-200',   swatch: 'bg-amber-200/80',  check: 'text-amber-600' },
  lavender: { card: 'bg-violet-50/70 border-violet-100 hover:border-violet-200', sel: 'bg-violet-50 border-violet-300 ring-2 ring-violet-200', swatch: 'bg-violet-200/80', check: 'text-violet-600' },
  blue:     { card: 'bg-sky-50/80 border-sky-100 hover:border-sky-200',          sel: 'bg-sky-50 border-sky-300 ring-2 ring-sky-200',          swatch: 'bg-sky-200/80',    check: 'text-sky-600' },
  blush:    { card: 'bg-pink-50/70 border-pink-100 hover:border-pink-200',       sel: 'bg-pink-50 border-pink-300 ring-2 ring-pink-200',       swatch: 'bg-pink-200/80',   check: 'text-pink-600' },
  mint:     { card: 'bg-teal-50/70 border-teal-100 hover:border-teal-200',       sel: 'bg-teal-50 border-teal-300 ring-2 ring-teal-200',       swatch: 'bg-teal-200/80',   check: 'text-teal-600' },
  rose:     { card: 'bg-rose-50/70 border-rose-100 hover:border-rose-200',       sel: 'bg-rose-50 border-rose-300 ring-2 ring-rose-200',       swatch: 'bg-rose-200/80',   check: 'text-rose-600' },
  night:    { card: 'bg-indigo-50/70 border-indigo-100 hover:border-indigo-200', sel: 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200', swatch: 'bg-indigo-200/80', check: 'text-indigo-600' },
  neutral:  { card: 'bg-slate-50 border-slate-200 hover:border-slate-300',       sel: 'bg-slate-100 border-slate-300 ring-2 ring-slate-200',   swatch: 'bg-slate-300/70', check: 'text-slate-600' },
};

// First-pass branded micro-illustrations for the moment cards. Soft rounded
// fills, one idea each, a cream highlight and a single "magic" spark, all tinted
// from the card's own category colour. No emoji, no icon-library glyphs, no
// outlines. viewBox 40x40, readable at ~32-40px.
const MOMENT_PALETTE = {
  peach:    { bg: '#FDF1E3', mid: '#F6D3A6', deep: '#E1934E', accent: '#F5C24B' },
  lavender: { bg: '#F1ECFB', mid: '#D6C7F0', deep: '#9576D1', accent: '#C7B3EC' },
  blue:     { bg: '#E8F1FB', mid: '#BFD9F1', deep: '#5E9AD1', accent: '#A9CFF0' },
  blush:    { bg: '#FCEAF1', mid: '#F4C6D9', deep: '#DD7FA6', accent: '#F3B0CA' },
  mint:     { bg: '#E5F5F0', mid: '#BEE6D9', deep: '#5EBFA8', accent: '#A7E1D0' },
  rose:     { bg: '#FCEBEC', mid: '#F4C6CC', deep: '#DC7D89', accent: '#F2AEB6' },
  night:    { bg: '#ECEDFA', mid: '#C7CBEF', deep: '#7E84CE', accent: '#C6B4EC' },
  neutral:  { bg: '#F3F3F6', mid: '#DBDFE6', deep: '#9AA1AC', accent: '#F3C766' },
};

function MomentGlyph({ tone, kind }) {
  const P = MOMENT_PALETTE[tone] || MOMENT_PALETTE.neutral;
  const cream = '#FFFDF7';
  const shapes = {
    // Starting something new - an open door in an arched frame, soft glow behind
    door: (
      <>
        <circle cx="22" cy="19" r="8" fill={P.accent} opacity="0.5" />
        <path d="M14 30 v-12.5 a6 6 0 0 1 12 0 V30 Z" fill={P.mid} />
        <path d="M16.6 30 v-10.5 a3.4 3.4 0 0 1 6.8 0 V30 Z" fill={cream} />
        <path d="M16.6 18 L10.6 20.5 V29.6 L16.6 27.1 Z" fill={P.deep} />
        <circle cx="14.4" cy="24" r="0.9" fill={P.mid} />
        <rect x="8.8" y="29.4" width="22.4" height="2.4" rx="1.2" fill={P.deep} opacity="0.5" />
      </>
    ),
    // Dealing with fear - a small hanging lantern with a warm protective light
    lantern: (
      <>
        <circle cx="20" cy="22" r="10" fill={P.accent} opacity="0.38" />
        <circle cx="20" cy="6.2" r="1.7" fill="none" stroke={P.deep} strokeWidth="1.4" />
        <path d="M20 7.9 V10" stroke={P.deep} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="15" y="10" width="10" height="3" rx="1.5" fill={P.deep} />
        <rect x="14" y="13" width="12" height="15" rx="4" fill={P.mid} />
        <rect x="17" y="16" width="6" height="10" rx="2.6" fill={cream} />
        <path d="M20 19.4 q2.1 2.4 0 4.4 q-2.1 -2 0 -4.4 Z" fill={P.accent} />
        <rect x="14" y="27.4" width="12" height="3" rx="1.5" fill={P.deep} />
      </>
    ),
    // Moving house - a small house with one moving box
    house: (
      <>
        <path d="M10 20.5 L19 11.5 L28 20.5 V29 a1 1 0 0 1 -1 1 H11 a1 1 0 0 1 -1 -1 Z" fill={P.mid} />
        <path d="M8.6 21 L19 10.5 L29.4 21" fill="none" stroke={P.deep} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16.4" y="22" width="5.2" height="8" rx="1.6" fill={cream} />
        <rect x="23.5" y="23.5" width="8.5" height="7.5" rx="1.6" fill={P.deep} />
        <path d="M23.5 27.2 H32 M27.7 23.5 V31" stroke={P.bg} strokeWidth="1.3" />
      </>
    ),
    // Friendship challenges - two soft speech bubbles in dialogue
    bubbles: (
      <>
        <rect x="6.5" y="10.5" width="16" height="11" rx="4.5" fill={P.mid} />
        <path d="M11 21 l-1.4 3.6 4.2 -2.6 Z" fill={P.mid} />
        <g fill={cream}>
          <circle cx="11.5" cy="16" r="1.1" />
          <circle cx="15" cy="16" r="1.1" />
          <circle cx="18.5" cy="16" r="1.1" />
        </g>
        <rect x="19" y="18.5" width="15" height="10" rx="4.5" fill={P.deep} />
        <path d="M29.5 28.5 l1.3 3.2 -4 -2.4 Z" fill={P.deep} />
      </>
    ),
    // Separation - two soft shapes connected gently
    linked: (
      <>
        <circle cx="13" cy="20" r="6.6" fill={P.mid} />
        <circle cx="27" cy="20" r="6.6" fill={P.deep} />
        <circle cx="10.8" cy="17.8" r="1.6" fill={cream} />
        <g fill={P.accent}>
          <circle cx="17.6" cy="20" r="1.05" />
          <circle cx="20" cy="20" r="1.05" />
          <circle cx="22.4" cy="20" r="1.05" />
        </g>
      </>
    ),
    // Big emotions - a soft cloud with a subtle swirl
    cloud: (
      <>
        <path d="M12.5 25 a5 5 0 0 1 0.8 -9.4 a6 6 0 0 1 11.2 -0.6 a4.6 4.6 0 0 1 2.8 10 Z" fill={P.mid} />
        <path d="M15 20 c2.2 -2.2 5.4 -2.2 7.4 0 c1.5 1.5 -0.4 3.9 -2 2.6" fill="none" stroke={P.deep} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M26.5 11 l0.7 1.7 1.8 0.2 -1.3 1.3 0.3 1.8 -1.6 -0.9 -1.6 0.9 0.3 -1.8 -1.3 -1.3 1.8 -0.2 Z" fill={P.accent} />
      </>
    ),
    // Bedtime - a pillow with a moon
    pillow: (
      <>
        <path d="M8 22 a4.5 4.5 0 0 1 4.5 -5.5 h15 a4.5 4.5 0 0 1 0 11 h-15 A4.5 4.5 0 0 1 8 22 Z" fill={P.mid} />
        <path d="M11.5 17.5 q4.5 -3 9 0" fill="none" stroke={cream} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M25.5 8 a4.4 4.4 0 1 0 3.2 7.5 A5.4 5.4 0 0 1 25.5 8 Z" fill={P.accent} />
        <circle cx="31.2" cy="9.4" r="0.9" fill={P.deep} />
      </>
    ),
    // Something else - a small open book with a star
    book: (
      <>
        <path d="M9 13 q5.2 -2.6 11 0 v15.6 q-5.8 -2.4 -11 0 Z" fill={P.mid} />
        <path d="M31 13 q-5.2 -2.6 -11 0 v15.6 q5.8 -2.4 11 0 Z" fill={P.deep} />
        <path d="M20 12.6 V29" stroke={P.bg} strokeWidth="1.3" />
        <path d="M26.8 8.5 l0.8 1.9 2 0.8 -2 0.8 -0.8 1.9 -0.8 -1.9 -2 -0.8 2 -0.8 Z" fill={P.accent} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0" aria-hidden="true">
      <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill={P.bg} />
      {shapes[kind] || shapes.book}
    </svg>
  );
}

const HERO_STORY_IMG =
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/465dd64af_image3.png';

/*
 * The hero's visual anchor: a personalized-story preview with a small set of
 * explanatory callouts around it. They read as a labelling SYSTEM, not stickers -
 * each names a real part of a StoryLeap experience:
 *   · Parent guidance            (what's included)
 *   · A personalized story        (what's included - integrated into the card)
 *   · Gentle activities           (what's included)
 *   · A doorway to emotional conversations   (why it matters - visually distinct)
 * "Evidence-informed" already appears in the trust line under the moment box, so
 * it is deliberately not repeated here. Flow layout (no absolute stickers) keeps
 * the composition breathable and avoids covering the image.
 * NOTE: a small Leapy could later sit beside this stack once a hosted asset exists.
 */
function HeroPreview({ isHe }) {
  const pill =
    'inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-slate-200/80 shadow-md px-3 py-1.5 text-xs font-semibold text-slate-700';
  return (
    <div className="relative mx-auto w-[16.5rem] sm:w-[18rem] md:w-[19rem] max-w-full my-3">
      {/* included: parent guidance - tucked to the top corner, mostly in the margin */}
      <div className="relative z-10 flex justify-end pe-3 mb-[-0.55rem]">
        <span className={pill}>
          <Heart className="w-3 h-3 text-rose-400" aria-hidden="true" />
          {isHe ? 'הכוונה להורה' : 'Parent guidance'}
        </span>
      </div>

      {/* the story - a real StoryLeap illustration, its name integrated at the bottom */}
      <div className="rounded-3xl bg-white border border-white shadow-xl shadow-slate-200/70 overflow-hidden" style={{ transform: 'rotate(-1.5deg)' }}>
        <div className="aspect-[4/3] overflow-hidden bg-slate-50">
          <img
            src={HERO_STORY_IMG}
            alt={isHe ? 'עמוד מתוך סיפור מותאם אישית' : 'A page from a personalized story'}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-violet-500" />
          </span>
          <span className="text-sm font-semibold text-slate-700">
            {isHe ? 'סיפור מותאם אישית' : 'A personalized story'}
          </span>
        </div>
      </div>

      {/* included: gentle activities - tucked to the bottom corner, opposite side */}
      <div className="relative z-10 flex justify-start ps-3 mt-[-0.55rem]">
        <span className={pill}>
          <Sparkles className="w-3 h-3 text-sky-400" aria-hidden="true" />
          {isHe ? 'פעילויות עדינות' : 'Gentle activities'}
        </span>
      </div>

      {/* why it matters - a supporting line, softer and centred so it reads apart from the "what" pills */}
      <div className="mt-3.5 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50/80 border border-violet-100 px-3.5 py-1.5 text-[11px] md:text-xs font-semibold text-violet-800">
          <MessageCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" aria-hidden="true" />
          {isHe ? 'פתח לשיחות רגשיות' : 'A doorway to emotional conversations'}
        </span>
      </div>
    </div>
  );
}

/*
 * The central Moment selector - the entry point to a StoryLeap experience.
 * Larger, colour-coded, no emoji. Pick a moment, then the primary CTA becomes
 * contextual to that choice.
 */
function MomentBox({ isHe, t, onOpenModal }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const sel = MOMENTS.find((m) => m.key === selected);
  const label = (m) => (m.he ? (isHe ? m.he : m.en) : t(m.key));

  return (
    <div id="experiences" className="scroll-mt-24 max-w-3xl mx-auto rounded-3xl bg-white/90 border border-white/80 shadow-xl shadow-slate-200/70 px-5 py-8 md:px-10 md:py-10">
      <div className="text-center mb-6 md:mb-8">
        <span className="inline-block text-[11px] font-bold tracking-wide text-violet-500 bg-violet-50 rounded-full px-3 py-1 mb-3">
          {isHe ? 'כאן מתחילה חוויה' : 'A StoryLeap experience starts here'}
        </span>
        <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 mb-1.5">{t('hero_chips_title')}</h2>
        <p className="text-sm md:text-base text-slate-500">
          {isHe ? 'בוחרים את הרגע, ואנחנו מובילים אתכם לכלים הנכונים.' : "Choose the moment, and we'll guide you to the right tools."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOMENTS.map((m) => {
          const on = selected === m.key;
          const T = TONE[m.tone] || TONE.neutral;
          return (
            <button
              key={m.key}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(on ? null : m.key)}
              className={`relative flex flex-col items-start gap-2.5 text-start rounded-2xl border px-4 py-4 md:px-5 md:py-5 transition-all duration-200 ${
                on ? `${T.sel} shadow-md` : `${T.card} hover:-translate-y-1 hover:shadow-lg`
              }`}
            >
              <MomentGlyph tone={m.tone} kind={m.glyph} />
              <span className="text-sm md:text-[15px] font-bold text-slate-700 leading-snug">{label(m)}</span>
              {on && (
                <Check
                  className={`absolute w-4 h-4 ${T.check}`}
                  strokeWidth={3}
                  style={{ top: '0.7rem', insetInlineEnd: '0.7rem' }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col items-center gap-2.5">
        <Button
          size="lg"
          onClick={() => (sel ? navigate(sel.to) : onOpenModal())}
          className="h-14 px-8 rounded-full text-base md:text-lg font-bold text-white hover:scale-105 active:scale-95 hover:opacity-90 transition-all duration-300 border-0"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)', boxShadow: '0 10px 40px rgba(255,111,181,0.25), 0 4px 20px rgba(79,195,232,0.2)' }}
        >
          {sel
            ? (isHe ? 'לגלות את החוויה הזו ←' : 'Explore this experience →')
            : (isHe ? 'בואו נתחיל יחד ←' : "Let's start together →")}
        </Button>
        {sel ? (
          <button type="button" onClick={() => setSelected(null)} className="text-xs md:text-sm text-slate-400 hover:text-slate-600 underline">
            {isHe ? 'לבחור רגע אחר' : 'Pick a different moment'}
          </button>
        ) : (
          <button type="button" onClick={onOpenModal} className="text-xs md:text-sm text-slate-400 hover:text-slate-600 underline">
            {isHe ? 'עזרו לי לבחור' : 'Help me choose'}
          </button>
        )}
      </div>
    </div>
  );
}

// Copied verbatim from src/pages/Home.jsx - same visual, same content.
function TestimonialsCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
    { name: t('t1_name'), text: t('t1_text'), stars: 5 },
    { name: t('t2_name'), text: t('t2_text'), stars: 5 },
    { name: t('t3_name'), text: t('t3_text'), stars: 5 },
    { name: t('t4_name'), text: t('t4_text'), stars: 5 },
    { name: t('t5_name'), text: t('t5_text'), stars: 5 },
    { name: t('t6_name'), text: t('t6_text'), stars: 5 },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const prev = () => { setCurrent((current - 1 + testimonials.length) % testimonials.length); setAutoPlay(false); };
  const next = () => { setCurrent((current + 1) % testimonials.length); setAutoPlay(false); };
  const item = testimonials[current];

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{t('testimonials_title')}</h2>
        <p className="text-slate-500">{t('testimonials_subtitle')}</p>
      </div>
      <div className="max-w-2xl mx-auto relative">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-0 shadow-xl shadow-slate-100">
            <CardContent className="p-8 text-center">
              <Quote className="w-10 h-10 text-slate-300 mx-auto mb-4 rotate-180" />
              <p className="text-slate-700 text-lg leading-relaxed mb-6">"{item.text}"</p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="font-semibold text-slate-700">{item.name}</p>
            </CardContent>
          </Card>
        </motion.div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setCurrent(i); setAutoPlay(false); }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-slate-700 w-6' : 'bg-slate-300'}`} />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomeNew() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const isHe = lang === 'he';
  const kitaAlefPath = navPathFor('KitaAlef', location.pathname, lang);
  const pricingPath = navPathFor('Pricing', location.pathname, lang);
  const visionPath = navPathFor('Vision', location.pathname, lang);
  const [showStartModal, setShowStartModal] = useState(false);

  // Hide ONLY the inherited header for this route; keep the magical background,
  // the star layer and the footer from Layout. Reversible on unmount.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('hn2-active');
    return () => root.classList.remove('hn2-active');
  }, []);

  const homeMeta = HOME_META[lang] || HOME_META.en;

  // Same four cards as the live Features section, kept as-is further down.
  const features = [
    { icon: Wand2, title: t('feature1_title'), description: t('feature1_desc'), bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: Dumbbell, title: t('feature2_title'), description: t('feature2_desc'), bg: 'bg-rose-50', iconColor: 'text-rose-500' },
    { icon: Heart, title: t('feature3_title'), description: t('feature3_desc'), bg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { icon: MessageCircle, title: t('feature4_title'), description: t('feature4_desc'), bg: 'bg-indigo-50', iconColor: 'text-indigo-500', isNew: true },
  ];

  // "How it works" - parent / child / together, built from the existing card style.
  const howCards = [
    {
      icon: Heart, bg: 'bg-rose-50', iconColor: 'text-rose-500',
      title: isHe ? 'להורה — להבין מה קורה' : 'Parent — understand the moment',
      desc: isHe
        ? 'הכוונה בשפה פשוטה: על מה לשים לב, מה לשאול, מה לנסות.'
        : 'Plain-language guidance: what to notice, what to ask, what to try.',
    },
    {
      icon: Wand2, bg: 'bg-blue-50', iconColor: 'text-blue-600',
      title: isHe ? 'לילד/ה — דרך עדינה פנימה' : 'Child — a gentle way in',
      desc: isHe
        ? 'סיפור מותאם אישית, פעילויות וכלים לחקור את הרגש בלי לחץ.'
        : 'A personalized story, plus activities and tools to explore the feeling without pressure.',
    },
    {
      icon: MessageCircle, bg: 'bg-amber-50', iconColor: 'text-amber-500',
      title: isHe ? 'ביחד — להפוך את זה לחיבור' : 'Together — turn it into connection',
      desc: isHe
        ? 'שאלות לשיחה, טקסים קטנים ופעילות משותפת שחוזרת לחיים האמיתיים.'
        : 'Conversation prompts, small rituals and shared activity that come back into real life.',
    },
  ];

  return (
    <div className="pb-12">
      <PageMeta title={homeMeta.title} description={homeMeta.description} />
      <NoIndexMeta />
      <style>{`
        html.hn2-active header.site-chrome { display: none !important; }
        html.hn2-active main { padding-top: 0 !important; }
        html.hn2-active body { overflow-x: hidden; }
      `}</style>

      {/* Slim seasonal-sale strip - moved out of the hero center */}
      <div style={{ width: '100vw', marginInlineStart: 'calc(50% - 50vw)' }}
        className="bg-amber-50/90 border-b border-amber-100 text-amber-800 text-xs md:text-sm text-center py-1.5 px-4">
        <Link to={pricingPath} className="inline-flex items-center gap-1.5 hover:underline">
          <span>☀️ {isHe ? 'מבצע חופש גדול' : 'Summer Sale'}</span>
          <span className="line-through opacity-60">{isHe ? '₪110' : '$40'}</span>
          <span className="font-bold">{isHe ? '₪70' : '$25'}</span>
        </Link>
      </div>

      {/* Simplified navigation - same StoryLeap styling as the live header */}
      <div style={{ width: '100vw', marginInlineStart: 'calc(50% - 50vw)' }}>
        <NavbarSL />
      </div>

      {/* ============================ HERO ============================ */}
      <section className="relative pt-10 pb-10 md:pt-14 md:pb-12 overflow-hidden">
        {/* a few gentle stars kept for atmosphere (was 12, now 5) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Star key={i}
              className={`absolute w-3 h-3 text-blue-200 fill-blue-100 opacity-60 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
              style={{ top: `${12 + (i * 17) % 70}%`, left: `${(i * 23) % 92}%` }} />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* headline + one meaningful visual anchor */}
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-center mb-9 md:mb-11">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center md:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-5 border border-blue-100">
                <Sparkles className="w-4 h-4" />
                {t('hero_badge')}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                {isHe
                  ? 'חוויות מותאמות אישית שעוזרות לילד/ה שלכם להרגיש שמבינים אותו/ה'
                  : 'Personalized experiences that help your child feel understood'}
              </h1>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto md:mx-0">
                {isHe
                  ? 'ספרו לנו מה עובר על הילד/ה שלכם, ואנחנו נלווה אתכם בזה — סיפור מותאם אישית, פעילויות עדינות, והכוונה מעשית להורים.'
                  : "Tell us what your child is going through, and we'll walk through it with you - a personalized story, gentle activities, and practical guidance for the grown-ups."}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <HeroPreview isHe={isHe} />
            </motion.div>
          </div>

          {/* Moment box - the single strong central interaction */}
          <MomentBox isHe={isHe} t={t} onOpenModal={() => setShowStartModal(true)} />

          {/* One quiet trust line (replaces the two promo pills) */}
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto text-center mt-5">
            {isHe
              ? 'בשימוש אצל 200+ משפחות · פרטי ובהובלת ההורה · גישה מבוססת מחקר'
              : 'Used by 200+ families · Private & parent-guided · Evidence-informed approach'}
          </p>
        </div>
      </section>

      {/* ==================== HOW IT WORKS (parent / child / together) ==================== */}
      <section id="how" className="py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {isHe ? 'איך זה עובד' : 'How it works'}
          </h2>
          <p className="text-slate-500">
            {isHe
              ? 'כל חוויה נבנית סביב רגע אחד אמיתי: הכוונה להורה, סיפור מותאם אישית, ופעילויות שמלוות אותו.'
              : 'Each experience is built around one real moment: parent guidance, a personalized story, and activities that support it.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i} className="h-full border-0 shadow-lg shadow-slate-100">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${c.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{c.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ==================== KITA ALEF BANNER (unchanged from live Home) ==================== */}
      <section className="py-4">
        <Link to={kitaAlefPath}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl p-6 md:p-8 text-center cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)', border: '1px solid #FFD6EC', boxShadow: '0 8px 30px rgba(255,111,181,0.12)' }}
          >
            <div className="absolute top-3 right-6 text-2xl opacity-60 star-float-1">✦</div>
            <div className="absolute bottom-3 left-8 text-lg opacity-50 star-float-2">★</div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ background: 'linear-gradient(135deg, #FFD6EC, #B8EBF7)', color: '#1A1A6E' }}>
              {isHe ? '✨ ספיישל כיתה א׳' : '✨ Starting School Special'}
            </span>
            <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ color: '#1A1A6E' }}>
              {isHe ? 'הכנה לכיתה א׳ ביחד 💗' : 'Getting Ready for Kindergarten Together 💖'}
            </h3>
            <p className="text-sm md:text-base mb-4" style={{ color: '#6b6b8a' }}>
              {isHe ? 'שאלון משותף לילד ולהורה - 5 דקות 🎒' : 'A joint questionnaire for child and parent, 5 minutes 🎒'}
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
              <Sparkles className="w-4 h-4" />
              {isHe ? 'לחצו כאן להתחלה' : 'Click here to start'}
            </span>
          </motion.div>
        </Link>
      </section>

      {/* ==================== ACTIVITIES (grouped: free set + Activity Place) ==================== */}
      <section className="py-8">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
            {isHe ? 'פעילויות שמלוות את החוויה' : 'Activities that support the experience'}
          </h3>
          <p className="text-slate-500 text-sm">
            {isHe
              ? 'כלים קצרים לצד הסיפור — או בפני עצמם. בלי הרשמה, בלי תשלום.'
              : 'Short tools to use alongside a story - or on their own. No signup, no payment.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Link to="/FreeActivityGoodbye">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">{isHe ? 'טקס הפרידה שלנו' : 'Our Goodbye Ritual'}</h4>
                <p className="text-slate-500 text-sm">{isHe ? 'בונים יחד פרידה קבועה ומרגיעה לשער בית הספר' : 'Build a calm, consistent goodbye routine together'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/FreeActivityMorningEvening">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">{isHe ? 'הבוקר והערב שלי' : 'My Morning and Evening'}</h4>
                <p className="text-slate-500 text-sm">{isHe ? 'בונים לוח שגרה אישי להדפסה לבוקר ולערב' : 'Build a printable personal routine board'}</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/FreeActivityLittleHeart">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">{isHe ? 'לב קטן מהבית' : 'A Little Heart from Home'}</h4>
                <p className="text-slate-500 text-sm">{isHe ? 'יוצרים יחד כרטיס, מכתב או ציור לקחת בתיק' : 'Create a card, letter, or drawing to take along'}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <ActivityPlaceTeaser />

      {/* ==================== FEATURES (unchanged from live Home) ==================== */}
      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative">
                {feature.isNew && (
                  <span className="absolute -top-3 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">
                    {t('badge_new')}
                  </span>
                )}
                <Card className={`h-full shadow-lg shadow-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 ${feature.isNew ? 'border-2 border-blue-300' : 'border-0'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================== MAYA SAMPLE (unchanged from live Home) ==================== */}
      <section className="py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg shadow-amber-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #fff8ed 0%, #fde8c8 100%)' }}>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">✨ {t('maya_sample')}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('maya_title')}</h3>
                  <Link to="/MayaStory">
                    <Button className="rounded-xl px-6" style={{ background: '#c07028', color: 'white' }}>
                      📖 {t('maya_btn')}
                    </Button>
                  </Link>
                </div>
                <img src="https://media.base44.com/images/public/697f4b704975c71e9cf56f59/7455564e3_MAYA.png" alt="Princess Maya" className="w-36 md:w-44 object-contain drop-shadow-lg rounded-md" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ==================== STORY GALLERY (moved lower - de-emphasise the catalog) ==================== */}
      <StoryGallery />

      {/* ==================== TESTIMONIALS (unchanged from live Home) ==================== */}
      <TestimonialsCarousel />

      {/* ==================== FOR PROFESSIONALS - soft, secondary, NOT in the main nav ==================== */}
      <section id="professionals" className="py-6">
        <Card className="border-0 shadow-md shadow-slate-100">
          <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-center gap-4 text-center md:text-start bg-slate-50/60">
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {isHe ? 'לאנשי מקצוע' : 'For professionals'}
              </p>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isHe ? 'עובדים עם ילדים באופן מקצועי?' : 'Work with children professionally?'}
              </h3>
              <p className="text-slate-500 text-sm">
                {isHe
                  ? 'אנחנו בונים כלים לאנשי מקצוע גם — מטפלים, מחנכים ואנשי התפתחות הילד. עדיין בשלבי פיתוח.'
                  : "We're building tools for professionals too - therapists, educators and child-development specialists. Still early."}
              </p>
            </div>
            <Link to={visionPath}>
              <Button variant="outline" className="rounded-xl">{isHe ? 'לקרוא עוד' : 'Learn more'}</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* ==================== SECURITY BADGE (unchanged from live Home) ==================== */}
      <section className="py-4 flex justify-center">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm text-slate-500">
          <span className="flex items-center gap-2"><span className="text-green-500">🔒</span> {isHe ? 'המידע שלכם מוצפן ומאובטח' : 'Your data is encrypted & secure'}</span>
          <span className="w-px h-4 bg-slate-200 hidden sm:block" />
          <span className="flex items-center gap-2"><span>🛡️</span> {isHe ? 'לא נשתף מידע עם צד שלישי' : 'We never share your data'}</span>
          <span className="w-px h-4 bg-slate-200 hidden sm:block" />
          <span className="flex items-center gap-2"><span>✅</span> {isHe ? 'עמידה בתקני פרטיות' : 'Privacy compliant'}</span>
        </div>
      </section>

      {/* ==================== BOTTOM CTA (unchanged from live Home) ==================== */}
      <section className="py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="overflow-hidden border-0 shadow-2xl shadow-slate-200">
            <div className="p-8 md:p-12 text-white text-center relative" style={{ background: 'linear-gradient(135deg, #BAD1FA, #9ab8f5)' }}>
              <Star className="absolute top-4 right-8 w-6 h-6 text-blue-300 fill-blue-300 opacity-60" />
              <Star className="absolute bottom-6 left-12 w-4 h-4 text-blue-200 fill-blue-200 opacity-40" />
              <Star className="absolute top-8 left-20 w-3 h-3 text-white/30 fill-white/30" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('cta_title')}</h2>
              <p className="mb-6 max-w-lg mx-auto text-slate-500">{t('cta_desc')}</p>
              <Link to={createPageUrl('CreateStory')}>
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-semibold">
                  {t('cta_btn')}
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      <AnimatePresence>
        {showStartModal && <StartModal onClose={() => setShowStartModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
