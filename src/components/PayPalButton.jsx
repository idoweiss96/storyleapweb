import { useEffect, useRef } from 'react';

export default function PayPalButton() {
  const containerRef = useRef(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;

    const tryRender = () => {
      if (window.paypal && containerRef.current) {
        rendered.current = true;
        window.paypal.HostedButtons({
          hostedButtonId: "Q84GCTNCHU63A"
        }).render(containerRef.current);
      } else {
        setTimeout(tryRender, 300);
      }
    };

    tryRender();
  }, []);

  return null;
}