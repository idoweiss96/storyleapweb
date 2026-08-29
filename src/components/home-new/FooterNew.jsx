import React from 'react';
import HNLink from './hnLink';
import { FOOTER, LOGO_URL } from './homeNewContent';

export default function FooterNew({ lang = 'en' }) {
  const t = FOOTER[lang] || FOOTER.en;

  return (
    <footer className="hn-footer">
      <div className="hn-footer__inner">
        <div className="hn-footer__col" style={{ maxWidth: 260 }}>
          <img src={LOGO_URL} alt="StoryLeap" style={{ height: 30, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <p style={{ margin: '10px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{t.tagline}</p>
        </div>

        <div className="hn-footer__col">
          <span className="hn-footer__title">{t.exploreTitle}</span>
          {t.explore.map((l) => (
            <HNLink key={l.label} to={l.to}>{l.label}</HNLink>
          ))}
        </div>

        <div className="hn-footer__col">
          <span className="hn-footer__title">{t.companyTitle}</span>
          {t.company.map((l) => (
            <HNLink key={l.label} to={l.to}>{l.label}</HNLink>
          ))}
        </div>

        <div className="hn-footer__col">
          <span className="hn-footer__title">Legal</span>
          {t.legal.map((l) => (
            <HNLink key={l.label} to={l.to}>{l.label}</HNLink>
          ))}
        </div>
      </div>
      <p className="hn-footer__legal">{t.note}</p>
    </footer>
  );
}
