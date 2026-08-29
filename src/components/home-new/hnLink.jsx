import React from 'react';
import { Link } from 'react-router-dom';

/**
 * One link primitive for the Home-new prototype.
 * - "#anchor"        -> plain <a> (same-page scroll)
 * - "http(s)://..."  -> plain <a>
 * - anything else     -> react-router <Link> to an existing app route
 */
export default function HNLink({ to, children, className, onClick, ...rest }) {
  const str = typeof to === 'string' ? to : '';
  const isPlain = str.startsWith('#') || /^https?:/i.test(str) || str.startsWith('mailto:');
  if (isPlain) {
    return (
      <a href={str} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
