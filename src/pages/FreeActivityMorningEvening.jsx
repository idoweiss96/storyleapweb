import React, { useEffect, useRef } from 'react';
import { attachEmailOptIn } from '@/lib/freeActivityEmailOptIn';

const STYLE = `
.fa-me{}
.fa-me *{box-sizing:border-box}
.fa-me{
  --royal:#02198B;
  --charcoal:#2D2F33;
  --cream:#FFF7F1;
  --blush:#F6D2D6;
  --peach:#F5CFC3;
  --lav:#DADCF8;
  --sky:#DDE8FF;
  --mist:#F7F8FB;
  --display:"Frank Ruhl Libre","David Libre",Georgia,serif;
  --body:"Rubik","Assistant","Segoe UI",Arial,sans-serif;
  --r-s:16px; --r-m:24px; --r-l:32px;
  --shadow:0 12px 40px rgba(45,47,51,.08);
  --line:rgba(2,25,139,.10);
  font-family:var(--body);
  color:var(--charcoal);
  background:linear-gradient(135deg,#FFF7F1 0%,#F7F8FB 45%,#DDE8FF 100%);
  -webkit-font-smoothing:antialiased;
  line-height:1.55;
  border-radius:24px;
  overflow:hidden;
}
.fa-me button,.fa-me input,.fa-me select,.fa-me textarea{font-family:inherit;font-size:inherit;color:inherit}
.fa-me :focus-visible{outline:3px solid rgba(2,25,139,.45);outline-offset:2px;border-radius:8px}

.fa-me .app{max-width:600px;margin:0 auto;min-height:70vh;display:flex;flex-direction:column}
.fa-me .top{position:sticky;top:0;z-index:20;padding:14px 20px 10px;
  background:rgba(255,247,241,.82);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(2,25,139,.06)}
.fa-me .top .row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.fa-me .brand{font-family:var(--display);font-weight:800;color:var(--royal);font-size:19px;letter-spacing:.2px;display:flex;align-items:center;gap:8px}
.fa-me .brand svg{width:20px;height:20px}
.fa-me .stepnum{font-size:13px;color:rgba(45,47,51,.6);font-variant-numeric:tabular-nums}
.fa-me .progress{height:6px;border-radius:999px;background:rgba(2,25,139,.10);margin-top:10px;overflow:hidden}
.fa-me .progress i{display:block;height:100%;width:0;background:var(--royal);border-radius:999px;transition:width .4s cubic-bezier(.2,.7,.2,1)}
.fa-me main{flex:1;padding:22px 20px 24px}
.fa-me .nav{position:sticky;bottom:0;z-index:20;display:flex;gap:10px;padding:14px 20px 16px;
  background:linear-gradient(to top,rgba(255,247,241,.98) 55%,rgba(255,247,241,0))}
.fa-me .nav .btn{flex:1}

.fa-me h1{font-family:var(--display);font-size:29px;line-height:1.25;margin:0 0 10px;color:var(--royal);font-weight:800}
.fa-me h2{font-family:var(--display);font-size:24px;line-height:1.3;margin:0 0 8px;color:var(--royal);font-weight:700}
.fa-me .sub{margin:0 0 20px;color:rgba(45,47,51,.72);font-size:16px}
.fa-me .hint{font-size:14px;color:rgba(45,47,51,.62)}
.fa-me .kid-prompt{display:inline-flex;align-items:center;gap:7px;background:var(--lav);color:var(--royal);
  border-radius:999px;padding:7px 14px;font-size:13.5px;font-weight:500;margin-bottom:16px}
.fa-me .kid-prompt svg{width:15px;height:15px;flex:none}

.fa-me .btn{border:0;border-radius:999px;padding:15px 26px;font-weight:600;font-size:16.5px;cursor:pointer;
  background:var(--royal);color:#fff;transition:transform .12s ease,box-shadow .2s ease,opacity .2s;
  box-shadow:0 8px 22px rgba(2,25,139,.18)}
.fa-me .btn:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(2,25,139,.24)}
.fa-me .btn:active{transform:translateY(0)}
.fa-me .btn.ghost{background:transparent;color:var(--royal);border:1.5px solid rgba(2,25,139,.22);box-shadow:none}
.fa-me .btn.ghost:hover{background:rgba(2,25,139,.05)}
.fa-me .btn.small{padding:11px 18px;font-size:15px}
.fa-me .btn[disabled]{opacity:.42;cursor:not-allowed;transform:none;box-shadow:none}
.fa-me .btn.wide{width:100%}
.fa-me a.btn{display:inline-block;text-decoration:none;text-align:center}
.fa-me .linkbtn{background:none;border:0;color:var(--royal);text-decoration:underline;cursor:pointer;font-size:14px;padding:6px}

.fa-me .card{background:rgba(255,255,255,.74);border:1px solid var(--line);border-radius:var(--r-m);
  box-shadow:0 12px 40px rgba(45,47,51,.06);padding:20px;margin-bottom:16px}
.fa-me label.field{display:block;margin-bottom:14px}
.fa-me label.field span{display:block;font-weight:500;margin-bottom:7px;font-size:15.5px}
.fa-me input[type=text],.fa-me input[type=time],.fa-me input[type=email],.fa-me select,.fa-me textarea{
  width:100%;padding:14px 16px;border-radius:var(--r-s);border:1.5px solid var(--line);
  background:#fff;font-size:16.5px;transition:border-color .2s}
.fa-me input:focus,.fa-me select:focus,.fa-me textarea:focus{border-color:var(--royal)}
.fa-me input[type=time]{font-variant-numeric:tabular-nums}
.fa-me .err{color:#8B1A1A;background:rgba(139,26,26,.07);border-radius:12px;padding:10px 14px;font-size:14.5px;margin-bottom:14px}

.fa-me .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:400px){.fa-me .opts{grid-template-columns:1fr}}
.fa-me .opt{display:flex;align-items:center;gap:10px;min-height:62px;padding:12px 14px;text-align:right;
  background:#fff;border:1.5px solid var(--line);border-radius:18px;cursor:pointer;font-size:15.5px;
  transition:border-color .18s,background .18s,transform .12s;position:relative}
.fa-me .opt:hover{border-color:rgba(2,25,139,.3);transform:translateY(-1px)}
.fa-me .opt .ic{width:34px;height:34px;flex:none;border-radius:12px;background:var(--mist);display:grid;place-items:center;color:var(--royal)}
.fa-me .opt .ic svg{width:20px;height:20px}
.fa-me .opt .nm{flex:1}
.fa-me .opt .tick{opacity:0;flex:none;color:var(--royal);transition:opacity .15s}
.fa-me .opt .tick svg{width:19px;height:19px}
.fa-me .opt[aria-pressed="true"]{border-color:var(--royal);background:var(--sky);box-shadow:inset 0 0 0 1px var(--royal)}
.fa-me .opt[aria-pressed="true"] .ic{background:#fff}
.fa-me .opt[aria-pressed="true"] .tick{opacity:1}
.fa-me .count{font-size:14px;color:rgba(45,47,51,.62);margin:14px 0 6px;text-align:center}

.fa-me .list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;touch-action:pan-y}
.fa-me .item{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--line);
  border-radius:18px;padding:10px 12px;will-change:transform;transition:box-shadow .2s,border-color .2s}
.fa-me .item.dragging{box-shadow:0 16px 34px rgba(45,47,51,.16);border-color:var(--royal);z-index:3;position:relative}
.fa-me .item .handle{flex:none;width:40px;height:44px;display:grid;place-items:center;color:rgba(45,47,51,.45);
  cursor:grab;touch-action:none;background:none;border:0;border-radius:12px}
.fa-me .item .handle:active{cursor:grabbing}
.fa-me .item .num{flex:none;width:26px;height:26px;border-radius:999px;background:var(--peach);color:var(--royal);
  display:grid;place-items:center;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.fa-me .item .ic{width:32px;height:32px;flex:none;border-radius:11px;background:var(--mist);display:grid;place-items:center;color:var(--royal)}
.fa-me .item .ic svg{width:19px;height:19px}
.fa-me .item .nm{flex:1;font-size:15.5px}
.fa-me .item .mini{background:none;border:0;padding:6px;border-radius:10px;cursor:pointer;color:rgba(45,47,51,.5)}
.fa-me .item .mini:hover{background:var(--mist);color:var(--royal)}
.fa-me .item .mini svg{width:18px;height:18px;display:block}

.fa-me .indep{background:#fff;border:1.5px solid var(--line);border-radius:18px;padding:12px 14px;margin-bottom:10px}
.fa-me .indep .head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.fa-me .indep .head .ic{width:32px;height:32px;border-radius:11px;background:var(--mist);display:grid;place-items:center;color:var(--royal)}
.fa-me .indep .head .ic svg{width:19px;height:19px}
.fa-me .indep .head .nm{font-size:15.5px;font-weight:500}
.fa-me .seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.fa-me .seg button{border:1.5px solid var(--line);background:var(--mist);border-radius:14px;padding:9px 4px;
  font-size:13px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:.18s}
.fa-me .seg button svg{width:17px;height:17px}
.fa-me .seg button[aria-pressed="true"]{background:var(--sky);border-color:var(--royal);color:var(--royal);font-weight:600}
.fa-me .goalpick{display:flex;flex-wrap:wrap;gap:8px}
.fa-me .goalpick button{border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:10px 15px;font-size:14.5px;cursor:pointer;display:flex;align-items:center;gap:7px}
.fa-me .goalpick button svg{width:16px;height:16px;color:var(--royal)}
.fa-me .goalpick button[aria-pressed="true"]{background:var(--peach);border-color:var(--royal);color:var(--royal);font-weight:600}

.fa-me .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.fa-me .chip{border:1.5px solid var(--line);background:#fff;border-radius:999px;padding:10px 15px;font-size:14.5px;cursor:pointer}
.fa-me .chip[aria-pressed="true"]{background:var(--lav);border-color:var(--royal);color:var(--royal);font-weight:600}

.fa-me .styles{display:flex;flex-direction:column;gap:12px}
.fa-me .stylecard{display:flex;gap:14px;align-items:center;background:#fff;border:1.5px solid var(--line);
  border-radius:var(--r-m);padding:14px;cursor:pointer;text-align:right}
.fa-me .stylecard[aria-pressed="true"]{border-color:var(--royal);box-shadow:inset 0 0 0 1px var(--royal);background:var(--sky)}
.fa-me .stylecard .thumb{flex:none;width:86px;height:104px;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#fff;padding:8px}
.fa-me .stylecard .thumb .tl{height:8px;border-radius:4px;margin-bottom:7px}
.fa-me .stylecard .thumb .tr{display:flex;align-items:center;gap:5px;margin-bottom:6px}
.fa-me .stylecard .thumb .tr b{width:14px;height:14px;border-radius:5px;flex:none;display:block}
.fa-me .stylecard .thumb .tr i{height:6px;border-radius:3px;flex:1;display:block;background:rgba(45,47,51,.18)}
.fa-me .stylecard .stinfo{flex:1}
.fa-me .stylecard .sth{display:block;font-family:var(--display);font-size:18px;color:var(--royal);font-weight:700;margin-bottom:4px}
.fa-me .stylecard .stp{display:block;font-size:14px;color:rgba(45,47,51,.7);line-height:1.45}

.fa-me .transition{text-align:center;padding:26px 20px;background:linear-gradient(135deg,#F5CFC3 0%,#F6D2D6 35%,#DADCF8 70%,#DDE8FF 100%);
  border-radius:var(--r-l);box-shadow:var(--shadow)}
.fa-me .transition .glyph{width:74px;height:74px;margin:0 auto 14px;border-radius:999px;background:rgba(255,255,255,.75);
  display:grid;place-items:center;color:var(--royal)}
.fa-me .transition .glyph svg{width:34px;height:34px}

.fa-me .hero{background:linear-gradient(135deg,#F5CFC3 0%,#F6D2D6 35%,#DADCF8 70%,#DDE8FF 100%);
  border-radius:var(--r-l);padding:28px 24px;box-shadow:var(--shadow);margin-bottom:18px}
.fa-me .hero h1{font-size:32px;margin-bottom:8px}
.fa-me .hero .lede{font-size:16.5px;color:rgba(45,47,51,.82);margin:0 0 18px}
.fa-me .heroband{display:flex;gap:8px;margin-bottom:18px}
.fa-me .heroband div{flex:1;background:rgba(255,255,255,.72);border-radius:16px;padding:11px 8px;text-align:center;font-size:12.5px;color:var(--royal)}
.fa-me .heroband svg{width:20px;height:20px;display:block;margin:0 auto 5px}
.fa-me .note{display:flex;gap:9px;align-items:flex-start;font-size:14px;color:rgba(45,47,51,.7);
  background:rgba(255,255,255,.6);border-radius:14px;padding:11px 13px}
.fa-me .note svg{width:17px;height:17px;flex:none;margin-top:2px;color:var(--royal)}

.fa-me .previewwrap{background:rgba(255,255,255,.5);border:1px solid var(--line);border-radius:var(--r-m);padding:12px;margin-bottom:18px}
.fa-me .actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.fa-me .cta{background:var(--cream);border:1px solid var(--line);border-radius:var(--r-m);padding:20px;text-align:center}
.fa-me .cta p{margin:0 0 14px;font-size:15.5px;color:rgba(45,47,51,.8)}
.fa-me .toast{position:fixed;bottom:96px;right:50%;transform:translateX(50%);background:var(--charcoal);color:#fff;
  padding:12px 18px;border-radius:999px;font-size:14.5px;z-index:60;opacity:0;pointer-events:none;transition:opacity .25s}
.fa-me .toast.on{opacity:1}

.fa-me .board{background:#fff;border-radius:var(--r-m);padding:22px;color:var(--charcoal)}
.fa-me .board + .board{margin-top:16px}
.fa-me .board .bhead{margin-bottom:14px}
.fa-me .board .btitle{font-family:var(--display);font-size:22px;font-weight:800;color:var(--royal);margin:0}
.fa-me .board .bsub{font-size:13.5px;color:rgba(45,47,51,.6);margin:2px 0 0}
.fa-me .board .sect{font-family:var(--display);font-size:19px;color:var(--royal);margin:18px 0 10px;display:flex;align-items:center;gap:8px}
.fa-me .board .sect svg{width:20px;height:20px}
.fa-me .board .brow{display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid rgba(45,47,51,.10);break-inside:avoid}
.fa-me .board .brow:last-child{border-bottom:0}
.fa-me .board .bnum{flex:none;width:26px;height:26px;border-radius:999px;display:grid;place-items:center;
  font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;background:var(--peach);color:var(--royal)}
.fa-me .board .bic{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:var(--mist);color:var(--royal)}
.fa-me .board .bic svg{width:18px;height:18px}
.fa-me .board .bnm{flex:1;font-size:15px}
.fa-me .board .bflag{font-size:11.5px;border-radius:999px;padding:3px 9px;background:var(--mist);color:rgba(45,47,51,.7);white-space:nowrap}
.fa-me .board .bbox{flex:none;width:19px;height:19px;border:1.5px solid rgba(45,47,51,.55);border-radius:5px}
.fa-me .board .goal{display:flex;align-items:center;gap:9px;background:var(--lav);border-radius:14px;padding:11px 13px;margin-top:12px;font-size:14px}
.fa-me .board .goal svg{width:18px;height:18px;flex:none;color:var(--royal)}
.fa-me .board .goal b{font-weight:600}
.fa-me .board .facts{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}
.fa-me .board .fact{font-size:12.5px;background:var(--mist);border-radius:999px;padding:6px 12px}
.fa-me .board .fact b{font-weight:600;color:var(--royal)}
.fa-me .board .quote{margin-top:11px;font-family:var(--display);font-size:15.5px;color:var(--royal);
  border-right:3px solid var(--peach);padding:2px 12px 2px 0}
.fa-me .board .bfoot{margin-top:18px;padding-top:10px;border-top:1px solid rgba(45,47,51,.10);
  display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:rgba(45,47,51,.55)}
.fa-me .board .bfoot .lg{font-family:var(--display);font-weight:700;color:var(--royal);font-size:13px}
.fa-me .pagebreak{height:0}

.fa-me .style-soft .board{background:var(--cream);border:1px solid rgba(2,25,139,.08)}
.fa-me .style-soft .board .bic{background:var(--blush)}
.fa-me .style-soft .board .bnum{background:var(--peach)}
.fa-me .style-soft .board .brow{border-bottom:1px dashed rgba(45,47,51,.16)}
.fa-me .style-clean .board{background:#fff;border:1px solid rgba(45,47,51,.12)}
.fa-me .style-clean .board .bic{background:#fff;color:var(--charcoal)}
.fa-me .style-clean .board .bnum{background:var(--mist);color:var(--charcoal)}
.fa-me .style-clean .board .sect{color:var(--charcoal)}
.fa-me .style-clean .board .goal{background:var(--mist)}
.fa-me .style-clean .board .quote{border-right-color:rgba(45,47,51,.25);color:var(--charcoal)}
.fa-me .style-grown .board{background:#fff;border:1px solid rgba(2,25,139,.16)}
.fa-me .style-grown .board .bnum{background:var(--royal);color:#fff}
.fa-me .style-grown .board .bic{background:transparent}
.fa-me .style-grown .board .brow{border-bottom:1px solid rgba(2,25,139,.14);padding:11px 0}
.fa-me .style-grown .board .bnm{font-weight:500}
.fa-me .style-grown .board .sect{border-bottom:2px solid var(--royal);padding-bottom:6px}
.fa-me .style-grown .board .goal{background:var(--sky)}

.fa-me .optin-card .hint{margin:0 0 10px}
.fa-me .optin-form{display:flex;gap:8px;flex-wrap:wrap}
.fa-me .optin-form input{flex:1;min-width:180px}
.fa-me .optin-form .btn{flex:none}

.fa-me #printRoot{display:none}
@media print{
  @page{size:A4;margin:12mm}
  .fa-me .app,.fa-me .toast{display:none !important}
  .fa-me #printRoot{display:block !important}
  .fa-me .board{border:1px solid rgba(45,47,51,.18) !important;border-radius:14px;padding:18px 20px;
    break-inside:avoid;page-break-inside:avoid;margin:0 0 12mm}
  .fa-me .board .brow{break-inside:avoid;page-break-inside:avoid;padding:7px 0}
  .fa-me .board .btitle{font-size:20px}
  .fa-me .board .sect{margin:14px 0 8px}
  .fa-me .pagebreak{break-after:page;page-break-after:always}
}
@media (prefers-reduced-motion:reduce){.fa-me *{transition:none !important;animation:none !important}}
`;

const BODY_HTML = `
<div class="app">
  <header class="top">
    <div class="row">
      <div class="brand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z"/></svg>StoryLeap</div>
      <div class="stepnum" id="stepnum"></div>
    </div>
    <div class="progress"><i id="bar"></i></div>
  </header>
  <main id="screen" tabindex="-1"></main>
  <div class="nav" id="nav"></div>
</div>
<div id="printRoot"></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const SCRIPT_SRC = `
(function(){
"use strict";

var P = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  toilet:'<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M5 4h14"/><path d="M9 16l-1 4h8l-1-4"/>',
  drop:'<path d="M12 3s6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 6-10 6-10z"/>',
  tooth:'<path d="M7 4c2 0 2 1 5 1s3-1 5-1 3 2 2 5c-1 3-1 10-3 10s-2-4-4-4-2 4-4 4-2-7-3-10c-1-3 0-5 2-5z"/>',
  shirt:'<path d="M8 3l4 2 4-2 4 3-2 3-2-1v11H8V8L6 9 4 6z"/>',
  comb:'<path d="M4 7h16v4H4z"/><path d="M7 11v6M11 11v6M15 11v6M19 11v6"/>',
  bowl:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M9 7c0-1.2 1-1.2 1-2.4M14 7c0-1.2 1-1.2 1-2.4"/>',
  sandwich:'<path d="M4 9l8-4 8 4-8 4z"/><path d="M4 13l8 4 8-4"/><path d="M4 9v4M20 9v4"/>',
  lunchbox:'<rect x="3" y="8" width="18" height="11" rx="2"/><path d="M9 8V6h6v2"/><path d="M3 13h18"/>',
  bottle:'<path d="M10 2h4v3l2 3v12H8V8l2-3z"/><path d="M8 12h8"/>',
  checklist:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9.5l1.8 1.8L14 7M8 16h8"/>',
  shoe:'<path d="M3 17v-6h5l3 2h5a5 5 0 0 1 5 5v1H3z"/><path d="M8 11v3"/>',
  music:'<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  speech:'<path d="M4 5h16v10h-8l-5 4v-4H4z"/><path d="M12 7.4l.8 1.8 2 .3-1.4 1.3.3 2-1.7-1-1.7 1 .3-2L9.2 9.5l2-.3z"/>',
  backpack:'<path d="M6 9a6 6 0 0 1 12 0v11H6z"/><path d="M9 9V7.5a3 3 0 0 1 6 0V9"/><path d="M9 14h6"/>',
  door:'<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M3 21h16"/><circle cx="13" cy="12" r="1"/>',
  home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
  pencil:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  blocks:'<rect x="3" y="12" width="8" height="8" rx="1.5"/><rect x="13" y="12" width="8" height="8" rx="1.5"/><rect x="8" y="3.5" width="8" height="8" rx="1.5"/>',
  people:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M3 19.5c0-3 2.2-5 5-5s5 2 5 5"/><path d="M14 19.5c0-2 1.2-3.6 3-3.6s3 1.6 3 3.6"/>',
  dinner:'<circle cx="10" cy="12" r="6"/><path d="M19 5v14"/><path d="M17 5v4h4V5"/>',
  shower:'<path d="M4 12h10a5 5 0 0 0-10 0z"/><path d="M9 12V5h9"/><path d="M6 16v2M9 15.5v2M12 16v2"/>',
  pajama:'<path d="M8 3l4 2 4-2 4 3-2 3-2-1v11H8V8L6 9 4 6z"/><path d="M12 12.4l.6 1.3 1.4.2-1 1 .3 1.4-1.3-.7-1.3.7.3-1.4-1-1 1.4-.2z"/>',
  hanger:'<circle cx="12" cy="5" r="2"/><path d="M12 7v2L4 16h16l-8-7"/>',
  box:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12h18M12 8v12"/>',
  screenoff:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/><path d="M4 4.5l16 15"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z"/>',
  chat:'<path d="M3 5h12v9H8l-5 4z"/><path d="M8 5V3.5h13V13h-2.5"/>',
  heart:'<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/>',
  bed:'<path d="M3 19v-9a2 2 0 0 1 2-2h9a4 4 0 0 1 4 4h1a2 2 0 0 1 2 2v5"/><path d="M3 15h18"/><circle cx="8" cy="12" r="1.6"/>',
  moon:'<path d="M20 14a8 8 0 1 1-10-10 7 7 0 0 0 10 10z"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4.4l3 1.8"/>',
  star:'<path d="M12 3.2l2.5 5.4 6 .8-4.4 4.2 1.1 5.9-5.2-2.8-5.2 2.8 1.1-5.9L3.5 9.4l6-.8z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  grip:'<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',
  self:'<circle cx="12" cy="7" r="3.2"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
  together:'<circle cx="8" cy="8" r="2.8"/><circle cx="16" cy="8" r="2.8"/><path d="M3 19c0-3 2.2-5 5-5M21 19c0-3-2.2-5-5-5"/><path d="M9.5 19a2.5 2.5 0 0 1 5 0"/>',
  learning:'<path d="M12 3.5l9 4.5-9 4.5-9-4.5z"/><path d="M7 10.5V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.5"/>',
  printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  save:'<path d="M12 3v11M8 10.5l4 4 4-4"/><path d="M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/>',
  edit:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.7-6"/><path d="M20 4v5h-5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  hand:'<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 10.5V4.6a1.5 1.5 0 0 1 3 0V11"/><path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9L5 15.4a1.6 1.6 0 0 1 2.4-2.1L9 15V8.6a1.5 1.5 0 0 1 3 0"/>',
  shield:'<path d="M12 3l7 3v6c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  repeat:'<path d="M17 3l3 3-3 3"/><path d="M20 6H8a4 4 0 0 0-4 4"/><path d="M7 21l-3-3 3-3"/><path d="M4 18h12a4 4 0 0 0 4-4"/>'
};
function ic(n, cls){
  var d = P[n] || P.star;
  return '<svg class="'+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
}

var MORNING = [
  {id:'m_wake',      t:'מתעוררים',                i:'sun'},
  {id:'m_toilet',    t:'הולכים לשירותים',          i:'toilet'},
  {id:'m_wash',      t:'שוטפים פנים',              i:'drop'},
  {id:'m_teeth',     t:'מצחצחים שיניים',           i:'tooth'},
  {id:'m_dress',     t:'מתלבשים',                  i:'shirt'},
  {id:'m_hair',      t:'מסדרים שיער',              i:'comb'},
  {id:'m_breakfast', t:'אוכלים ארוחת בוקר',        i:'bowl'},
  {id:'m_sandwich',  t:'מכינים את הסנדוויץ׳',      i:'sandwich'},
  {id:'m_packfood',  t:'מכניסים אוכל לתיק',        i:'lunchbox'},
  {id:'m_bottle',    t:'ממלאים בקבוק מים',         i:'bottle'},
  {id:'m_bagcheck',  t:'בודקים שהתיק מוכן',        i:'checklist'},
  {id:'m_shoes',     t:'נועלים נעליים',            i:'shoe'},
  {id:'m_song',      t:'בוחרים שיר לדרך',          i:'music'},
  {id:'m_courage',   t:'אומרים משפט שנותן אומץ',   i:'speech'},
  {id:'m_takebag',   t:'לוקחים את התיק',           i:'backpack'},
  {id:'m_leave',     t:'יוצאים מהבית',             i:'door'}
];
var EVENING = [
  {id:'e_home',      t:'חוזרים הביתה',             i:'home'},
  {id:'e_bagtidy',   t:'מסדרים את התיק',           i:'backpack'},
  {id:'e_homework',  t:'מכינים שיעורי בית',        i:'pencil'},
  {id:'e_play',      t:'זמן משחק',                 i:'blocks'},
  {id:'e_family',    t:'זמן משפחה',                i:'people'},
  {id:'e_dinner',    t:'אוכלים ארוחת ערב',         i:'dinner'},
  {id:'e_shower',    t:'מתקלחים',                  i:'shower'},
  {id:'e_pajama',    t:'לובשים פיג׳מה',            i:'pajama'},
  {id:'e_clothes',   t:'בוחרים בגדים למחר',        i:'hanger'},
  {id:'e_bagprep',   t:'מכינים את התיק למחר',      i:'checklist'},
  {id:'e_bottle',    t:'מכינים בקבוק מים',         i:'bottle'},
  {id:'e_sandwich',  t:'בוחרים מה יהיה בסנדוויץ׳', i:'sandwich'},
  {id:'e_room',      t:'מסדרים את החדר',           i:'box'},
  {id:'e_screens',   t:'מכבים מסכים',              i:'screenoff'},
  {id:'e_teeth',     t:'מצחצחים שיניים',           i:'tooth'},
  {id:'e_toilet',    t:'הולכים לשירותים',          i:'toilet'},
  {id:'e_story',     t:'קוראים סיפור',             i:'book'},
  {id:'e_talk',      t:'מדברים על היום שעבר',      i:'chat'},
  {id:'e_hug',       t:'חיבוק ולילה טוב',          i:'heart'},
  {id:'e_sleep',     t:'הולכים לישון',             i:'bed'}
];
var COURAGE = [
  'אני מוכן או מוכנה ליום חדש.',
  'גם אם משהו יהיה קשה, אפשר לבקש עזרה.',
  'לא צריך לדעת הכול מיד.',
  'אני יכול או יכולה לנסות.'
];
var CALMING = ['סיפור','חיבוק','מוזיקה רגועה','שיחה קצרה','נשימה עמוקה','אור קטן','לחשוב על דבר טוב שהיה היום'];
var STYLES = [
  {id:'soft',  name:'רך ומאויר',            desc:'צבעים חמים ואיורים ידידותיים. מתאים לילדים שאוהבים לוח צבעוני.'},
  {id:'clean', name:'פשוט ונקי',            desc:'הרבה אוויר, קווים עדינים וקריאות גבוהה. מצוין להדפסה יומיומית.'},
  {id:'grown', name:'אני כבר גדול או גדולה', desc:'עיצוב בוגר יותר עם מספור ברור. לא נראה כמו לוח של גן.'}
];
var FORMATS = [
  {id:'poster',   name:'פוסטר קבוע למקרר', desc:'מציג את סדר הפעולות בבירור, בלי משבצות סימון.'},
  {id:'checklist',name:'צ׳קליסט לסימון יומי', desc:'משבצת ריקה ליד כל פעולה, לסימון בכל יום.'},
  {id:'separate', name:'שני דפים נפרדים: בוקר וערב', desc:'דף לתלייה במטבח ודף לחדר השינה.'},
  {id:'combined', name:'דף משולב של בוקר וערב', desc:'הכול על דף אחד.'}
];
var INDEP = [
  {id:'self',     t:'עושה לבד',            i:'self'},
  {id:'together', t:'יחד עם מבוגר',        i:'together'},
  {id:'learning', t:'עדיין לומדים',        i:'learning'}
];

var KEY = 'storyleap_routine_v1';
var S = blank();
function blank(){
  return {
    childName:'',
    customMorning:[], customEvening:[],
    selectedMorningActivities:[], morningOrder:[],
    morningIndependenceStatus:{}, morningIndependenceGoal:'',
    morningStartTime:'', leavingTime:'', morningSong:'', morningSentence:'',
    selectedEveningActivities:[], eveningOrder:[],
    eveningIndependenceStatus:{}, eveningIndependenceGoal:'',
    eveningStartTime:'', bedtime:'', calmingActivity:'', bedtimeSentence:'',
    selectedVisualStyle:'soft', selectedOutputFormats:['poster','combined'],
    step:0
  };
}

var Store = {
  mem:null,
  save:function(d){
    this.mem = d;
    try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){}
  },
  load:function(){
    var self=this;
    return new Promise(function(res){
      var fromLS=null;
      try{ var v=localStorage.getItem(KEY); if(v) fromLS=JSON.parse(v); }catch(e){}
      res(fromLS||self.mem);
    });
  },
  clear:function(){
    this.mem=null;
    try{ localStorage.removeItem(KEY); }catch(e){}
  }
};
function persist(){ Store.save(S); }

function el(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function allMorning(){ return MORNING.concat(S.customMorning); }
function allEvening(){ return EVENING.concat(S.customEvening); }
function findAct(id){
  var a=allMorning().concat(allEvening());
  for(var i=0;i<a.length;i++) if(a[i].id===id) return a[i];
  return {id:id,t:id,i:'star'};
}
function kid(){ return S.childName.trim(); }
function withName(withN, without){ return kid() ? withN.replace('{{name}}', esc(kid())) : without; }
function toast(msg){
  var t=el('toast'); t.textContent=msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t=setTimeout(function(){ t.classList.remove('on'); },2600);
}

var STEPS = [
  'intro','name','mPick','mOrder','mIndep','mExtra','bridge',
  'ePick','eOrder','eIndep','eExtra','style','format','result'
];
var BUILD_STEPS = STEPS.length - 2;

function optionGrid(list, selectedIds, handler){
  return '<div class="opts">' + list.map(function(a){
    var on = selectedIds.indexOf(a.id) > -1;
    return '<button type="button" class="opt" aria-pressed="'+on+'" data-act="'+handler+'" data-id="'+a.id+'">'+
      '<span class="ic">'+ic(a.i)+'</span><span class="nm">'+esc(a.t)+'</span>'+
      '<span class="tick">'+ic('check')+'</span></button>';
  }).join('') + '</div>';
}
function customAdder(kind, items, max){
  var left = max - items.length;
  var html = '<div class="card" style="margin-top:16px">'+
    '<label class="field" style="margin-bottom:10px"><span>הוספת פעולה משלנו</span>'+
    '<input type="text" id="customInput" maxlength="34" placeholder="למשל: מאכילים את הכלב" '+(left<=0?'disabled':'')+'></label>'+
    '<button type="button" class="btn small" data-act="addCustom" data-kind="'+kind+'" '+(left<=0?'disabled':'')+'>'+
    ic('plus')+' הוספה</button>'+
    '<div class="hint" style="margin-top:8px">'+(left>0? 'אפשר להוסיף עוד '+left+' פעולות משלכם.' : 'הוספתם את מספר הפעולות המרבי.')+'</div>';
  if(items.length){
    html += '<div class="chips" style="margin-top:12px">'+items.map(function(a){
      return '<span class="chip" style="cursor:default">'+esc(a.t)+
        ' <button type="button" class="mini" aria-label="מחיקת '+esc(a.t)+'" data-act="delCustom" data-kind="'+kind+'" data-id="'+a.id+'" style="background:none;border:0;cursor:pointer;padding:2px;vertical-align:middle;color:inherit">'+ic('x')+'</button></span>';
    }).join('')+'</div>';
  }
  return html + '</div>';
}
function orderList(orderIds, kindKey){
  if(!orderIds.length) return '<div class="card">עדיין לא נבחרו פעולות. חזרו שלב אחורה כדי לבחור.</div>';
  return '<ul class="list" id="dragList" data-kind="'+kindKey+'">' + orderIds.map(function(id,idx){
    var a = findAct(id);
    return '<li class="item" data-id="'+id+'" data-idx="'+idx+'">'+
      '<button type="button" class="handle" aria-label="גרירה של '+esc(a.t)+'" data-drag="1">'+ic('grip')+'</button>'+
      '<span class="num">'+(idx+1)+'</span>'+
      '<span class="ic">'+ic(a.i)+'</span>'+
      '<span class="nm">'+esc(a.t)+'</span>'+
      '<button type="button" class="mini" aria-label="העברה למעלה" data-act="moveUp" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('up')+'</button>'+
      '<button type="button" class="mini" aria-label="העברה למטה" data-act="moveDown" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('down')+'</button>'+
      '<button type="button" class="mini" aria-label="הסרה של '+esc(a.t)+'" data-act="removeAct" data-kind="'+kindKey+'" data-id="'+id+'">'+ic('x')+'</button>'+
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
  return rows + '<div class="card" style="margin-top:6px"><h2 style="font-size:20px">משימת העצמאות שלי</h2>'+
    '<p class="hint" style="margin:0 0 12px">בוחרים פעולה אחת קטנה שמתאמנים עליה השבוע. אפשר להחליף בכל שבוע.</p>'+ goals +'</div>';
}
function sentenceChips(options, current, actName){
  var isCustom = current && options.indexOf(current) === -1;
  return '<div class="chips">'+ options.map(function(t){
      return '<button type="button" class="chip" aria-pressed="'+(current===t)+'" data-act="'+actName+'" data-val="'+esc(t)+'">'+esc(t)+'</button>';
    }).join('') +
    '<button type="button" class="chip" aria-pressed="'+(isCustom?'true':'false')+'" data-act="'+actName+'" data-val="">משפט משלנו</button></div>';
}

var R = {};

R.intro = function(){
  return '<section class="hero">'+
    '<h1>הבוקר והערב שלי</h1>'+
    '<p class="lede">שגרה קבועה עוזרת לילדים לדעת מה קורה עכשיו ומה מגיע אחר כך. בואו נבנה יחד סדר בוקר וסדר ערב שמתאימים בדיוק למשפחה שלכם.</p>'+
    '<div class="heroband">'+
      '<div>'+ic('clock')+'חמש עד שמונה דקות</div>'+
      '<div>'+ic('people')+'עושים יחד עם הילד</div>'+
      '<div>'+ic('printer')+'יוצא דף להדפסה</div>'+
    '</div>'+
    '<div class="note">'+ic('info')+'<span>אפשר תמיד לחזור, לשנות ולהדפיס מחדש. מה שתבחרו נשמר במכשיר שלכם.</span></div>'+
  '</section>'+
  '<div class="card"><h2 style="font-size:20px">מה בונים כאן</h2>'+
   '<p class="hint" style="margin:0">שני לוחות אישיים: רוטינת הבוקר ורוטינת הערב. בסוף מקבלים דף מוכן להדפסה, עם הפעולות שבחרתם, בסדר שבחרתם, ועם משימת עצמאות אחת קטנה לכל חלק של היום.</p></div>';
};

R.name = function(){
  return '<h1>קודם כול, איך קוראים לילד או לילדה?</h1>'+
    '<p class="sub">נשתמש בשם בלוח המודפס, כדי שהשגרה תרגיש אישית.</p>'+
    '<div class="card"><label class="field"><span>שם הילד או הילדה</span>'+
    '<input type="text" id="nameInput" maxlength="20" autocomplete="off" value="'+esc(S.childName)+'" placeholder="למשל: עומר"></label>'+
    '<div class="hint">אפשר שם, כינוי, או איך שקוראים לו בבית.</div></div>';
};

R.mPick = function(){
  var n = S.selectedMorningActivities.length;
  return '<span class="kid-prompt">'+ic('hand')+'עכשיו תנו לילד לבחור</span>'+
    '<h1>'+ withName('מה עושים אצלכם בבוקר?','מה עושים אצלכם בבוקר?') +'</h1>'+
    '<p class="sub">בחרו את הפעולות שמתאימות לכם. תוכלו לסדר אותן בשלב הבא.</p>'+
    optionGrid(allMorning(), S.selectedMorningActivities, 'toggleM') +
    '<div class="count">נבחרו '+n+' פעולות'+(n<3?' · צריך לפחות שלוש':(n>10?' · אפשר גם פחות, ארבע עד עשר עובד הכי טוב':''))+'</div>'+
    customAdder('m', S.customMorning, 3);
};

R.mOrder = function(){
  return '<h1>באיזה סדר עושים את הדברים?</h1>'+
    '<p class="sub">גררו את הפעולות וסדרו אותן לפי הבוקר שלכם.</p>'+
    '<span class="kid-prompt">'+ic('info')+'יש יותר מתשובה אחת נכונה</span>'+
    orderList(S.morningOrder,'m')+
    '<div style="margin-top:14px"><button type="button" class="btn ghost small" data-act="backToPick" data-kind="m">'+ic('plus')+' הוספת פעולה</button></div>';
};

R.mIndep = function(){
  return '<h1>מה כבר אפשר לעשות לבד?</h1>'+
    '<p class="sub">לא צריך לעשות הכול לבד. עצמאות נבנית צעד אחר צעד.</p>'+
    '<span class="kid-prompt">'+ic('hand')+'תנו לילד לסמן</span>'+
    indepBlock(S.morningOrder, S.morningIndependenceStatus, S.morningIndependenceGoal, 'm');
};

R.mExtra = function(){
  return '<h1>עוד כמה דברים שעוזרים לבוקר שלנו</h1>'+
    '<p class="sub">הכול כאן לא חובה. מלאו רק מה שמתאים לכם.</p>'+
    '<div class="card">'+
      '<label class="field"><span>באיזו שעה מתחילים את הבוקר?</span><input type="time" id="mStart" value="'+esc(S.morningStartTime)+'"></label>'+
      '<label class="field"><span>באיזו שעה יוצאים מהבית?</span><input type="time" id="mLeave" value="'+esc(S.leavingTime)+'"></label>'+
      '<label class="field" style="margin-bottom:0"><span>איזה שיר אנחנו אוהבים לשמוע בבוקר?</span><input type="text" id="mSong" maxlength="40" value="'+esc(S.morningSong)+'" placeholder="שם השיר"></label>'+
    '</div>'+
    '<div class="card"><span style="display:block;font-weight:500;margin-bottom:9px">איזה משפט נרצה להגיד לפני שיוצאים?</span>'+
      sentenceChips(COURAGE, S.morningSentence, 'setMSentence')+
      '<input type="text" id="mSentence" maxlength="70" style="margin-top:12px" value="'+esc(S.morningSentence)+'" placeholder="או כתבו משפט משלכם">'+
    '</div>';
};

R.bridge = function(){
  return '<section class="transition">'+
    '<div class="glyph">'+ic('sun')+'</div>'+
    '<h1 style="font-size:26px">סיימנו לבנות את הבוקר</h1>'+
    '<p style="margin:0;font-size:16px;color:rgba(45,47,51,.8)">עכשיו נבנה שגרת ערב שתעזור להתכונן למחר ולסיים את היום בצורה רגועה.</p>'+
  '</section>'+
  '<div class="card" style="margin-top:16px"><h2 style="font-size:19px">רגע לפני</h2>'+
  '<p class="hint" style="margin:0">הרבה מהלחץ של הבוקר נולד בערב שלפניו. תיק מוכן, בגדים בחוץ ובקבוק מים ליד הדלת מקצרים את הבוקר בכמה דקות ובכמה ויכוחים.</p></div>';
};

R.ePick = function(){
  var n = S.selectedEveningActivities.length;
  return '<span class="kid-prompt">'+ic('hand')+'עכשיו תנו לילד לבחור</span>'+
    '<h1>מה עושים אצלכם בערב?</h1>'+
    '<p class="sub">בחרו את הפעולות שמתאימות לכם. תוכלו לסדר אותן בשלב הבא.</p>'+
    optionGrid(allEvening(), S.selectedEveningActivities, 'toggleE') +
    '<div class="count">נבחרו '+n+' פעולות'+(n<3?' · צריך לפחות שלוש':(n>10?' · אפשר גם פחות, ארבע עד עשר עובד הכי טוב':''))+'</div>'+
    customAdder('e', S.customEvening, 3);
};

R.eOrder = function(){
  return '<h1>באיזה סדר מתכוננים ללילה?</h1>'+
    '<p class="sub">סדר קבוע עוזר לגוף ולראש להבין שהיום מתקרב לסיום.</p>'+
    orderList(S.eveningOrder,'e')+
    '<div style="margin-top:14px"><button type="button" class="btn ghost small" data-act="backToPick" data-kind="e">'+ic('plus')+' הוספת פעולה</button></div>';
};

R.eIndep = function(){
  return '<h1>מה אפשר לעשות לבד בערב?</h1>'+
    '<p class="sub">גם כאן, אין תשובה נכונה. מסמנים איפה אנחנו נמצאים עכשיו.</p>'+
    '<span class="kid-prompt">'+ic('hand')+'תנו לילד לסמן</span>'+
    indepBlock(S.eveningOrder, S.eveningIndependenceStatus, S.eveningIndependenceGoal, 'e');
};

R.eExtra = function(){
  return '<h1>מה עוזר לנו לסיים את היום ברוגע?</h1>'+
    '<p class="sub">גם כאן, רק מה שמתאים לכם.</p>'+
    '<div class="card">'+
      '<label class="field"><span>באיזו שעה מתחילים להתכונן לשינה?</span><input type="time" id="eStart" value="'+esc(S.eveningStartTime)+'"></label>'+
      '<label class="field" style="margin-bottom:0"><span>באיזו שעה הולכים לישון?</span><input type="time" id="eBed" value="'+esc(S.bedtime)+'"></label>'+
    '</div>'+
    '<div class="card"><span style="display:block;font-weight:500;margin-bottom:9px">מה עוזר לי להירגע?</span>'+
      sentenceChips(CALMING, S.calmingActivity, 'setCalm')+
      '<input type="text" id="eCalm" maxlength="40" style="margin-top:12px" value="'+esc(S.calmingActivity)+'" placeholder="או כתבו משהו משלכם">'+
    '</div>'+
    '<div class="card"><label class="field" style="margin-bottom:0"><span>איזה משפט נרצה להגיד לפני השינה?</span>'+
      '<input type="text" id="eSentence" maxlength="70" value="'+esc(S.bedtimeSentence)+'" placeholder="למשל: היה יום, מחר יהיה יום חדש"></label></div>';
};

R.style = function(){
  return '<span class="kid-prompt">'+ic('hand')+'תנו לילד לבחור את הסגנון</span>'+
    '<h1>איך הלוח שלנו ייראה?</h1>'+
    '<p class="sub">שלושה סגנונות, אותו תוכן. אפשר להחליף גם אחר כך.</p>'+
    '<div class="styles">'+ STYLES.map(function(st){
      return '<button type="button" class="stylecard" aria-pressed="'+(S.selectedVisualStyle===st.id)+'" data-act="setStyle" data-id="'+st.id+'">'+
        thumb(st.id)+
        '<span class="stinfo"><span class="sth">'+esc(st.name)+'</span><span class="stp">'+esc(st.desc)+'</span></span>'+
      '</button>';
    }).join('') +'</div>';
};
function thumb(id){
  var bg = id==='soft' ? 'var(--cream)' : '#fff';
  var chip = id==='soft' ? 'var(--blush)' : (id==='clean' ? 'var(--mist)' : 'var(--royal)');
  var title = id==='grown' ? 'var(--royal)' : (id==='clean' ? 'rgba(45,47,51,.5)' : 'var(--peach)');
  var rows = '';
  for(var i=0;i<4;i++){
    rows += '<span class="tr"><b style="background:'+chip+'"></b><i></i></span>';
  }
  return '<span class="thumb" style="background:'+bg+'" aria-hidden="true"><span class="tl" style="background:'+title+';width:70%"></span>'+rows+'</span>';
}

R.format = function(){
  return '<h1>איך תרצו להשתמש בשגרה?</h1>'+
    '<p class="sub">אפשר לבחור יותר מאפשרות אחת. נכין את כל הגרסאות שבחרתם.</p>'+
    '<div style="display:flex;flex-direction:column;gap:10px">'+ FORMATS.map(function(f){
      var on = S.selectedOutputFormats.indexOf(f.id)>-1;
      return '<button type="button" class="opt" style="min-height:74px;align-items:flex-start;padding:14px" aria-pressed="'+on+'" data-act="toggleFormat" data-id="'+f.id+'">'+
        '<span class="ic" style="margin-top:2px">'+ic(f.id==='checklist'?'checklist':(f.id==='poster'?'star':(f.id==='separate'?'book':'repeat')))+'</span>'+
        '<span style="flex:1"><span style="display:block;font-weight:600">'+esc(f.name)+'</span>'+
        '<span style="display:block;font-size:13.5px;color:rgba(45,47,51,.65);line-height:1.4">'+esc(f.desc)+'</span></span>'+
        '<span class="tick" style="margin-top:2px">'+ic('check')+'</span></button>';
    }).join('') +'</div>'+
    '<div class="card" style="margin-top:16px"><p class="hint" style="margin:0">אם תבחרו גם פוסטר וגם צ׳קליסט, יודפסו שתי גרסאות של אותה שגרה.</p></div>';
};

function fmtTime(t){ return t ? t : ''; }
function rowsHtml(orderIds, statusObj, goalId, checks){
  return orderIds.map(function(id,idx){
    var a = findAct(id), st = statusObj[id];
    var flag = st==='self' ? 'לבד' : (st==='together' ? 'יחד' : (st==='learning' ? 'מתאמנים' : ''));
    var isGoal = (id===goalId);
    return '<div class="brow">'+
      (checks ? '<span class="bbox"></span>' : '')+
      '<span class="bnum">'+(idx+1)+'</span>'+
      '<span class="bic">'+ic(a.i)+'</span>'+
      '<span class="bnm">'+esc(a.t)+'</span>'+
      (isGoal ? '<span class="bflag" style="background:var(--lav)">משימת עצמאות</span>' : '')+
      (flag ? '<span class="bflag">'+flag+'</span>' : '')+
    '</div>';
  }).join('');
}
function factChips(pairs){
  var have = pairs.filter(function(p){ return p[1]; });
  if(!have.length) return '';
  return '<div class="facts">'+have.map(function(p){
    return '<span class="fact"><b>'+esc(p[0])+':</b> '+esc(p[1])+'</span>';
  }).join('')+'</div>';
}
function morningSection(checks){
  var goal = S.morningIndependenceGoal ? findAct(S.morningIndependenceGoal).t : '';
  return '<h3 class="sect">'+ic('sun')+'הבוקר שלי</h3>'+
    rowsHtml(S.morningOrder, S.morningIndependenceStatus, S.morningIndependenceGoal, checks)+
    (goal ? '<div class="goal">'+ic('star')+'<span><b>משימת העצמאות שלי בבוקר:</b> '+esc(goal)+'</span></div>' : '')+
    factChips([['מתחילים', fmtTime(S.morningStartTime)],['יוצאים', fmtTime(S.leavingTime)],['השיר שלנו', S.morningSong]])+
    (S.morningSentence ? '<div class="quote">'+esc(S.morningSentence)+'</div>' : '');
}
function eveningSection(checks){
  var goal = S.eveningIndependenceGoal ? findAct(S.eveningIndependenceGoal).t : '';
  return '<h3 class="sect">'+ic('moon')+'הערב שלי</h3>'+
    rowsHtml(S.eveningOrder, S.eveningIndependenceStatus, S.eveningIndependenceGoal, checks)+
    (goal ? '<div class="goal">'+ic('star')+'<span><b>משימת העצמאות שלי בערב:</b> '+esc(goal)+'</span></div>' : '')+
    factChips([['מתכוננים', fmtTime(S.eveningStartTime)],['שינה', fmtTime(S.bedtime)],['עוזר להירגע', S.calmingActivity]])+
    (S.bedtimeSentence ? '<div class="quote">'+esc(S.bedtimeSentence)+'</div>' : '');
}
function boardShell(title, sub, inner){
  return '<article class="board"><div class="bhead"><h2 class="btitle">'+esc(title)+'</h2>'+
    (sub ? '<p class="bsub">'+esc(sub)+'</p>' : '')+'</div>'+ inner +
    '<div class="bfoot"><span class="lg">StoryLeap</span><span>שגרה קבועה עוזרת לדעת מה מגיע אחר כך</span></div></article>';
}
function boardTitle(){
  return kid() ? 'הבוקר והערב של '+kid() : 'הבוקר והערב שלנו';
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
      var sub = checks ? 'צ׳קליסט יומי' : 'פוסטר קבוע';
      if(layout==='combined'){
        docs.push(boardShell(boardTitle(), sub, morningSection(checks)+eveningSection(checks)));
      } else {
        docs.push(boardShell(kid()? 'הבוקר של '+kid() : 'הבוקר שלנו', sub, morningSection(checks)));
        docs.push(boardShell(kid()? 'הערב של '+kid() : 'הערב שלנו', sub, eveningSection(checks)));
      }
    });
  });
  return docs.join('<div class="pagebreak"></div>');
}
function syncPrintRoot(){
  var root = el('printRoot');
  root.className = 'style-'+S.selectedVisualStyle;
  root.innerHTML = buildBoards();
}

R.result = function(){
  syncPrintRoot();
  return '<h1>'+ (kid()? 'השגרה של '+esc(kid())+' מוכנה' : 'השגרה שלכם מוכנה') +'</h1>'+
    '<p class="sub">כך ייראה הדף המודפס. אפשר לשנות כל דבר ולהדפיס מחדש בכל פעם.</p>'+
    '<div class="previewwrap style-'+S.selectedVisualStyle+'" id="preview">'+ buildBoards() +'</div>'+
    '<div class="actions">'+
      '<button type="button" class="btn" data-act="print">'+ic('printer')+' הדפסה</button>'+
      '<button type="button" class="btn ghost" data-act="savefile">'+ic('save')+' שמירה כקובץ</button>'+
      '<button type="button" class="btn ghost" data-act="edit">'+ic('edit')+' שינוי השגרה</button>'+
      '<button type="button" class="btn ghost" data-act="restart">'+ic('refresh')+' התחלה מחדש</button>'+
    '</div>'+
    '<div class="card"><h2 style="font-size:19px">איך משתמשים בזה בבית</h2>'+
      '<p class="hint" style="margin:0">תלו את הדף בגובה העיניים של הילד, במקום שבו השגרה קורית: המקרר, דלת חדר האמבטיה, או ליד המיטה. בשבוע הראשון עוברים על הלוח יחד. אחרי זה אפשר רק להצביע. כשמשימת העצמאות הופכת לקלה, בוחרים אחת חדשה ומדפיסים מחדש.</p></div>'+
    '<div class="cta">'+
      '<p>שגרה קבועה עוזרת לילד לדעת מה מגיע אחר כך. סיפור אישי יכול לעזור לו גם להבין ולהתכונן למה שהוא עשוי להרגיש בדרך.</p>'+
      '<a class="btn" href="/CreateStory">לגלות את הסיפור האישי של StoryLeap</a>'+
    '</div>'+
    '<div class="card optin-card" data-fa-optin>'+
      '<div data-fa-optin-body>'+
        '<p class="hint">רוצים שנשלח לכם עותק, או עוד פעילויות בחינם כאלה? השאירו מייל (לגמרי אופציונלי)</p>'+
        '<form class="optin-form" data-fa-optin-form>'+
          '<input type="email" data-fa-optin-email placeholder="האימייל שלכם">'+
          '<button type="submit" class="btn small">שליחה</button>'+
        '</form>'+
        '<button type="button" data-fa-optin-skip class="linkbtn" style="display:block;margin-top:8px">לא תודה, אולי בפעם אחרת</button>'+
      '</div>'+
      '<p data-fa-optin-thanks style="display:none;margin:0;font-size:15px;color:rgba(45,47,51,.75)">תודה! נהיה בקשר.</p>'+
    '</div>';
};

var errMsg = '';
var confirmReset = false;

function navFor(key){
  if(key==='intro'){
    var resume = (S.childName || S.morningOrder.length) ? true : false;
    return '<button type="button" class="btn wide" data-act="next">'+(resume?'ממשיכים מאיפה שעצרנו':'בואו נבנה את השגרה שלנו')+'</button>'+
      (resume ? '<button type="button" class="btn ghost small" data-act="restart" style="flex:0 0 auto">מתחילים מחדש</button>' : '');
  }
  if(key==='result'){
    return '<button type="button" class="btn ghost" data-act="back">חזרה</button>'+
           '<button type="button" class="btn" data-act="print">'+ic('printer')+' הדפסה</button>';
  }
  var nextLabel = key==='bridge' ? 'עוברים לערב' : (key==='format' ? 'רואים את התוצאה' : 'הבא');
  return '<button type="button" class="btn ghost" data-act="back">הקודם</button>'+
         '<button type="button" class="btn" data-act="next">'+nextLabel+'</button>';
}

function validate(key){
  if(key==='name' && !S.childName.trim()) return 'רק צריך שם או כינוי, כדי שהלוח ירגיש אישי.';
  if(key==='mPick' && S.selectedMorningActivities.length < 3) return 'בחרו לפחות שלוש פעולות לבוקר.';
  if(key==='ePick' && S.selectedEveningActivities.length < 3) return 'בחרו לפחות שלוש פעולות לערב.';
  if(key==='format' && !S.selectedOutputFormats.length) return 'בחרו לפחות אפשרות אחת.';
  return '';
}

var lastStep = -1;
function render(){
  var key = STEPS[S.step];
  var main = el('screen');
  var stepChanged = (S.step !== lastStep);

  var ae = document.activeElement, memo = null;
  if(!stepChanged && ae && ae.getAttribute && ae.getAttribute('data-act')){
    memo = {a:ae.getAttribute('data-act'), i:ae.getAttribute('data-id'), v:ae.getAttribute('data-val')};
  }
  var scrollY = window.pageYOffset;

  main.innerHTML = (errMsg ? '<div class="err" role="alert">'+esc(errMsg)+'</div>' : '') + R[key]();
  el('nav').innerHTML = navFor(key);

  var shown = Math.min(Math.max(S.step,0), BUILD_STEPS);
  el('bar').style.width = (S.step===0 ? 0 : (S.step >= STEPS.length-1 ? 100 : (shown/BUILD_STEPS)*100)) + '%';
  el('stepnum').textContent = (S.step===0 || S.step===STEPS.length-1) ? '' : ('שלב '+shown+' מתוך '+BUILD_STEPS);

  if(stepChanged){
    window.scrollTo(0,0);
    main.focus({preventScroll:true});
  } else {
    window.scrollTo(0, scrollY);
    if(memo){
      var cands = document.querySelectorAll('[data-act="'+memo.a+'"]');
      for(var i=0;i<cands.length;i++){
        if(cands[i].getAttribute('data-id')===memo.i && cands[i].getAttribute('data-val')===memo.v){
          cands[i].focus({preventScroll:true}); break;
        }
      }
    }
  }
  lastStep = S.step;
}

function go(delta){
  var key = STEPS[S.step];
  if(delta > 0){
    var v = validate(key);
    if(v){ errMsg = v; render(); return; }
  }
  errMsg = '';
  S.step = Math.max(0, Math.min(STEPS.length-1, S.step + delta));
  persist();
  render();
}

function toggleActivity(id, selKey, orderKey){
  var sel = S[selKey], ord = S[orderKey];
  var i = sel.indexOf(id);
  if(i > -1){
    sel.splice(i,1);
    var j = ord.indexOf(id); if(j > -1) ord.splice(j,1);
  } else {
    sel.push(id); ord.push(id);
  }
  errMsg = '';
}
function removeActivity(kind, id){
  if(kind==='m'){ toggleActivity(id,'selectedMorningActivities','morningOrder');
    if(S.morningIndependenceGoal===id) S.morningIndependenceGoal='';
    delete S.morningIndependenceStatus[id];
  } else { toggleActivity(id,'selectedEveningActivities','eveningOrder');
    if(S.eveningIndependenceGoal===id) S.eveningIndependenceGoal='';
    delete S.eveningIndependenceStatus[id];
  }
}
function moveInOrder(kind, id, dir){
  var arr = kind==='m' ? S.morningOrder : S.eveningOrder;
  var i = arr.indexOf(id), j = i + dir;
  if(i<0 || j<0 || j>=arr.length) return;
  arr.splice(j,0,arr.splice(i,1)[0]);
}

document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-act]');
  if(!btn) return;
  var act = btn.getAttribute('data-act');
  var id = btn.getAttribute('data-id');
  var kind = btn.getAttribute('data-kind');
  var val = btn.getAttribute('data-val');

  switch(act){
    case 'next': go(1); return;
    case 'back': go(-1); return;

    case 'toggleM': toggleActivity(id,'selectedMorningActivities','morningOrder'); break;
    case 'toggleE': toggleActivity(id,'selectedEveningActivities','eveningOrder'); break;

    case 'addCustom': {
      var inp = el('customInput'); if(!inp) return;
      var txt = inp.value.trim();
      if(!txt){ inp.focus(); return; }
      var list = kind==='m' ? S.customMorning : S.customEvening;
      if(list.length >= 3) return;
      var cid = 'c_'+kind+'_'+Date.now();
      list.push({id:cid, t:txt, i:'star', custom:true});
      if(kind==='m'){ S.selectedMorningActivities.push(cid); S.morningOrder.push(cid); }
      else { S.selectedEveningActivities.push(cid); S.eveningOrder.push(cid); }
      errMsg=''; break;
    }
    case 'delCustom': {
      var arr = kind==='m' ? S.customMorning : S.customEvening;
      for(var k=0;k<arr.length;k++){ if(arr[k].id===id){ arr.splice(k,1); break; } }
      removeActivity(kind, id);
      break;
    }
    case 'removeAct': removeActivity(kind, id); break;
    case 'moveUp': moveInOrder(kind, id, -1); break;
    case 'moveDown': moveInOrder(kind, id, 1); break;
    case 'backToPick': S.step = (kind==='m') ? 2 : 7; break;

    case 'setIndep': {
      var obj = kind==='m' ? S.morningIndependenceStatus : S.eveningIndependenceStatus;
      obj[id] = (obj[id]===val) ? '' : val;
      break;
    }
    case 'setGoal': {
      if(kind==='m') S.morningIndependenceGoal = (S.morningIndependenceGoal===id)?'':id;
      else S.eveningIndependenceGoal = (S.eveningIndependenceGoal===id)?'':id;
      break;
    }
    case 'setMSentence': S.morningSentence = val || ''; break;
    case 'setCalm': S.calmingActivity = val || ''; break;
    case 'setStyle': S.selectedVisualStyle = id; break;
    case 'toggleFormat': {
      var f = S.selectedOutputFormats, fi = f.indexOf(id);
      if(fi>-1) f.splice(fi,1); else f.push(id);
      errMsg='';
      break;
    }

    case 'print': syncPrintRoot(); window.print(); return;
    case 'savefile':
      syncPrintRoot();
      toast('בחלון ההדפסה בחרו "שמירה כ־PDF" כדי לשמור קובץ.');
      setTimeout(function(){ window.print(); }, 700);
      return;
    case 'edit': S.step = 2; break;
    case 'restart': {
      if(!confirmReset){
        confirmReset = true;
        toast('לחצו שוב כדי למחוק את השגרה ולהתחיל מחדש.');
        setTimeout(function(){ confirmReset=false; }, 4500);
        return;
      }
      confirmReset = false;
      Store.clear();
      S = blank();
      errMsg = '';
      render();
      return;
    }
    default: return;
  }
  persist();
  render();
});

document.addEventListener('input', function(e){
  var t = e.target, id = t.id;
  if(!id) return;
  var map = {
    nameInput:'childName', mStart:'morningStartTime', mLeave:'leavingTime',
    mSong:'morningSong', mSentence:'morningSentence', eStart:'eveningStartTime',
    eBed:'bedtime', eCalm:'calmingActivity', eSentence:'bedtimeSentence'
  };
  if(map[id]){
    S[map[id]] = t.value;
    if(id==='nameInput' && errMsg) { errMsg=''; var e2=document.querySelector('.err'); if(e2) e2.remove(); }
    if(id==='mSentence' || id==='eCalm'){
      var group = t.parentNode.querySelector ? t.closest('.card').querySelectorAll('.chip') : [];
      [].forEach.call(group, function(c){
        c.setAttribute('aria-pressed', String(c.getAttribute('data-val')===t.value));
      });
    }
    persist();
  }
});
document.addEventListener('keydown', function(e){
  if(e.key==='Enter' && e.target.id==='customInput'){
    e.preventDefault();
    var b = document.querySelector('[data-act="addCustom"]');
    if(b) b.click();
  }
  if(e.key==='Enter' && e.target.id==='nameInput'){ e.preventDefault(); go(1); }
});

var drag = null;
document.addEventListener('pointerdown', function(e){
  var handle = e.target.closest('[data-drag]');
  if(!handle) return;
  var li = handle.closest('.item');
  var list = li.parentNode;
  var items = [].slice.call(list.children);
  var idx = items.indexOf(li);
  var r0 = li.getBoundingClientRect();
  var r1 = items[1] ? items[1].getBoundingClientRect() : null;
  var stepH = (items.length>1 && r1) ? Math.abs(items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().top) : r0.height + 10;
  e.preventDefault();
  drag = {list:list, li:li, items:items, idx:idx, cur:idx, startY:e.clientY, h:stepH || (r0.height+10), kind:list.getAttribute('data-kind')};
  li.classList.add('dragging');
  items.forEach(function(x){ if(x!==li) x.classList.add('shift'); });
  try{ handle.setPointerCapture(e.pointerId); }catch(err){}
  document.addEventListener('pointermove', onDragMove);
  document.addEventListener('pointerup', onDragEnd);
  document.addEventListener('pointercancel', onDragEnd);
});
function onDragMove(e){
  if(!drag) return;
  var d = e.clientY - drag.startY;
  drag.li.style.transform = 'translateY('+d+'px)';
  var cur = drag.idx + Math.round(d / drag.h);
  cur = Math.max(0, Math.min(drag.items.length-1, cur));
  if(cur !== drag.cur){
    drag.cur = cur;
    drag.items.forEach(function(x,i){
      if(x === drag.li) return;
      var t = 0;
      if(drag.idx < cur && i > drag.idx && i <= cur) t = -drag.h;
      else if(drag.idx > cur && i < drag.idx && i >= cur) t = drag.h;
      x.style.transform = 'translateY('+t+'px)';
    });
  }
}
function onDragEnd(){
  if(!drag) return;
  var arr = drag.kind==='m' ? S.morningOrder : S.eveningOrder;
  if(drag.cur !== drag.idx){
    arr.splice(drag.cur, 0, arr.splice(drag.idx,1)[0]);
  }
  document.removeEventListener('pointermove', onDragMove);
  document.removeEventListener('pointerup', onDragEnd);
  document.removeEventListener('pointercancel', onDragEnd);
  drag = null;
  persist();
  render();
}

window.addEventListener('beforeprint', function(){ syncPrintRoot(); });

function hydrate(saved){
  if(saved && typeof saved==='object'){
    var fresh = blank();
    Object.keys(fresh).forEach(function(k){
      if(saved[k] !== undefined && saved[k] !== null) fresh[k] = saved[k];
    });
    fresh.step = 0;
    S = fresh;
  }
  render();
}
Store.load().then(hydrate).catch(function(){ render(); });
})();
`;

export default function FreeActivityMorningEvening() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement('script');
    script.textContent = SCRIPT_SRC;
    container.appendChild(script);
    attachEmailOptIn(container, 'morning_evening');
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="fa-me" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </div>
  );
}