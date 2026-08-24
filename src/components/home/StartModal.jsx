import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, Sparkles, GraduationCap, Wand2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { navPathFor } from '@/lib/marketingRoutes';

// Shown when clicking the Hero "Let's start together" button. Offers the same three
// entry paths as the "Get Started" nav dropdown (see Layout.jsx), so the choice
// structure is identical in both places.
export default function StartModal({ onClose, onPickSpecific }) {
  const { lang } = useLanguage();
  const location = useLocation();
  const isHe = lang === 'he';

  const options = [
    {
      key: 'specific',
      icon: Sparkles,
      title: isHe ? 'משהו ספציפי עובר על הילד/ה שלי עכשיו' : 'Something specific my child is going through right now',
      action: onPickSpecific,
    },
    {
      key: 'school',
      icon: GraduationCap,
      title: isHe ? 'מתכוננים לכיתה א׳/גן' : 'Getting ready for school',
      to: navPathFor('KitaAlef', location.pathname, lang),
    },
    {
      key: 'adventure',
      icon: Wand2,
      title: isHe ? 'סתם הרפתקה כיפית ומעצימה' : 'Just a fun, empowering adventure',
      to: '/HeroStory',
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
          {isHe ? 'עם מה נתחיל?' : 'What would you like to start with?'}
        </h2>
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const content = (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <span className="text-slate-800 font-medium text-sm">{opt.title}</span>
              </div>
            );
            return opt.to ? (
              <Link key={opt.key} to={opt.to} onClick={onClose}>{content}</Link>
            ) : (
              <button key={opt.key} onClick={opt.action} className="w-full">{content}</button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}