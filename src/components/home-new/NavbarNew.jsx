import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import HNLink from './hnLink';
import { NAV, LOGO_URL } from './homeNewContent';

/**
 * Duplicated navigation for the Home-new prototype. Does NOT touch src/Layout.jsx.
 * Proposed IA: Moments / Activities / How it works / Our approach / For Professionals
 * ("Purchase Credits" removed from primary nav; lives in the footer instead).
 */
export default function NavbarNew({ lang = 'en', onToggleLang, onLogin }) {
  const t = NAV[lang] || NAV.en;
  const [open, setOpen] = useState(false);

  const links = [
    { label: t.moments, to: '#moments' },
    { label: t.activities, to: '/activities' },
    { label: t.how, to: '#how' },
    { label: t.approach, to: '/our-methods' },
    { label: t.professionals, to: '#professionals' },
  ];

  return (
    <header className="hn-nav">
      <div className="hn-nav__inner">
        <HNLink to="#top" className="hn-nav__logo" aria-label="StoryLeap">
          <img src={LOGO_URL} alt="StoryLeap" />
        </HNLink>

        <nav className="hn-nav__links" aria-label="Primary">
          {links.map((l) => (
            <HNLink key={l.label} to={l.to} className="hn-nav__link">
              {l.label}
            </HNLink>
          ))}
        </nav>

        <div className="hn-nav__right">
          <button
            type="button"
            className="hn-nav__icon-btn"
            onClick={onToggleLang}
            title={t.language}
            aria-label={t.language}
          >
            <Globe aria-hidden="true" />
          </button>
          <button type="button" className="hn-btn hn-btn--ghost" onClick={onLogin}>
            {t.login}
          </button>
          <HNLink to="#moments" className="hn-btn hn-btn--primary" withArrow={false}>
            {t.start}
          </HNLink>
          <button
            type="button"
            className="hn-nav__burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t.menu}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="hn-nav__sheet">
          {links.map((l) => (
            <HNLink key={l.label} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </HNLink>
          ))}
          <HNLink to="#moments" onClick={() => setOpen(false)}>
            {NAV[lang].start}
          </HNLink>
          <button
            type="button"
            className="hn-btn hn-btn--primary"
            onClick={() => {
              setOpen(false);
              onLogin?.();
            }}
          >
            {t.login}
          </button>
        </div>
      )}
    </header>
  );
}
