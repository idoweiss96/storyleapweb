import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

// Short tip shown before sending the parent to the general CreateStory questionnaire.
export default function GalleryTipPopup({ tip, onClose, onContinue }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const content = isHe ? tip.he : tip.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">{content.title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{content.body}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={onContinue} className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold">
            {isHe ? 'המשך ליצירת הסיפור' : 'Continue to create the story'}
          </Button>
          <button onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 py-2">
            {isHe ? 'סגירה' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}