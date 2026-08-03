import React, { useEffect, useRef } from 'react';
import { attachEmailOptIn } from '@/lib/freeActivityEmailOptIn';
import { useLanguage } from '@/components/LanguageContext';
import { MORNING_EVENING_CONTENT } from '@/lib/morningEveningContent';

const LOGO_URL = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';

const STYLE = `
  .fa-me{}
  .fa-me *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  .fa-me{
    --royal:#1A1A6E;--charcoal:#1a1a2e;--cream:#FFF0F7;--blush:#FFD6EC;--peach:#FFF8EC;
    --lavender:#A89BE8;--sky:#EAF8FD;--mist:#FAFAFE;--line:#ede9f8;--line-strong:#F0E8F5;
    --shadow:0 4px 20px rgba(255,111,181,.08), 0 2px 10px rgba(79,195,232,.06);
    --grad:linear-gradient(135deg, #FF6FB5, #4FC3E8);
    --r-sm:14px;--r-md:20px;--r-lg:24px;--r-pill:999px;
    --body:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --display:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-family:var(--body);color:var(--charcoal);
    background:linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%);
    min-height:100vh;line-height:1.6;-webkit-font-smoothing:antialiased;font-size:16px;
    border-radius:24px;overflow:hidden;
  }
  .fa-me .wrap{max-width:640px;margin:0 auto;padding:20px 18px 56px}
  .fa-me .brandbar{display:flex;align-items:center;justify-content:center;padding:6px 0 18px}
  .fa-me .brandbar img{height:26px;width:auto;opacity:.9}
  .fa-me .progress{margin:0 0 18px}
  .fa-me .track{height:6px;border-radius:var(--r-pill);background:rgba(26,26,110,.09);overflow:hidden}
  .fa-me .fill{display:block;height:100%;border-radius:var(--r-pill);
      background:linear-gradient(90deg,var(--lavender),var(--sky),var(--royal));
      width:0;transition:width .4s cubic-bezier(.4,0,.2,1)}
  .fa-me .stepnum{font-size:13px;color:rgba(26,26,46,.55);margin-top:8px}
  .fa-me .card{background:rgba(255,255,255,.8);backdrop-filter:blur(6px);border:1px solid var(--line);
      border-radius:var(--r-lg);box-shadow:var(--shadow);padding:28px 22px 24px}
  .fa-me h1{font-family:var(--display);font-weight:700;font-size:29px;line-height:1.25;color:var(--royal);margin:0 0 10px}
  .fa-me h2{font-family:var(--display);font-weight:700;font-size:20px;color:var(--royal);margin:0}
  .fa-me .sub{font-size:15.5px;color:rgba(26,26,46,.62);margin:0 0 18px}
  .fa-me .kid-prompt{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;
      color:var(--royal);background:rgba(26,26,110,.06);border-radius:var(--r-pill);padding:6px 12px;margin-bottom:12px}
  .fa-me .hint{font-size:14px;color:rgba(26,26,46,.6);line-height:1.6}
  .fa-me .note{display:flex;gap:9px;align-items:flex-start;background:#FFF8EC;border:1.5px solid #F5C842;
      border-radius:var(--r-sm);padding:12px 14px;font-size:14px;color:#7A5000;margin:14px 0}
  .fa-me .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0 14px}
  @media (max-width:420px){.fa-me .grid{grid-template-columns:1fr}}
  .fa-me .opt{display:flex;align-items:center;gap:10px;width:100%;text-align:start;
      background:#fff;border:1.5px solid var(--line);border-radius:var(--r-sm);padding:13px 14px;
      cursor:pointer;transition:.16s;min-height:52px}
  .fa-me .opt:hover{border-color:var(--line-strong)}
  .fa-me .opt .ic{flex:0 0 20px;color:var(--royal);opacity:.75}
  .fa-me .opt .tick{flex:0 0 18px;height:18px;border-radius:999px;border:1.5px solid var(--line-strong);
      display:grid;place-items:center;color:#fff;opacity:0;background:var(--royal);margin-inline-start:auto}
  .fa-me .opt[aria-pressed="true"]{border-color:var(--royal);background:#FFD6EC}
  .fa-me .opt[aria-pressed="true"] .tick{opacity:1}
  .fa-me .count{font-size:13.5px;color:rgba(26,26,46,.55);margin:2px 0 16px}
  .fa-me .field{margin:0 0 16px}
  .fa-me .field span{display:block;font-size:14.5px;font-weight:500;margin-bottom:7px}
  .fa-me input[type=text],.fa-me input[type=time],.fa-me input[type=email]{
      width:100%;font-family:var(--body);font-size:16px;color:var(--charcoal);
      background:#fff;border:1.5px solid var(--line);border-radius:var(--r-sm);padding:12px 14px}
  .fa-me input:focus{border-color:var(--royal);outline:none}
  .fa-me .chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0}
  .fa-me .chip{font-size:13.5px;background:#fff;border:1.5px solid var(--line);border-radius:var(--r-pill);
      padding:8px 14px;cursor:pointer}
  .fa-me .chip[aria-pressed="true"]{background:var(--grad);border-color:transparent;color:#fff}
  .fa-me .list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
  .fa-me .item{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid var(--line);
      border-radius:var(--r-sm);padding:10px 12px}
  .fa-me .item .handle{cursor:grab;color:rgba(26,26,46,.35);flex:0 0 auto;background:none;border:0;padding:2px}
  .fa-me .item .num{flex:0 0 22px;height:22px;border-radius:999px;background:var(--sky);color:var(--royal);
      font-size:12px;font-weight:600;display:grid;place-items:center}
  .fa-me .item .ic{flex:0 0 auto;color:var(--royal);opacity:.7}
  .fa-me .item .nm{flex:1;font-size:15px}
  .fa-me .item .mini{background:none;border:0;color:rgba(26,26,46,.45);cursor:pointer;padding:4px}
  .fa-me .indep{background:#fff;border:1.5px solid var(--line);border-radius:var(--r-sm);padding:12px 14px;margin-bottom:8px}
  .fa-me .indep .head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .fa-me .indep .head .ic{color:var(--royal);opacity:.7}
  .fa-me .indep .head .nm{font-size:15px;font-weight:500}
  .fa-me .seg{display:flex;gap:6px;background:rgba(26,26,110,.05);border-radius:var(--r-pill);padding:4px}
  .fa-me .seg button{flex:1;font-size:13px;background:transparent;border:0;border-radius:var(--r-pill);
      padding:8px 6px;color:rgba(26,26,46,.65);display:flex;align-items:center;justify-content:center;gap:4px}
  .fa-me .seg button[aria-pressed="true"]{background:#fff;color:var(--royal);font-weight:500;box-shadow:0 2px 8px rgba(26,26,46,.08)}
  .fa-me .goalpick{display:flex;flex-wrap:wrap;gap:8px}
  .fa-me .goalpick button{display:flex;align-items:center;gap:6px;font-size:13.5px;background:#fff;
      border:1.5px solid var(--line);border-radius:var(--r-pill);padding:8px 13px}
  .fa-me .goalpick button[aria-pressed="true"]{border-color:var(--royal);background:var(--sky)}
  .fa-me .styles{display:flex;flex-direction:column;gap:10px}
  .fa-me .stylecard{display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid var(--line);
      border-radius:var(--r-sm);padding:12px 14px;text-align:start;width:100%}
  .fa-me .stylecard[aria-pressed="true"]{border-color:var(--royal);background:var(--sky)}
  .fa-me .stylecard .thumb{flex:0 0 52px;height:52px;border-radius:12px;overflow:hidden;background:#f4f4fb}
  .fa-me .stinfo{display:flex;flex-direction:column}
  .fa-me .sth{font-size:15px;font-weight:600}
  .fa-me .stp{font-size:12.5px;color:rgba(26,26,46,.55)}
  .fa-me .tick{margin-inline-start:auto;color:var(--royal);opacity:0}
  .fa-me .opt[aria-pressed="true"] .tick{opacity:1}
  .fa-me .nav{display:flex;gap:10px;margin-top:22px}
  .fa-me .btn{font-family:var(--body);font-size:15.5px;font-weight:500;border-radius:var(--r-pill);
      padding:13px 24px;cursor:pointer;border:1.5px solid transparent;min-height:48px}
  .fa-me .btn:not(.ghost):not(.small){background:var(--grad);color:#fff;flex:1;box-shadow:0 6px 18px rgba(255,111,181,.22)}
  .fa-me .btn.ghost{background:transparent;color:var(--royal);border-color:var(--line-strong)}
  .fa-me .btn.small{padding:9px 16px;font-size:14px;min-height:auto}
  .fa-me .btn.wide{width:100%}
  .fa-me .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--royal);
      color:#fff;padding:10px 18px;border-radius:var(--r-pill);font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:60}
  .fa-me .previewwrap{margin:10px 0 18px}
  .fa-me .board{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px 18px;margin-bottom:14px}
  .fa-me .board .bhead{text-align:center;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line)}
  .fa-me .btitle{font-family:var(--display);font-weight:700;font-size:21px;color:var(--royal);margin:0}
  .fa-me .bsub{font-size:12.5px;color:rgba(26,26,46,.55);margin-top:3px}
  .fa-me .sect{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:600;color:var(--royal);margin:14px 0 8px}
  .fa-me .brow{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid rgba(26,26,46,.06);font-size:14.5px}
  .fa-me .bbox{flex:0 0 16px;height:16px;border:1.5px solid rgba(26,26,46,.3);border-radius:4px}
  .fa-me .bnum{flex:0 0 18px;height:18px;border-radius:999px;background:var(--sky);color:var(--royal);
      font-size:10.5px;font-weight:600;display:grid;place-items:center}
  .fa-me .bic{flex:0 0 auto;color:var(--royal);opacity:.7}
  .fa-me .bnm{flex:1}
  .fa-me .bflag{font-size:11px;background:rgba(26,26,110,.08);color:var(--royal);border-radius:999px;padding:3px 8px}
  .fa-me .goal{display:flex;align-items:center;gap:7px;background:var(--sky);border-radius:12px;padding:8px 10px;margin-top:8px;font-size:13px}
  .fa-me .factchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .fa-me .factchip{font-size:11.5px;background:rgba(26,26,46,.045);border-radius:999px;padding:4px 9px}
  .fa-me .quote{font-family:var(--display);font-size:14.5px;color:var(--royal);margin-top:8px}
  .fa-me .bfoot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:10px;
      border-top:1px solid var(--line);font-size:11px;color:rgba(26,26,46,.4)}
  .fa-me .bfoot .lg{font-weight:700;color:var(--royal)}
  .fa-me .actions{display:flex;flex-wrap:wrap;gap:9px;margin:18px 0}
  .fa-me .actions .btn{flex:1 1 45%;min-width:130px;font-size:14.5px;padding:12px 16px}
  .fa-me .cta{margin-top:20px;border-radius:var(--r-lg);padding:22px;text-align:center;
      background:linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)}
  .fa-me .cta p{font-family:var(--display);font-weight:700;font-size:17px;color:var(--royal);margin:0 0 14px}
  .fa-me .cta .btn{background:var(--grad);color:#fff;display:inline-block;text-decoration:none;box-shadow:0 6px 18px rgba(255,111,181,.22)}
  .fa-me .optin-card{margin-top:16px}
  .fa-me .optin-card .hint{margin:0 0 10px}
  .fa-me .optin-form{display:flex;gap:8px;flex-wrap:wrap}
  .fa-me .optin-form input{flex:1;min-width:160px}
  .fa-me .linkbtn{background:none;border:0;color:rgba(26,26,46,.5);font-size:14px;cursor:pointer}
  .fa-me .transition{text-align:center;padding:16px 6px}
  .fa-me .transition .glyph{width:64px;height:64px;border-radius:999px;margin:0 auto 14px;
      background:var(--grad);display:grid;place-items:center;color:#fff}
  .fa-me[dir="rtl"] .opt{text-align:right}
  .fa-me[dir="ltr"] .opt{text-align:left}
  .fa-me[dir="rtl"] .stylecard{text-align:right}
  .fa-me[dir="ltr"] .stylecard{text-align:left}
  .fa-me[dir="rtl"] .board .quote{border-inline-end:3px solid var(--peach);padding-inline-start:0;padding-inline-end:12px}
  .fa-me[dir="ltr"] .board .quote{border-inline-start:3px solid var(--peach);padding-inline-start:12px;padding-inline-end:0}
  .fa-me #printRoot{display:none}
  @media (min-width:640px){
    .fa-me{font-size:17px}
    .fa-me .wrap{padding:32px 20px 64px}
    .fa-me .card{padding:36px 34px 30px}
    .fa-me h1{font-size:33px}
  }
  @media print{
    .fa-me, .fa-me *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    @page{size:A4;margin:12mm}
    .fa-me{background:#fff}
    .fa-me .app,.fa-me .toast{display:none !important}
    .fa-me #printRoot{display:block !important}
    .fa-me .board{border:1px solid rgba(26,26,46,.18) !important;border-radius:14px;padding:18px 20px;
      break-inside:avoid;page-break-inside:avoid;margin:0 0 12mm}
    .fa-me .board .brow{break-inside:avoid;page-break-inside:avoid;padding:7px 0}
    .fa-me .board .btitle{font-size:20px}
    .fa-me .board .sect{margin:14px 0 8px}
    .fa-me .pagebreak{break-after:page;page-break-after:always}
  }
`;

const BODY_HTML = `
<div class="wrap">
  <div class="brandbar app"><img src="${LOGO_URL}" alt="StoryLeap"></div>
  <div class="progress app" id="progress"><div class="track"><span class="fill" id="fill"></span></div><div class="stepnum" id="stepnum"></div></div>
  <div class="card app" id="stage"></div>
  <div class="nav app" id="navwrap"></div>
</div>
<div id="printRoot"></div>
`;

function buildScriptSrc(T, lang) {
  const D = {
    lang,
    MORNING: T.MORNING, EVENING: T.EVENING, COURAGE: T.COURAGE, CALMING: T.CALMING,
    STYLES: T.STYLES, FORMATS: T.FORMATS, INDEP: T.INDEP,
    intro: T.intro, name: T.name,
    pick: { ...T.pick, countLabelTpl: T.pick.countLabel('{{n}}') },
    order: T.order, indep: T.indep, mExtra: T.mExtra, bridge: T.bridge, eExtra: T.eExtra,
    style: T.style, format: T.format,
    result: { ...T.result, h1NameTpl: T.result.h1Name('{{n}}') },
    nav: T.nav, validate: T.validate,
    customAdder: { ...T.customAdder, hintMoreTpl: T.customAdder.hintMore('{{n}}') },
    sentenceOwn: T.sentenceOwn, factLabels: T.factLabels, goalPrefix: T.goalPrefix,
    board: {
      ...T.board,
      titleWithNameTpl: T.board.titleWithName('{{name}}'),
      morningTitleWithNameTpl: T.board.morningTitleWithName('{{name}}'),
      eveningTitleWithNameTpl: T.board.eveningTitleWithName('{{name}}'),
    },
    toast: T.toast,
    stepLabelTpl: T.stepLabel('{{n}}', '{{total}}'),
  };
  const dataJson = JSON.stringify(D);

  return `
(function(){
  "use strict";
  var D = ${dataJson};

  var P = {
    sun:'<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M3 12h2M19 12h2"/><circle cx="12" cy="12" r="4"/>',
    toilet:'<path d="M7 3h10v6H7zM6 9h12l-1 12H7z"/>',
    drop:'<path d="M12 3c3 4 6 7 6 11a6 6 0 1 1-12 0c0-4 3-7 6-11z"/>',
    tooth:'<path d="M8 3c2 0 2 2 4 2s2-2 4-2c2 0 3 2 3 5 0 4-1 6-2 11-1 3-3 3-3 0 0-3-1-4-2-4s-2 1-2 4c0 3-2 3-3 0-1-5-2-7-2-11 0-3 1-5 3-5z"/>',
    shirt:'<path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-4z"/>',
    comb:'<path d="M4 6h16M4 6v4M8 6v6M12 6v4M16 6v6M20 6v4"/>',
    bowl:'<path d="M4 11h16a8 6 0 0 1-16 0z"/><path d="M6 11c0-3 2-5 6-5s6 2 6 5"/>',
    sandwich:'<path d="M3 12l9-7 9 7"/><path d="M4 12h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>',
    lunchbox:'<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    bottle:'<path d="M10 2h4v3l2 2v13a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7l2-2z"/>',
    checklist:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10l1.5 1.5L12 9M8 15l1.5 1.5L12 14"/>',
    shoe:'<path d="M3 16c0-2 2-3 4-4l6-4 4 2c2 1 4 2 4 4v2H3z"/>',
    music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    speech:'<path d="M4 5h16v10H9l-4 4v-4H4z"/>',
    backpack:'<path d="M7 8a5 5 0 0 1 10 0v11H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9 13h6"/>',
    door:'<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="14" cy="12" r="1"/>',
    home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
    pencil:'<path d="M4 20l1-4 12-12 3 3-12 12z"/>',
    blocks:'<rect x="3" y="10" width="7" height="7"/><rect x="14" y="10" width="7" height="7"/><rect x="8" y="3" width="7" height="7"/>',
    people:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M10 20c0-3 3-5 6-5s6 2 6 5"/>',
    dinner:'<circle cx="12" cy="13" r="7"/><path d="M12 6V3M8 13h8"/>',
    shower:'<path d="M6 8a6 6 0 0 1 12 0"/><path d="M4 8h16M8 12v2M12 12v3M16 12v2"/>',
    pajama:'<path d="M8 3 4 6l2 3 2-1v12h8V8l2 1 2-3-4-3-2 2h-4z"/>',
    hanger:'<path d="M12 4a2 2 0 1 1 2 2l-2 1 9 6H3l9-6z"/><path d="M4 19h16"/>',
    box:'<path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v9l9 5 9-5V8"/>',
    screenoff:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 20h18M5 21v-1M19 21v-1M4 4l16 13"/>',
    book:'<path d="M4 5c3-1 6-1 8 0v14c-2-1-5-1-8 0z"/><path d="M20 5c-3-1-6-1-8 0v14c2-1 5-1 8 0z"/>',
    chat:'<path d="M4 5h16v10H10l-4 4v-4H4z"/>',
    heart:'<path d="M12 20 4.6 12.6a4.6 4.6 0 1 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 1 1 6.5 6.5z"/>',
    bed:'<path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7"/><path d="M3 15h18M3 18v2M21 18v2M7 8V6M12 8V6"/>',
    star:'<path d="M12 3l2.6 6 6.4.5-4.9 4.1 1.6 6.2L12 16.8 6.3 19.8l1.6-6.2L3 9.5l6.4-.5z"/>',
    self:'<circle cx="12" cy="7" r="3"/><path d="M6 20c0-3 2.5-5 6-5s6 2 6 5"/>',
    together:'<circle cx="8" cy="7" r="2.5"/><circle cx="16" cy="7" r="2.5"/><path d="M3 19c0-2.5 2-4 5-4s5 1.5 5 4M11 19c0-2.5 2-4 5-4s5 1.5 5 4"/>',
    learning:'<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    x:'<path d="M6 6l12 12M18 6L6 18"/>',
    grip:'<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
    up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
    down:'<path d="M12 5v14M5 12l7 7 7-7"/>',
    check:'<path d="M20 6L9 17l-5-5"/>',
    printer:'<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17v4h12v-4"/>',
    save:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h8V4M8 14h8v6H8z"/>',
    edit:'<path d="M4 20h4l10-10-4-4L4 16z"/>',
    refresh:'<path d="M20 12a8 8 0 1 1-3-6.3M20 4v5h-5"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    hand:'<path d="M8 13V6a1.5 1.5 0 1 1 3 0v6M11 12V4a1.5 1.5 0 1 1 3 0v8M14 12V6a1.5 1.5 0 1 1 3 0v7M8 12l-1.5-1a1.5 1.5 0 0 0-2 2l3 4a5 5 0 0 0 4 2h2a5 5 0 0 0 5-5v-2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  };
  function ic(id, size){
    size = size || 18;
    var d = P[id] || P.star;
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
  }

  var MORNING = D.MORNING, EVENING = D.EVENING, COURAGE = D.COURAGE, CALMING = D.CALMING,
      STYLES = D.STYLES, FORMATS = D.FORMATS, INDEP = D.INDEP;

  var KEY = "storyleap_routine_v1";
  function blank(){
    return {
      childName:"", selectedMorningActivities:[], selectedEveningActivities:[],
      morningOrder:[], eveningOrder:[], customMorning:[], customEvening:[],
      morningIndependenceStatus:{}, eveningIndependenceStatus:{},
      morningIndependenceGoal:"", eveningIndependenceGoal:"",
      morningStartTime:"", leavingTime:"", morningSong:"", morningSentence:"",
      eveningStartTime:"", bedtime:"", calmingActivity:"", bedtimeSentence:"",
      selectedVisualStyle:"soft", selectedOutputFormats:["poster"], step:0
    };
  }
  var S = blank();
  try{
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if(saved && typeof saved === "object") S = Object.assign(blank(), saved);
  }catch(e){}

  function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(ch){
    return ({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"})[ch]; }); }

  function allMorning(){ return MORNING.concat(S.customMorning); }
  function allEvening(){ return EVENING.concat(S.customEvening); }
  function findAct(id){
    var all = allMorning().concat(allEvening());
    for(var i=0;i<all.length;i++){ if(all[i].id === id) return all[i]; }
    return { id:id, t:id, i:"star" };
  }
  function kid(){ return S.childName.trim(); }

  var toastTimer = null;
  function toast(msg){
    var t = document.querySelector(".fa-me .toast");
    if(t) t.remove();
    var d = document.createElement("div");
    d.className = "toast";
    d.textContent = msg;
    document.querySelector(".fa-me").appendChild(d);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ d.remove(); }, 3200);
  }

  var STEPS = ["intro","name","mPick","mOrder","mIndep","mExtra","bridge","ePick","eOrder","eIndep","eExtra","style","format","result"];
  var BUILD_STEPS = STEPS.length - 2;

  function optionGrid(list, selectedIds, actName){
    return '<div class="grid">' + list.map(function(a){
      var on = selectedIds.indexOf(a.id) > -1;
      return '<button type="button" class="opt" aria-pressed="'+on+'" data-act="'+actName+'" data-id="'+a.id+'">'+
        '<span class="ic">'+ic(a.i)+'</span><span>'+esc(a.t)+'</span><span class="tick">'+ic('check',14)+'</span></button>';
    }).join('') + '</div>';
  }

  function customAdder(kind, items, max){
    var left = max - items.length;
    var html = '<div class="card" style="margin-top:16px">'+
      '<label class="field" style="margin-bottom:10px"><span>'+D.customAdder.title+'</span>'+
      '<input type="text" id="customInput" maxlength="34" placeholder="'+D.customAdder.ph+'" '+(left<=0?'disabled':'')+'></label>'+
      '<button type="button" class="btn small" data-act="addCustom" data-kind="'+kind+'" '+(left<=0?'disabled':'')+'>'+
      ic('plus')+' '+D.customAdder.addBtn+'</button>'+
      '<div class="hint" style="margin-top:8px">'+(left>0? D.customAdder.hintMoreTpl.replace('{{n}}', left) : D.customAdder.hintMax)+'</div>';
    if(items.length){
      html += '<div class="chips" style="margin-top:12px">'+items.map(function(a){
        return '<span class="chip" style="cursor:default">'+esc(a.t)+
          ' <button type="button" class="mini" aria-label="'+D.customAdder.deleteAria+esc(a.t)+'" data-act="delCustom" data-kind="'+kind+'" data-id="'+a.id+'" style="background:none;border:0;cursor:pointer;padding:2px;vertical-align:middle;color:inherit">'+ic('x')+'</button></span>';
      }).join('')+'</div>';
    }
    return html + '</div>';
  }

  function orderList(orderIds, kindKey){
    if(!orderIds.length) return '<div class="card">'+D.order.empty+'</div>';
    return '<ul class="list" id="dragList" data-kind="'+kindKey+'">' + orderIds.map(function(id,idx){
      var a = findAct(id);
      return '<li class="item" data-id="'+id+'" data-idx="'+idx+'">'+
        '<button type="button" class="handle" aria-label="'+D.order.dragAria+esc(a.t)+'" data-drag="1">'+ic('grip')+'</button>'+
        '<span class="num">'+(idx+1)+'</span>'+
        '<span class="ic">'+ic(a.i)+'</span>'+
        '<span class="nm">'+esc(a.t)+'</span>'+
        '<button type="button" class="mini" aria-label="'+D.order.upAria+'" data-act="moveUp" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('up')+'</button>'+
        '<button type="button" class="mini" aria-label="'+D.order.downAria+'" data-act="moveDown" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('down')+'</button>'+
        '<button type="button" class="mini" aria-label="'+D.order.removeAria+esc(a.t)+'" data-act="removeAct" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('x')+'</button>'+
      '</li>';
    }).join('') + '</ul>';
  }

  function indepBlock(orderIds, statusObj, goalId, kindKey){
    var rows = orderIds.map(function(id){
      var a = findAct(id), cur = statusObj[id] || '';
      return '<div class="indep"><div class="head"><span class="ic">'+ic(a.i)+'</span><span class="nm">'+esc(a.t)+'</span></div>'+
        '<div class="seg" role="group" aria-label="'+esc(a.t)+'">'+ INDEP.map(function(o){
          return '<button type="button" aria-pressed="'+(cur===o.id)+'" data-act="setIndep" data-kind="'+kindKey+'" data-id="'+id+'" data-val="'+o.id+'">'+ic(o.i)+esc(o.t)+'</button>';
        }).join('') +'</div></div>';
    }).join('');
    var goals = '<div class="goalpick">'+ orderIds.map(function(id){
      var a=findAct(id);
      return '<button type="button" aria-pressed="'+(goalId===id)+'" data-act="setGoal" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('star')+esc(a.t)+'</button>';
    }).join('') +'</div>';
    return rows + '<div class="card" style="margin-top:6px"><h2 style="font-size:20px">'+D.indep.goalTitle+'</h2>'+
      '<p class="hint" style="margin:0 0 12px">'+D.indep.goalHint+'</p>'+ goals +'</div>';
  }

  function sentenceChips(options, current, actName){
    var isCustom = current && options.indexOf(current) === -1;
    return '<div class="chips">'+ options.map(function(t){
        return '<button type="button" class="chip" aria-pressed="'+(current===t)+'" data-act="'+actName+'" data-val="'+esc(t)+'">'+esc(t)+'</button>';
      }).join('') +
      '<button type="button" class="chip" aria-pressed="'+(isCustom?'true':'false')+'" data-act="'+actName+'" data-val="">'+D.sentenceOwn+'</button></div>';
  }

  var R = {};

  R.intro = function(){
    return '<section class="hero">'+
      '<h1>'+D.intro.h1+'</h1>'+
      '<p class="sub" style="font-size:16.5px;color:rgba(26,26,46,.82)">'+D.intro.lede+'</p>'+
      '<div class="chips">'+
        '<span class="chip" style="cursor:default" aria-pressed="false">'+ic('clock',14)+' '+D.intro.band[0]+'</span>'+
        '<span class="chip" style="cursor:default" aria-pressed="false">'+ic('people',14)+' '+D.intro.band[1]+'</span>'+
        '<span class="chip" style="cursor:default" aria-pressed="false">'+ic('printer',14)+' '+D.intro.band[2]+'</span>'+
      '</div>'+
      '<div class="note">'+ic('info')+'<span>'+D.intro.note+'</span></div>'+
    '</section>'+
    '<div class="card" style="margin-top:14px"><h2 style="font-size:19px">'+D.intro.card2Title+'</h2>'+
     '<p class="hint" style="margin:8px 0 0">'+D.intro.card2Text+'</p></div>';
  };

  R.name = function(){
    return '<h1>'+D.name.h1+'</h1>'+
      '<p class="sub">'+D.name.sub+'</p>'+
      '<div class="card"><label class="field"><span>'+D.name.label+'</span>'+
      '<input type="text" id="nameInput" maxlength="20" autocomplete="off" value="'+esc(S.childName)+'" placeholder="'+D.name.ph+'"></label>'+
      '<div class="hint">'+D.name.hint+'</div></div>';
  };

  R.mPick = function(){
    var n = S.selectedMorningActivities.length;
    return '<span class="kid-prompt">'+ic('hand')+D.pick.kidPrompt+'</span>'+
      '<h1>'+D.pick.morningH1+'</h1>'+
      '<p class="sub">'+D.pick.sub+'</p>'+
      optionGrid(allMorning(), S.selectedMorningActivities, 'toggleM') +
      '<div class="count">'+D.pick.countLabelTpl.replace('{{n}}', n)+(n<3?D.pick.countLow:(n>10?D.pick.countHigh:''))+'</div>'+
      customAdder('m', S.customMorning, 3);
  };

  R.mOrder = function(){
    return '<h1>'+D.order.morningH1+'</h1>'+
      '<p class="sub">'+D.order.morningSub+'</p>'+
      '<span class="kid-prompt">'+ic('info')+D.order.kidPrompt+'</span>'+
      orderList(S.morningOrder,'m')+
      '<div style="margin-top:14px"><button type="button" class="btn ghost small" data-act="backToPick" data-kind="m">'+ic('plus')+' '+D.order.addBtn+'</button></div>';
  };

  R.mIndep = function(){
    return '<h1>'+D.indep.morningH1+'</h1>'+
      '<p class="sub">'+D.indep.morningSub+'</p>'+
      '<span class="kid-prompt">'+ic('hand')+D.indep.kidPrompt+'</span>'+
      indepBlock(S.morningOrder, S.morningIndependenceStatus, S.morningIndependenceGoal, 'm');
  };

  R.mExtra = function(){
    return '<h1>'+D.mExtra.h1+'</h1>'+
      '<p class="sub">'+D.mExtra.sub+'</p>'+
      '<div class="card">'+
        '<label class="field"><span>'+D.mExtra.startLabel+'</span><input type="time" id="mStart" value="'+esc(S.morningStartTime)+'"></label>'+
        '<label class="field"><span>'+D.mExtra.leaveLabel+'</span><input type="time" id="mLeave" value="'+esc(S.leavingTime)+'"></label>'+
        '<label class="field" style="margin-bottom:0"><span>'+D.mExtra.songLabel+'</span><input type="text" id="mSong" maxlength="40" value="'+esc(S.morningSong)+'" placeholder="'+D.mExtra.songPh+'"></label>'+
      '</div>'+
      '<div class="card" style="margin-top:14px"><span style="display:block;font-weight:500;margin-bottom:9px">'+D.mExtra.sentenceTitle+'</span>'+
        sentenceChips(COURAGE, S.morningSentence, 'setMSentence')+
        '<input type="text" id="mSentence" maxlength="70" style="margin-top:12px" value="'+esc(S.morningSentence)+'" placeholder="'+D.mExtra.sentencePh+'">'+
      '</div>';
  };

  R.bridge = function(){
    return '<section class="transition">'+
      '<div class="glyph">'+ic('sun',26)+'</div>'+
      '<h1 style="font-size:24px">'+D.bridge.h1+'</h1>'+
      '<p style="margin:0;font-size:15.5px;color:rgba(26,26,46,.8)">'+D.bridge.text+'</p>'+
    '</section>'+
    '<div class="card" style="margin-top:16px"><h2 style="font-size:18px">'+D.bridge.cardTitle+'</h2>'+
    '<p class="hint" style="margin:8px 0 0">'+D.bridge.cardText+'</p></div>';
  };

  R.ePick = function(){
    var n = S.selectedEveningActivities.length;
    return '<span class="kid-prompt">'+ic('hand')+D.pick.kidPrompt+'</span>'+
      '<h1>'+D.pick.eveningH1+'</h1>'+
      '<p class="sub">'+D.pick.sub+'</p>'+
      optionGrid(allEvening(), S.selectedEveningActivities, 'toggleE') +
      '<div class="count">'+D.pick.countLabelTpl.replace('{{n}}', n)+(n<3?D.pick.countLow:(n>10?D.pick.countHigh:''))+'</div>'+
      customAdder('e', S.customEvening, 3);
  };

  R.eOrder = function(){
    return '<h1>'+D.order.eveningH1+'</h1>'+
      '<p class="sub">'+D.order.eveningSub+'</p>'+
      orderList(S.eveningOrder,'e')+
      '<div style="margin-top:14px"><button type="button" class="btn ghost small" data-act="backToPick" data-kind="e">'+ic('plus')+' '+D.order.addBtn+'</button></div>';
  };

  R.eIndep = function(){
    return '<h1>'+D.indep.eveningH1+'</h1>'+
      '<p class="sub">'+D.indep.eveningSub+'</p>'+
      '<span class="kid-prompt">'+ic('hand')+D.indep.kidPrompt+'</span>'+
      indepBlock(S.eveningOrder, S.eveningIndependenceStatus, S.eveningIndependenceGoal, 'e');
  };

  R.eExtra = function(){
    return '<h1>'+D.eExtra.h1+'</h1>'+
      '<p class="sub">'+D.eExtra.sub+'</p>'+
      '<div class="card">'+
        '<label class="field"><span>'+D.eExtra.startLabel+'</span><input type="time" id="eStart" value="'+esc(S.eveningStartTime)+'"></label>'+
        '<label class="field" style="margin-bottom:0"><span>'+D.eExtra.bedLabel+'</span><input type="time" id="eBed" value="'+esc(S.bedtime)+'"></label>'+
      '</div>'+
      '<div class="card" style="margin-top:14px"><span style="display:block;font-weight:500;margin-bottom:9px">'+D.eExtra.calmTitle+'</span>'+
        sentenceChips(CALMING, S.calmingActivity, 'setCalm')+
        '<input type="text" id="eCalm" maxlength="40" style="margin-top:12px" value="'+esc(S.calmingActivity)+'" placeholder="'+D.eExtra.calmPh+'">'+
      '</div>'+
      '<div class="card" style="margin-top:14px"><label class="field" style="margin-bottom:0"><span>'+D.eExtra.sentenceLabel+'</span>'+
        '<input type="text" id="eSentence" maxlength="70" value="'+esc(S.bedtimeSentence)+'" placeholder="'+D.eExtra.sentencePh+'"></label></div>';
  };

  function thumb(id){
    if(id === 'soft') return '<div class="thumb" style="background:linear-gradient(135deg,#FFD6EC,#EAF8FD)"></div>';
    if(id === 'quiet') return '<div class="thumb" style="background:#fff;border:1px solid rgba(26,26,46,.14)"></div>';
    return '<div class="thumb" style="background:#1A1A6E"></div>';
  }

  R.style = function(){
    return '<span class="kid-prompt">'+ic('hand')+D.style.kidPrompt+'</span>'+
      '<h1>'+D.style.h1+'</h1>'+
      '<p class="sub">'+D.style.sub+'</p>'+
      '<div class="styles">'+ STYLES.map(function(st){
        return '<button type="button" class="stylecard" aria-pressed="'+(S.selectedVisualStyle===st.id)+'" data-act="setStyle" data-id="'+st.id+'">'+
          thumb(st.id)+
          '<span class="stinfo"><span class="sth">'+esc(st.name)+'</span><span class="stp">'+esc(st.desc)+'</span></span>'+
          '<span class="tick" style="margin-inline-start:auto">'+ic('check',16)+'</span>'+
        '</button>';
      }).join('') +'</div>';
  };

  R.format = function(){
    return '<h1>'+D.format.h1+'</h1>'+
      '<p class="sub">'+D.format.sub+'</p>'+
      '<div style="display:flex;flex-direction:column;gap:10px">'+ FORMATS.map(function(f){
        var on = S.selectedOutputFormats.indexOf(f.id)>-1;
        return '<button type="button" class="opt" style="min-height:66px;align-items:flex-start;padding:14px" aria-pressed="'+on+'" data-act="toggleFormat" data-id="'+f.id+'">'+
          '<span class="ic" style="margin-top:2px">'+ic(f.id==='checklist'?'checklist':(f.id==='poster'?'star':(f.id==='separate'?'book':'repeat')))+'</span>'+
          '<span style="flex:1"><span style="display:block;font-weight:600">'+esc(f.name)+'</span>'+
          '<span style="display:block;font-size:13px;color:rgba(26,26,46,.62);line-height:1.4">'+esc(f.desc)+'</span></span>'+
          '<span class="tick" style="margin-top:2px">'+ic('check',16)+'</span></button>';
      }).join('') +'</div>'+
      '<div class="card" style="margin-top:14px"><p class="hint" style="margin:0">'+D.format.hint+'</p></div>';
  };

  function rowsHtml(orderIds, statusObj, goalId, checks){
    return orderIds.map(function(id,idx){
      var a = findAct(id), st = statusObj[id];
      var flag = st==='self' ? D.indep.flagAlone : (st==='together' ? D.indep.flagTogether : (st==='learning' ? D.indep.flagLearning : ''));
      var isGoal = (id===goalId);
      return '<div class="brow">'+
        (checks ? '<span class="bbox"></span>' : '')+
        '<span class="bnum">'+(idx+1)+'</span>'+
        '<span class="bic">'+ic(a.i,15)+'</span>'+
        '<span class="bnm">'+esc(a.t)+'</span>'+
        (isGoal ? '<span class="bflag" style="background:var(--lavender);color:#fff">'+D.indep.flagGoal+'</span>' : '')+
        (flag ? '<span class="bflag">'+flag+'</span>' : '')+
      '</div>';
    }).join('');
  }

  function factChips(pairs){
    var items = pairs.filter(function(p){ return p[1]; });
    if(!items.length) return '';
    return '<div class="factchips">'+ items.map(function(p){
      return '<span class="factchip">'+esc(p[0])+': '+esc(p[1])+'</span>';
    }).join('') +'</div>';
  }

  function fmtTime(t){ return t || ''; }

  function morningSection(checks){
    var goal = S.morningIndependenceGoal ? findAct(S.morningIndependenceGoal).t : '';
    return '<h3 class="sect">'+ic('sun',16)+D.board.sectionMorning+'</h3>'+
      rowsHtml(S.morningOrder, S.morningIndependenceStatus, S.morningIndependenceGoal, checks)+
      (goal ? '<div class="goal">'+ic('star',15)+'<span><b>'+D.goalPrefix.morning+'</b> '+esc(goal)+'</span></div>' : '')+
      factChips([[D.factLabels.morning[0], fmtTime(S.morningStartTime)],[D.factLabels.morning[1], fmtTime(S.leavingTime)],[D.factLabels.morning[2], S.morningSong]])+
      (S.morningSentence ? '<div class="quote">'+esc(S.morningSentence)+'</div>' : '');
  }

  function eveningSection(checks){
    var goal = S.eveningIndependenceGoal ? findAct(S.eveningIndependenceGoal).t : '';
    return '<h3 class="sect">'+ic('moon' in P ? 'moon' : 'star',16)+D.board.sectionEvening+'</h3>'+
      rowsHtml(S.eveningOrder, S.eveningIndependenceStatus, S.eveningIndependenceGoal, checks)+
      (goal ? '<div class="goal">'+ic('star',15)+'<span><b>'+D.goalPrefix.evening+'</b> '+esc(goal)+'</span></div>' : '')+
      factChips([[D.factLabels.evening[0], fmtTime(S.eveningStartTime)],[D.factLabels.evening[1], fmtTime(S.bedtime)],[D.factLabels.evening[2], S.calmingActivity]])+
      (S.bedtimeSentence ? '<div class="quote">'+esc(S.bedtimeSentence)+'</div>' : '');
  }

  function boardShell(title, sub, inner){
    return '<article class="board"><div class="bhead"><h2 class="btitle">'+esc(title)+'</h2>'+
      (sub ? '<p class="bsub">'+esc(sub)+'</p>' : '')+'</div>'+ inner +
      '<div class="bfoot"><span class="lg">StoryLeap</span><span>'+D.board.footTagline+'</span></div></article>';
  }

  function boardTitle(){
    return kid() ? D.board.titleWithNameTpl.replace('{{name}}', kid()) : D.board.titleDefault;
  }

  function buildBoards(){
    var f = S.selectedOutputFormats;
    var versions = [];
    if(f.indexOf('poster')>-1) versions.push(false);
    if(f.indexOf('checklist')>-1) versions.push(true);
    if(!versions.length) versions = [false];
    var layouts = [];
    if(f.indexOf('combined')>-1) layouts.push('combined');
    if(f.indexOf('separate')>-1) layouts.push('separate');
    if(!layouts.length) layouts = ['combined'];

    var docs = [];
    versions.forEach(function(checks){
      layouts.forEach(function(layout){
        var sub = checks ? D.board.subChecklist : D.board.subPoster;
        if(layout==='combined'){
          docs.push(boardShell(boardTitle(), sub, morningSection(checks)+eveningSection(checks)));
        } else {
          docs.push(boardShell(kid()? D.board.morningTitleWithNameTpl.replace('{{name}}', kid()) : D.board.morningTitleDefault, sub, morningSection(checks)));
          docs.push(boardShell(kid()? D.board.eveningTitleWithNameTpl.replace('{{name}}', kid()) : D.board.eveningTitleDefault, sub, eveningSection(checks)));
        }
      });
    });
    return docs.join('<div class="pagebreak"></div>');
  }

  function syncPrintRoot(){
    var pr = el('printRoot');
    pr.className = 'style-'+S.selectedVisualStyle;
    pr.innerHTML = buildBoards();
  }

  R.result = function(){
    syncPrintRoot();
    return '<h1>'+ (kid()? D.result.h1NameTpl.replace('{{n}}', esc(kid())) : D.result.h1Default) +'</h1>'+
      '<p class="sub">'+D.result.sub+'</p>'+
      '<div class="previewwrap style-'+S.selectedVisualStyle+'" id="preview">'+ buildBoards() +'</div>'+
      '<div class="actions">'+
        '<button type="button" class="btn" data-act="print">'+ic('printer')+' '+D.result.btnPrint+'</button>'+
        '<button type="button" class="btn ghost" data-act="savefile">'+ic('save')+' '+D.result.btnSave+'</button>'+
        '<button type="button" class="btn ghost" data-act="edit">'+ic('edit')+' '+D.result.btnEdit+'</button>'+
        '<button type="button" class="btn ghost" data-act="restart">'+ic('refresh')+' '+D.result.btnRestart+'</button>'+
      '</div>'+
      '<div class="card"><h2 style="font-size:18px">'+D.result.howtoTitle+'</h2>'+
        '<p class="hint" style="margin:8px 0 0">'+D.result.howtoText+'</p></div>'+
      '<div class="cta">'+
        '<p>'+D.result.ctaText+'</p>'+
        '<a class="btn" href="/CreateStory">'+D.result.ctaLink+'</a>'+
      '</div>'+
      '<div class="card optin-card" data-fa-optin>'+
        '<div data-fa-optin-body>'+
          '<p class="hint">'+D.result.optinHint+'</p>'+
          '<form class="optin-form" data-fa-optin-form>'+
            '<input type="email" data-fa-optin-email placeholder="'+ (D.result.optinPh||'') +'">'+
            '<button type="submit" class="btn small">'+D.result.optinSubmit+'</button>'+
          '</form>'+
          '<button type="button" data-fa-optin-skip class="linkbtn" style="display:block;margin-top:8px">'+D.result.optinSkip+'</button>'+
        '</div>'+
        '<p data-fa-optin-thanks style="display:none;margin:0;font-size:15px;color:rgba(26,26,46,.75)">'+D.result.optinThanks+'</p>'+
      '</div>';
  };

  function navFor(key){
    if(key==='intro'){
      var resume = (S.childName || S.morningOrder.length) ? true : false;
      return '<button type="button" class="btn wide" data-act="next">'+(resume?D.intro.resumeBtn:D.intro.startBtn)+'</button>'+
        (resume ? '<button type="button" class="btn ghost small" data-act="restart" style="flex:0 0 auto">'+D.intro.restartSmall+'</button>' : '');
    }
    if(key==='result'){
      return '<button type="button" class="btn ghost" data-act="back">'+D.nav.resultBack+'</button>'+
             '<button type="button" class="btn" data-act="print">'+ic('printer')+' '+D.result.btnPrint+'</button>';
    }
    var nextLabel = key==='bridge' ? D.nav.bridgeNext : (key==='format' ? D.nav.formatNext : D.nav.next);
    return '<button type="button" class="btn ghost" data-act="back">'+D.nav.back+'</button>'+
           '<button type="button" class="btn" data-act="next">'+nextLabel+'</button>';
  }

  function validate(key){
    if(key==='name' && !S.childName.trim()) return D.validate.name;
    if(key==='mPick' && S.selectedMorningActivities.length < 3) return D.validate.mPick;
    if(key==='ePick' && S.selectedEveningActivities.length < 3) return D.validate.ePick;
    if(key==='format' && !S.selectedOutputFormats.length) return D.validate.format;
    return '';
  }

  function render(){
    var key = STEPS[S.step];
    el('stage').innerHTML = R[key]();
    el('navwrap').innerHTML = navFor(key);
    var isEnds = (key==='intro' || key==='result');
    el('progress').style.display = isEnds ? 'none' : 'block';
    if(!isEnds){
      var shown = S.step;
      var pct = Math.round((shown/(BUILD_STEPS))*100);
      el('fill').style.width = pct+'%';
      el('stepnum').textContent = D.stepLabelTpl.replace('{{n}}', shown).replace('{{total}}', BUILD_STEPS);
    }
    window.scrollTo({top:0, behavior:'smooth'});
    attachDrag();
  }

  function go(step){ S.step = step; persist(); render(); }

  function toggleActivity(kindArrKey, id){
    var arr = S[kindArrKey];
    var i = arr.indexOf(id);
    if(i>-1) arr.splice(i,1); else arr.push(id);
  }

  function removeActivity(kind, id){
    if(kind==='m'){
      var i = S.selectedMorningActivities.indexOf(id); if(i>-1) S.selectedMorningActivities.splice(i,1);
      var j = S.morningOrder.indexOf(id); if(j>-1) S.morningOrder.splice(j,1);
      delete S.morningIndependenceStatus[id];
      if(S.morningIndependenceGoal===id) S.morningIndependenceGoal='';
      S.customMorning = S.customMorning.filter(function(a){ return a.id!==id; });
    } else {
      var i2 = S.selectedEveningActivities.indexOf(id); if(i2>-1) S.selectedEveningActivities.splice(i2,1);
      var j2 = S.eveningOrder.indexOf(id); if(j2>-1) S.eveningOrder.splice(j2,1);
      delete S.eveningIndependenceStatus[id];
      if(S.eveningIndependenceGoal===id) S.eveningIndependenceGoal='';
      S.customEvening = S.customEvening.filter(function(a){ return a.id!==id; });
    }
  }

  function moveInOrder(kind, id, dir){
    var arr = kind==='m' ? S.morningOrder : S.eveningOrder;
    var i = arr.indexOf(id);
    var j = i + dir;
    if(i<0 || j<0 || j>=arr.length) return;
    var tmp = arr[i]; arr[i]=arr[j]; arr[j]=tmp;
  }

  var confirmReset = false;

  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-act]');
    if(!b) return;
    var act = b.getAttribute('data-act');

    if(act === 'next'){
      var key = STEPS[S.step];
      var err = validate(key);
      if(err){ toast(err); return; }
      if(key==='mPick'){ S.morningOrder = S.selectedMorningActivities.slice(); }
      if(key==='ePick'){ S.eveningOrder = S.selectedEveningActivities.slice(); }
      go(Math.min(S.step+1, STEPS.length-1));
      return;
    }
    if(act === 'back'){ go(Math.max(S.step-1, 0)); return; }
    if(act === 'backToPick'){
      var kind = b.getAttribute('data-kind');
      go(kind==='m' ? STEPS.indexOf('mPick') : STEPS.indexOf('ePick'));
      return;
    }

    if(act === 'toggleM'){ toggleActivity('selectedMorningActivities', b.getAttribute('data-id')); persist(); render(); return; }
    if(act === 'toggleE'){ toggleActivity('selectedEveningActivities', b.getAttribute('data-id')); persist(); render(); return; }

    if(act === 'addCustom'){
      var kind2 = b.getAttribute('data-kind');
      var input = el('customInput');
      var val = input.value.trim();
      if(!val) return;
      var arr = kind2==='m' ? S.customMorning : S.customEvening;
      if(arr.length >= 3) return;
      var id = (kind2==='m'?'cm_':'ce_') + Date.now();
      arr.push({id:id, t:val, i:'star'});
      if(kind2==='m'){ S.selectedMorningActivities.push(id); } else { S.selectedEveningActivities.push(id); }
      persist(); render();
      return;
    }
    if(act === 'delCustom'){
      var kind3 = b.getAttribute('data-kind'), id3 = b.getAttribute('data-id');
      removeActivity(kind3, id3);
      persist(); render();
      return;
    }
    if(act === 'removeAct'){
      removeActivity(b.getAttribute('data-kind'), b.getAttribute('data-id'));
      persist(); render();
      return;
    }
    if(act === 'moveUp'){ moveInOrder(b.getAttribute('data-kind'), b.getAttribute('data-id'), -1); persist(); render(); return; }
    if(act === 'moveDown'){ moveInOrder(b.getAttribute('data-kind'), b.getAttribute('data-id'), 1); persist(); render(); return; }

    if(act === 'setIndep'){
      var kind4=b.getAttribute('data-kind'), id4=b.getAttribute('data-id'), val4=b.getAttribute('data-val');
      var obj = kind4==='m' ? S.morningIndependenceStatus : S.eveningIndependenceStatus;
      obj[id4] = val4;
      persist(); render();
      return;
    }
    if(act === 'setGoal'){
      var kind5=b.getAttribute('data-kind'), id5=b.getAttribute('data-id');
      if(kind5==='m') S.morningIndependenceGoal = id5; else S.eveningIndependenceGoal = id5;
      persist(); render();
      return;
    }

    if(act === 'setMSentence'){ S.morningSentence = b.getAttribute('data-val'); persist(); render(); return; }
    if(act === 'setCalm'){ S.calmingActivity = b.getAttribute('data-val'); persist(); render(); return; }

    if(act === 'setStyle'){ S.selectedVisualStyle = b.getAttribute('data-id'); persist(); render(); return; }
    if(act === 'toggleFormat'){
      var fid = b.getAttribute('data-id');
      var idx = S.selectedOutputFormats.indexOf(fid);
      if(idx>-1) S.selectedOutputFormats.splice(idx,1); else S.selectedOutputFormats.push(fid);
      persist(); render();
      return;
    }

    if(act === 'print'){ syncPrintRoot(); window.print(); return; }
    if(act === 'savefile'){
      syncPrintRoot();
      toast(D.toast.savefile);
      setTimeout(function(){ window.print(); }, 700);
      return;
    }
    if(act === 'edit'){ go(2); return; }
    if(act === 'restart'){
      if(!confirmReset){
        confirmReset = true;
        toast(D.toast.restartConfirm);
        setTimeout(function(){ confirmReset=false; }, 4500);
        return;
      }
      confirmReset = false;
      S = blank();
      persist(); render();
      return;
    }
  });

  document.addEventListener('input', function(e){
    var t = e.target;
    if(t.id === 'nameInput'){ S.childName = t.value; persist(); return; }
    if(t.id === 'mStart'){ S.morningStartTime = t.value; persist(); return; }
    if(t.id === 'mLeave'){ S.leavingTime = t.value; persist(); return; }
    if(t.id === 'mSong'){ S.morningSong = t.value; persist(); return; }
    if(t.id === 'mSentence'){ S.morningSentence = t.value; persist(); return; }
    if(t.id === 'eStart'){ S.eveningStartTime = t.value; persist(); return; }
    if(t.id === 'eBed'){ S.bedtime = t.value; persist(); return; }
    if(t.id === 'eCalm'){ S.calmingActivity = t.value; persist(); return; }
    if(t.id === 'eSentence'){ S.bedtimeSentence = t.value; persist(); return; }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && e.target && e.target.id === 'customInput'){
      e.preventDefault();
      var btn = document.querySelector('[data-act="addCustom"]');
      if(btn) btn.click();
    }
  });

  var dragSrc = null;
  function attachDrag(){
    var list = el('dragList');
    if(!list) return;
    Array.prototype.forEach.call(list.querySelectorAll('.item'), function(li){
      li.setAttribute('draggable', 'true');
      li.addEventListener('dragstart', function(){ dragSrc = li; li.style.opacity = '.5'; });
      li.addEventListener('dragend', function(){ li.style.opacity = ''; });
      li.addEventListener('dragover', function(e){ e.preventDefault(); });
      li.addEventListener('drop', function(e){
        e.preventDefault();
        if(!dragSrc || dragSrc === li) return;
        var kind = list.getAttribute('data-kind');
        var arr = kind==='m' ? S.morningOrder : S.eveningOrder;
        var from = arr.indexOf(dragSrc.getAttribute('data-id'));
        var to = arr.indexOf(li.getAttribute('data-id'));
        if(from<0||to<0) return;
        arr.splice(to,0,arr.splice(from,1)[0]);
        persist(); render();
      });
    });
  }

  window.addEventListener('beforeprint', function(){ syncPrintRoot(); });

  render();
})();
`;
}

export default function FreeActivityMorningEvening() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const T = MORNING_EVENING_CONTENT[isHe ? 'he' : 'en'];
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement('script');
    script.textContent = buildScriptSrc(T, isHe ? 'he' : 'en');
    container.appendChild(script);
    attachEmailOptIn(container, 'morning_evening');
    return () => {
      script.remove();
    };
  }, [lang]);

  return (
    <div className="fa-me" dir={isHe ? 'rtl' : 'ltr'}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div key={lang} ref={ref} dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </div>
  );
}