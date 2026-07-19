import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAGES } from './questionsConfig';
import QuestionCard from './QuestionCard';

export default function Questionnaire({ answers, setAnswers, onComplete }) {
  const [pageIdx, setPageIdx] = useState(0);
  const page = PAGES[pageIdx];
  const progress = ((pageIdx + 1) / PAGES.length) * 100;

  const handleAnswer = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-[75vh] rounded-3xl px-4 py-6" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: '#4FC3E8' }}>עמוד {pageIdx + 1} מתוך {PAGES.length}</span>
            <span className="text-sm font-semibold" style={{ color: '#FF6FB5' }}>{page.title}</span>
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

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {page.questions.filter(q => {
              if (!q.showIf) return true;
              const dep = answers[q.showIf.dependsOn];
              return q.showIf.values.includes(dep);
            }).map(q => (
              <QuestionCard key={q.key} question={q} answers={answers} onAnswerChange={handleAnswer} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          {pageIdx > 0 ? (
            <button
              onClick={() => setPageIdx(pageIdx - 1)}
              className="px-6 py-3 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
            >
              → חזור
            </button>
          ) : <div />}

          {pageIdx < PAGES.length - 1 ? (
            <button
              onClick={() => setPageIdx(pageIdx + 1)}
              className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}
            >
              הבא ←
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
            >
              סיום ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
}