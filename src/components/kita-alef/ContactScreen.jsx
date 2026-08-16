import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import { getIntroQuestions, getPages } from './questionsConfig';

// This is the questionnaire's intro step: name/gender/strength questions for the child.
// Email/phone are collected later, at the end of the questionnaire, right before story creation.
export default function ContactScreen({ answers, setAnswers, onSubmit, onBack }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const introQuestions = getIntroQuestions(lang);
  const totalSteps = getPages(lang).length + 1;

  const handleAnswer = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.form
        onSubmit={handleContinue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white space-y-4"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <ProgressBar step={1} total={totalSteps} isEn={isEn} />

        <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1A1A6E' }}>
          {isEn ? "Let's get started" : 'בואו נתחיל'}
        </h2>

        {introQuestions.map(q => (
          <QuestionCard key={q.key} question={q} answers={answers} onAnswerChange={handleAnswer} />
        ))}

        <button
          type="submit"
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          {isEn ? 'Continue →' : 'להמשך ←'}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity"
            style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
          >
            {isEn ? '← Back' : '→ חזור'}
          </button>
        )}
      </motion.form>
    </div>
  );
}