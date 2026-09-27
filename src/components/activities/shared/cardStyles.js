// Shared visual language for card-based activities.
//
// Extracted once three real implementations existed (emotion-wheel, strength-cards,
// coping-cards) so it generalizes over what actually repeated, not over a guess.
// Everything is scoped under `.ac-deck` so it cannot leak into the rest of the site.

export const CARD_STYLES = `
  .ac-deck *{box-sizing:border-box}

  /* ---- Picker card: the deck a child chooses from ----
     Drawn like a game tile: ink outline, a pastel face that changes from card
     to card, a pressed-down shadow. Height is capped so a two-column grid on a
     wide screen doesn't turn into tall empty cards. */
  .ac-card{
    position:relative;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
    width:100%;aspect-ratio:4/5;max-height:210px;min-height:118px;padding:14px 10px;
    background:var(--ac-face,#FFF6FB);
    border:2.4px solid #3A3357;border-radius:20px;
    box-shadow:0 5px 0 rgba(58,51,87,.2);
    cursor:pointer;text-align:center;font-family:inherit;
    transition:transform .16s cubic-bezier(.22,1,.36,1), box-shadow .16s, background .16s;
  }
  .ac-card:nth-child(6n+1){--ac-face:#FFF0F7}
  .ac-card:nth-child(6n+2){--ac-face:#EAF8FD}
  .ac-card:nth-child(6n+3){--ac-face:#FFF8E6}
  .ac-card:nth-child(6n+4){--ac-face:#EDFAF2}
  .ac-card:nth-child(6n+5){--ac-face:#F3EEFF}
  .ac-card:nth-child(6n+6){--ac-face:#FFF1E8}
  /* Inner frame, the way a printed card has a border inside its edge */
  .ac-card::before{
    content:'';position:absolute;inset:7px;
    border:1.5px dashed rgba(58,51,87,.16);border-radius:14px;pointer-events:none;
  }
  .ac-card:hover{transform:translateY(-4px) rotate(-1deg);box-shadow:0 9px 0 rgba(58,51,87,.2)}
  .ac-card:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(58,51,87,.2)}
  .ac-card:focus-visible{outline:3px solid #1A1A6E;outline-offset:3px}

  .ac-card[aria-pressed="true"]{
    background:linear-gradient(160deg,#FFD6EC 0%,#FFB3D6 100%);
    transform:translateY(-5px);
    box-shadow:0 9px 0 #C4407A;
  }
  .ac-card[aria-pressed="true"]::before{border-color:rgba(255,255,255,.8)}
  .ac-card[aria-pressed="true"]:hover{transform:translateY(-8px) rotate(-1deg)}

  .ac-emoji{font-size:46px;line-height:1;filter:drop-shadow(0 3px 2px rgba(26,26,110,.18))}
  .ac-label{font-size:14px;font-weight:800;color:#1A1A6E;line-height:1.3}

  /* Corner pips, mirrored like the indices on a playing card */
  .ac-pip{position:absolute;font-size:10px;color:rgba(58,51,87,.35);line-height:1}
  .ac-pip-a{top:11px;inset-inline-start:12px}
  .ac-pip-b{bottom:11px;inset-inline-end:12px;transform:rotate(180deg)}
  .ac-card[aria-pressed="true"] .ac-pip{color:#fff}

  .ac-check{
    position:absolute;top:-10px;inset-inline-end:-10px;
    width:28px;height:28px;border-radius:999px;background:#5BC98C;
    display:grid;place-items:center;border:2.5px solid #3A3357;
    box-shadow:0 2px 0 #3A3357;
  }

  /* ---- Result card: same language, but it carries the content ---- */
  .ac-result-grid{display:grid;grid-template-columns:1fr;gap:16px}
  @media (min-width:560px){.ac-result-grid{grid-template-columns:1fr 1fr}}

  .ac-bigcard{
    position:relative;display:flex;flex-direction:column;
    padding:22px 18px 18px;min-height:250px;
    background:linear-gradient(160deg,#ffffff 0%,#FFF4FA 100%);
    border:2.4px solid #3A3357;border-radius:20px;
    box-shadow:0 6px 0 rgba(255,111,181,.35);
    break-inside:avoid;
  }
  .ac-bigcard::before{
    content:'';position:absolute;inset:7px;
    border:1px solid rgba(255,111,181,.32);border-radius:10px;pointer-events:none;
  }
  .ac-bigcard .ac-pip{color:rgba(255,111,181,.6)}

  .ac-bighead{display:flex;flex-direction:column;align-items:center;text-align:center;gap:7px}
  .ac-bigemoji{font-size:44px;line-height:1;filter:drop-shadow(0 3px 2px rgba(26,26,110,.18))}
  .ac-biglabel{font-size:16px;font-weight:800;color:#1A1A6E;line-height:1.35;margin:0}

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
    .ac-card{box-shadow:none;max-height:none}
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
