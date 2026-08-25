import SaveToSpace from '../shared/SaveToSpace';
import SaveToSpace from '../shared/SaveToSpace';
import React, { useRef, useState } from 'react';
import { Plus, Printer, RotateCcw } from 'lucide-react';
import { AGREEMENTS, CUSTOM_EMOJI, ITEMS, UI } from './calmCornerContent';

const STYLE = `
  .cc2 *{box-sizing:border-box}

  .cc2-poster{
    background:linear-gradient(160deg,#ffffff 0%,#F7FDFB 100%);
    border:2px solid #6FD0C4;border-radius:22px;
    padding:26px 22px;box-shadow:0 6px 26px rgba(111,208,196,.20);
    break-inside:avoid;
  }
  .cc2-poster h2{
    text-align:center;font-size:25px;font-weight:800;color:#1A1A6E;
    margin:0 0 20px;line-height:1.35;
  }

  .cc2-section{margin-bottom:20px}
  .cc2-section:last-child{margin-bottom:0}
  .cc2-section h3{
    font-size:12px;font-weight:700;letter-spacing:.03em;
    color:rgba(26,26,46,.42);margin:0 0 10px;text-align:center;
  }

  .cc2-list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
  .cc2-list li{
    display:inline-flex;align-items:center;gap:7px;
    font-size:15px;font-weight:600;color:#334155;
    background:rgba(111,208,196,.14);border-radius:999px;padding:8px 14px;
  }

  .cc2-rules{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
  .cc2-rules li{
    display:flex;align-items:center;gap:11px;
    font-size:16px;font-weight:600;color:#1A1A6E;line-height:1.4;
    background:#fff;border:1.5px solid #DCF2EE;border-radius:13px;padding:11px 14px;
  }
  .cc2-rules li span{font-size:22px;line-height:1;flex:0 0 auto}

  .cc2-empty{
    text-align:center;color:rgba(26,26,46,.45);font-size:15px;line-height:1.6;
    background:rgba(255,255,255,.6);border:1.5px dashed #EDE9F8;border-radius:16px;
    padding:26px 20px;
  }

  .cc2-field{margin-bottom:20px}
  .cc2-field label{display:block;font-size:13.5px;font-weight:600;color:#1A1A6E;margin-bottom:7px;text-align:center}
  .cc2-field input{
    width:100%;max-width:380px;margin:0 auto;display:block;
    font-family:inherit;font-size:16px;color:#1a1a2e;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:12px;padding:12px 14px;
    transition:border-color .18s;
  }
  .cc2-field input:focus{border-color:#6FD0C4;outline:none}

  .cc2-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:8px}
  .cc2-tile{
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    min-height:84px;padding:10px 6px;text-align:center;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:14px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .cc2-tile:hover{transform:translateY(-2px)}
  .cc2-tile[aria-pressed="true"]{border-color:#6FD0C4;border-width:2.5px;background:#EDFBF8}
  .cc2-tile:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .cc2-tile-emoji{font-size:25px;line-height:1}
  .cc2-tile-text{font-size:12px;font-weight:600;color:#475569;line-height:1.3}

  .cc2-agree{display:grid;grid-template-columns:1fr;gap:8px}
  @media (min-width:560px){.cc2-agree{grid-template-columns:1fr 1fr}}
  .cc2-agree button{
    display:flex;align-items:center;gap:11px;text-align:start;
    padding:12px 14px;min-height:58px;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:13px;
    font-family:inherit;cursor:pointer;transition:.15s;
  }
  .cc2-agree button:hover{transform:translateY(-2px)}
  .cc2-agree button[aria-pressed="true"]{border-color:#6FD0C4;border-width:2.5px;background:#EDFBF8}
  .cc2-agree button:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:2px}
  .cc2-agree button span:first-child{font-size:23px;line-height:1;flex:0 0 auto}
  .cc2-agree button span:last-child{font-size:14.5px;font-weight:600;color:#475569;line-height:1.35}

  .cc2-custom{
    margin-top:18px;padding:16px 18px;
    background:rgba(255,255,255,.72);border:1.5px dashed #BFEDE5;border-radius:16px;
  }
  .cc2-custom label{display:block;font-size:14px;font-weight:600;color:#1A1A6E;margin-bottom:8px}
  .cc2-custom-row{display:flex;gap:8px}
  .cc2-custom input{
    flex:1;min-width:0;font-family:inherit;font-size:15px;color:#1a1a2e;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:11px;padding:11px 13px;
  }
  .cc2-custom input:focus{border-color:#6FD0C4;outline:none}
  .cc2-custom button{
    display:inline-flex;align-items:center;gap:5px;
    font-family:inherit;font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#6FD0C4,#4FC3E8);
    border:0;border-radius:11px;padding:0 18px;cursor:pointer;
  }
  .cc2-custom button:disabled{opacity:.45;cursor:not-allowed}

  .cc2-hint{text-align:center;font-size:13.5px;color:rgba(26,26,46,.45);margin-top:10px}

  @media (prefers-reduced-motion:reduce){
    .cc2-tile,.cc2-tile:hover,.cc2-agree button,.cc2-agree button:hover{transition:none;transform:none}
  }

  @media print{
    .cc2-poster{box-shadow:none}
  }
`;

export default function CalmCorner({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [custom, setCustom] = useState('');
  const uid = useRef(0);

  const label = (item) => (typeof item[lang] === 'string' ? item[lang] : item.he);

  const toggle = (setter, id) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const addCustom = () => {
    const text = custom.trim();
    if (!text) return;
    uid.current += 1;
    setCustomItems((prev) => [...prev, { key: `x${uid.current}`, emoji: CUSTOM_EMOJI, label: text }]);
    setCustom('');
  };

  const clear = () => {
    setItems([]);
    setAgreements([]);
    setCustomItems([]);
    setName('');
  };

  // Library order, not tap order, so a reprint gives the same sign.
  const chosenItems = [
    ...ITEMS.filter((i) => items.includes(i.id)).map((i) => ({
      key: i.id,
      emoji: i.emoji,
      label: label(i),
    })),
    ...customItems,
  ];
  const chosenAgreements = AGREEMENTS.filter((a) => agreements.includes(a.id));
  const hasContent = chosenItems.length > 0 || chosenAgreements.length > 0;

  return (
    <div className="cc2">
      <style>{STYLE}</style>

      {hasContent ? (
        <div className="cc2-poster">
          <h2>{name.trim() || copy.title}</h2>

          {chosenItems.length > 0 && (
            <div className="cc2-section">
              <h3>{copy.posterItems}</h3>
              <ul className="cc2-list">
                {chosenItems.map((item) => (
                  <li key={item.key}>
                    <span>{item.emoji}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {chosenAgreements.length > 0 && (
            <div className="cc2-section">
              <h3>{copy.posterRules}</h3>
              <ul className="cc2-rules">
                {chosenAgreements.map((rule) => (
                  <li key={rule.id}>
                    <span>{rule.emoji}</span>
                    {label(rule)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="cc2-empty site-chrome">{copy.empty}</p>
      )}

      {hasContent && (
        <>
          <p className="cc2-hint site-chrome">{copy.printHint}</p>
          <div className="site-chrome flex flex-wrap gap-3 justify-center mt-5">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {copy.clear}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg active:scale-[.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #6FD0C4, #4FC3E8)' }}
            >
              <Printer className="w-4 h-4" />
              {copy.print}
            </button>
            <SaveToSpace
              slug="calm-corner"
              lang={lang}
              getEntry={() => (items.length > 0 || agreements.length > 0 ? {
                summary: name || `${items.length} ${lang === 'he' ? 'פריטים' : 'items'}`,
                payload: { name, items, agreements, customItems },
              } : null)}
            />
            <SaveToSpace
              slug="calm-corner"
              lang={lang}
              getEntry={() => (items.length > 0 || agreements.length > 0 ? {
                summary: name || `${items.length} ${lang === 'he' ? 'פריטים' : 'items'}`,
                payload: { name, items, agreements, customItems },
              } : null)}
            />
          </div>
        </>
      )}

      <div className="site-chrome mt-12">
        <div className="cc2-field">
          <label htmlFor="cc2-name">{copy.nameLabel}</label>
          <input
            id="cc2-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.namePlaceholder}
          />
        </div>

        <h2 className="text-center text-lg font-bold text-slate-700 mb-4">{copy.itemsTitle}</h2>
        <div className="cc2-tiles">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="cc2-tile"
              aria-pressed={items.includes(item.id)}
              onClick={() => toggle(setItems, item.id)}
            >
              <span className="cc2-tile-emoji">{item.emoji}</span>
              <span className="cc2-tile-text">{label(item)}</span>
            </button>
          ))}
        </div>

        <div className="cc2-custom">
          <label htmlFor="cc2-custom-input">
            {CUSTOM_EMOJI} {copy.customLabel}
          </label>
          <div className="cc2-custom-row">
            <input
              id="cc2-custom-input"
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder={copy.customPlaceholder}
            />
            <button type="button" onClick={addCustom} disabled={!custom.trim()}>
              <Plus className="w-4 h-4" />
              {copy.customAdd}
            </button>
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-700 mt-12 mb-1">
          {copy.agreementsTitle}
        </h2>
        <p className="text-center text-sm text-slate-400 mb-4 max-w-lg mx-auto">
          {copy.agreementsHint}
        </p>
        <div className="cc2-agree">
          {AGREEMENTS.map((rule) => (
            <button
              key={rule.id}
              type="button"
              aria-pressed={agreements.includes(rule.id)}
              onClick={() => toggle(setAgreements, rule.id)}
            >
              <span>{rule.emoji}</span>
              <span>{label(rule)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
