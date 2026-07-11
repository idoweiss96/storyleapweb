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
    <div className="min-h-[75vh] bg-kita-bg rounded-3xl px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-kita-subtext">עמוד {pageIdx + 1} מתוך {PAGES.length}</span>
            <span className="text-sm font-semibold text-kita-navy">{page.title}</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-kita-purple to-kita-navy rounded-full"
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
            {page.questions.map(q => (
              <QuestionCard key={q.key} question={q} answers={answers} onAnswerChange={handleAnswer} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          {pageIdx > 0 ? (
            <button
              onClick={() => setPageIdx(pageIdx - 1)}
              className="px-6 py-3 rounded-[14px] bg-white border border-kita-border text-kita-subtext font-medium hover:bg-kita-grad-start transition-colors"
            >
              → חזור
            </button>
          ) : <div />}

          {pageIdx < PAGES.length - 1 ? (
            <button
              onClick={() => setPageIdx(pageIdx + 1)}
              className="px-6 py-3 rounded-[14px] bg-kita-navy text-white font-semibold hover:opacity-90 transition-opacity"
            >
              הבא ←
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-[14px] bg-gradient-to-l from-kita-purple to-kita-navy text-white font-semibold hover:opacity-90 transition-opacity"
            >
              סיום ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
}