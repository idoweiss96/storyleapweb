import React from 'react';
import { motion } from 'framer-motion';

// Shared progress indicator used across every KitaAlef questionnaire screen
// (intro step + all questionnaire pages), so the parent always knows how far along they are.
export default function ProgressBar({ step, total, label, isEn }) {
  const progress = (step / total) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: '#4FC3E8' }}>
          {isEn ? `Step ${step} of ${total}` : `שלב ${step} מתוך ${total}`}
        </span>
        {label && <span className="text-sm font-semibold" style={{ color: '#FF6FB5' }}>{label}</span>}
      </div>
      <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to left, #4FC3E8, #FF6FB5)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}