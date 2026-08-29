import React from 'react';
import HNLink from './hnLink';
import { MOMENTS } from './homeNewContent';

/**
 * The organising spine of the page. Each chip links to an existing prefilled
 * flow (see homeNewContent.js). Navigation only - triggers no user action.
 */
export default function MomentPicker({ lang = 'en', label }) {
  return (
    <div className="hn-picker" id="moments">
      <p className="hn-picker__label">{label}</p>
      <div className="hn-chips">
        {MOMENTS.map((m) => (
          <HNLink
            key={m.key}
            to={m.to}
            className={`hn-chip ${m.muted ? 'hn-chip--muted' : ''}`}
          >
            {m[lang] || m.en}
          </HNLink>
        ))}
      </div>
    </div>
  );
}
