import React, { useEffect, useRef } from 'react';
import { attachEmailOptIn } from '@/lib/freeActivityEmailOptIn';
import { useLanguage } from '@/components/LanguageContext';
import { GOODBYE_RITUAL_CONTENT, GOODBYE_PARENT_LINES_EN, GOODBYE_CHILD_LINES_EN } from '@/lib/goodbyeRitualContent';
import PageMeta from '@/components/SEO/PageMeta';

const GOODBYE_META = {
  en: { title: 'Goodbye Ritual for Kids | Free Separation Activity | StoryLeap', description: "Build a calm, personalized goodbye routine for school drop-off. A free interactive tool from StoryLeap to help kids handle separation anxiety." },
  he: { title: 'טקס הפרידה שלנו | פעילות חינמית להתמודדות עם פרידה | StoryLeap', description: 'בונים יחד טקס פרידה קבוע ומרגיע לשער בית הספר. כלי אינטראקטיבי וחינמי מבית StoryLeap שעוזר לילדים להתמודד עם קושי בפרידה.' },
};

const LOGO_URL = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';

const STYLE = `
  .fa-goodbye{}
  .fa-goodbye *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  .fa-goodbye{
    --royal:#1A1A6E;
    --charcoal:#1a1a2e;
    --cream:#FFF0F7;
    --blush:#FFD6EC;
    --peach:#FFF8EC;
    --lavender:#A89BE8;
    --sky:#EAF8FD;
    --mist:#FAFAFE;
    --line:#ede9f8;
    --line-strong:#F0E8F5;
    --shadow:0 4px 20px rgba(255,111,181,.08), 0 2px 10px rgba(79,195,232,.06);
    --shadow-soft:0 4px 20px rgba(255,111,181,.10);
    --grad:linear-gradient(135deg, #FF6FB5, #4FC3E8);
    --r-sm:14px; --r-md:20px; --r-lg:24px; --r-pill:999px;
    --display:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --body:ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-family:var(--body);
    color:var(--charcoal);
    background:linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%);
    min-height:100vh;
    line-height:1.65;
    -webkit-font-smoothing:antialiased;
    font-size:16px;
    border-radius:24px;
    overflow:hidden;
  }

  .fa-goodbye .wrap{max-width:600px;margin:0 auto;padding:20px 18px 56px}

  .fa-goodbye .brandbar{display:flex;align-items:center;justify-content:center;padding:6px 0 18px}
  .fa-goodbye .brandbar img{height:26px;width:auto;opacity:.9}

  .fa-goodbye .progress{margin:0 0 18px;display:none}
  .fa-goodbye .progress.on{display:block}
  .fa-goodbye .track{height:6px;border-radius:var(--r-pill);background:rgba(26,26,110,.09);overflow:hidden}
  .fa-goodbye .fill{display:block;height:100%;border-radius:var(--r-pill);
        background:linear-gradient(90deg,var(--lavender),var(--sky),var(--royal));
        width:0;transition:width .45s cubic-bezier(.4,0,.2,1)}
  .fa-goodbye .steplabel{font-size:13px;color:rgba(26,26,46,.55);margin-top:8px;letter-spacing:.01em}

  .fa-goodbye .card{
    background:rgba(255,255,255,.78);
    backdrop-filter:blur(6px);
    border:1px solid var(--line);
    border-radius:var(--r-lg);
    box-shadow:var(--shadow);
    padding:30px 22px 26px;
  }

  .fa-goodbye .screen{display:none;animation:fa-rise .45s cubic-bezier(.22,1,.36,1) both}
  .fa-goodbye .screen.active{display:block}
  @keyframes fa-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){
    .fa-goodbye .screen{animation:none}
    .fa-goodbye .fill{transition:none}
  }

  .fa-goodbye h1{font-family:var(--display);font-weight:700;font-size:34px;line-height:1.22;
     color:var(--royal);margin:0 0 10px;letter-spacing:-.01em}
  .fa-goodbye h2{font-family:var(--display);font-weight:700;font-size:26px;line-height:1.3;
     color:var(--royal);margin:0 0 8px}
  .fa-goodbye .lede{font-size:17px;color:rgba(26,26,46,.82);margin:0 0 14px}
  .fa-goodbye .sub{font-size:15.5px;color:rgba(26,26,46,.6);margin:0 0 20px}
  .fa-goodbye p{margin:0 0 14px}

  .fa-goodbye .chips{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 26px}
  .fa-goodbye .chip{font-size:13.5px;font-weight:500;color:var(--royal);
        background:rgba(26,26,110,.06);border-radius:var(--r-pill);padding:7px 14px}

  .fa-goodbye .opts{display:flex;flex-direction:column;gap:10px;margin:4px 0 18px}
  .fa-goodbye .opt{
    display:flex;align-items:center;gap:12px;width:100%;text-align:start;
    font-family:var(--body);font-size:16.5px;color:var(--charcoal);
    background:#fff;border:1.5px solid var(--line);border-radius:var(--r-sm);
    padding:15px 16px;cursor:pointer;transition:border-color .18s,background .18s,transform .12s;
    min-height:56px;
  }
  .fa-goodbye .opt:hover{border-color:var(--line-strong)}
  .fa-goodbye .opt:active{transform:scale(.995)}
  .fa-goodbye .opt .mark{
    flex:0 0 22px;height:22px;border-radius:var(--r-pill);
    border:1.5px solid var(--line-strong);display:grid;place-items:center;transition:.18s;
  }
  .fa-goodbye .opt .mark svg{width:12px;height:12px;opacity:0;transition:opacity .18s}
  .fa-goodbye .opt .txt{flex:1}
  .fa-goodbye .opt .note{display:block;font-size:13.5px;color:rgba(26,26,46,.55);margin-top:2px}
  .fa-goodbye .opt[aria-pressed="true"]{border-color:var(--royal);background:#FFD6EC;box-shadow:0 4px 20px rgba(255,111,181,.18)}
  .fa-goodbye .opt[aria-pressed="true"] .mark{background:var(--royal);border-color:var(--royal)}
  .fa-goodbye .opt[aria-pressed="true"] .mark svg{opacity:1}
  .fa-goodbye .opt:focus-visible,.fa-goodbye .btn:focus-visible,.fa-goodbye input:focus-visible,.fa-goodbye .seg button:focus-visible,.fa-goodbye .quick:focus-visible{
    outline:2.5px solid var(--royal);outline-offset:2px}

  .fa-goodbye label.f{display:block;font-size:15.5px;font-weight:500;color:var(--charcoal);margin:0 0 8px}
  .fa-goodbye input[type=text],.fa-goodbye input[type=email]{
    width:100%;font-family:var(--body);font-size:17px;color:var(--charcoal);
    background:#fff;border:1.5px solid var(--line);border-radius:var(--r-sm);
    padding:14px 16px;transition:border-color .18s;
  }
  .fa-goodbye input[type=text]::placeholder,.fa-goodbye input[type=email]::placeholder{color:rgba(26,26,46,.38)}
  .fa-goodbye input[type=text]:focus,.fa-goodbye input[type=email]:focus{border-color:var(--royal);outline:none}
  .fa-goodbye .field{margin:0 0 22px}
  .fa-goodbye .hidden{display:none}

  .fa-goodbye .quicks{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
  .fa-goodbye .quick{font-family:var(--body);font-size:14px;color:var(--royal);background:rgba(26,26,110,.055);
         border:1px solid transparent;border-radius:var(--r-pill);padding:7px 13px;cursor:pointer;transition:.16s}
  .fa-goodbye .quick:hover{background:rgba(26,26,110,.1)}

  .fa-goodbye .seg{display:flex;gap:6px;background:rgba(26,26,110,.05);border-radius:var(--r-pill);padding:5px}
  .fa-goodbye .seg button{
    flex:1;font-family:var(--body);font-size:14.5px;color:rgba(26,26,46,.7);
    background:transparent;border:0;border-radius:var(--r-pill);padding:9px 6px;cursor:pointer;transition:.18s;
  }
  .fa-goodbye .seg button[aria-pressed="true"]{background:#fff;color:var(--royal);font-weight:500;box-shadow:var(--shadow-soft)}

  .fa-goodbye .tip{
    display:flex;gap:10px;align-items:flex-start;
    background:#FFF8EC;border:1.5px solid #F5C842;
    border-radius:var(--r-sm);padding:13px 15px;font-size:14.5px;
    color:#7A5000;margin:2px 0 20px;line-height:1.55;
  }
  .fa-goodbye .tip strong{color:#7A5000;font-weight:600}
  .fa-goodbye .tip svg{flex:0 0 17px;margin-top:3px;color:#7A5000;opacity:.8}

  .fa-goodbye .nav{display:flex;align-items:center;gap:12px;margin-top:6px}
  .fa-goodbye .btn{
    font-family:var(--body);font-size:16.5px;font-weight:500;
    border-radius:var(--r-pill);padding:15px 30px;cursor:pointer;border:1.5px solid transparent;
    transition:.18s;min-height:52px;
  }
  .fa-goodbye .btn-primary{background:var(--grad);color:#fff;flex:1;box-shadow:0 8px 22px rgba(255,111,181,.25)}
  .fa-goodbye .btn-primary:hover{opacity:.92}
  .fa-goodbye .btn-primary:disabled{background:#ede9f8;color:#9a9ab0;box-shadow:none;cursor:not-allowed;opacity:1}
  .fa-goodbye .btn-ghost{background:transparent;color:var(--royal);border-color:var(--line-strong);padding:15px 20px}
  .fa-goodbye .btn-ghost:hover{background:rgba(26,26,110,.045)}
  .fa-goodbye .btn-quiet{background:transparent;color:rgba(26,26,46,.55);border:0;font-size:15px;padding:12px 6px}
  .fa-goodbye .btn-quiet:hover{color:var(--royal)}

  .fa-goodbye .ritual{
    background:linear-gradient(165deg,#FFFDFB 0%,#FFF0F7 55%,#EAF8FD 100%);
    border:1px solid rgba(26,26,110,.12);
    border-radius:var(--r-lg);
    padding:28px 22px 24px;
    box-shadow:var(--shadow);
    position:relative;overflow:hidden;
  }
  .fa-goodbye .ritual::before{
    content:"";position:absolute;inset:auto -60px -80px auto;width:220px;height:220px;border-radius:50%;
    background:radial-gradient(circle at 30% 75%,rgba(255,111,181,.25),rgba(79,195,232,.20) 60%,transparent 75%);
    pointer-events:none;
  }
  .fa-goodbye .ritual-head{text-align:center;position:relative;padding-bottom:18px;margin-bottom:6px;
               border-bottom:1px solid rgba(26,26,110,.1)}
  .fa-goodbye .ritual-eyebrow{font-size:13px;letter-spacing:.08em;color:rgba(26,26,46,.5);margin-bottom:6px}
  .fa-goodbye .ritual-title{font-family:var(--display);font-weight:700;font-size:30px;line-height:1.25;color:var(--royal);margin:0}
  .fa-goodbye .ritual-sub{font-size:14.5px;color:rgba(26,26,46,.6);margin-top:6px}

  .fa-goodbye .rows{position:relative}
  .fa-goodbye .row{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid rgba(26,26,110,.07)}
  .fa-goodbye .row:last-child{border-bottom:0}
  .fa-goodbye .num{
    flex:0 0 30px;height:30px;border-radius:var(--r-pill);display:grid;place-items:center;
    font-size:14px;font-weight:500;color:var(--royal);background:var(--sky);margin-top:2px;
  }
  .fa-goodbye .row:nth-child(2) .num{background:var(--lavender)}
  .fa-goodbye .row:nth-child(3) .num{background:var(--blush)}
  .fa-goodbye .row:nth-child(4) .num{background:var(--peach)}
  .fa-goodbye .row:nth-child(5) .num{background:var(--sky)}
  .fa-goodbye .row:nth-child(6) .num{background:var(--lavender)}
  .fa-goodbye .row-k{font-size:13.5px;color:rgba(26,26,46,.55);margin-bottom:2px}
  .fa-goodbye .row-v{font-size:17px;color:var(--charcoal);line-height:1.5}
  .fa-goodbye .row-v.quote{font-family:var(--display);font-size:19px;line-height:1.45;color:var(--royal)}
  .fa-goodbye .row-v ul{margin:4px 0 0;padding-inline-start:18px;padding-inline-end:0}
  .fa-goodbye .row-v li{margin-bottom:3px}
  .fa-goodbye .empty{color:rgba(26,26,46,.38)}

  .fa-goodbye .warmnote{
    margin-top:20px;background:rgba(255,255,255,.7);border-radius:var(--r-md);
    padding:18px 18px;font-size:15.5px;line-height:1.6;color:rgba(26,26,46,.8);position:relative;
  }
  .fa-goodbye .warmnote strong{color:var(--royal);font-weight:500}

  .fa-goodbye .howto{margin-top:18px}
  .fa-goodbye .howto h3{font-family:var(--display);font-size:19px;color:var(--royal);margin:0 0 10px;font-weight:700}
  .fa-goodbye .howto ul{margin:0;padding-inline-start:20px;padding-inline-end:0;font-size:15.5px;color:rgba(26,26,46,.78)}
  .fa-goodbye .howto li{margin-bottom:7px}

  .fa-goodbye .actions{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0}
  .fa-goodbye .actions .btn{flex:1 1 45%;min-width:140px;padding:14px 18px;font-size:15.5px}
  .fa-goodbye .cta{
    margin-top:26px;border-radius:var(--r-lg);padding:26px 22px;text-align:center;
    background:linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%);
  }
  .fa-goodbye .cta p{font-family:var(--display);font-weight:700;font-size:19.5px;line-height:1.5;color:var(--royal);margin:0 0 18px}
  .fa-goodbye .cta .btn{background:var(--grad);color:#fff;display:inline-block;text-decoration:none;
            box-shadow:0 8px 22px rgba(255,111,181,.25)}

  .fa-goodbye .disclaimer{font-size:12.5px;line-height:1.55;color:rgba(26,26,46,.5);text-align:center;margin:24px 6px 0}

  .fa-goodbye .savebox{margin-top:14px}
  .fa-goodbye .savebox textarea{
    width:100%;min-height:180px;font-family:var(--body);font-size:14px;line-height:1.6;
    border:1.5px solid var(--line);border-radius:var(--r-sm);padding:14px;color:var(--charcoal);background:#fff;
  }

  .fa-goodbye .optin-card{margin-top:18px}
  .fa-goodbye .optin-card .hint{font-size:14.5px;color:rgba(26,26,46,.7);margin:0 0 10px}
  .fa-goodbye .optin-form{display:flex;gap:8px;flex-wrap:wrap}
  .fa-goodbye .optin-form input{flex:1;min-width:180px}
  .fa-goodbye .optin-form .btn{padding:12px 20px;font-size:15px;min-height:auto}

  @media (min-width:640px){
    .fa-goodbye{font-size:17.5px}
    .fa-goodbye .wrap{padding:34px 20px 70px}
    .fa-goodbye .card{padding:40px 38px 34px}
    .fa-goodbye h1{font-size:40px}
    .fa-goodbye h2{font-size:29px}
    .fa-goodbye .ritual{padding:34px 32px 30px}
    .fa-goodbye .ritual-title{font-size:34px}
  }

  @media print{
    .fa-goodbye, .fa-goodbye *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    .fa-goodbye{background:#fff}
    .fa-goodbye .noprint{display:none!important}
    .fa-goodbye .wrap{max-width:100%;padding:0}
    .fa-goodbye .card{border:0;box-shadow:none;padding:0;background:transparent}
    .fa-goodbye .ritual{
      box-shadow:none;
      border:1px solid rgba(26,26,110,.15);
      background:linear-gradient(165deg,#FFFDFB 0%,#FFF0F7 55%,#EAF8FD 100%);
      padding:18px 20px 16px;
      page-break-inside:avoid;break-inside:avoid;
    }
    .fa-goodbye .ritual::before{display:none}
    .fa-goodbye .ritual-title{font-size:26px}
    .fa-goodbye .ritual-head{padding-bottom:12px}
    .fa-goodbye .row{padding:9px 0;page-break-inside:avoid;break-inside:avoid}
    .fa-goodbye .warmnote{background:#FFF8EC;border:1px solid #F5C842;padding:12px 14px;margin-top:14px;page-break-inside:avoid;break-inside:avoid}
    .fa-goodbye .howto{page-break-inside:avoid;break-inside:avoid;margin-top:12px}
    @page{margin:12mm}
  }
`;

function buildBodyHtml(T) {
  return `
<div class="wrap">

  <div class="brandbar noprint"><img src="${LOGO_URL}" alt="StoryLeap"></div>

  <div class="progress noprint" id="progress">
    <div class="track"><span class="fill" id="fill"></span></div>
    <div class="steplabel" id="steplabel"></div>
  </div>

  <div class="card">

    <section class="screen active" id="s0">
      <h1>${T.s0.h1}</h1>
      <p class="lede">${T.s0.lede}</p>
      <p>${T.s0.p1}</p>
      <p>${T.s0.p2}</p>
      <div class="chips">
        <span class="chip">${T.s0.chips[0]}</span>
        <span class="chip">${T.s0.chips[1]}</span>
        <span class="chip">${T.s0.chips[2]}</span>
      </div>
      <div class="nav"><button class="btn btn-primary" data-go="1">${T.s0.btn}</button></div>
    </section>

    <section class="screen" id="s1">
      <h2>${T.s1.h2}</h2>
      <p class="sub">${T.s1.sub}</p>

      <div class="field">
        <label class="f" for="name">${T.s1.nameLabel}</label>
        <input type="text" id="name" placeholder="${T.s1.namePh}" autocomplete="off">
      </div>

      <div class="field">
        <label class="f">${T.s1.genderLabel}</label>
        <div class="seg" id="segChild" role="group" aria-label="${T.s1.genderAria}">
          <button type="button" data-v="boy">${T.s1.genderBoy}</button>
          <button type="button" data-v="girl">${T.s1.genderGirl}</button>
          <button type="button" data-v="neutral" aria-pressed="true">${T.s1.genderNeutral}</button>
        </div>
      </div>

      <div class="field">
        <label class="f">${T.s1.parentLabel}</label>
        <div class="seg" id="segParent" role="group" aria-label="${T.s1.parentAria}">
          <button type="button" data-v="mom">${T.s1.parentMom}</button>
          <button type="button" data-v="dad">${T.s1.parentDad}</button>
          <button type="button" data-v="parent" aria-pressed="true">${T.s1.parentOther}</button>
        </div>
      </div>

      <div class="nav">
        <button class="btn btn-ghost" data-go="0">${T.navBack}</button>
        <button class="btn btn-primary" data-go="2" id="nameNext" disabled>${T.s1.next}</button>
      </div>
    </section>

    <section class="screen" id="s2">
      <h2>${T.s2.h2}</h2>
      <p class="sub">${T.s2.sub}</p>
      <div class="opts" id="optsGoodbye"></div>
      <div class="field hidden" id="goodbyeOtherWrap">
        <input type="text" id="goodbyeOther" placeholder="${T.s2.otherPh}" autocomplete="off">
      </div>
      <div class="tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>${T.s2.tip}</span>
      </div>
      <div class="nav">
        <button class="btn btn-ghost" data-go="1">${T.navBack}</button>
        <button class="btn btn-primary" data-go="3" id="goodbyeNext" disabled>${T.s2.next}</button>
      </div>
    </section>

    <section class="screen" id="s3">
      <h2>${T.s3.h2}</h2>
      <p class="sub">${T.s3.sub}</p>
      <div class="opts" id="optsParent"></div>
      <div class="field hidden" id="parentOtherWrap">
        <input type="text" id="parentOther" placeholder="${T.s3.otherPh}" autocomplete="off">
      </div>
      <div class="tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>${T.s3.tip}</span>
      </div>
      <div class="nav">
        <button class="btn btn-ghost" data-go="2">${T.navBack}</button>
        <button class="btn btn-primary" data-go="4" id="parentNext" disabled>${T.s3.next}</button>
      </div>
    </section>

    <section class="screen" id="s4">
      <h2 id="childQ">${T.s4.titleDefault}</h2>
      <p class="sub">${T.s4.sub}</p>
      <div class="opts" id="optsChild"></div>
      <div class="field hidden" id="childOtherWrap">
        <input type="text" id="childOther" placeholder="${T.s4.otherPh}" autocomplete="off">
      </div>
      <div class="tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>${T.s4.tip}</span>
      </div>
      <div class="nav">
        <button class="btn btn-ghost" data-go="3">${T.navBack}</button>
        <button class="btn btn-primary" data-go="5" id="childNext" disabled>${T.s4.next}</button>
      </div>
    </section>

    <section class="screen" id="s5">
      <h2>${T.s5.h2}</h2>
      <p class="sub">${T.s5.sub}</p>
      <div class="opts" id="optsHelp"></div>
      <div class="field hidden" id="helpOtherWrap">
        <input type="text" id="helpOther" placeholder="${T.s5.otherPh}" autocomplete="off">
      </div>
      <div class="tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
        <span>${T.s5.tip}</span>
      </div>
      <div class="nav">
        <button class="btn btn-ghost" data-go="4">${T.navBack}</button>
        <button class="btn btn-primary" data-go="6" id="helpNext" disabled>${T.s5.next}</button>
      </div>
    </section>

    <section class="screen" id="s6">
      <h2>${T.s6.h2}</h2>
      <p class="sub">${T.s6.sub}</p>

      <div class="field">
        <label class="f" for="pickup">${T.s6.pickupLabel}</label>
        <input type="text" id="pickup" placeholder="${T.s6.pickupPh}" autocomplete="off">
        <div class="quicks" data-target="pickup">
          ${T.s6.pickupQuick.map((q) => `<button type="button" class="quick">${q}</button>`).join('')}
        </div>
      </div>

      <div class="field">
        <label class="f" for="first">${T.s6.firstLabel}</label>
        <input type="text" id="first" placeholder="${T.s6.firstPh}" autocomplete="off">
        <div class="quicks" data-target="first">
          ${T.s6.firstQuick.map((q) => `<button type="button" class="quick">${q}</button>`).join('')}
        </div>
      </div>

      <div class="nav">
        <button class="btn btn-ghost" data-go="5">${T.navBack}</button>
        <button class="btn btn-primary" data-go="7">${T.s6.next}</button>
      </div>
    </section>

    <section class="screen" id="s7">
      <div class="ritual" id="ritual">
        <div class="ritual-head">
          <div class="ritual-eyebrow">${T.s7.eyebrow}</div>
          <h2 class="ritual-title" id="sumName">—</h2>
          <div class="ritual-sub">${T.s7.sub}</div>
        </div>

        <div class="rows">
          <div class="row"><div class="num">1</div><div><div class="row-k">${T.s7.rowGoodbye}</div><div class="row-v" id="sum1"></div></div></div>
          <div class="row"><div class="num">2</div><div><div class="row-k" id="sumk2">${T.s7.rowParentDefault}</div><div class="row-v quote" id="sum2"></div></div></div>
          <div class="row"><div class="num">3</div><div><div class="row-k" id="sumk3">${T.s7.rowChildDefault}</div><div class="row-v quote" id="sum3"></div></div></div>
          <div class="row"><div class="num">4</div><div><div class="row-k">${T.s7.rowHelp}</div><div class="row-v" id="sum4"></div></div></div>
          <div class="row"><div class="num">5</div><div><div class="row-k">${T.s7.rowPickup}</div><div class="row-v" id="sum5"></div></div></div>
          <div class="row"><div class="num">6</div><div><div class="row-k">${T.s7.rowFirst}</div><div class="row-v" id="sum6"></div></div></div>
        </div>

        <div class="warmnote">
          <strong>${T.s7.warmStrong}</strong><br>
          ${T.s7.warmText}
        </div>

        <div class="howto">
          <h3>${T.s7.howtoTitle}</h3>
          <ul>
            ${T.s7.howtoItems.map((i) => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="actions noprint">
        <button class="btn btn-ghost" id="btnPrint">${T.s7.btnPrint}</button>
        <button class="btn btn-ghost" id="btnSave">${T.s7.btnSave}</button>
        <button class="btn btn-ghost" id="btnRestart">${T.s7.btnRestart}</button>
      </div>

      <div class="savebox hidden noprint" id="savebox">
        <textarea id="savetext" readonly aria-label="${T.s7.savetextAria}"></textarea>
        <div class="nav" style="margin-top:10px">
          <button class="btn btn-quiet" id="btnCopy">${T.s7.btnCopy}</button>
          <button class="btn btn-quiet" id="btnCloseSave">${T.s7.btnCloseSave}</button>
        </div>
      </div>

      <div class="cta noprint">
        <p>${T.s7.ctaText}</p>
        <a class="btn" href="/CreateStory" id="ctaLink">${T.s7.ctaLink}</a>
      </div>

      <div class="card optin-card noprint" data-fa-optin>
        <div data-fa-optin-body>
          <p class="hint">${T.s7.optinHint}</p>
          <form class="optin-form" data-fa-optin-form>
            <input type="email" data-fa-optin-email placeholder="${T.s7.optinPh}">
            <button type="submit" class="btn btn-ghost">${T.s7.optinSubmit}</button>
          </form>
          <button type="button" data-fa-optin-skip class="btn-quiet">${T.s7.optinSkip}</button>
        </div>
        <p data-fa-optin-thanks style="display:none;margin:0;font-size:15px;color:rgba(26,26,46,.75)">${T.s7.optinThanks}</p>
      </div>

      <p class="disclaimer noprint">${T.s7.disclaimer}</p>
    </section>

  </div>
</div>
`;
}

function buildScriptSrc(T, lang) {
  const D = {
    isHe: lang === 'he',
    s7: T.s7,
    fallback: T.fallback,
    sumNameFallback: T.sumNameFallback,
    stepLabelTpl: T.stepLabel('{{n}}', '{{total}}'),
    childQTitleTpl: T.s4.titleWithName('{{name}}'),
    childQTitleDefault: T.s4.titleDefault,
    GOODBYE: T.GOODBYE,
    HELP: T.HELP,
    parentOtherLabel: T.parentOtherLabel,
    childOtherLabel: T.childOtherLabel,
    parentLinesEn: lang === 'en' ? GOODBYE_PARENT_LINES_EN : null,
    childLinesEn: lang === 'en' ? GOODBYE_CHILD_LINES_EN : null,
    parentWordMom: lang === 'he' ? 'מה אמא אומרת' : "What Mom says",
    parentWordDad: lang === 'he' ? 'מה אבא אומר' : "What Dad says",
    childWordBoy: lang === 'he' ? 'מה אני אומר לעצמי' : T.s7.rowChildDefault,
    childWordGirl: lang === 'he' ? 'מה אני אומרת לעצמי' : T.s7.rowChildDefault,
    downloadFileName: T.downloadFileName,
  };
  const dataJson = JSON.stringify(D);

  return `
(function(){
  "use strict";

  var D = ${dataJson};

  var state = {
    name:"", childG:"neutral", parentR:"parent",
    goodbye:null, goodbyeOther:"",
    parentLine:null, parentOther:"",
    childLine:null, childOther:"",
    help:[], helpOther:"",
    pickup:"", first:""
  };

  var TOTAL = 6;
  var current = 0;

  var CHECK = '<span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>';

  function parentLines(){
    if(!D.isHe){ return D.parentLinesEn; }
    var m = state.parentR, c = state.childG;
    var nifrad = m==="mom" ? "נפרדת" : m==="dad" ? "נפרד" : "נפרד/ת";
    var somech = m==="mom" ? "סומכת" : m==="dad" ? "סומך" : "סומך/ת";
    var alecha = c==="girl" ? "עלייך" : "עליך";
    var at = c==="boy" ? "אתה" : c==="girl" ? "את" : "את/ה";
    var batuach = c==="boy" ? "בטוח" : c==="girl" ? "בטוחה" : "בטוח/ה";
    var ahuv = c==="boy" ? "אהוב" : c==="girl" ? "אהובה" : "אהוב/ה";
    var muchan = c==="boy" ? "מוכן" : c==="girl" ? "מוכנה" : "מוכן/ה";
    var yachol = c==="boy" ? "יכול" : c==="girl" ? "יכולה" : "יכול/ה";
    return [
      {id:"p1", t:"אני "+nifrad+" ממך עכשיו, ואחזור לקחת אותך אחר כך."},
      {id:"p2", t:at+" "+batuach+", "+ahuv+" ו"+muchan+"."},
      {id:"p3", t:"גם אם יהיה קצת קשה, "+at+" לא לבד."},
      {id:"p4", t:"אני "+somech+" "+alecha+". "+at+" "+yachol+"."},
      {id:"other", t:D.parentOtherLabel}
    ];
  }

  function childLines(){
    if(!D.isHe){ return D.childLinesEn; }
    var c = state.childG, m = state.parentR;
    var yachol = c==="boy" ? "יכול" : c==="girl" ? "יכולה" : "יכול/ה";
    var batuach = c==="boy" ? "בטוח" : c==="girl" ? "בטוחה" : "בטוח/ה";
    var back = m==="mom" ? "אמא חוזרת." : m==="dad" ? "אבא חוזר." : "אמא או אבא חוזרים.";
    return [
      {id:"c1", t:"אני "+yachol+"."},
      {id:"c2", t:back},
      {id:"c3", t:"אני "+batuach+"."},
      {id:"c4", t:"אני אנסה, גם אם קצת קשה לי."},
      {id:"other", t:D.childOtherLabel}
    ];
  }

  var GOODBYE = D.GOODBYE;
  var HELP = D.HELP;

  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(ch){
    return ({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"})[ch]; }); }

  function renderOpts(container, items, selectedIds, multi){
    container.innerHTML = items.map(function(o){
      var on = multi ? selectedIds.indexOf(o.id) > -1 : selectedIds === o.id;
      return '<button type="button" class="opt" data-id="'+o.id+'" aria-pressed="'+(on?"true":"false")+'">'
        + CHECK
        + '<span class="txt">'+esc(o.t)+(o.n?'<span class="note">'+esc(o.n)+'</span>':'')+'</span>'
        + '</button>';
    }).join("");
  }

  function textOf(list, id, other){
    if(id === "other") return other.trim();
    for(var i=0;i<list.length;i++){ if(list[i].id === id) return list[i].t; }
    return "";
  }

  function go(n){
    var cur = document.querySelector(".fa-goodbye .screen.active");
    if(cur) cur.classList.remove("active");
    $("s"+n).classList.add("active");
    current = n;

    var p = $("progress");
    if(n >= 1 && n <= 6){
      p.classList.add("on");
      $("fill").style.width = (n/TOTAL*100) + "%";
      $("steplabel").textContent = D.stepLabelTpl.replace("{{n}}", n).replace("{{total}}", TOTAL);
    } else {
      p.classList.remove("on");
    }

    if(n === 3) renderOpts($("optsParent"), parentLines(), state.parentLine, false);
    if(n === 4){
      renderOpts($("optsChild"), childLines(), state.childLine, false);
      $("childQ").textContent = state.name ? D.childQTitleTpl.replace("{{name}}", state.name) : D.childQTitleDefault;
    }
    if(n === 7) buildSummary();

    window.scrollTo({top:0, behavior:"smooth"});
  }

  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-go]");
    if(b && !b.disabled) go(parseInt(b.getAttribute("data-go"),10));
  });

  $("name").addEventListener("input", function(){
    state.name = this.value.trim();
    $("nameNext").disabled = state.name.length === 0;
  });

  function segHandler(el, key){
    el.addEventListener("click", function(e){
      var b = e.target.closest("button"); if(!b) return;
      Array.prototype.forEach.call(el.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed","true");
      state[key] = b.getAttribute("data-v");
      state.parentLine = null; state.childLine = null;
      $("parentNext").disabled = true; $("childNext").disabled = true;
    });
  }
  segHandler($("segChild"), "childG");
  segHandler($("segParent"), "parentR");

  function singleSelect(containerId, stateKey, otherWrapId, otherInputId, otherStateKey, nextBtnId){
    var c = $(containerId);
    c.addEventListener("click", function(e){
      var b = e.target.closest(".opt"); if(!b) return;
      var id = b.getAttribute("data-id");
      state[stateKey] = id;
      Array.prototype.forEach.call(c.querySelectorAll(".opt"), function(x){
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      var isOther = id === "other";
      $(otherWrapId).classList.toggle("hidden", !isOther);
      if(isOther) setTimeout(function(){ $(otherInputId).focus(); }, 60);
      $(nextBtnId).disabled = isOther && state[otherStateKey].trim().length === 0;
    });
    $(otherInputId).addEventListener("input", function(){
      state[otherStateKey] = this.value;
      $(nextBtnId).disabled = this.value.trim().length === 0;
    });
  }

  renderOpts($("optsGoodbye"), GOODBYE, null, false);
  renderOpts($("optsHelp"), HELP, [], true);
  singleSelect("optsGoodbye","goodbye","goodbyeOtherWrap","goodbyeOther","goodbyeOther","goodbyeNext");
  singleSelect("optsParent","parentLine","parentOtherWrap","parentOther","parentOther","parentNext");
  singleSelect("optsChild","childLine","childOtherWrap","childOther","childOther","childNext");

  $("optsHelp").addEventListener("click", function(e){
    var b = e.target.closest(".opt"); if(!b) return;
    var id = b.getAttribute("data-id");
    var i = state.help.indexOf(id);
    if(i > -1){ state.help.splice(i,1); }
    else {
      if(state.help.length >= 3) return;
      state.help.push(id);
    }
    renderOpts($("optsHelp"), HELP, state.help, true);
    var isOther = state.help.indexOf("other") > -1;
    $("helpOtherWrap").classList.toggle("hidden", !isOther);
    updateHelpNext();
  });
  $("helpOther").addEventListener("input", function(){ state.helpOther = this.value; updateHelpNext(); });
  function updateHelpNext(){
    var ok = state.help.length > 0;
    if(state.help.indexOf("other") > -1 && state.helpOther.trim().length === 0) ok = false;
    $("helpNext").disabled = !ok;
  }

  $("pickup").addEventListener("input", function(){ state.pickup = this.value; });
  $("first").addEventListener("input", function(){ state.first = this.value; });
  Array.prototype.forEach.call(document.querySelectorAll(".fa-goodbye .quicks"), function(g){
    g.addEventListener("click", function(e){
      var b = e.target.closest(".quick"); if(!b) return;
      var t = g.getAttribute("data-target");
      $(t).value = b.textContent;
      state[t === "pickup" ? "pickup" : "first"] = b.textContent;
    });
  });

  function fill(el, val, fallback){
    if(val && String(val).trim()){ el.textContent = val; el.classList.remove("empty"); }
    else { el.textContent = fallback; el.classList.add("empty"); }
  }

  function buildSummary(){
    var name = state.name || D.sumNameFallback;
    $("sumName").textContent = name;

    var parentWord = state.parentR === "mom" ? D.parentWordMom : state.parentR === "dad" ? D.parentWordDad : D.s7.rowParentDefault;
    $("sumk2").textContent = parentWord;
    $("sumk3").textContent = D.isHe
      ? (state.childG === "boy" ? "מה אני אומר לעצמי" : state.childG === "girl" ? "מה אני אומרת לעצמי" : "מה אני אומר/ת לעצמי")
      : D.s7.rowChildDefault;

    fill($("sum1"), textOf(GOODBYE, state.goodbye, state.goodbyeOther), D.fallback);
    fill($("sum2"), textOf(parentLines(), state.parentLine, state.parentOther), D.fallback);
    fill($("sum3"), textOf(childLines(), state.childLine, state.childOther), D.fallback);

    var helps = state.help.map(function(id){ return textOf(HELP, id, state.helpOther); }).filter(Boolean);
    if(helps.length){
      $("sum4").innerHTML = "<ul>" + helps.map(function(h){ return "<li>"+esc(h)+"</li>"; }).join("") + "</ul>";
      $("sum4").classList.remove("empty");
    } else {
      $("sum4").textContent = D.fallback;
      $("sum4").classList.add("empty");
    }

    fill($("sum5"), state.pickup, D.fallback);
    fill($("sum6"), state.first, D.fallback);
  }

  function asText(){
    var name = state.name || D.sumNameFallback;
    var helps = state.help.map(function(id){ return textOf(HELP, id, state.helpOther); }).filter(Boolean);
    var L = [];
    L.push(D.s7.eyebrow + " " + name);
    L.push(D.s7.sub);
    L.push("");
    L.push("1. " + D.s7.rowGoodbye + ": " + (textOf(GOODBYE, state.goodbye, state.goodbyeOther) || "—"));
    L.push("2. " + $("sumk2").textContent + ": " + (textOf(parentLines(), state.parentLine, state.parentOther) || "—"));
    L.push("3. " + $("sumk3").textContent + ": " + (textOf(childLines(), state.childLine, state.childOther) || "—"));
    L.push("4. " + D.s7.rowHelp + ": " + (helps.length ? helps.join(" · ") : "—"));
    L.push("5. " + D.s7.rowPickup + ": " + (state.pickup || "—"));
    L.push("6. " + D.s7.rowFirst + ": " + (state.first || "—"));
    L.push("");
    L.push(D.s7.warmStrong);
    return L.join("\\n");
  }

  $("btnPrint").addEventListener("click", function(){ window.print(); });

  $("btnSave").addEventListener("click", function(){
    var txt = asText();
    $("savetext").value = txt;
    var ok = false;
    try{
      var blob = new Blob([ "\\uFEFF" + txt ], {type:"text/plain;charset=utf-8"});
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = D.downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
      ok = true;
    }catch(err){ ok = false; }
    if(!ok) $("savebox").classList.remove("hidden");
  });

  $("btnCopy").addEventListener("click", function(){
    var ta = $("savetext");
    ta.removeAttribute("readonly"); ta.select();
    try{ document.execCommand("copy"); this.textContent = D.s7.btnCopyDone; }
    catch(e){ this.textContent = D.s7.btnCopyManual; }
    ta.setAttribute("readonly","readonly");
  });
  $("btnCloseSave").addEventListener("click", function(){ $("savebox").classList.add("hidden"); });

  $("btnRestart").addEventListener("click", function(){
    state = { name:"", childG:"neutral", parentR:"parent", goodbye:null, goodbyeOther:"",
      parentLine:null, parentOther:"", childLine:null, childOther:"", help:[], helpOther:"",
      pickup:"", first:"" };
    $("name").value=""; $("goodbyeOther").value=""; $("parentOther").value="";
    $("childOther").value=""; $("helpOther").value=""; $("pickup").value=""; $("first").value="";
    ["goodbyeOtherWrap","parentOtherWrap","childOtherWrap","helpOtherWrap","savebox"].forEach(function(id){
      $(id).classList.add("hidden");
    });
    ["nameNext","goodbyeNext","parentNext","childNext","helpNext"].forEach(function(id){ $(id).disabled = true; });
    Array.prototype.forEach.call($("segChild").querySelectorAll("button"), function(b,i){
      b.setAttribute("aria-pressed", i===2 ? "true":"false"); });
    Array.prototype.forEach.call($("segParent").querySelectorAll("button"), function(b,i){
      b.setAttribute("aria-pressed", i===2 ? "true":"false"); });
    renderOpts($("optsGoodbye"), GOODBYE, null, false);
    renderOpts($("optsHelp"), HELP, [], true);
    go(0);
  });
})();
`;
}

export default function FreeActivityGoodbye() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isHe = lang === 'he';
  const T = GOODBYE_RITUAL_CONTENT[isHe ? 'he' : 'en'];

  useEffect(() => {
    const container = ref.current;
    const script = document.createElement('script');
    script.textContent = buildScriptSrc(T, isHe ? 'he' : 'en');
    container.appendChild(script);
    attachEmailOptIn(container, 'goodbye_ritual');
    return () => {
      script.remove();
    };
  }, [lang]);

  return (
    <div className="fa-goodbye" dir={isHe ? 'rtl' : 'ltr'}>
      <PageMeta title={GOODBYE_META[isHe ? 'he' : 'en'].title} description={GOODBYE_META[isHe ? 'he' : 'en'].description} />
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div key={lang} ref={ref} dangerouslySetInnerHTML={{ __html: buildBodyHtml(T) }} />
    </div>
  );
}