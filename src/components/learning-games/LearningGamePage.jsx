import React, { Suspense, lazy, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FlaskConical, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import { getLearningGame } from '@/components/learning-games/registry';

const LAZY = new Map();
function componentFor(game) {
  if (!LAZY.has(game.slug)) LAZY.set(game.slug, lazy(game.load));
  return LAZY.get(game.slug);
}

/**
 * One page for every learning game. Same shape as GameClinic.jsx — back link,
 * title, the game, a parent tip — plus a "why it helps" note, because these
 * games are chosen for what they train and a parent should be able to see it.
 */
export default function LearningGamePage({ slug }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const game = getLearningGame(slug);
  const Game = useMemo(() => (game ? componentFor(game) : null), [game]);

  if (!game) return null;

  const copy = isHe ? game.content.UI.he : game.content.UI.en;
  const meta = isHe ? game.content.META.he : game.content.META.en;
  const BackArrow = isHe ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-3xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />

      <Link
        to="/games"
        className="site-chrome inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <BackArrow className="w-4 h-4" />
        <span>{copy.back}</span>
      </Link>

      <header className="site-chrome text-center mb-7">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{copy.title}</h1>
        <p className="text-base text-slate-500 max-w-lg mx-auto">{copy.subtitle}</p>
      </header>

      <Suspense fallback={<div className="h-96 rounded-3xl bg-slate-50 animate-pulse" />}>
        <Game lang={isHe ? 'he' : 'en'} />
      </Suspense>

      <div
        className="site-chrome flex gap-3 items-start mt-10 rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: '#FFF8EC', border: '1.5px solid #F5C842', color: '#7A5000' }}
      >
        <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">{copy.parentTipLabel}: </strong>
          {copy.parentTip}
        </p>
      </div>

      <div
        className="site-chrome flex gap-3 items-start mt-3 rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: '#F1F8FD', border: '1.5px solid #9FD4EE', color: '#1F4F66' }}
      >
        <FlaskConical className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">{copy.whyLabel}: </strong>
          {copy.why}
        </p>
      </div>
    </div>
  );
}
