import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PAGES } from './questionsConfig';

function getDisplayValue(question, value) {
  if (!value) return '—';
  if (question.type === 'emoji') {
    const opt = question.options?.find(o => o.label === value);
    return opt ? `${opt.emoji} ${opt.label}` : value;
  }
  if (question.type === 'chips' && question.multi) {
    return Array.isArray(value) ? value.join(', ') : value;
  }
  return value;
}

export default function CompletionScreen({ answers }) {
  const navigate = useNavigate();
  const name = answers.name || '';

  return (
    <div className="min-h-[75vh] bg-kita-bg rounded-3xl flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="max-w-lg w-full"
      >
        {/* Photo */}
        <div className="flex justify-center mb-4">
          {answers.photo ? (
            <img src={answers.photo} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-kita-grad-start to-kita-grad-end flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl">🧒</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-kita-navy text-center mb-6">
          הפרופיל של {name} מוכן! 🎉
        </h2>

        {/* Summary */}
        <div className="bg-white rounded-3xl border border-kita-border p-5 space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
          {PAGES.map((page, pi) => (
            <div key={pi}>
              <h4 className="text-sm font-semibold text-kita-purple mb-2">{page.title}</h4>
              <div className="space-y-2">
                {page.questions.map(q => {
                  const val = answers[q.key];
                  const parentVal = answers[`${q.key}_parent`];
                  if (!val && !parentVal) return null;
                  return (
                    <div key={q.key}>
                      <p className="text-xs text-kita-subtext">{q.question}</p>
                      <p className="text-sm text-kita-text font-medium">{getDisplayValue(q, val)}</p>
                      {parentVal && <p className="text-xs text-kita-subtext mt-0.5">💬 {parentVal}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/CreateStory')}
          className="w-full py-3.5 rounded-[14px] bg-gradient-to-l from-kita-purple to-kita-navy text-white font-semibold hover:opacity-90 transition-opacity"
        >
          צור את הספר עכשיו ✨
        </button>
      </motion.div>
    </div>
  );
}