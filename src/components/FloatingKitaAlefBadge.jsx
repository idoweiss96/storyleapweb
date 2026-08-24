import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { navPathFor } from '@/lib/marketingRoutes';

export default function FloatingKitaAlefBadge() {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHe = lang === 'he';

  const handleClick = () => {
    navigate(navPathFor('KitaAlef', location.pathname, lang));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 z-40"
      style={{ [isHe ? 'right' : 'left']: '1.5rem' }}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-4 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
        style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)', boxShadow: '0 8px 24px rgba(255,111,181,0.4)' }}
      >
        <Sparkles className="w-4 h-4" />
        {isHe ? 'ספיישל כיתה א׳' : 'Starting School Special'}
      </button>
    </motion.div>
  );
}