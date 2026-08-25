import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

const GUEST_PRICE_DISPLAY = '$29';

// Lets a parent pay for a single story with just an email — no account, no login.
// Renders its own PayPal button, separate from the account-based Pricing flow.
export default function GuestStoryCheckout({ getStoryData, lang, isHe, onSuccess }) {
  const containerRef = useRef(null);
  const storyIdRef = useRef(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.paypal?.Buttons || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
        createOrder: async () => {
          setError('');
          const res = await base44.functions.invoke('createGuestStoryOrder', { storyData: getStoryData(), lang });
          if (!res.data?.paypal_order_id) throw new Error('order_failed');
          storyIdRef.current = res.data.story_id;
          return res.data.paypal_order_id;
        },
        onApprove: async (data) => {
          setProcessing(true);
          try {
            const res = await base44.functions.invoke('captureGuestStoryOrder', { paypal_order_id: data.orderID });
            if (res.data?.success) {
              onSuccess(res.data.story);
            } else {
              setError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
            }
          } catch (_) {
            setError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
          } finally {
            setProcessing(false);
          }
        },
        onError: () => setError(isHe ? 'שגיאה בתשלום, נסו שנית' : 'Payment error, please try again'),
        onCancel: () => setError(isHe ? 'התשלום בוטל' : 'Payment cancelled'),
      });
      if (buttons.isEligible()) buttons.render(containerRef.current);
    };

    base44.functions.invoke('getPaypalClientId', {}).then((res) => {
      const clientId = res.data?.client_id;
      if (!clientId || cancelled) return;
      const scriptKey = `${clientId}-USD-buttons-guest`;
      const existing = document.querySelector(`script[data-paypal-guest-sdk="${scriptKey}"]`);
      if (window.paypal?.Buttons && existing) {
        render();
        return;
      }
      if (existing) {
        existing.addEventListener('load', render, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.setAttribute('data-paypal-guest-sdk', scriptKey);
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&currency=USD&disable-funding=venmo,credit`;
      script.onload = render;
      script.onerror = () => setError(isHe ? "לא ניתן להתחבר ל-PayPal כרגע" : "Can't connect to PayPal right now");
      document.body.appendChild(script);
    });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-sm font-semibold text-slate-700 mb-1">
        {isHe ? `שלמו ${GUEST_PRICE_DISPLAY} על סיפור בודד — בלי חשבון` : `Pay ${GUEST_PRICE_DISPLAY} for a single story — no account needed`}
      </p>
      <p className="text-xs text-slate-400 mb-3">
        {isHe ? 'הסיפור יישלח לכתובת המייל שהזנתם' : "The story will be sent to the email you entered"}
      </p>
      {processing && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {isHe ? 'מעבד תשלום...' : 'Processing payment...'}
        </div>
      )}
      <div ref={containerRef} />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}