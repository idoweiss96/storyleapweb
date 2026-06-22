import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function CreditsAddedPopup({ added, total, pendingStory, onClose, onCreateStory }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {isHe ? '🎉 הקרדיטים נוספו!' : '🎉 Credits Added!'}
          </h2>
          <p className="text-slate-600 text-sm mb-1">
            {isHe ? `נוספו לך ${added} קרדיטים לחשבון.` : `${added} credits were added to your account.`}
          </p>
          <p className="text-slate-500 text-sm mb-4">
            {isHe ? `סה"כ יש לך כעת ${total} קרדיטים.` : `You now have ${total} credits total.`}
          </p>

          {pendingStory && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-right">
              <p className="text-amber-800 text-sm font-medium">
                {isHe
                  ? `יש לך סיפור ממתין עבור ${pendingStory.child_name} — לחץ ליצירה עכשיו!`
                  : `You have a pending story for ${pendingStory.child_name} — click to create now!`}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {pendingStory && (
              <Button
                onClick={onCreateStory}
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isHe ? 'צור את הסיפור עכשיו!' : 'Create Story Now!'}
                </span>
              </Button>
            )}
            <button onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 py-2">
              {isHe ? 'סגור' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}