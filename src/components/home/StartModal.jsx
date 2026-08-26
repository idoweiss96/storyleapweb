import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, Heart, RefreshCw, GraduationCap, Wand2, Puzzle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { navPathFor } from '@/lib/marketingRoutes';

// Shown when clicking the Hero "Let's start together" button. Mirrors the "Get
// Started" nav dropdown (see Layout.jsx): four options, each linking straight to
// its own questionnaire — no intermediate choice screen.
export default function StartModal({ onClose }) {
  const { lang } = useLanguage();
  const location = useLocation();
  const isHe = lang === 'he';

  const options = [
    {
      key: 'feeling',
      icon: Heart,
      title: isHe ? 'מתמודדים עם רגש' : 'Working through a feeling',
      to: '/CreateStory',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
    {
      key: 'change',
      icon: RefreshCw,
      title: isHe ? 'מתכוננים לשינוי' : 'Getting ready for a change',
      to: '/PrepareStory',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-500',
    },
    {
      key: 'kita',
      icon: GraduationCap,
      title: isHe ? 'מתחילים כיתה א׳' : 'Starting kindergarten',
      subtitle: isHe ? 'שאלון משותף הורה-ילד, 3 דקות' : 'A short parent-child questionnaire, 3 minutes',
      to: navPathFor('KitaAlef', location.pathname, lang),
      special: true,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      key: 'adventure',
      icon: Wand2,
      title: isHe ? 'סיפור מעצים ביטחון' : 'Building Confidence',
      to: '/HeroStory',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      key: 'activities',
      icon: Puzzle,
      title: isHe ? 'פעילויות חינמיות' : 'Free Activities',
      subtitle: isHe ? 'לחינם' : 'Free',
      to: '/activities',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 text-center mb-6">
          {isHe ? 'איזה סיפור ניצור?' : 'What would you like to start with?'}
        </h2>
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Link key={opt.key} to={opt.to} onClick={onClose}>
                <div className={`relative flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
                  opt.special
                    ? 'border-2 border-pink-200 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 hover:border-pink-300'
                    : 'border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}>
                  {opt.special && (
                    <span className="absolute -top-2.5 end-3 text-[11px] font-semibold text-white bg-gradient-to-r from-pink-400 to-sky-400 rounded-full px-2 py-0.5 shadow-sm">
                      ✨ {isHe ? 'ספיישל' : 'Special'}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.iconBg || 'bg-slate-100'}`}>
                    <Icon className={`w-5 h-5 ${opt.iconColor || 'text-slate-700'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-800 font-medium text-sm">{opt.title}</span>
                    {opt.subtitle && (
                      <span className="text-xs text-slate-500 mt-0.5">{opt.subtitle}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}