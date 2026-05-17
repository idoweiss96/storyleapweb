import { useEffect, useRef, useState } from 'react';

export default function PayPalButton() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40; // up to 12 seconds

    const tryRender = () => {
      if (cancelled) return;
      attempts++;

      if (window.paypal?.HostedButtons && containerRef.current) {
        containerRef.current.innerHTML = '';
        window.paypal.HostedButtons({
          hostedButtonId: "Q84GCTNCHU63A"
        }).render(containerRef.current)
          .then(() => { if (!cancelled) setStatus('ready'); })
          .catch(() => { if (!cancelled) setStatus('error'); });
      } else if (attempts < maxAttempts) {
        setTimeout(tryRender, 300);
      } else {
        if (!cancelled) setStatus('error');
      }
    };

    tryRender();

    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      {status === 'loading' && (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="mr-2 text-sm text-slate-400">טוען...</span>
        </div>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center py-2">
          לא ניתן לטעון את PayPal. רענן את הדף ונסה שוב.
        </p>
      )}
      <div ref={containerRef} />
    </div>
  );
}