import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export default function FloatingGift() {
  const { isHe } = useLanguage();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const showTimer = setTimeout(() => {
      setVisible(true);
      setShowBubble(true);
    }, 3000);
    return () => clearTimeout(showTimer);
  }, [dismissed]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setShowBubble(false);
    setDismissed(true);
  };

  const handleClick = () => {
    navigate('/Pricing');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 z-40"
          style={{ [isHe ? 'left' : 'right']: '1.5rem' }}
        >
          <div className="relative flex items-end gap-2">
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isHe ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: isHe ? 20 : -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative mb-1 max-w-[200px] bg-white rounded-2xl shadow-xl border border-pink-100 p-3"
                >
                  <button
                    onClick={handleDismiss}
                    className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center text-slate-300 hover:text-slate-500 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-sm font-medium text-slate-700 pr-4">
                    {isHe
                      ? '🎁 רוצה להפתיע? שלחו סיפור כמתנה לחבר!'
                      : '🎁 Surprise a friend — send a story as a gift!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleClick}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-300/50 flex items-center justify-center text-white hover:scale-110 transition-transform"
              title={isHe ? 'שלח מתנה' : 'Send a gift'}
            >
              <Gift className="w-7 h-7" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}