import React, { useState, useRef, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/LanguageContext";
import { LITTLE_HEART_CONTENT } from "@/lib/littleHeartContent";
import PageMeta from "@/components/SEO/PageMeta";

const LITTLE_HEART_META = {
  en: { title: "A Little Heart from Home | Free Printable Keepsake Card | StoryLeap", description: "Create a personalized letter, photo card, or drawing your child can carry to school for comfort. A free printable keepsake tool from StoryLeap." },
  he: { title: "לב קטן מהבית | כרטיס פרידה חינמי להדפסה | StoryLeap", description: "יוצרים יחד מכתב, כרטיס עם תמונה או ציור שהילד/ה יכולים לקחת איתם לבית הספר לתחושת ביטחון. כלי חינמי ומודפס מבית StoryLeap." },
};

/* ------------------------------------------------------------------ *
 *  StoryLeap — "A Little Heart from Home"
 *  Free interactive tool #3 for the first-grade transition collection.
 *  Self-contained, bilingual (follows site language), mobile-first.
 * ------------------------------------------------------------------ */

const CSS = `
.sl {
  --royal: #1A1A6E;
  --charcoal: #1a1a2e;
  --cream: #FFF0F7;
  --blush: #FFD6EC;
  --peach: #FFF8EC;
  --lavender: #A89BE8;
  --sky: #EAF8FD;
  --mist: #FAFAFE;
  --grad: linear-gradient(135deg, #FF6FB5, #4FC3E8);
  --line: #ede9f8;
  --shadow: 0 4px 20px rgba(255,111,181,.08), 0 2px 10px rgba(79,195,232,.06);
  --body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --display: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  text-align: start;
  font-family: var(--body);
  color: var(--charcoal);
  background:
    radial-gradient(120% 80% at 85% -10%, var(--sky) 0%, rgba(221,232,255,0) 55%),
    radial-gradient(110% 70% at 5% 105%, var(--peach) 0%, rgba(245,207,195,0) 60%),
    var(--cream);
  min-height: 100vh;
  padding: 0 0 64px;
  -webkit-font-smoothing: antialiased;
  border-radius: 24px;
  overflow: hidden;
}
.sl *, .sl *::before, .sl *::after { box-sizing: border-box; }
.sl button { font-family: inherit; cursor: pointer; }
.sl :focus-visible { outline: 3px solid var(--royal); outline-offset: 3px; border-radius: 8px; }

.sl-wrap { max-width: 640px; margin: 0 auto; padding: 0 20px; }

/* header + progress */
.sl-top { padding: 22px 0 8px; }
.sl-brand { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.sl-logo { font-family: var(--display); font-weight: 700; font-size: 19px; color: var(--royal); letter-spacing: .2px; direction: ltr; }
.sl-stepnum { font-size: 13px; color: rgba(26,26,46,.55); font-variant-numeric: tabular-nums; }
.sl-bar { margin-top: 12px; height: 6px; border-radius: 999px; background: rgba(26,26,110,.09); overflow: hidden; }
.sl-bar-fill { height: 100%; border-radius: 999px; background: var(--royal); transition: width .45s cubic-bezier(.4,0,.2,1); }

/* panels */
.sl-panel { margin-top: 22px; animation: slIn .35s ease both; }
@keyframes slIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .sl-panel { animation: none; } .sl-bar-fill { transition: none; } }

.sl-eyebrow { font-size: 13px; font-weight: 500; color: var(--royal); opacity: .75; margin: 0 0 8px; }
.sl-h1 { font-family: var(--display); font-weight: 700; font-size: 30px; line-height: 1.25; margin: 0 0 12px; color: var(--royal); }
.sl-h2 { font-family: var(--display); font-weight: 700; font-size: 24px; line-height: 1.3; margin: 0 0 10px; color: var(--charcoal); }
.sl-p { font-size: 16.5px; line-height: 1.75; margin: 0 0 14px; color: rgba(26,26,46,.86); }
.sl-hint { font-size: 14px; line-height: 1.65; color: rgba(26,26,46,.6); margin: 0 0 14px; }
.sl-note { font-size: 13.5px; line-height: 1.6; color: #7A5000; background: #FFF8EC; border: 1.5px solid #F5C842; border-radius: 16px; padding: 12px 14px; margin: 14px 0; font-weight: 500; }

/* cards / options */
.sl-grid { display: grid; gap: 12px; }
.sl-grid.two { grid-template-columns: 1fr 1fr; }
@media (max-width: 420px) { .sl-grid.two { grid-template-columns: 1fr; } }

.sl-opt {
  width: 100%; text-align: start; background: rgba(255,255,255,.78);
  border: 1.5px solid var(--line); border-radius: 20px; padding: 16px 18px;
  display: flex; align-items: center; gap: 14px; min-height: 60px;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
  color: var(--charcoal);
}
.sl-opt:hover { transform: translateY(-1px); border-color: rgba(26,26,110,.28); }
.sl-opt[aria-pressed="true"], .sl-opt.on {
  border-color: var(--royal); background: #FFD6EC;
  box-shadow: 0 4px 20px rgba(255,111,181,.18);
}
.sl-opt-t { font-size: 16.5px; font-weight: 500; display: block; }
.sl-opt-d { font-size: 14px; color: rgba(26,26,46,.62); display: block; margin-top: 3px; line-height: 1.55; }
.sl-tick {
  flex: 0 0 auto; width: 24px; height: 24px; border-radius: 999px;
  border: 1.5px solid rgba(26,26,110,.22); display: grid; place-items: center;
  color: #fff; font-size: 13px; line-height: 1;
}
.sl-opt.on .sl-tick, .sl-opt[aria-pressed="true"] .sl-tick { background: var(--royal); border-color: var(--royal); }

.sl-chips { display: flex; flex-wrap: wrap; gap: 9px; }
.sl-chip {
  background: rgba(255,255,255,.8); border: 1.5px solid var(--line);
  border-radius: 999px; padding: 10px 16px; font-size: 15px; color: var(--charcoal);
  transition: all .16s ease;
}
.sl-chip:hover { border-color: rgba(26,26,110,.3); }
.sl-chip.on { background: var(--grad); border-color: transparent; color: #fff; }
.sl-chip.on::before { content: "✓ "; }

/* inputs */
.sl-label { display: block; font-size: 14.5px; font-weight: 500; margin: 0 0 7px; color: rgba(26,26,46,.8); }
.sl-input, .sl-area {
  width: 100%; font-family: var(--body); font-size: 17px; color: var(--charcoal);
  background: #fff; border: 1.5px solid var(--line); border-radius: 16px;
  padding: 14px 16px; text-align: start; line-height: 1.7;
}
.sl-area { min-height: 150px; resize: vertical; }
.sl-input:focus, .sl-area:focus { border-color: var(--royal); outline: none; box-shadow: 0 0 0 3px rgba(26,26,110,.10); }
.sl-count { font-size: 13px; color: rgba(26,26,46,.55); margin-top: 6px; }
.sl-warn { font-size: 13.5px; line-height: 1.6; color: #7a3d1f; background: #FBEDE6; border: 1px solid rgba(122,61,31,.18); border-radius: 14px; padding: 11px 13px; margin-top: 10px; }

/* nav */
.sl-nav { display: flex; gap: 12px; margin-top: 26px; align-items: center; }
.sl-btn {
  border: none; border-radius: 999px; padding: 15px 30px; font-size: 16.5px;
  font-weight: 600; background: var(--grad); color: #fff; transition: opacity .18s, transform .18s;
  box-shadow: 0 8px 22px rgba(255,111,181,.25);
}
.sl-btn:hover:not(:disabled) { transform: translateY(-1px); }
.sl-btn:disabled { opacity: .35; cursor: not-allowed; }
.sl-btn.ghost { background: transparent; color: var(--royal); border: 1.5px solid rgba(26,26,110,.22); }
.sl-btn.wide { width: 100%; }
.sl-btn.sm { padding: 11px 20px; font-size: 15px; }

/* symbol picker */
.sl-syms { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
@media (max-width: 380px) { .sl-syms { grid-template-columns: repeat(3, 1fr); } }
.sl-sym {
  aspect-ratio: 1; border-radius: 20px; border: 1.5px solid var(--line);
  background: rgba(255,255,255,.78); display: grid; place-items: center; gap: 2px;
  padding: 8px; transition: all .16s ease; color: var(--royal);
}
.sl-sym span { font-size: 11.5px; color: rgba(26,26,46,.6); }
.sl-sym.on { border-color: var(--royal); background: #fff; box-shadow: 0 8px 24px rgba(26,26,110,.12); }
.sl-sym.on span { color: var(--royal); font-weight: 500; }

/* style previews */
.sl-styleopt { border: 1.5px solid var(--line); border-radius: 22px; background: rgba(255,255,255,.7); padding: 14px; text-align: start; width: 100%; transition: all .18s ease; }
.sl-styleopt.on { border-color: var(--royal); box-shadow: 0 10px 30px rgba(26,26,110,.12); background: #fff; }
.sl-mini { height: 108px; border-radius: 14px; overflow: hidden; margin-bottom: 11px; }

/* image / drawing */
.sl-drop { border: 1.5px dashed rgba(26,26,110,.28); border-radius: 20px; padding: 26px 18px; text-align: center; background: rgba(255,255,255,.6); }
.sl-thumb { width: 100%; max-height: 260px; object-fit: contain; border-radius: 16px; background: #fff; border: 1px solid var(--line); }
.sl-canvas { width: 100%; touch-action: none; background: #fff; border: 1.5px solid var(--line); border-radius: 16px; display: block; }
.sl-tools { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }

/* card stage */
.sl-stage { display: flex; flex-direction: column; align-items: center; gap: 18px; margin: 6px 0 4px; }
.sl-scaler { transform-origin: top center; }

/* CTA */
.sl-cta { margin-top: 30px; border-radius: 26px; padding: 24px; background: linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%); border: 1px solid var(--line); }
.sl-foot { margin-top: 26px; font-size: 12.5px; color: rgba(26,26,46,.5); line-height: 1.7; }

/* modal */
.sl-modal-bg { position: fixed; inset: 0; background: rgba(26,26,46,.42); display: grid; place-items: center; padding: 20px; z-index: 50; }
.sl-modal { background: #fff; border-radius: 24px; padding: 24px; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(26,26,46,.2); }

/* ======================= printable card styles ======================= */
.slc {
  position: relative; overflow: hidden; display: flex; flex-direction: column;
  text-align: start; color: #1a1a2e;
  background: #fff; page-break-inside: avoid; break-inside: avoid;
}
.slc-title { margin: 0; line-height: 1.2; }
.slc-msg { margin: 0; white-space: pre-wrap; overflow-wrap: break-word; }
.slc-sign { margin: 0; }
.slc-label { font-size: 2.6mm; letter-spacing: .3mm; opacity: .62; margin: 0 0 1.5mm; }
.slc-blank { flex: 1; border: 0.4mm dashed rgba(26,26,110,.30); border-radius: 3mm; }

/* print sheet */
.sl-print { display: none; }
.sl-sheet-title { display: none; }

@media print {
  .sl, .sl * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  .sl-ui { display: none !important; }
  .sl-print { display: block !important; }
  .sl { background: #fff !important; padding: 0 !important; min-height: 0; }
  @page { size: A4; margin: 10mm; }
  html, body { background: #fff !important; }
  .sl-page { page-break-after: always; break-after: page; }
  .sl-page:last-child { page-break-after: auto; break-after: auto; }
  .sl-row { display: flex; flex-wrap: wrap; gap: 6mm; align-content: flex-start; }
  .slc { box-shadow: none !important; page-break-inside: avoid; break-inside: avoid; }
  .sl-cut { outline: 0.2mm dashed rgba(26,26,46,.35); outline-offset: 1.5mm; }
}
`;

/* ------------------------------- symbols ------------------------------- */

const S = (p) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...p,
});

const SYMBOLS = [
  { id: "heart", path: (<path d="M12 20.4C9.6 18.5 3.6 14.4 3.6 9.9 3.6 7.2 5.7 5.1 8.3 5.1c1.6 0 3 .8 3.7 2 .7-1.2 2.1-2 3.7-2 2.6 0 4.7 2.1 4.7 4.8 0 4.5-6 8.6-8.4 10.5z" />) },
  { id: "star", path: <path d="M12 3c.9 4.9 3.6 7.6 8.5 8.5-4.9.9-7.6 3.6-8.5 8.5-.9-4.9-3.6-7.6-8.5-8.5C8.4 10.6 11.1 7.9 12 3z" /> },
  { id: "sun", path: (<>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2M12 19.6v2M21.6 12h-2M4.4 12h-2M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4M18.8 18.8l-1.4-1.4M6.6 6.6L5.2 5.2" />
    </>) },
  { id: "rainbow", path: (<>
      <path d="M3 18a9 9 0 0 1 18 0" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
      <path d="M10 18a2 2 0 0 1 4 0" />
    </>) },
  { id: "house", path: (<>
      <path d="M3.6 10.4 12 3.8l8.4 6.6" />
      <path d="M5.5 9.6V20h13V9.6" />
      <path d="M10 20v-5.4h4V20" />
    </>) },
  { id: "cloud", path: <path d="M7.2 18.4h9.9a3.6 3.6 0 0 0 .5-7.2 5.2 5.2 0 0 0-9.9-1.3 3.8 3.8 0 0 0-.5 8.5z" /> },
  { id: "moon", path: <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.4 8.4 0 1 0 20 14.4z" /> },
  { id: "flower", path: (<>
      <circle cx="12" cy="12" r="2.1" />
      <path d="M12 9.9c0-2.4-.6-4.4 0-5.6.7-1.3 2.9-.3 2.9 2 0 1.5-1.3 2.7-2.9 3.6zM12 9.9c0-2.4.6-4.4 0-5.6-.7-1.3-2.9-.3-2.9 2 0 1.5 1.3 2.7 2.9 3.6z" />
      <path d="M14.1 12c2.4 0 4.4-.6 5.6 0 1.3.7.3 2.9-2 2.9-1.5 0-2.7-1.3-3.6-2.9zM9.9 12c-2.4 0-4.4.6-5.6 0-1.3-.7-.3-2.9 2-2.9 1.5 0 2.7 1.3 3.6 2.9z" />
      <path d="M12 14.1V20" />
    </>) },
  { id: "kite", path: (<>
      <path d="M12 2.8 19 9l-7 6.2L5 9z" />
      <path d="M12 2.8v12.4M5 9h14" />
      <path d="M12 15.2c-.4 1.8.9 2.4.4 4.1-.3 1-1.4 1.4-2.2 1.1" />
    </>) },
  { id: "feather", path: (<>
      <path d="M19.4 4.6c-6.2-1.3-11.6 2.4-12.6 8.2-.3 1.7-.2 3.3.2 4.6C11.2 21 18 18.6 19.4 4.6z" />
      <path d="M6.2 20.2 12.6 12" />
    </>) },
  { id: "hands", path: (<>
      <path d="M3.4 13.6c1.6-2.2 3.5-3.4 5.2-3.4 1.3 0 2.2.6 3.4 1.6" />
      <path d="M20.6 13.6c-1.6-2.2-3.5-3.4-5.2-3.4-1.3 0-2.2.6-3.4 1.6" />
      <path d="M8.6 10.2 7 6.4M15.4 10.2 17 6.4" />
      <path d="M4.6 15.6c2.4 3 4.9 4.4 7.4 4.4s5-1.4 7.4-4.4" />
    </>) },
  { id: "spark", path: (<>
      <path d="M9 4.2c.6 3.1 2.2 4.7 5.3 5.3-3.1.6-4.7 2.2-5.3 5.3-.6-3.1-2.2-4.7-5.3-5.3C6.8 8.9 8.4 7.3 9 4.2z" />
      <path d="M17 13c.3 1.7 1.2 2.6 2.9 2.9-1.7.3-2.6 1.2-2.9 2.9-.3-1.7-1.2-2.6-2.9-2.9 1.7-.3 2.6-1.2 2.9-2.9z" />
    </>) },
];

const Symbol = ({ id, size = 30, stroke = 1.4 }) => {
  const s = SYMBOLS.find((x) => x.id === id);
  if (!s) return null;
  return (
    <svg {...S({ width: size, height: size, strokeWidth: stroke })} aria-hidden="true">
      {s.path}
    </svg>
  );
};

const FORMAT_DIMS = {
  double: { w: 90, h: 58, sides: 2 },
  single: { w: 90, h: 58, sides: 1 },
  folded: { w: 105, h: 74, sides: 1 },
  coloring: { w: 180, h: 120, sides: 1 },
};
function getFormats(T) {
  return T.formats.map((f) => ({ ...f, ...FORMAT_DIMS[f.id] }));
}

/* ---------------------------- card rendering ---------------------------- */

const STYLE_TOKENS = {
  soft: { bg: "#FFF0F7", ink: "#1a1a2e", accent: "#1A1A6E", display: "'Frank Ruhl Libre', Georgia, serif", body: "'Heebo', Arial, sans-serif", radius: "5mm", border: "0.35mm solid rgba(26,26,110,0.16)", pad: "7mm", titleSize: "6.2mm", titleWeight: 700, msgSize: "3.9mm", msgWeight: 400, lh: 1.55, deco: true, halo: "#FFD6EC" },
  quiet: { bg: "#FFFFFF", ink: "#1a1a2e", accent: "#1A1A6E", display: "'Heebo', Arial, sans-serif", body: "'Heebo', Arial, sans-serif", radius: "2mm", border: "0.3mm solid rgba(26,26,46,0.20)", pad: "9mm", titleSize: "4.6mm", titleWeight: 500, msgSize: "4.1mm", msgWeight: 300, lh: 1.75, deco: false, halo: "#F7F8FB" },
  grown: { bg: "#FFFFFF", ink: "#1a1a2e", accent: "#1A1A6E", display: "'Heebo', Arial, sans-serif", body: "'Heebo', Arial, sans-serif", radius: "3mm", border: "0.3mm solid rgba(26,26,110,0.22)", pad: "6mm", titleSize: "5mm", titleWeight: 700, msgSize: "3.8mm", msgWeight: 400, lh: 1.6, deco: false, halo: "#DDE8FF" },
};

function frontText(d) {
  if (d.keepsake === "courage") return d.courageSentence || "";
  return d.parentMessage || "";
}

function Card({ data, formatId, side = "front", forPrint = false, T, formats }) {
  const st = STYLE_TOKENS[data.visualStyle] || STYLE_TOKENS.soft;
  const fmt = formats.find((f) => f.id === formatId) || formats[0];
  const name = data.childName || "";
  const msg = frontText(data);
  const media = data.keepsake === "photo" ? data.uploadedImage : data.keepsake === "drawing" ? data.drawingData : null;
  const isColoring = formatId === "coloring";
  const isFolded = formatId === "folded";
  const single = fmt.sides === 1;

  const len = msg.length;
  const shrink = len > 340 ? 0.82 : len > 230 ? 0.9 : 1;
  const msgSize = `calc(${st.msgSize} * ${isFolded ? 1.02 : 1} * ${shrink})`;

  const base = {
    width: `${fmt.w}mm`,
    height: `${fmt.h}mm`,
    background: st.bg,
    borderRadius: st.radius,
    border: st.border,
    padding: st.pad,
    fontFamily: st.body,
    color: st.ink,
    boxShadow: forPrint ? "none" : "0 12px 40px rgba(26,26,46,0.10)",
  };

  if (side === "back") {
    return (
      <div className={"slc" + (forPrint ? " sl-cut" : "")} style={base}>
        {st.deco && <Corner st={st} />}
        <p className="slc-label" style={{ color: st.accent }}>{T.card.backPrompt}</p>
        <p className="slc-msg" style={{ fontFamily: st.display, fontSize: "4.6mm", fontWeight: st.titleWeight, lineHeight: 1.45, color: st.accent }}>
          {data.helpfulAction || T.card.defaultAction}
        </p>
        <div style={{ flex: 1 }} />
        {data.secondaryParentLine && (
          <p className="slc-msg" style={{ fontSize: "3.2mm", lineHeight: 1.5, opacity: .8, marginBottom: "2mm" }}>
            {data.secondaryParentLine}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "3mm" }}>
          <div>
            {data.parentSignature && (
              <p className="slc-sign" style={{ fontFamily: st.display, fontSize: "3.4mm" }}>{data.parentSignature}</p>
            )}
            {data.storageLocation && (
              <p className="slc-sign" style={{ fontSize: "2.7mm", opacity: .55, marginTop: "1mm" }}>
                {T.card.storagePrefix}{data.storageLocation}
              </p>
            )}
            {data.includeMoment && data.openingMoment && (
              <p className="slc-sign" style={{ fontSize: "2.7mm", opacity: .55, marginTop: "0.8mm" }}>
                {T.card.openPrefix}{data.openingMoment}
              </p>
            )}
          </div>
          <div style={{ color: st.accent, opacity: .75 }}>
            <Symbol id={data.secondarySymbol || data.mainSymbol} size={26} stroke={1.2} />
          </div>
        </div>
      </div>
    );
  }

  if (isColoring) {
    return (
      <div className={"slc" + (forPrint ? " sl-cut" : "")} style={{ ...base, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4mm", marginBottom: "4mm" }}>
          <div style={{ color: st.accent }}><Symbol id={data.mainSymbol} size={44} stroke={1.1} /></div>
          <div>
            <h3 className="slc-title" style={{ fontFamily: st.display, fontSize: "7mm", fontWeight: 700, color: st.accent }}>
              {name ? T.card.nameOf(name) : T.card.defaultName}
            </h3>
            {msg && <p className="slc-msg" style={{ fontSize: "3.6mm", lineHeight: 1.6, marginTop: "1.5mm", maxWidth: "120mm" }}>{msg}</p>}
          </div>
        </div>
        <p className="slc-label">{T.card.coloringPrompt}</p>
        <div className="slc-blank" />
        <p className="slc-sign" style={{ fontSize: "3mm", opacity: .6, marginTop: "3mm" }}>
          {T.card.coloringSign(data.helpfulAction || T.card.defaultAction, data.parentSignature)}
        </p>
      </div>
    );
  }

  const Media = media ? (
    <div style={{
      width: "100%", height: isFolded ? "30mm" : "22mm", borderRadius: "3mm",
      overflow: "hidden", background: "#fff", border: "0.25mm solid rgba(26,26,46,.12)", marginBottom: "3mm",
    }}>
      <img src={media} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  ) : null;

  if (data.visualStyle === "grown") {
    return (
      <div className={"slc" + (forPrint ? " sl-cut" : "")} style={{ ...base, padding: 0 }}>
        <div style={{
          background: st.accent, color: "#fff", padding: "3.5mm 6mm",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "3mm",
        }}>
          <span style={{ fontSize: st.titleSize, fontWeight: 700, lineHeight: 1.2 }}>{name || T.card.defaultName}</span>
          <span style={{ opacity: .95 }}><Symbol id={data.mainSymbol} size={20} stroke={1.6} /></span>
        </div>
        <div style={{ padding: "4.5mm 6mm 5mm", display: "flex", flexDirection: "column", flex: 1 }}>
          {Media}
          <p className="slc-msg" style={{ fontSize: msgSize, fontWeight: 500, lineHeight: st.lh }}>{msg}</p>
          <div style={{ flex: 1 }} />
          {data.secondaryParentLine && (
            <p className="slc-msg" style={{ fontSize: "2.9mm", opacity: .7, lineHeight: 1.5 }}>{data.secondaryParentLine}</p>
          )}
          <div style={{ height: "0.4mm", width: "14mm", background: st.accent, opacity: .55, margin: "2.5mm 0 1.8mm" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2mm" }}>
            <span style={{ fontSize: "2.9mm", opacity: .75 }}>{data.parentSignature}</span>
            {single && (
              <span style={{ fontSize: "2.6mm", opacity: .6 }}>
                {data.helpfulAction ? T.card.helpableInline(data.helpfulAction) : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (data.visualStyle === "quiet") {
    return (
      <div className={"slc" + (forPrint ? " sl-cut" : "")} style={base}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "3mm", marginBottom: "3mm" }}>
          <span style={{ fontSize: st.titleSize, fontWeight: st.titleWeight, letterSpacing: ".2mm" }}>{name || T.card.defaultName}</span>
          <span style={{ color: st.accent, opacity: .8 }}><Symbol id={data.mainSymbol} size={22} stroke={1.2} /></span>
        </div>
        <div style={{ height: "0.25mm", background: "rgba(26,26,46,.18)", marginBottom: "4mm" }} />
        {Media}
        <p className="slc-msg" style={{ fontSize: msgSize, fontWeight: st.msgWeight, lineHeight: st.lh }}>{msg}</p>
        <div style={{ flex: 1 }} />
        {data.secondaryParentLine && (
          <p className="slc-msg" style={{ fontSize: "2.9mm", opacity: .68, lineHeight: 1.5, marginBottom: "1.5mm" }}>{data.secondaryParentLine}</p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2mm" }}>
          <span style={{ fontSize: "2.9mm", opacity: .7 }}>{data.parentSignature}</span>
          {single && data.helpfulAction && (
            <span style={{ fontSize: "2.6mm", opacity: .55 }}>{T.card.helpableInline(data.helpfulAction)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={"slc" + (forPrint ? " sl-cut" : "")} style={base}>
      <Corner st={st} />
      <div style={{ display: "flex", alignItems: "center", gap: "3.5mm", marginBottom: "3mm" }}>
        <div style={{
          width: "13mm", height: "13mm", borderRadius: "999px", flex: "0 0 auto",
          background: `radial-gradient(circle at 35% 30%, ${st.halo}, #EAF8FD)`,
          display: "grid", placeItems: "center", color: st.accent,
        }}>
          <Symbol id={data.mainSymbol} size={28} stroke={1.3} />
        </div>
        <h3 className="slc-title" style={{ fontFamily: st.display, fontSize: st.titleSize, fontWeight: 700, color: st.accent }}>
          {name || T.card.defaultName}
        </h3>
      </div>
      {Media}
      <p className="slc-msg" style={{ fontFamily: st.display, fontSize: msgSize, lineHeight: st.lh }}>{msg}</p>
      <div style={{ flex: 1 }} />
      {data.secondaryParentLine && (
        <p className="slc-msg" style={{ fontSize: "2.9mm", opacity: .7, lineHeight: 1.5, marginBottom: "1.5mm" }}>{data.secondaryParentLine}</p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2mm" }}>
        <span style={{ fontFamily: st.display, fontSize: "3.1mm", opacity: .8 }}>{data.parentSignature}</span>
        {single && data.helpfulAction && (
          <span style={{ fontSize: "2.6mm", opacity: .6 }}>{T.card.helpableInline(data.helpfulAction)}</span>
        )}
      </div>
    </div>
  );
}

const Corner = ({ st }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
    style={{ position: "absolute", top: "3mm", insetInlineStart: "3mm", color: st.accent, opacity: .22 }}>
    <path d="M12 3c.9 4.9 3.6 7.6 8.5 8.5-4.9.9-7.6 3.6-8.5 8.5-.9-4.9-3.6-7.6-8.5-8.5C8.4 10.6 11.1 7.9 12 3z"
      fill="currentColor" />
  </svg>
);

function MiniPreview({ id }) {
  if (id === "soft") {
    return (
      <div style={{ height: "100%", background: "#FFF0F7", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #FFD6EC, #EAF8FD)", display: "grid", placeItems: "center", color: "#1A1A6E" }}>
            <Symbol id="heart" size={15} />
          </div>
          <div style={{ height: 5, background: "rgba(26,26,46,.16)", borderRadius: 3, width: 40 }} />
        </div>
        <div style={{ height: 5, background: "rgba(26,26,46,.16)", borderRadius: 3, width: "92%" }} />
        <div style={{ height: 5, background: "rgba(26,26,46,.16)", borderRadius: 3, width: "78%" }} />
        <div style={{ height: 5, background: "rgba(26,26,46,.16)", borderRadius: 3, width: "60%" }} />
      </div>
    );
  }
  if (id === "quiet") {
    return (
      <div style={{ height: "100%", background: "#fff", border: "1px solid rgba(26,26,46,.16)", borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ height: 5, background: "rgba(26,26,46,.13)", borderRadius: 3, width: 40 }} />
          <div style={{ color: "#1A1A6E", opacity: .8 }}><Symbol id="star" size={14} /></div>
        </div>
        <div style={{ height: 1, background: "rgba(26,26,46,.18)" }} />
        <div style={{ height: 4, background: "rgba(26,26,46,.13)", borderRadius: 3, width: "86%" }} />
        <div style={{ height: 4, background: "rgba(26,26,46,.13)", borderRadius: 3, width: "66%" }} />
      </div>
    );
  }
  return (
    <div style={{ height: "100%", background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(26,26,110,.2)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1A1A6E", color: "#fff", padding: "7px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ height: 5, background: "rgba(255,255,255,.7)", borderRadius: 3, width: 40 }} />
        <Symbol id="kite" size={14} stroke={1.7} />
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 5, background: "rgba(26,26,46,.18)", borderRadius: 3, width: "90%" }} />
        <div style={{ height: 5, background: "rgba(26,26,46,.18)", borderRadius: 3, width: "72%" }} />
        <div style={{ height: 3, background: "#1A1A6E", opacity: .6, width: 34, marginTop: 4 }} />
      </div>
    </div>
  );
}

/* ------------------------------ the app ------------------------------ */

const EMPTY = {
  childName: "", keepsake: "", themes: [], customTheme: "", parentMessage: "",
  courageSentence: "", customCourage: "", secondaryParentLine: "",
  uploadedImage: null, drawingData: null, drawingMode: "canvas",
  mainSymbol: "heart", secondarySymbol: "", helpfulAction: "", storageLocation: "",
  visualStyle: "soft", cardFormats: ["double"], openingMoment: "", includeMoment: false, parentSignature: "",
};

const STEPS_COUNT = 13;

function NavBar({ nextLabel, onNext, onBack, disabled, T }) {
  return (
    <div className="sl-nav">
      <button className="sl-btn" onClick={onNext} disabled={disabled}>{nextLabel || T.navContinueDefault}</button>
      {onBack && <button className="sl-btn ghost sm" onClick={onBack}>{T.navBack}</button>}
    </div>
  );
}

export default function FreeActivityLittleHeart() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const T = LITTLE_HEART_CONTENT[isHe ? 'he' : 'en'];
  const FORMATS = getFormats(T);

  const [step, setStep] = useState(0);
  const [d, setD] = useState(EMPTY);
  const [modal, setModal] = useState(null);
  const [copies, setCopies] = useState(2);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);
  const printRef = useRef(null);

  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState("idle");
  const submitLead = async (e) => {
    e.preventDefault();
    const email = leadEmail.trim();
    if (!email) return;
    try {
      await base44.entities.FreeActivityLead.create({ email, activity: "little_heart" });
    } catch (err) {}
    setLeadStatus("done");
  };
  const skipLead = () => setLeadStatus("done");

  const set = (patch) => setD((p) => ({ ...p, ...patch }));
  const go = (n) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const widest = Math.max(...d.cardFormats.map((f) => (FORMATS.find((x) => x.id === f) || FORMATS[0]).w));
    const px = widest * 3.7795;
    const avail = el.clientWidth;
    setScale(Math.min(1, avail / px));
  }, [d.cardFormats, FORMATS]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, step]);

  const name = d.childName.trim();
  const msgLen = frontText(d).length;
  const tooLong = msgLen > 420;

  const canNext = () => {
    switch (step) {
      case 1: return name.length > 0;
      case 2: return !!d.keepsake;
      case 3: return d.themes.length > 0 || d.customTheme.trim().length > 0;
      case 4: return frontText(d).trim().length > 0;
      case 5: return !!d.mainSymbol;
      case 6: return !!d.helpfulAction;
      case 7: return !!d.storageLocation;
      case 9: return d.cardFormats.length > 0;
      default: return true;
    }
  };

  const toggleTheme = (t) => {
    setD((p) => {
      const has = p.themes.includes(t);
      if (has) return { ...p, themes: p.themes.filter((x) => x !== t) };
      if (p.themes.length >= 2) return p;
      return { ...p, themes: [...p.themes, t] };
    });
  };

  const toggleFormat = (id) => {
    setD((p) => {
      const has = p.cardFormats.includes(id);
      if (has && p.cardFormats.length === 1) return p;
      return { ...p, cardFormats: has ? p.cardFormats.filter((x) => x !== id) : [...p.cardFormats, id] };
    });
  };

  const reset = () => { setD(EMPTY); setCopies(2); go(0); };

  const doPrint = () => { if (typeof window !== "undefined") window.print(); };

  const doDownloadFile = () => {
    try {
      const html = `<!doctype html><html lang="${lang}" dir="${isHe ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${T.downloadTitle(name)}</title>
<style>${CSS}\n.sl-print{display:block !important}body{margin:0;background:#fff}.sl-row{display:flex;flex-wrap:wrap;gap:6mm;padding:10mm}</style>
</head><body><div class="sl">${printRef.current ? printRef.current.innerHTML : ""}</div></body></html>`;
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = T.downloadFileName(name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      setModal("download");
    }
  };

  const S0 = T.screens.s0, S1 = T.screens.s1, S2 = T.screens.s2, S3 = T.screens.s3, S4 = T.screens.s4,
    S5 = T.screens.s5, S6 = T.screens.s6, S7 = T.screens.s7, S8 = T.screens.s8, S9 = T.screens.s9,
    S10 = T.screens.s10, S11 = T.screens.s11, S12 = T.screens.s12;

  const screens = {
    0: (
      <div className="sl-panel">
        <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
          <div style={{
            width: 96, height: 96, borderRadius: 999, margin: "0 auto 20px",
            background: "linear-gradient(135deg, #FF6FB5, #4FC3E8)",
            display: "grid", placeItems: "center", color: "#1A1A6E", boxShadow: "0 12px 40px rgba(26,26,46,.10)",
          }}>
            <Symbol id="heart" size={44} stroke={1.3} />
          </div>
          <h1 className="sl-h1" style={{ fontSize: 34 }}>{S0.title}</h1>
          <p className="sl-p" style={{ maxWidth: 460, margin: "0 auto 18px" }}>{S0.lede}</p>
        </div>
        <div className="sl-note" style={{ background: "rgba(255,255,255,.78)" }}>
          <p className="sl-p" style={{ fontSize: 16, margin: 0 }}>{S0.note}</p>
        </div>
        <p className="sl-hint">{S0.hint}</p>
        <button className="sl-btn wide" onClick={() => go(1)}>{S0.cta}</button>
        <p className="sl-foot">{S0.foot}</p>
      </div>
    ),

    1: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S1.eyebrow}</p>
        <h2 className="sl-h2">{S1.h2}</h2>
        <p className="sl-hint">{S1.hint}</p>
        <label className="sl-label" htmlFor="sl-name">{S1.label}</label>
        <input id="sl-name" className="sl-input" value={d.childName} maxLength={22}
          onChange={(e) => set({ childName: e.target.value })} placeholder={S1.ph} />
        <NavBar T={T} disabled={!canNext()} onNext={() => go(2)} onBack={() => go(step - 1)} />
      </div>
    ),

    2: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S2.eyebrow}</p>
        <h2 className="sl-h2">{S2.h2}</h2>
        <p className="sl-hint">{S2.hint}</p>
        <div className="sl-grid">
          {T.keepsakes.map((k) => (
            <button key={k.id} className={"sl-opt" + (d.keepsake === k.id ? " on" : "")}
              aria-pressed={d.keepsake === k.id} onClick={() => set({ keepsake: k.id })}>
              <span className="sl-tick" aria-hidden="true">✓</span>
              <span>
                <span className="sl-opt-t">{k.t}</span>
                <span className="sl-opt-d">{k.d}</span>
              </span>
            </button>
          ))}
        </div>
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    3: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S3.eyebrow}</p>
        <h2 className="sl-h2">{S3.h2(name)}</h2>
        <p className="sl-hint">{S3.hint}</p>
        <div className="sl-chips">
          {T.themes.map((t) => (
            <button key={t} className={"sl-chip" + (d.themes.includes(t) ? " on" : "")}
              aria-pressed={d.themes.includes(t)} onClick={() => toggleTheme(t)}>{t}</button>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="sl-label" htmlFor="sl-other">{S3.otherLabel}</label>
          <input id="sl-other" className="sl-input" value={d.customTheme} maxLength={60}
            onChange={(e) => set({ customTheme: e.target.value })} placeholder={S3.otherPh} />
        </div>
        {d.themes.length === 2 && <p className="sl-hint" style={{ marginTop: 10 }}>{S3.twoNote}</p>}
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    4: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S4.eyebrow}</p>
        {d.keepsake === "letter" && <LetterBuilder d={d} set={set} name={name} T={T} />}
        {d.keepsake === "courage" && <CourageBuilder d={d} set={set} T={T} />}
        {d.keepsake === "photo" && <PhotoBuilder d={d} set={set} T={T} />}
        {d.keepsake === "drawing" && <DrawingBuilder d={d} set={set} T={T} />}
        <div style={{ marginTop: 20 }}>
          <label className="sl-label" htmlFor="sl-sign">{S4.signLabel}</label>
          <input id="sl-sign" className="sl-input" value={d.parentSignature} maxLength={40}
            onChange={(e) => set({ parentSignature: e.target.value })} placeholder={S4.signPh} />
        </div>
        {tooLong && <div className="sl-warn">{S4.warn}</div>}
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    5: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S5.eyebrow}</p>
        <h2 className="sl-h2">{S5.h2}</h2>
        <p className="sl-hint">{S5.hint}</p>
        <div className="sl-syms">
          {SYMBOLS.map((s) => (
            <button key={s.id} className={"sl-sym" + (d.mainSymbol === s.id ? " on" : "")}
              aria-pressed={d.mainSymbol === s.id} onClick={() => set({ mainSymbol: s.id })}>
              <Symbol id={s.id} size={30} />
              <span>{T.symbols[s.id]}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <p className="sl-label">{S5.secondaryHint}</p>
          <div className="sl-chips">
            <button className={"sl-chip" + (!d.secondarySymbol ? " on" : "")} onClick={() => set({ secondarySymbol: "" })}>{S5.secondaryNone}</button>
            {SYMBOLS.filter((s) => s.id !== d.mainSymbol).map((s) => (
              <button key={s.id} className={"sl-chip" + (d.secondarySymbol === s.id ? " on" : "")}
                onClick={() => set({ secondarySymbol: s.id })}>{T.symbols[s.id]}</button>
            ))}
          </div>
        </div>
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    6: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S6.eyebrow}</p>
        <h2 className="sl-h2">{S6.h2}</h2>
        <p className="sl-hint">{S6.hint}</p>
        <div className="sl-grid">
          {T.actions.map((a) => (
            <button key={a} className={"sl-opt" + (d.helpfulAction === a ? " on" : "")}
              aria-pressed={d.helpfulAction === a} onClick={() => set({ helpfulAction: a })}>
              <span className="sl-tick" aria-hidden="true">✓</span>
              <span className="sl-opt-t">{a}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="sl-label" htmlFor="sl-act">{S6.otherLabel}</label>
          <input id="sl-act" className="sl-input" maxLength={48}
            value={T.actions.includes(d.helpfulAction) ? "" : d.helpfulAction}
            onChange={(e) => set({ helpfulAction: e.target.value })} placeholder={S6.otherPh} />
        </div>
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    7: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S7.eyebrow}</p>
        <h2 className="sl-h2">{S7.h2}</h2>
        <p className="sl-hint">{S7.hint}</p>
        <div className="sl-grid two">
          {T.places.map((p) => (
            <button key={p} className={"sl-opt" + (d.storageLocation === p ? " on" : "")}
              aria-pressed={d.storageLocation === p} onClick={() => set({ storageLocation: p })}>
              <span className="sl-tick" aria-hidden="true">✓</span>
              <span className="sl-opt-t">{p}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <label className="sl-label" htmlFor="sl-place">{S7.otherLabel}</label>
          <input id="sl-place" className="sl-input" maxLength={40}
            value={T.places.includes(d.storageLocation) ? "" : d.storageLocation}
            onChange={(e) => set({ storageLocation: e.target.value })} placeholder={S7.otherPh} />
        </div>
        <div className="sl-note">{S7.note}</div>
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    8: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S8.eyebrow}</p>
        <h2 className="sl-h2">{S8.h2}</h2>
        <p className="sl-hint">{S8.hint}</p>
        <div className="sl-grid">
          {T.styles.map((s) => (
            <button key={s.id} className={"sl-styleopt" + (d.visualStyle === s.id ? " on" : "")}
              aria-pressed={d.visualStyle === s.id} onClick={() => set({ visualStyle: s.id })}>
              <div className="sl-mini"><MiniPreview id={s.id} /></div>
              <span className="sl-opt-t">{s.t}</span>
              <span className="sl-opt-d">{s.d}</span>
            </button>
          ))}
        </div>
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    9: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S9.eyebrow}</p>
        <h2 className="sl-h2">{S9.h2}</h2>
        <p className="sl-hint">{S9.hint}</p>
        <div className="sl-grid">
          {FORMATS.map((f) => (
            <button key={f.id} className={"sl-opt" + (d.cardFormats.includes(f.id) ? " on" : "")}
              aria-pressed={d.cardFormats.includes(f.id)} onClick={() => toggleFormat(f.id)}>
              <span className="sl-tick" aria-hidden="true">✓</span>
              <span>
                <span className="sl-opt-t">{f.t}</span>
                <span className="sl-opt-d">{f.d} · {f.w}×{f.h} {f.unit}</span>
              </span>
            </button>
          ))}
        </div>
        {tooLong && !d.cardFormats.includes("folded") && (
          <div className="sl-warn">{S9.warn}</div>
        )}
        <NavBar T={T} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    10: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S10.eyebrow}</p>
        <h2 className="sl-h2">{S10.h2(name)}</h2>
        <p className="sl-hint">{S10.hint}</p>
        <div className="sl-stage" ref={stageRef}>
          {d.cardFormats.map((fid) => {
            const f = FORMATS.find((x) => x.id === fid);
            const h = (f.h * 3.7795) * scale;
            const sides = f.sides === 2 ? ["front", "back"] : ["front"];
            return sides.map((side) => (
              <div key={fid + side} style={{ height: h + 8, width: "100%", display: "flex", justifyContent: "center" }}>
                <div className="sl-scaler" style={{ transform: `scale(${scale})` }}>
                  <Card data={d} formatId={fid} side={side} T={T} formats={FORMATS} />
                </div>
              </div>
            ));
          })}
        </div>
        <div className="sl-chips" style={{ marginTop: 18 }}>
          <button className="sl-chip" onClick={() => go(4)}>{S10.chipMsg}</button>
          <button className="sl-chip" onClick={() => go(8)}>{S10.chipStyle}</button>
          <button className="sl-chip" onClick={() => go(5)}>{S10.chipSymbol}</button>
        </div>
        <NavBar T={T} nextLabel={S10.nextLabel} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    11: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S11.eyebrow}</p>
        <h2 className="sl-h2">{S11.h2}</h2>
        <p className="sl-p">{S11.p}</p>
        <p className="sl-label" style={{ marginTop: 18 }}>{S11.promptLabel}</p>
        <div className="sl-chips">
          {T.moments.map((m) => (
            <button key={m} className={"sl-chip" + (d.openingMoment === m ? " on" : "")}
              onClick={() => set({ openingMoment: d.openingMoment === m ? "" : m })}>{m}</button>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <label className="sl-label" htmlFor="sl-mom">{S11.otherLabel}</label>
          <input id="sl-mom" className="sl-input" maxLength={48}
            value={T.moments.includes(d.openingMoment) ? "" : d.openingMoment}
            onChange={(e) => set({ openingMoment: e.target.value })} placeholder={S11.otherPh} />
        </div>
        {d.openingMoment && (
          <button className={"sl-opt" + (d.includeMoment ? " on" : "")} style={{ marginTop: 16 }}
            aria-pressed={d.includeMoment} onClick={() => set({ includeMoment: !d.includeMoment })}>
            <span className="sl-tick" aria-hidden="true">✓</span>
            <span className="sl-opt-t">{S11.includeLabel}</span>
          </button>
        )}
        <NavBar T={T} nextLabel={S11.nextLabel} disabled={!canNext()} onNext={() => go(step + 1)} onBack={() => go(step - 1)} />
      </div>
    ),

    12: (
      <div className="sl-panel">
        <p className="sl-eyebrow">{S12.eyebrow}</p>
        <h2 className="sl-h2">{S12.h2(name)}</h2>
        <p className="sl-hint">{S12.hint}</p>

        <div className="sl-stage" ref={stageRef}>
          {d.cardFormats.map((fid) => {
            const f = FORMATS.find((x) => x.id === fid);
            const h = (f.h * 3.7795) * scale;
            const sides = f.sides === 2 ? ["front", "back"] : ["front"];
            return sides.map((side) => (
              <div key={fid + side} style={{ height: h + 8, width: "100%", display: "flex", justifyContent: "center" }}>
                <div className="sl-scaler" style={{ transform: `scale(${scale})` }}>
                  <Card data={d} formatId={fid} side={side} T={T} formats={FORMATS} />
                </div>
              </div>
            ));
          })}
        </div>

        <div style={{ marginTop: 22 }}>
          <p className="sl-label">{S12.copiesLabel}</p>
          <div className="sl-chips">
            {[1, 2, 4].map((n) => (
              <button key={n} className={"sl-chip" + (copies === n ? " on" : "")} onClick={() => setCopies(n)}>{n}</button>
            ))}
          </div>
          <p className="sl-hint" style={{ marginTop: 8 }}>{S12.copiesHint}</p>
        </div>

        <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
          <button className="sl-btn wide" onClick={doPrint}>{S12.printBtn}</button>
          <div className="sl-chips">
            <button className="sl-chip" onClick={doDownloadFile}>{S12.downloadBtn}</button>
            <button className="sl-chip" onClick={() => setModal("image")}>{S12.imageBtn}</button>
            <button className="sl-chip" onClick={() => go(4)}>{S12.changeMsg}</button>
            <button className="sl-chip" onClick={() => go(8)}>{S12.changeDesign}</button>
            <button className="sl-chip" onClick={() => setModal("reset")}>{S12.resetBtn}</button>
          </div>
        </div>

        {(d.uploadedImage || d.drawingData) && (
          <div className="sl-note" style={{ marginTop: 18 }}>
            {S12.privacyNote}
            <div style={{ marginTop: 10 }}>
              <button className="sl-chip" onClick={() => set({ uploadedImage: null, drawingData: null })}>{S12.deleteBtn}</button>
            </div>
          </div>
        )}

        <div className="sl-cta">
          <h3 className="sl-h2" style={{ fontSize: 21, marginBottom: 8 }}>{S12.ctaTitle}</h3>
          <p className="sl-p" style={{ fontSize: 15.5 }}>{S12.ctaText}</p>
          <a className="sl-btn sm" href="/CreateStory" style={{ display: "inline-block", textDecoration: "none" }}>
            {S12.ctaBtn}
          </a>
        </div>

        {leadStatus === "idle" ? (
          <div className="sl-note" style={{ marginTop: 18 }}>
            <p className="sl-p" style={{ fontSize: 15, marginBottom: 10 }}>{S12.leadHint}</p>
            <form onSubmit={submitLead} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input type="email" className="sl-input" style={{ flex: 1, minWidth: 180 }}
                value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder={S12.leadPh} />
              <button type="submit" className="sl-btn sm">{S12.leadSubmit}</button>
            </form>
            <button type="button" className="sl-chip" style={{ marginTop: 10 }} onClick={skipLead}>{S12.leadSkip}</button>
          </div>
        ) : (
          <p className="sl-note" style={{ marginTop: 18 }}>{S12.leadThanks}</p>
        )}

        <p className="sl-foot">{S12.foot}</p>
      </div>
    ),
  };

  const pct = step === 0 ? 0 : Math.round((step / (STEPS_COUNT - 1)) * 100);

  return (
    <div className="sl" dir={isHe ? 'rtl' : 'ltr'}>
      <PageMeta title={LITTLE_HEART_META[isHe ? 'he' : 'en'].title} description={LITTLE_HEART_META[isHe ? 'he' : 'en'].description} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="sl-ui">
        <div className="sl-wrap">
          <div className="sl-top">
            <div className="sl-brand">
              <span className="sl-logo">StoryLeap</span>
              {step > 0 && <span className="sl-stepnum">{T.stepLabel(step, STEPS_COUNT - 1)}</span>}
            </div>
            {step > 0 && (
              <div className="sl-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="sl-bar-fill" style={{ width: pct + "%" }} />
              </div>
            )}
          </div>
          {React.cloneElement(screens[step], { key: step })}
        </div>
      </div>

      <div className="sl-print" ref={printRef}>
        {d.cardFormats.map((fid) => {
          const f = FORMATS.find((x) => x.id === fid);
          const n = f.id === "double" || f.id === "single" ? copies : 1;
          const fronts = Array.from({ length: n });
          return (
            <div key={fid}>
              <div className="sl-page">
                <div className="sl-row">
                  {fronts.map((_, i) => (
                    <Card key={"f" + i} data={d} formatId={fid} side="front" forPrint T={T} formats={FORMATS} />
                  ))}
                </div>
              </div>
              {f.sides === 2 && (
                <div className="sl-page">
                  <div className="sl-row">
                    {fronts.map((_, i) => (
                      <Card key={"b" + i} data={d} formatId={fid} side="back" forPrint T={T} formats={FORMATS} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="sl-modal-bg" onClick={() => setModal(null)}>
          <div className="sl-modal" onClick={(e) => e.stopPropagation()}>
            {modal === "image" && (<>
              <h3 className="sl-h2" style={{ fontSize: 20 }}>{T.modal.imageTitle}</h3>
              <p className="sl-p" style={{ fontSize: 15.5 }}>{T.modal.imageText}</p>
              <button className="sl-btn sm" onClick={() => { setModal(null); doPrint(); }}>{T.modal.imageBtn}</button>
            </>)}
            {modal === "download" && (<>
              <h3 className="sl-h2" style={{ fontSize: 20 }}>{T.modal.downloadTitle}</h3>
              <p className="sl-p" style={{ fontSize: 15.5 }}>{T.modal.downloadText}</p>
              <button className="sl-btn sm" onClick={() => setModal(null)}>{T.modal.downloadBtn}</button>
            </>)}
            {modal === "reset" && (<>
              <h3 className="sl-h2" style={{ fontSize: 20 }}>{T.modal.resetTitle}</h3>
              <p className="sl-p" style={{ fontSize: 15.5 }}>{T.modal.resetText}</p>
              <div className="sl-chips">
                <button className="sl-chip" onClick={() => { setModal(null); reset(); }}>{T.modal.resetYes}</button>
                <button className="sl-chip on" onClick={() => setModal(null)}>{T.modal.resetNo}</button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------- step 4 sub-builders -------------------------- */

function LetterBuilder({ d, set, name, T }) {
  const B = T.letterBuilder;
  const starters = T.letterStarters(name);
  const samples = T.letterSamples(name);
  const words = d.parentMessage.trim() ? d.parentMessage.trim().split(/\s+/).length : 0;

  const append = (t) => set({ parentMessage: (d.parentMessage ? d.parentMessage.replace(/\s*$/, " ") : "") + t + " " });

  return (
    <>
      <h2 className="sl-h2">{B.h2}</h2>
      <p className="sl-hint">{B.hint}</p>

      <p className="sl-label">{B.startersLabel}</p>
      <div className="sl-chips" style={{ marginBottom: 16 }}>
        {starters.map((s) => (
          <button key={s} className="sl-chip" onClick={() => append(s)}>{s}</button>
        ))}
      </div>

      <label className="sl-label" htmlFor="sl-letter">{B.letterLabel}</label>
      <textarea id="sl-letter" className="sl-area" value={d.parentMessage}
        onChange={(e) => set({ parentMessage: e.target.value })}
        placeholder={B.letterPh} />
      <p className="sl-count">{B.words(words, d.parentMessage.length)}</p>

      <p className="sl-label" style={{ marginTop: 16 }}>{B.sampleLabel}</p>
      <div className="sl-grid">
        {samples.map((s, i) => (
          <button key={i} className="sl-opt" onClick={() => set({ parentMessage: s })}>
            <span className="sl-tick" aria-hidden="true">✓</span>
            <span className="sl-opt-d" style={{ marginTop: 0 }}>{s}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function CourageBuilder({ d, set, T }) {
  const B = T.courageBuilder;
  return (
    <>
      <h2 className="sl-h2">{B.h2}</h2>
      <p className="sl-hint">{B.hint}</p>
      <div className="sl-grid">
        {T.courage.map((c) => (
          <button key={c} className={"sl-opt" + (d.courageSentence === c ? " on" : "")}
            aria-pressed={d.courageSentence === c} onClick={() => set({ courageSentence: c })}>
            <span className="sl-tick" aria-hidden="true">✓</span>
            <span className="sl-opt-t">{c}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <label className="sl-label" htmlFor="sl-cust">{B.customLabel}</label>
        <input id="sl-cust" className="sl-input" maxLength={70}
          value={T.courage.includes(d.courageSentence) ? "" : d.courageSentence}
          onChange={(e) => set({ courageSentence: e.target.value })} placeholder={B.customPh} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label className="sl-label" htmlFor="sl-second">{B.secondLabel}</label>
        <input id="sl-second" className="sl-input" maxLength={70} value={d.secondaryParentLine}
          onChange={(e) => set({ secondaryParentLine: e.target.value })} placeholder={B.secondPh} />
      </div>
    </>
  );
}

function PhotoBuilder({ d, set, T }) {
  const B = T.photoBuilder;
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set({ uploadedImage: r.result });
    r.readAsDataURL(f);
  };
  return (
    <>
      <h2 className="sl-h2">{B.h2}</h2>
      <p className="sl-hint">{B.hint}</p>

      {d.uploadedImage ? (
        <>
          <img className="sl-thumb" src={d.uploadedImage} alt="" />
          <div className="sl-tools">
            <label className="sl-chip" style={{ cursor: "pointer" }}>
              {B.changeBtn}
              <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            </label>
            <button className="sl-chip" onClick={() => set({ uploadedImage: null })}>{B.deleteBtn}</button>
          </div>
        </>
      ) : (
        <div className="sl-drop">
          <p className="sl-p" style={{ fontSize: 15.5, marginBottom: 12 }}>{B.dropHint}</p>
          <label className="sl-btn sm" style={{ display: "inline-block", cursor: "pointer" }}>
            {B.chooseBtn}
            <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} aria-label={B.chooseAria} />
          </label>
        </div>
      )}

      <div className="sl-note">{B.note}</div>

      <label className="sl-label" htmlFor="sl-pmsg">{B.msgLabel}</label>
      <textarea id="sl-pmsg" className="sl-area" style={{ minHeight: 100 }} value={d.parentMessage}
        onChange={(e) => set({ parentMessage: e.target.value })} placeholder={B.msgPh} />
      <div className="sl-chips" style={{ marginTop: 10 }}>
        {T.photoLines.map((l) => (
          <button key={l} className="sl-chip" onClick={() => set({ parentMessage: l })}>{l}</button>
        ))}
      </div>
    </>
  );
}

function DrawingBuilder({ d, set, T }) {
  const B = T.drawingBuilder;
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef([]);
  const current = useRef(null);
  const [tool, setTool] = useState("pen");

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokes.current.forEach((s) => {
      ctx.strokeStyle = s.tool === "eraser" ? "#fff" : "#1A1A6E";
      ctx.lineWidth = s.tool === "eraser" ? 22 : 3;
      ctx.beginPath();
      s.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    });
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.clientWidth * 2;
    c.height = 240 * 2;
    c.getContext("2d").scale(2, 2);
    redraw();
  }, [redraw, d.drawingMode]);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const start = (e) => { e.preventDefault(); drawing.current = true; current.current = { tool, pts: [pos(e)] }; strokes.current.push(current.current); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); current.current.pts.push(pos(e)); redraw(); };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    set({ drawingData: canvasRef.current.toDataURL("image/png") });
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set({ drawingData: r.result });
    r.readAsDataURL(f);
  };

  return (
    <>
      <h2 className="sl-h2">{B.h2}</h2>
      <p className="sl-hint">{B.hint}</p>

      <div className="sl-chips" style={{ marginBottom: 16 }}>
        {[["canvas", B.modeCanvas], ["upload", B.modeUpload], ["blank", B.modeBlank]].map(([id, t]) => (
          <button key={id} className={"sl-chip" + (d.drawingMode === id ? " on" : "")}
            onClick={() => set({ drawingMode: id, drawingData: id === "blank" ? null : d.drawingData })}>{t}</button>
        ))}
      </div>

      {d.drawingMode === "canvas" && (
        <>
          <canvas ref={canvasRef} className="sl-canvas" style={{ height: 240 }}
            onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={move} onTouchEnd={end} aria-label={B.canvasAria} />
          <div className="sl-tools">
            <button className={"sl-chip" + (tool === "pen" ? " on" : "")} onClick={() => setTool("pen")}>{B.toolPen}</button>
            <button className={"sl-chip" + (tool === "eraser" ? " on" : "")} onClick={() => setTool("eraser")}>{B.toolEraser}</button>
            <button className="sl-chip" onClick={() => { strokes.current.pop(); redraw(); set({ drawingData: canvasRef.current.toDataURL("image/png") }); }}>{B.undoBtn}</button>
            <button className="sl-chip" onClick={() => { strokes.current = []; redraw(); set({ drawingData: null }); }}>{B.clearBtn}</button>
          </div>
        </>
      )}

      {d.drawingMode === "upload" && (
        d.drawingData ? (
          <>
            <img className="sl-thumb" src={d.drawingData} alt="" />
            <div className="sl-tools">
              <button className="sl-chip" onClick={() => set({ drawingData: null })}>{B.deleteBtn}</button>
            </div>
          </>
        ) : (
          <div className="sl-drop">
            <p className="sl-p" style={{ fontSize: 15.5, marginBottom: 12 }}>{B.uploadHint}</p>
            <label className="sl-btn sm" style={{ display: "inline-block", cursor: "pointer" }}>
              {B.chooseBtn}
              <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            </label>
          </div>
        )
      )}

      {d.drawingMode === "blank" && (
        <div className="sl-note">{B.blankNote}</div>
      )}

      <div className="sl-note">{B.note}</div>

      <label className="sl-label" htmlFor="sl-dmsg">{B.msgLabel}</label>
      <textarea id="sl-dmsg" className="sl-area" style={{ minHeight: 100 }} value={d.parentMessage}
        onChange={(e) => set({ parentMessage: e.target.value })} placeholder={B.msgPh} />
    </>
  );
}