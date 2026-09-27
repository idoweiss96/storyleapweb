import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import PageMeta from '@/components/SEO/PageMeta';
import Critter from '@/components/games/shared/art/Critter';
import ActivityBackdrop from './ActivityBackdrop';
import { themeFor } from './activityThemes';

/**
 * ActivityShell — the page around every activity: a drawn banner where the
 * host character says what we are going to do, the activity itself on a
 * "stage" card, and the parent tip.
 *
 * Everything except the stage is `site-chrome`, so printing an activity still
 * prints only the activity (see Layout.jsx's @media print).
 */

const STYLE = `
  .as-banner{position:relative;overflow:hidden;border:2.5px solid #3A3357;border-radius:28px;min-height:190px;
    box-shadow:0 8px 0 rgba(58,51,87,.12);margin-bottom:22px}
  .as-bg{position:absolute;inset:0;width:100%;height:100%;display:block}
  .as-inner{position:relative;display:flex;align-items:flex-end;gap:12px;padding:18px 18px 16px;min-height:190px}
  .as-host{flex:0 0 auto;filter:drop-shadow(0 6px 8px rgba(26,26,110,.22));animation:as-bob 3.4s ease-in-out infinite}
  .as-talk{flex:1;display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding-bottom:6px}
  .as-title{margin:0;font-size:clamp(24px,5vw,36px);font-weight:900;color:#1A1A6E;line-height:1.1;
    background:rgba(255,255,255,.88);border-radius:14px;padding:4px 14px;border:2.4px solid #3A3357;box-shadow:0 3px 0 rgba(58,51,87,.18)}
  .as-bubble{position:relative;margin:0;background:#fff;border:2.4px solid #3A3357;border-radius:18px;padding:10px 14px;
    font-size:15.5px;line-height:1.5;color:#2a2a44;font-weight:600;max-width:460px;box-shadow:0 4px 0 rgba(58,51,87,.14)}
  .as-bubble::before{content:'';position:absolute;bottom:14px;inset-inline-start:-9px;width:14px;height:14px;background:#fff;
    border-bottom:2.4px solid #3A3357;border-inline-start:2.4px solid #3A3357;transform:rotate(45deg)}
  [dir="rtl"] .as-bubble::before{transform:rotate(-45deg)}
  .as-stage{position:relative;background:#fff;border:2.5px solid #3A3357;border-radius:28px;padding:22px 18px 26px;
    box-shadow:0 8px 0 rgba(58,51,87,.12)}
  .as-stage::before{content:'';position:absolute;top:0;inset-inline:26px;height:8px;border-radius:0 0 10px 10px;background:var(--as-color)}
  .as-tip{display:flex;gap:12px;align-items:flex-start;margin-top:22px;background:#FFF8EC;border:2.4px solid #F5C842;border-radius:20px;
    padding:12px 14px;color:#7A5000;font-size:14.5px;line-height:1.6}
  .as-tip-host{flex:0 0 auto;background:#fff;border:2.2px solid #F5C842;border-radius:999px;width:48px;height:48px;display:grid;place-items:center;overflow:hidden}
  @keyframes as-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @media (max-width:560px){
    .as-inner{padding:14px 12px 12px}
    .as-bubble{font-size:14.5px}
    .as-stage{padding:16px 10px 20px;border-radius:22px}
  }
  @media (prefers-reduced-motion:reduce){.as-host{animation:none}}
  @media print{
    .as-stage{border:0;box-shadow:none;padding:0}
    .as-stage::before{display:none}
  }
`;

export default function ActivityShell({ slug, copy, meta, isHe, wide = false, children }) {
  const theme = themeFor(slug);
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  return (
    <div className={`${wide ? 'max-w-3xl' : 'max-w-2xl'} mx-auto py-6 md:py-10`} style={{ '--as-color': theme.color }}>
      <style>{STYLE}</style>
      <PageMeta title={meta.title} description={meta.description} />

      <Link to="/activities" className="site-chrome inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <BackArrow className="w-4 h-4" />
        <span>{copy.back}</span>
      </Link>

      <header className="as-banner site-chrome">
        <ActivityBackdrop scene={theme.scene} id={`as-${slug}`} className="as-bg" />
        <div className="as-inner">
          <span className="as-host">
            <Critter species={theme.host} expression="happy" size={112} />
          </span>
          <div className="as-talk">
            <h1 className="as-title">{copy.title}</h1>
            <p className="as-bubble">{copy.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="as-stage">{children}</div>

      {copy.parentTip && (
        <aside className="as-tip site-chrome">
          <span className="as-tip-host" aria-hidden="true">
            <Critter species={theme.host} expression="happy" size={50} />
          </span>
          <p style={{ margin: 0 }}>
            <Lightbulb className="w-4 h-4 inline-block align-[-2px] me-1" />
            <strong className="font-semibold">{copy.parentTipLabel}: </strong>
            {copy.parentTip}
          </p>
        </aside>
      )}
    </div>
  );
}
