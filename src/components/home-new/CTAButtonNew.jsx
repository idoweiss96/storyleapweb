import React from 'react';
import { ArrowRight } from 'lucide-react';
import HNLink from './hnLink';

/**
 * variant: 'primary' (Royal Blue) | 'accent' (pink->sky gradient, one per page) | 'ghost'
 * Duplicated on purpose - does not touch src/components/ui/button.jsx.
 */
export default function CTAButtonNew({ to, children, variant = 'primary', withArrow = true, onClick }) {
  return (
    <HNLink to={to} className={`hn-btn hn-btn--${variant}`} onClick={onClick}>
      <span>{children}</span>
      {withArrow && <ArrowRight aria-hidden="true" />}
    </HNLink>
  );
}
