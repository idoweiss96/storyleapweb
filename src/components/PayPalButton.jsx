import { useEffect, useRef } from 'react';

export default function PayPalButton() {
  const containerRef = useRef(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30;

    const tryRender = () => {
      attempts++;
      if (window.paypal && containerRef.current) {
        // Clear container before rendering (in case of re-mount)
        containerRef.current.innerHTML = '';
        window.paypal.HostedButtons({
          hostedButtonId: "Q84GCTNCHU63A"
        }).render(containerRef.current);
      } else if (attempts < maxAttempts) {
        setTimeout(tryRender, 300);
      }
    };

    tryRender();
  }, []);

  return <div ref={containerRef} />;
}