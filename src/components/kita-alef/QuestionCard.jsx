import React from 'react';
import QuestionInput from './QuestionInput';

function Tag({ tag }) {
  if (tag === 'together') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] text-white text-xs font-medium" style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}>
        💛 יחד
      </span>
    );
  }
  if (tag === 'child') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] text-xs font-medium" style={{ background: '#FFD6EC', color: '#C4407A' }}>
        🌟 הילד/ה עונה
      </span>
    );
  }
  return null;
}

export default function QuestionCard({ question, answers, onAnswerChange }) {
  return (
    <div className="rounded-3xl overflow-hidden border bg-white" style={{ borderColor: '#F0E8F5', boxShadow: '0 4px 20px rgba(255,111,181,0.08), 0 2px 10px rgba(79,195,232,0.06)' }}>
      <div className="p-4" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
        <Tag tag={question.tag} />
        <h3 className="text-lg font-semibold mt-2" style={{ color: '#1a1a2e' }}>{question.question}</h3>
      </div>
      <div className="bg-white p-4">
        <QuestionInput question={question} answers={answers} onAnswerChange={onAnswerChange} />
      </div>
    </div>
  );
}