import React from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function LoginPromptModal({ onClose }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  const handleLogin = () => {
    // After login, we return to CreateStory with a flag to resume
    base44.auth.redirectToLogin(window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'resume=1');
  };

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
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {isHe ? 'כמעט שם! 🎉' : 'Almost there! 🎉'}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {isHe
              ? 'כדי להמשיך לתשלום ולשמור את השאלון, יש להתחבר או להירשם באמצעות מייל.'
              : 'To continue to payment and save your questionnaire, please sign in or register with your email.'}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleLogin}
            className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            <LogIn className="w-4 h-4 ml-2" />
            {isHe ? 'התחבר / הירשם עם מייל' : 'Sign in / Register with email'}
          </Button>
          <button
            onClick={onClose}
            className="w-full text-sm text-slate-400 hover:text-slate-600 py-2"
          >
            {isHe ? 'חזרה לשאלון' : 'Back to questionnaire'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}