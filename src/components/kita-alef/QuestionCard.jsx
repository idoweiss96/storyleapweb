import React from 'react';
import QuestionInput from './QuestionInput';

function Tag({ tag }) {
  if (tag === 'together') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] bg-kita-purple text-white text-xs font-medium">
        💛 יחד
      </span>
    );
  }
  if (tag === 'child') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] bg-kita-yellow text-kita-yellow-text text-xs font-medium">
        🌟 הילד/ה עונה
      </span>
    );
  }
  return null;
}

export default function QuestionCard({ question, answers, onAnswerChange }) {
  return (
    <div className="rounded-3xl border border-kita-border overflow-hidden">
      <div className="bg-gradient-to-br from-kita-grad-start to-kita-grad-end p-4">
        <Tag tag={question.tag} />
        <h3 className="text-lg font-semibold text-kita-text mt-2">{question.question}</h3>
      </div>
      <div className="bg-white p-4">
        <QuestionInput question={question} answers={answers} onAnswerChange={onAnswerChange} />
      </div>
    </div>
  );
}