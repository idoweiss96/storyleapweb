import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getPages } from './questionsConfig';
import { useLanguage } from '@/components/LanguageContext';

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
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const pages = getPages(lang);
  const navigate = useNavigate();
  const name = answers.name || '';
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Send answers to Google Sheet once on mount
    base44.functions.invoke('submitKitaAlefAnswers', { answers, lang })
      .then(() => setSubmitted(true))
      .catch((err) => console.error('Failed to submit answers:', err));
  }, []);

  return (
    <div className="min-h-[75vh] rounded-3xl flex flex-col items-center justify-center px-4 py-10" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
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
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg" style={{ background: 'linear-gradient(135deg, #B8EBF7, #FFD6EC)' }}>
              <span className="text-4xl">🧒</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#1A1A6E' }}>
          {isEn ? `${name}'s story is almost ready! ✨` : `הסיפור של ${name} כמעט מוכן! ✨`}
        </h2>

        {/* Summary */}
        <div className="bg-white rounded-3xl border p-5 space-y-4 mb-6 max-h-[40vh] overflow-y-auto" style={{ borderColor: '#F0E8F5', boxShadow: '0 4px 20px rgba(255,111,181,0.08)' }}>
          {pages.map((page, pi) => (
            <div key={pi}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: pi % 2 === 0 ? '#4FC3E8' : '#FF6FB5' }}>{page.title}</h4>
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
          onClick={() => {
            sessionStorage.setItem('storyLeap_kitaAlefPending', JSON.stringify({ answers }));
            navigate('/KitaAlefStory');
          }}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          {isEn ? 'Create the book now ✨' : 'צור את הספר עכשיו ✨'}
        </button>
      </motion.div>
    </div>
  );
}