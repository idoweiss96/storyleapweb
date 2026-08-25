import React from 'react';
import { Check, Printer, RotateCcw } from 'lucide-react';

// Shared building blocks for card-based activities. Pair these with the CSS in
// `cardStyles.js` and wrap the activity in a `.ac-deck` element.

export function Pips() {
  return (
    <>
      <span className="ac-pip ac-pip-a" aria-hidden="true">✦</span>
      <span className="ac-pip ac-pip-b" aria-hidden="true">✦</span>
    </>
  );
}

/** One card in the deck a child picks from. */
export function PickerCard({ emoji, label, selected, onClick }) {
  return (
    <button type="button" className="ac-card" aria-pressed={selected} onClick={onClick}>
      <Pips />
      {selected && (
        <span className="ac-check" aria-hidden="true">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </span>
      )}
      <span className="ac-emoji">{emoji}</span>
      <span className="ac-label">{label}</span>
    </button>
  );
}

/**
 * A full card on the result screen: emoji, title, a line of body text, and
 * whatever the activity puts underneath (an answer field, nothing at all).
 */
export function ResultCard({ emoji, title, body, children }) {
  return (
    <div className="ac-bigcard">
      <Pips />
      <div className="ac-bighead">
        <span className="ac-bigemoji">{emoji}</span>
        <p className="ac-biglabel">{title}</p>
      </div>
      <div className="ac-rule" />
      {body && <p className="ac-bigbody">{body}</p>}
      {children}
    </div>
  );
}

/**
 * A textarea that prints properly. Browsers clip text that overflows a
 * textarea's visible height, so print gets a plain paragraph instead — or ruled
 * lines when the field is empty, which turns the same card into a worksheet.
 */
export function PrintableAnswer({ value, onChange, placeholder, ariaLabel, lines = 3 }) {
  const written = (value || '').trim();
  return (
    <>
      <textarea
        className="ac-answer"
        rows={3}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {written ? (
        <p className="ac-answer-print">{written}</p>
      ) : (
        <span className="ac-answer-blank" aria-hidden="true">
          {Array.from({ length: lines }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      )}
    </>
  );
}

/** Restart + print, hidden from the printed page via `site-chrome`. */
export function ActionBar({ onRestart, restartLabel, onPrint, printLabel, extra }) {
  return (
    <div className="site-chrome flex flex-wrap gap-3 justify-center mt-8">
      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        {restartLabel}
      </button>
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg active:scale-[.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
      >
        <Printer className="w-4 h-4" />
        {printLabel}
      </button>
      {extra}
    </div>
  );
}

/** Picks the right plural form from the activity's own UI strings. */
export function countLabel(copy, n) {
  if (n === 0) return copy.selectedNone;
  if (n === 1) return copy.selectedOne;
  return copy.selectedMany.replace('{n}', n);
}
