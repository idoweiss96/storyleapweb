import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Eraser, Printer, RotateCcw, Undo2 } from 'lucide-react';
import { CARD_STYLES } from '../shared/cardStyles';
import { PickerCard } from '../shared/ActivityCards';
import { BRUSHES, COLORS, EMOTIONS, UI } from './emotionDrawingContent';

// Fixed internal resolution: the canvas is always this many pixels regardless of
// how large it renders, so a drawing looks the same on a phone and in print.
const W = 1000;
const H = 700;
const ERASER = '#FFFFFF';

const STYLE = `
  .ed-wrap{width:100%}

  .ed-canvas{
    display:block;width:100%;height:auto;aspect-ratio:10/7;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:16px;
    box-shadow:0 4px 18px rgba(26,26,110,.10);
    touch-action:none;            /* let the child draw without scrolling the page */
    cursor:crosshair;
  }

  .ed-tools{display:flex;flex-direction:column;gap:14px;margin-top:18px}
  .ed-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
  .ed-row-label{font-size:12.5px;font-weight:600;color:rgba(26,26,46,.5);min-width:38px}

  .ed-swatch{
    width:34px;height:34px;border-radius:999px;cursor:pointer;
    border:2.5px solid #fff;box-shadow:0 0 0 1.5px #EDE9F8;
    transition:transform .15s, box-shadow .15s;
  }
  .ed-swatch:hover{transform:scale(1.08)}
  .ed-swatch[aria-pressed="true"]{box-shadow:0 0 0 2.5px #1A1A6E;transform:scale(1.12)}
  .ed-swatch:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .ed-brush{
    display:grid;place-items:center;width:38px;height:38px;border-radius:12px;
    background:#fff;border:1.5px solid #EDE9F8;cursor:pointer;transition:.15s;
  }
  .ed-brush span{display:block;border-radius:999px;background:#3f3f56}
  .ed-brush[aria-pressed="true"]{border-color:#FF6FB5;background:#FFF0F7}
  .ed-brush:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .ed-btn{
    display:inline-flex;align-items:center;gap:6px;
    font-family:inherit;font-size:14px;color:#475569;
    background:#fff;border:1.5px solid #EDE9F8;border-radius:999px;
    padding:9px 15px;cursor:pointer;transition:.15s;
  }
  .ed-btn:hover:not(:disabled){background:#f8fafc}
  .ed-btn:disabled{opacity:.45;cursor:not-allowed}
  .ed-btn[aria-pressed="true"]{border-color:#FF6FB5;background:#FFF0F7;color:#1A1A6E}
  .ed-btn:focus-visible{outline:2.5px solid #1A1A6E;outline-offset:3px}

  .ed-caption{display:none}

  @media print{
    .ed-canvas{box-shadow:none;border-color:#d8d8e4;break-inside:avoid}
    .ed-caption{
      display:block;text-align:center;font-size:15px;font-weight:600;
      color:#1A1A6E;margin-bottom:12px;
    }
  }
`;

export default function EmotionDrawing({ lang = 'he' }) {
  const copy = UI[lang] || UI.he;

  const [emotion, setEmotion] = useState(null);
  const [color, setColor] = useState(COLORS[0]);
  const [brush, setBrush] = useState(BRUSHES[1].id);
  const [erasing, setErasing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const canvasRef = useRef(null);
  // Strokes live in a ref, not in state: they change on every pointermove and
  // re-rendering React 60 times a second while drawing would stutter.
  const strokes = useRef([]);
  const current = useRef(null);

  const brushWidth = BRUSHES.find((b) => b.id === brush).width;
  const activeColor = erasing ? ERASER : color;
  // An eraser that matched the brush size would feel too fine to be useful.
  const activeWidth = erasing ? brushWidth * 2 : brushWidth;

  const ctx = () => canvasRef.current?.getContext('2d');

  const paintBackground = useCallback((context) => {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, W, H);
  }, []);

  const drawStroke = useCallback((context, stroke) => {
    if (stroke.points.length === 0) return;
    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    const [first, ...rest] = stroke.points;
    context.moveTo(first.x, first.y);
    if (rest.length === 0) {
      // A single tap still deserves a dot
      context.lineTo(first.x + 0.1, first.y);
    } else {
      rest.forEach((p) => context.lineTo(p.x, p.y));
    }
    context.stroke();
  }, []);

  const redraw = useCallback(() => {
    const context = ctx();
    if (!context) return;
    paintBackground(context);
    strokes.current.forEach((stroke) => drawStroke(context, stroke));
  }, [drawStroke, paintBackground]);

  // Give the canvas its white background once it exists, so print and eraser
  // both have something opaque to work against.
  useEffect(() => {
    if (emotion) redraw();
  }, [emotion, redraw]);

  const posFrom = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const handleDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = { color: activeColor, width: activeWidth, points: [posFrom(e)] };
    strokes.current = [...strokes.current, current.current];
    setStrokeCount(strokes.current.length);
    const context = ctx();
    if (context) drawStroke(context, current.current);
  };

  const handleMove = (e) => {
    if (!current.current) return;
    const point = posFrom(e);
    const points = current.current.points;
    const previous = points[points.length - 1];
    points.push(point);

    // Draw only the new segment; a full redraw on every move would crawl.
    const context = ctx();
    if (!context) return;
    context.strokeStyle = current.current.color;
    context.lineWidth = current.current.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const handleUp = () => {
    current.current = null;
  };

  const undo = () => {
    strokes.current = strokes.current.slice(0, -1);
    setStrokeCount(strokes.current.length);
    redraw();
  };

  const clear = () => {
    if (strokes.current.length > 0 && !window.confirm(copy.clearConfirm)) return;
    strokes.current = [];
    setStrokeCount(0);
    redraw();
  };

  const changeEmotion = () => {
    strokes.current = [];
    current.current = null;
    setStrokeCount(0);
    setEmotion(null);
  };

  if (!emotion) {
    return (
      <div className="ac-deck">
        <style>{CARD_STYLES}</style>
        <h2 className="text-center text-lg font-bold text-slate-700 mb-5">{copy.pickTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {EMOTIONS.map((item) => (
            <PickerCard
              key={item.id}
              emoji={item.emoji}
              label={(item[lang] || item.he).label}
              selected={false}
              onClick={() => setEmotion(item)}
            />
          ))}
        </div>
      </div>
    );
  }

  const text = emotion[lang] || emotion.he;

  return (
    <div className="ed-wrap">
      <style>{STYLE}</style>

      <p className="site-chrome text-center text-slate-600 mb-5 leading-relaxed">
        <span className="text-2xl align-middle me-2">{emotion.emoji}</span>
        {text.prompt}
      </p>

      <p className="ed-caption">
        {copy.drawingOf} {text.label} {emotion.emoji}
      </p>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="ed-canvas"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        aria-label={`${copy.drawingOf} ${text.label}`}
      />

      <div className="site-chrome ed-tools">
        <div className="ed-row">
          <span className="ed-row-label">{copy.colors}</span>
          {COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className="ed-swatch"
              style={{ background: swatch }}
              aria-pressed={!erasing && color === swatch}
              aria-label={swatch}
              onClick={() => {
                setColor(swatch);
                setErasing(false);
              }}
            />
          ))}
        </div>

        <div className="ed-row">
          <span className="ed-row-label">{copy.brush}</span>
          {BRUSHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className="ed-brush"
              aria-pressed={brush === b.id}
              aria-label={b.id}
              onClick={() => setBrush(b.id)}
            >
              <span style={{ width: b.width / 2 + 4, height: b.width / 2 + 4 }} />
            </button>
          ))}

          <button
            type="button"
            className="ed-btn"
            aria-pressed={erasing}
            onClick={() => setErasing((on) => !on)}
          >
            <Eraser className="w-4 h-4" />
            {copy.eraser}
          </button>
        </div>

        <div className="ed-row">
          <button type="button" className="ed-btn" onClick={undo} disabled={strokeCount === 0}>
            <Undo2 className="w-4 h-4" />
            {copy.undo}
          </button>
          <button type="button" className="ed-btn" onClick={clear} disabled={strokeCount === 0}>
            <RotateCcw className="w-4 h-4" />
            {copy.clear}
          </button>
          <button type="button" className="ed-btn" onClick={changeEmotion}>
            {copy.changeEmotion}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold shadow-lg active:scale-[.98] transition-transform ms-auto"
            style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
          >
            <Printer className="w-4 h-4" />
            {copy.print}
          </button>
        </div>
      </div>
    </div>
  );
}
