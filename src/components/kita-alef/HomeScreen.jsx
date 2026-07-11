import React from 'react';
import { motion } from 'framer-motion';

const PILLS = [
  { emoji: '💜', text: 'מבוסס על שיטות טיפול פסיכולוגיות' },
  { emoji: '👨‍👩‍👧', text: 'חוויה משותפת הורה-ילד' },
  { emoji: '⏱', text: 'כ-3 דקות' },
];

export default function HomeScreen({ onStart }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 bg-kita-bg rounded-3xl">
      <h1 className="text-3xl font-bold text-kita-navy mb-8">StoryLeap</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-lg bg-gradient-to-br from-kita-grad-start to-kita-grad-end"
      >
        <div className="text-5xl text-center mb-4">🎒</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium bg-gradient-to-br from-kita-purple to-kita-navy">
            ✨ ספיישל כיתה א׳
          </span>
        </div>

        <h2 className="text-xl font-bold text-kita-navy text-center mb-2">הכנה לכיתה א׳ שמתחילה מהלב</h2>
        <p className="text-[13px] text-kita-purple text-center mb-6">שאלון משותף לילד ולהורה — 3 דקות</p>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-[14px] bg-kita-navy text-white font-semibold hover:opacity-90 transition-opacity"
        >
          בואו נתחיל יחד ←
        </button>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-md">
        {PILLS.map((pill, i) => (
          <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-kita-border text-xs text-kita-subtext">
            {pill.emoji} {pill.text}
          </span>
        ))}
      </div>
    </div>
  );
}