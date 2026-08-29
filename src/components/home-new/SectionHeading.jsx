import React from 'react';

export default function SectionHeading({ eyebrow, title, lead, id }) {
  return (
    <div className="hn-section-head" id={id}>
      {eyebrow && <p className="hn-eyebrow">{eyebrow}</p>}
      <h2 className="hn-h2" style={{ marginTop: eyebrow ? 12 : 0 }}>{title}</h2>
      {lead && <p className="hn-lead">{lead}</p>}
    </div>
  );
}
