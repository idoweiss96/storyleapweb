import React, { useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { base44 } from '@/api/base44Client';
import PageMeta from '@/components/SEO/PageMeta';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import {
  Compass, Palette, HeartHandshake, ArrowRight, ShieldCheck, Lock,
  Sparkles, Users, UserRound, BadgeCheck, ListChecks, CalendarCheck,
  Smile, BellRing, Route,
} from 'lucide-react';

import '@/styles/home-new.css';
import NavbarNew from '@/components/home-new/NavbarNew';
import FooterNew from '@/components/home-new/FooterNew';
import MomentPicker from '@/components/home-new/MomentPicker';
import SectionHeading from '@/components/home-new/SectionHeading';
import CTAButtonNew from '@/components/home-new/CTAButtonNew';
import Reveal from '@/components/home-new/Reveal';
import HNLink from '@/components/home-new/hnLink';
import {
  HOME_NEW_META, HERO, PCT, TRY, JOURNEY, APPROACH, TRUST, SPACE, PRO, CLOSE,
} from '@/components/home-new/homeNewContent';

const PCT_ICONS = [Compass, Palette, HeartHandshake];
const TRUST_ICONS = [UserRound, Lock, ShieldCheck, Users, BadgeCheck, Sparkles];
const SPACE_ICONS = [Route, ListChecks, Smile, BellRing, CalendarCheck];

/**
 * Home-new — isolated redesign prototype. Additive only.
 * Route: /HomeNew (auto-registered by pages.config.js when this file exists).
 * Not linked from production navigation. noindex.
 *
 * While mounted, adds `hn-active` to <html> so src/styles/home-new.css can hide
 * the inherited Layout chrome (nav, footer, star-field, page background) for
 * this route ONLY. Removed on unmount -> the normal shell is fully restored.
 * No source change to Layout.jsx or any shared file.
 */
export default function HomeNew() {
  const { lang, toggleLang } = useLanguage();
  const L = lang === 'he' ? 'he' : 'en';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('hn-active');
    return () => root.classList.remove('hn-active');
  }, []);

  const meta = HOME_NEW_META[L];
  const hero = HERO[L];
  const pct = PCT[L];
  const tryS = TRY[L];
  const journey = JOURNEY[L];
  const approach = APPROACH[L];
  const trust = TRUST[L];
  const space = SPACE[L];
  const pro = PRO[L];
  const close = CLOSE[L];

  const handleLogin = () => {
    try { base44.auth.redirectToLogin(); } catch (_) {}
  };

  return (
    <div className="home-new" id="top">
      <PageMeta title={meta.title} description={meta.description} />
      <NoIndexMeta />

      <NavbarNew lang={L} onToggleLang={toggleLang} onLogin={handleLogin} />

      {/* 1 - HERO: the moment question is the hero */}
      <section className="hn-hero">
        <div className="hn-wrap hn-wrap--narrow">
          <p className="hn-eyebrow hn-hero__eyebrow">{hero.eyebrow}</p>
          <h1 className="hn-h1">{hero.h1}</h1>
          <p className="hn-lead">{hero.lead}</p>
          <MomentPicker lang={L} label={hero.pickerLabel} />
        </div>
      </section>

      {/* 2 - PARENT / CHILD / TOGETHER */}
      <section className="hn-section hn-section--mist" id="how">
        <div className="hn-wrap">
          <Reveal>
            <SectionHeading eyebrow={pct.eyebrow} title={pct.h2} lead={pct.lead} />
          </Reveal>
          <Reveal>
            <div className="hn-pct">
              {pct.cols.map((c, i) => {
                const Icon = PCT_ICONS[i];
                return (
                  <div className="hn-pct__col" key={c.tag}>
                    <span className="hn-pct__tag">{c.tag}</span>
                    <div className="hn-card__icon" style={{ marginBottom: 12 }}>
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className="hn-h3">{c.h3}</h3>
                    <p>{c.p}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 - TRY SOMETHING NOW */}
      <section className="hn-section hn-section--cream">
        <div className="hn-wrap">
          <Reveal>
            <SectionHeading eyebrow={tryS.eyebrow} title={tryS.h2} lead={tryS.lead} />
          </Reveal>
          <Reveal>
            <div className="hn-grid hn-grid--3">
              {tryS.cards.map((c) => (
                <HNLink to={c.to} className="hn-card" key={c.to}>
                  <h3 className="hn-h3">{c.h3}</h3>
                  <p>{c.p}</p>
                  <span className="hn-card__next">
                    {c.next} <ArrowRight aria-hidden="true" />
                  </span>
                </HNLink>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <HNLink to="/activities" className="hn-textlink">
                {tryS.seeAll} <ArrowRight aria-hidden="true" />
              </HNLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 - ONE FULL EXAMPLE JOURNEY */}
      <section className="hn-section hn-section--mist">
        <div className="hn-wrap">
          <Reveal>
            <SectionHeading eyebrow={journey.eyebrow} title={journey.h2} lead={journey.lead} />
          </Reveal>
          <Reveal>
            <div className="hn-journey">
              {journey.steps.map((s, i) => (
                <div className="hn-journey__step" key={s.h3}>
                  <span className="hn-journey__num">{i + 1}</span>
                  <h3 className="hn-h3">{s.h3}</h3>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <CTAButtonNew to="#moments" variant="primary">{journey.cta}</CTAButtonNew>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 - WHY THIS APPROACH */}
      <section className="hn-section hn-section--cream">
        <div className="hn-wrap hn-wrap--narrow">
          <Reveal>
            <SectionHeading eyebrow={approach.eyebrow} title={approach.h2} lead={approach.lead} />
            <div className="hn-methods">
              {approach.methods.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div style={{ marginTop: 26 }}>
              <HNLink to="/our-methods" className="hn-textlink">
                {approach.cta} <ArrowRight aria-hidden="true" />
              </HNLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 - TRUST */}
      <section className="hn-section hn-section--mist">
        <div className="hn-wrap">
          <Reveal>
            <SectionHeading eyebrow={trust.eyebrow} title={trust.h2} />
          </Reveal>
          <Reveal>
            <div className="hn-trust">
              {trust.items.map((it, i) => {
                const Icon = TRUST_ICONS[i] || ShieldCheck;
                return (
                  <div className="hn-trust__item" key={it.t}>
                    <Icon aria-hidden="true" />
                    <p>
                      <strong>{it.t}</strong>
                      {it.d}
                    </p>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24 }}>
              <HNLink to="/Vision" className="hn-textlink">
                {trust.foundersLink} <ArrowRight aria-hidden="true" />
              </HNLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 - YOUR FAMILY SPACE */}
      <section className="hn-section hn-section--cream">
        <div className="hn-wrap">
          <Reveal>
            <div className="hn-space">
              <div>
                <SectionHeading eyebrow={space.eyebrow} title={space.h2} lead={space.lead} />
                <CTAButtonNew to="/space" variant="ghost">{space.cta}</CTAButtonNew>
              </div>
              <div className="hn-space__panel" aria-hidden="true">
                {space.rows.map((r, i) => {
                  const Icon = SPACE_ICONS[i] || ListChecks;
                  return (
                    <div className="hn-space__row" key={r}>
                      <Icon aria-hidden="true" />
                      <span>{r}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 - FOR PROFESSIONALS (secondary) */}
      <section className="hn-section hn-section--mist" id="professionals">
        <div className="hn-wrap">
          <Reveal>
            <div className="hn-pro">
              <div>
                <p className="hn-eyebrow" style={{ marginBottom: 10 }}>{pro.eyebrow}</p>
                <h3 className="hn-h3">{pro.h3}</h3>
                <p>{pro.p}</p>
                <p className="hn-pro__note">{pro.note}</p>
              </div>
              <CTAButtonNew to="/Contact" variant="ghost">{pro.cta}</CTAButtonNew>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9 - CLOSE */}
      <section className="hn-section hn-section--sky hn-close">
        <div className="hn-wrap hn-wrap--narrow">
          <Reveal>
            <h2 className="hn-h2">{close.h2}</h2>
            <p className="hn-lead">{close.lead}</p>
            <CTAButtonNew to="#moments" variant="accent">{close.cta}</CTAButtonNew>
          </Reveal>
        </div>
      </section>

      <FooterNew lang={L} />
    </div>
  );
}
