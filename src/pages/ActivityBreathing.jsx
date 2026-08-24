import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import Breathing from '@/components/activities/breathing/Breathing';
import { UI, META } from '@/components/activities/breathing/breathingContent';

export default function ActivityBreathing() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const copy = isHe ? UI.he : UI.en;
  const meta = isHe ? META.he : META.en;
  const BackArrow = isHe ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10">
      <PageMeta title={meta.title} description={meta.description} />

      <Link
        to="/activities"
        className="site-chrome inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <BackArrow className="w-4 h-4" />
        <span>{copy.back}</span>
      </Link>

      <header className="site-chrome text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">{copy.title}</h1>
        <p className="text-base text-slate-500 max-w-md mx-auto">{copy.subtitle}</p>
      </header>

      <Breathing lang={isHe ? 'he' : 'en'} />

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
    </div>
  );
}
