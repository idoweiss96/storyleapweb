import React from 'react';
import { motion } from 'framer-motion';

const PILLS = [
  { emoji: '💜', text: 'מבוסס על שיטות טיפול פסיכולוגיות' },
  { emoji: '👨‍👩‍👧', text: 'חוויה משותפת הורה-ילד' },
  { emoji: '⏱', text: 'כ-3 דקות' },
];

export default function HomeScreen({ onStart }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="text-5xl text-center mb-4">🎒</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            ✨ ספיישל כיתה א׳
          </span>
        </div>

        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>הכנה לכיתה א׳ ביחד 💗</h2>
        <p className="text-[13px] text-center mb-6" style={{ color: '#FF6FB5' }}>שאלון משותף לילד ולהורה — 3 דקות</p>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          בואו נתחיל יחד ←
        </button>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-md">
        {PILLS.map((pill, i) => (
          <span key={i} className="px-3 py-1.5 rounded-full bg-white border text-xs" style={{ borderColor: i % 2 === 0 ? '#B8EBF7' : '#FFD6EC', color: '#6b6b8a' }}>
            {pill.emoji} {pill.text}
          </span>
        ))}
      </div>
    </div>
  );
}