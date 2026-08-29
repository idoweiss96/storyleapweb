import React, { useEffect, useRef, useState } from 'react';

/** Fade/slide a block in once when it enters the viewport. CSS handles
 *  prefers-reduced-motion (see src/styles/home-new.css). */
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`hn-reveal ${seen ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  );
}
