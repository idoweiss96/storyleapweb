// Shared visual language for card-based activities.
//
// Extracted once three real implementations existed (emotion-wheel, strength-cards,
// coping-cards) so it generalizes over what actually repeated, not over a guess.
// Everything is scoped under `.ac-deck` so it cannot leak into the rest of the site.

export const CARD_STYLES = `
  .ac-deck *{box-sizing:border-box}

  /* ---- Picker card: the deck a child chooses from ---- */
  .ac-card{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    width:100%;aspect-ratio:5/7;padding:14px 10px;
    background:linear-gradient(160deg,#ffffff 0%,#FFFCF8 100%);
    border:1.5px solid #EDE9F8;border-radius:16px;
    box-shadow:0 3px 12px rgba(26,26,110,.08), 0 1px 3px rgba(26,26,110,.04);
    cursor:pointer;text-align:center;
    transition:transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, border-color .18s, background .18s;
  }
  /* Inner frame, the way a printed card has a border inside its edge */
  .ac-card::before{
    content:'';position:absolute;inset:7px;
    border:1px solid rgba(26,26,110,.10);border-radius:10px;pointer-events:none;
    transition:border-color .18s;
  }
  .ac-card:hover{transform:translateY(-5px) rotate(-1deg);box-shadow:0 10px 26px rgba(26,26,110,.14)}
  .ac-card:active{transform:translateY(-2px) scale(.99)}
  .ac-card:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .ac-card[aria-pressed="true"]{
    background:linear-gradient(160deg,#FFF0F7 0%,#FFD6EC 100%);
    border-color:#FF6FB5;
    transform:translateY(-6px);
    box-shadow:0 12px 28px rgba(255,111,181,.28);
  }
  .ac-card[aria-pressed="true"]::before{border-color:rgba(255,111,181,.45)}
  .ac-card[aria-pressed="true"]:hover{transform:translateY(-9px) rotate(-1deg)}

  .ac-emoji{font-size:34px;line-height:1}
  .ac-label{font-size:12.5px;font-weight:600;color:#3f3f56;line-height:1.35}

  /* Corner pips, mirrored like the indices on a playing card */
  .ac-pip{position:absolute;font-size:9px;color:rgba(26,26,110,.28);line-height:1}
  .ac-pip-a{top:11px;inset-inline-start:12px}
  .ac-pip-b{bottom:11px;inset-inline-end:12px;transform:rotate(180deg)}
  .ac-card[aria-pressed="true"] .ac-pip{color:rgba(255,111,181,.75)}

  .ac-check{
    position:absolute;top:-9px;inset-inline-end:-9px;
    width:26px;height:26px;border-radius:999px;background:#1A1A6E;
    display:grid;place-items:center;border:2.5px solid #fff;
    box-shadow:0 2px 8px rgba(26,26,110,.3);
  }

  /* ---- Result card: same language, but it carries the content ---- */
  .ac-result-grid{display:grid;grid-template-columns:1fr;gap:16px}
  @media (min-width:560px){.ac-result-grid{grid-template-columns:1fr 1fr}}

  .ac-bigcard{
    position:relative;display:flex;flex-direction:column;
    padding:22px 18px 18px;min-height:250px;
    background:linear-gradient(160deg,#ffffff 0%,#FFF8FB 100%);
    border:1.5px solid #FF6FB5;border-radius:16px;
    box-shadow:0 4px 18px rgba(255,111,181,.16);
    break-inside:avoid;
  }
  .ac-bigcard::before{
    content:'';position:absolute;inset:7px;
    border:1px solid rgba(255,111,181,.32);border-radius:10px;pointer-events:none;
  }
  .ac-bigcard .ac-pip{color:rgba(255,111,181,.6)}

  .ac-bighead{display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px}
  .ac-bigemoji{font-size:36px;line-height:1}
  .ac-biglabel{font-size:15px;font-weight:700;color:#1A1A6E;line-height:1.35;margin:0}

  .ac-rule{
    height:1px;margin:14px 6px 12px;
    background:linear-gradient(90deg,transparent,rgba(255,111,181,.38),transparent);
  }

  .ac-bigbody{
    font-size:13.5px;line-height:1.55;text-align:center;
    color:rgba(26,26,46,.62);margin:0;
  }

  @media (prefers-reduced-motion:reduce){
    .ac-card,.ac-card:hover,.ac-card:active{transition:none;transform:none}
  }

  @media print{
    .ac-card{box-shadow:none}
    .ac-result-grid{grid-template-columns:1fr 1fr;gap:14px}
    .ac-bigcard{box-shadow:none;min-height:0;padding:18px 16px 16px}
  }
`;

// Answer field. On screen a textarea; in print it becomes plain text, or ruled
// lines when nothing was typed, so the card can also be filled in by hand.
// Split from CARD_STYLES because the emotion wheel needs the field without the deck.
export const ANSWER_STYLES = `
  .ac-answer{
    width:100%;margin-top:14px;
    font-family:inherit;font-size:14.5px;color:#1a1a2e;line-height:1.55;
    background:rgba(255,255,255,.75);border:1.5px solid #FFD6EC;border-radius:11px;
    padding:10px 12px;resize:vertical;min-height:66px;
    transition:border-color .18s;
  }
  .ac-answer::placeholder{color:rgba(26,26,46,.34)}
  .ac-answer:focus{border-color:#FF6FB5;outline:none;background:#fff}
  .ac-bigcard .ac-answer{margin-top:auto}
  .ac-answer-print,.ac-answer-blank{display:none}

  @media print{
    .ac-answer{display:none}
    .ac-answer-print{
      display:block;margin-top:6px;font-size:14px;color:#1a1a2e;line-height:1.6;
      white-space:pre-wrap;overflow-wrap:anywhere;
    }
    .ac-answer-blank{display:block;margin-top:8px}
    .ac-answer-blank i{display:block;border-bottom:1px dashed #d8a9c4;height:21px}
  }
`;
