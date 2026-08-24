import React, { useState } from 'react';
import { CARD_STYLES } from '../shared/cardStyles';
import { ActionBar, PickerCard, ResultCard, countLabel } from '../shared/ActivityCards';
import { COPING, UI } from './copingCardsContent';

const CUSTOM_STYLE = `
  .cc-custom{
    margin-top:22px;padding:16px 18px;
    background:rgba(255,255,255,.72);
    border:1.5px dashed #FFD6EC;border-radius:16px;
  }
  .cc-custom label{
    display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px;
  }
  .cc-custom input{
    width:100%;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;
    padding:11px 13px;transition:border-color .18s;
  }
  .cc-custom input::placeholder{color:rgba(26,26,46,.34)}
  .cc-custom input:focus{border-color:#FF6FB5;outline:none}
`;

export default function CopingCards({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');
  const [revealed, setRevealed] = useState(false);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const restart = () => {
    setSelected([]);
    setCustom('');
    setRevealed(false);
  };

  const customText = custom.trim();

  // Keep the deck order rather than the tap order, so the kit reads consistently.
  const chosen = COPING.filter((c) => selected.includes(c.id));
  const total = chosen.length + (customText ? 1 : 0);

  if (revealed) {
    return (
      <div className="ac-deck">
        <style>{CARD_STYLES}</style>

        <div className="text-center mb-7">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A6E' }}>
            {copy.myKit}
          </h2>
          <p className="text-slate-500">{copy.revealIntro}</p>
        </div>

        <div className="ac-result-grid">
          {chosen.map((card) => {
            const text = card[lang] || card.he;
            return <ResultCard key={card.id} emoji={card.emoji} title={text.label} body={text.how} />;
          })}

          {customText && <ResultCard emoji={copy.customEmoji} title={customText} />}
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
      <style>{CARD_STYLES + CUSTOM_STYLE}</style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {COPING.map((card) => (
          <PickerCard
            key={card.id}
            emoji={card.emoji}
            label={(card[lang] || card.he).label}
            selected={selected.includes(card.id)}
            onClick={() => toggle(card.id)}
          />
        ))}
      </div>

      {/* A child's own strategy matters more than anything we could pre-write */}
      <div className="cc-custom">
        <label htmlFor="cc-custom-input">
          {copy.customEmoji} {copy.customLabel}
        </label>
        <input
          id="cc-custom-input"
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={copy.customPlaceholder}
        />
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        <p aria-live="polite" className="text-sm text-slate-500">
          {countLabel(copy, total)}
        </p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={total === 0}
          className="px-8 py-3.5 rounded-full text-white text-base font-semibold shadow-lg transition-transform disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          {copy.reveal}
        </button>
      </div>
    </div>
  );
}
