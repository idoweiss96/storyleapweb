import React, { useState } from 'react';
import { ANSWER_STYLES, CARD_STYLES } from '../shared/cardStyles';
import { ActionBar, PickerCard, PrintableAnswer, ResultCard, countLabel } from '../shared/ActivityCards';
import { STRENGTHS, UI } from './strengthCardsContent';

export default function StrengthCards({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState({});

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const restart = () => {
    setSelected([]);
    setAnswers({});
    setRevealed(false);
  };

  // Keep the deck order rather than the tap order, so the result reads consistently.
  const chosen = STRENGTHS.filter((s) => selected.includes(s.id));

  if (revealed) {
    return (
      <div className="ac-deck">
        <style>{CARD_STYLES + ANSWER_STYLES}</style>

        <div className="text-center mb-7">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A6E' }}>
            {copy.myStrengths}
          </h2>
          <p className="text-slate-500">{copy.revealIntro}</p>
        </div>

        <div className="ac-result-grid">
          {chosen.map((strength) => {
            const text = strength[lang] || strength.he;
            return (
              <ResultCard key={strength.id} emoji={strength.emoji} title={text.label} body={text.prompt}>
                <PrintableAnswer
                  value={answers[strength.id]}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [strength.id]: value }))}
                  placeholder={copy.answerPlaceholder}
                  ariaLabel={text.prompt}
                />
              </ResultCard>
            );
          })}
        </div>

        <ActionBar
          onRestart={restart}
          restartLabel={copy.restart}
          onPrint={() => window.print()}
          printLabel={copy.print}
        />
      </div>
    );
  }

  return (
    <div className="ac-deck">
      <style>{CARD_STYLES}</style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {STRENGTHS.map((strength) => (
          <PickerCard
            key={strength.id}
            emoji={strength.emoji}
            label={(strength[lang] || strength.he).label}
            selected={selected.includes(strength.id)}
            onClick={() => toggle(strength.id)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mt-9">
        <p aria-live="polite" className="text-sm text-slate-500">
          {countLabel(copy, selected.length)}
        </p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={selected.length === 0}
          className="px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-transform disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          {copy.reveal}
        </button>
      </div>
    </div>
  );
}
