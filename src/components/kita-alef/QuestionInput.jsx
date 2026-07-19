import React, { useRef } from 'react';
import FamilyPhotosInput from './FamilyPhotosInput';
import { useLanguage } from '@/components/LanguageContext';

export default function QuestionInput({ question, answers, onAnswerChange }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { type, key } = question;
  const value = answers[key];
  const parentValue = answers[`${key}_parent`];
  const fileRef = useRef(null);

  const placeholder = isEn ? 'Type here...' : 'כתבו כאן...';
  const removePhotoLabel = isEn ? 'Remove photo' : 'הסר תמונה';
  const maxSelectLabel = isEn ? `(Up to ${question.maxSelect})` : `(${question.maxSelect} לכל היותר)`;

  const handleEmojiClick = (opt) => {
    onAnswerChange(key, value === opt.label ? null : opt.label);
  };

  const handleChipsClick = (opt) => {
    if (question.multi) {
      const current = value || [];
      if (current.includes(opt)) {
        onAnswerChange(key, current.filter(v => v !== opt));
      } else {
        if (question.maxSelect && current.length >= question.maxSelect) return;
        onAnswerChange(key, [...current, opt]);
      }
    } else {
      onAnswerChange(key, value === opt ? null : opt);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAnswerChange(key, ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Text input */}
      {type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onAnswerChange(key, e.target.value)}
          className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none transition-colors"
          style={{ borderColor: '#F0E8F5' }}
          placeholder={placeholder}
        />
      )}

      {/* Textarea */}
      {type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onAnswerChange(key, e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none resize-none transition-colors"
          style={{ borderColor: '#F0E8F5' }}
          placeholder={question.hint || placeholder}
        />
      )}

      {/* Emoji grid */}
      {type === 'emoji' && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {question.options.map((opt) => {
            const selected = value === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => handleEmojiClick(opt)}
                className="flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all"
                style={selected
                  ? { background: '#FFF0F7', borderColor: '#FF6FB5' }
                  : { background: '#FFFFFF', borderColor: '#F0E8F5' }
                }
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[11px] text-kita-subtext text-center leading-tight">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Chips */}
      {type === 'chips' && (
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt) => {
            const selected = question.multi ? (value || []).includes(opt) : value === opt;
            return (
              <button
                key={opt}
                onClick={() => handleChipsClick(opt)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={selected
                  ? { background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)', color: '#FFFFFF' }
                  : { background: '#FFFFFF', color: '#6b6b8a', border: '1px solid #F0E8F5' }
                }
              >
                {opt}
              </button>
            );
          })}
          {question.multi && question.maxSelect && (
            <span className="text-xs text-kita-subtext self-center">
              {maxSelectLabel}
            </span>
          )}
        </div>
      )}

      {/* Photo upload */}
      {type === 'photo' && (
        <div className="flex justify-center">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors"
            style={{ borderColor: '#FF6FB5' }}
          >
            {value ? (
              <img src={value} alt={isEn ? 'Photo' : 'תמונה'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl" style={{ color: '#4FC3E8' }}>📷</span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          {value && (
            <button
              onClick={() => onAnswerChange(key, null)}
              className="text-xs text-kita-subtext underline self-end ml-2"
            >
              {removePhotoLabel}
            </button>
          )}
        </div>
      )}

      {/* Family photos (multiple labeled uploads) */}
      {type === 'family_photos' && (
        <FamilyPhotosInput value={value} onChange={(val) => onAnswerChange(key, val)} />
      )}

      {/* Parent field */}
      {question.parentField && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F0E8F5' }}>
          <p className="text-xs mb-2" style={{ color: '#FF6FB5' }}>{question.parentField.label}</p>
          <textarea
            value={parentValue || ''}
            onChange={(e) => onAnswerChange(`${key}_parent`, e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none resize-none transition-colors"
            style={{ borderColor: '#F0E8F5' }}
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}