import React from 'react';
import { RotateCcw, ImageOff } from 'lucide-react';

export default function StoryPageEditor({ pageNum, text, originalText, imageUrl, isHe, disabled, onChange, onRestore }) {
  const changed = text !== originalText;
  const overLimit = text.length > 350;

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-violet-50 p-4 md:p-6 grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">
      <div className="rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center min-h-[160px]">
        {imageUrl ? (
          <img src={imageUrl} alt={`page ${pageNum}`} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300 text-sm py-10">
            <ImageOff className="w-6 h-6" />
            {isHe ? 'אין תמונה' : 'No image'}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-violet-500">{isHe ? `עמוד ${pageNum}` : `Page ${pageNum}`}</span>
          {changed && !disabled && (
            <button type="button" onClick={() => onRestore(pageNum)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-3 h-3" />
              {isHe ? 'שחזרו את המקור' : 'Restore original'}
            </button>
          )}
        </div>
        <textarea
          dir={isHe ? 'rtl' : 'ltr'}
          value={text}
          disabled={disabled}
          onChange={(e) => onChange(pageNum, e.target.value)}
          className="flex-1 w-full min-h-[160px] resize-none rounded-2xl border-0 bg-amber-50/70 p-5 font-serif text-lg leading-loose text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-70"
          style={{ lineHeight: 2 }}
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs text-slate-400">{text.length} {isHe ? 'תווים' : 'characters'}</span>
          {overLimit && (
            <span className="text-xs text-amber-600 font-medium">{isHe ? 'הכתב בספר יוקטן מעט' : 'The text in the book will shrink slightly'}</span>
          )}
        </div>
      </div>
    </div>
  );
}