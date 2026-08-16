import React, { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FamilyPhotosInput from './FamilyPhotosInput';
import TermsOfUseModal from '@/components/story/TermsOfUseModal';
import { useLanguage } from '@/components/LanguageContext';
import { Tag } from './QuestionCard';

export default function QuestionInput({ question, answers, onAnswerChange }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const { type, key } = question;
  const value = answers[key];
  const parentValue = answers[`${key}_parent`];
  const consentValue = answers[`${key}_consent`];
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onAnswerChange(key, file_url);
    } finally {
      setIsUploading(false);
    }
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
          className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none resize-none transition-colors ph-mask"
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
            disabled={isUploading}
            className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors disabled:opacity-60 ph-no-capture"
            style={{ borderColor: '#FF6FB5' }}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#4FC3E8' }} />
            ) : value ? (
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

      {/* Photo consent checkbox */}
      {type === 'photo' && question.consent && (
        <label
          className="flex items-start gap-2.5 cursor-pointer p-3 rounded-2xl border transition-colors"
          style={{ borderColor: consentValue ? '#4FC3E8' : '#F0E8F5', background: consentValue ? '#EAF8FD' : '#fff' }}
        >
          <input
            type="checkbox"
            checked={consentValue || false}
            onChange={(e) => onAnswerChange(`${key}_consent`, e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: '#FF6FB5' }}
          />
          <span className="text-xs text-kita-subtext leading-relaxed">
            {isEn ? (
              <>
                I consent to uploading my child's photo for a personalized story and agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                  className="font-medium underline inline"
                  style={{ color: '#FF6FB5' }}
                >
                  Terms of Use
                </button>.
                We commit to deleting the photo from our database within one month of upload.
              </>
            ) : (
              <>
                אני מאשר/ת את העלאת תמונת הילד/ה ליצירת סיפור אישי, ומסכים/ה ל-{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                  className="font-medium underline inline"
                  style={{ color: '#FF6FB5' }}
                >
                  תנאי השימוש
                </button>.
                אנו מתחייבים למחוק את התמונה מהמאגר שלנו תוך חודש ממועד ההעלאה.
              </>
            )}
          </span>
        </label>
      )}
      {type === 'photo' && question.consent && (
        <TermsOfUseModal open={showTerms} onOpenChange={setShowTerms} />
      )}

      {/* Family photos (multiple labeled uploads) */}
      {type === 'family_photos' && (
        <FamilyPhotosInput value={value} onChange={(val) => onAnswerChange(key, val)} />
      )}

      {/* Parent field */}
      {question.parentField && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F0E8F5' }}>
          <div className="mb-2"><Tag tag="parent" isEn={isEn} /></div>
          <p className="text-xs mb-2" style={{ color: '#FF6FB5' }}>{question.parentField.label}</p>
          <textarea
            value={parentValue || ''}
            onChange={(e) => onAnswerChange(`${key}_parent`, e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg text-kita-text focus:outline-none resize-none transition-colors ph-mask"
            style={{ borderColor: '#F0E8F5' }}
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}