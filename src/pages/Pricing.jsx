import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, CheckCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';

const VALID_CODES = ['MIL30', 'NYUD30', 'SHNK30', 'MIAMI30'];
const FREE_CREDIT_CODES = { 'STORY20': 20 };
// Special test codes with hosted button override
const HOSTED_BUTTON_CODES = {
  'IDO10': { hostedButtonId: 'AMAMAC5GTGJUG', currency: 'ILS', display: '₪0.10' },
};

const PAYPAL_CLIENT_ID = 'BAAp7sBZcp1O2D_XYhhyHfg20nzgXC1O3hN8Dr6-8EFfnkGkpYKC8fTivDyIm91hiaKIFhxTilvzExmmXU';

// Price configs by language and promo
const PRICE_CONFIG = {
  he: {
    full:     { amount: '45', currency: 'ILS', display: '₪45' },
    discount: { amount: '15', currency: 'ILS', display: '₪15' },
  },
  en: {
    full:     { amount: '15', currency: 'USD', display: '$15' },
    discount: { amount: '5',  currency: 'USD', display: '$5'  },
  },
};

export default function Pricing() {
  const { lang, isHe: langIsHe } = useLanguage();
  const navigate = useNavigate();
  const [hasPendingStory, setHasPendingStory] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [paypalError, setPaypalError] = useState('');
  const [processing, setProcessing] = useState(false);
  const containerRef = useRef(null);
  const renderKeyRef = useRef(0);
  const isRenderedRef = useRef(false);

  const isHe = lang === 'he';
  const [hostedButtonCode, setHostedButtonCode] = useState(null); // e.g. 'IDO10'
  const mode = promoApplied ? 'discount' : 'full';
  const btnConfig = useMemo(() => (
    hostedButtonCode
      ? HOSTED_BUTTON_CODES[hostedButtonCode]
      : PRICE_CONFIG[isHe ? 'he' : 'en'][mode]
  ), [hostedButtonCode, isHe, mode]);

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }

      const pendingId = localStorage.getItem('pendingStoryId');
      if (pendingId) {
        try {
          const stories = await base44.entities.Story.list();
          const exists = stories.some(s => s.id === pendingId);
          if (!exists) localStorage.removeItem('pendingStoryId');
          setHasPendingStory(exists);
        } catch {
          localStorage.removeItem('pendingStoryId');
          setHasPendingStory(false);
        }
      }
    };
    init();
  }, []);

  // Render PayPal Buttons
  useEffect(() => {
    renderKeyRef.current += 1;
    const currentKey = renderKeyRef.current;
    isRenderedRef.current = false;

    const onApproveHandler = async (data) => {
      console.log('[PayPal] onApprove called with:', JSON.stringify(data));
      if (!data?.orderID) {
        console.warn('[PayPal] onApprove called without orderID, ignoring');
        return;
      }
      setProcessing(true);
      setPaypalError('');
      try {
        const pendingStoryId = localStorage.getItem('pendingStoryId');
        if (pendingStoryId) {
          const res = await base44.functions.invoke('capturePaypalOrder', {
            paypal_order_id: data.orderID,
            story_id: pendingStoryId,
          });
          if (res.data?.success) {
            localStorage.removeItem('pendingStoryId');
            window.dispatchEvent(new Event('credits-updated'));
            navigate('/PaymentSuccess?story_id=' + pendingStoryId);
          }
        } else {
          const res = await base44.functions.invoke('captureCreditsOrder', {
            paypal_order_id: data.orderID,
            credits: 20,
          });
          if (res.data?.success) {
            // Sync credits from DB to session (source of truth)
            const users = await base44.entities.User.list();
            const me = await base44.auth.me();
            const dbUser = users.find(u => u.email === me.email);
            if (dbUser) await base44.auth.updateMe({ credits: dbUser.credits });
            window.dispatchEvent(new Event('credits-updated'));
            navigate('/CreateStory?payment=success');
          }
        }
      } catch (err) {
        setPaypalError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
      } finally {
        setProcessing(false);
      }
    };

    const renderHosted = () => {
      if (renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.HostedButtons || !containerRef.current) return;
      if (isRenderedRef.current) return;
      isRenderedRef.current = true;
      containerRef.current.innerHTML = '';
      window.paypal.HostedButtons({
        hostedButtonId: btnConfig.hostedButtonId,
        onApprove: onApproveHandler,
        onCancel: () => setPaypalError(isHe ? 'התשלום בוטל' : 'Payment cancelled'),
        onError: () => setPaypalError(isHe ? 'שגיאה בתשלום, נסו שנית' : 'Payment error, please try again'),
      }).render(containerRef.current);
    };

    const renderRegular = () => {
      if (renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.Buttons || !containerRef.current) return;
      if (isRenderedRef.current) return;
      isRenderedRef.current = true;
      containerRef.current.innerHTML = '';
      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
        createOrder: async () => {
          const res = await base44.functions.invoke('createCreditsOrder', {
            currency: btnConfig.currency,
            amount: btnConfig.amount,
          });
          return res.data.paypal_order_id;
        },
        onApprove: onApproveHandler,
        onError: (err) => {
          console.error('[PayPal] error:', err);
          setPaypalError(isHe ? 'שגיאה בתשלום, נסו שנית' : 'Payment error, please try again');
        },
        onCancel: () => setPaypalError(isHe ? 'התשלום בוטל' : 'Payment cancelled'),
      });
      if (buttons.isEligible()) {
        buttons.render(containerRef.current);
      } else {
        console.warn('[PayPal] buttons not eligible');
        isRenderedRef.current = false;
      }
    };

    const isHosted = !!btnConfig.hostedButtonId;
    const components = isHosted ? 'hosted-buttons' : 'buttons';
    const sdkCurrency = btnConfig.currency;
    const scriptKey = `${PAYPAL_CLIENT_ID}-${sdkCurrency}-${components}`;
    const existingScript = document.querySelector(`script[data-paypal-sdk="${scriptKey}"]`);

    const tryRender = () => isHosted ? renderHosted() : renderRegular();
    const sdkReady = isHosted ? window.paypal?.HostedButtons : window.paypal?.Buttons;

    if (sdkReady && existingScript) {
      tryRender();
      return;
    }

    // Only remove scripts and reset paypal if the currency or components changed
    const wrongScript = document.querySelector(`script[data-paypal-sdk]:not([data-paypal-sdk="${scriptKey}"])`);
    if (wrongScript) {
      document.querySelectorAll('script[data-paypal-sdk]').forEach(s => s.remove());
      delete window.paypal;
    }

    const script = document.createElement('script');
    script.setAttribute('data-paypal-sdk', scriptKey);
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=${components}&currency=${sdkCurrency}&disable-funding=venmo,credit&enable-funding=paylater`;
    script.onload = () => setTimeout(() => tryRender(), 100);
    script.onerror = () => setPaypalError(isHe ? 'שגיאה בטעינת PayPal, נסו לרענן את הדף' : 'Failed to load PayPal, please refresh');
    document.body.appendChild(script);
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnConfig]);

  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (FREE_CREDIT_CODES[code] !== undefined) {
      // Free credits coupon — add credits directly
      setPromoLoading(true);
      try {
        const credits = FREE_CREDIT_CODES[code];
        const res = await base44.functions.invoke('captureCreditsOrder', { paypal_order_id: `COUPON_${code}`, credits, coupon: true });
        if (res.data?.success) {
          window.dispatchEvent(new Event('credits-updated'));
          toast.success(isHe ? `🎉 ${credits} קרדיטים התווספו לחשבונך!` : `🎉 ${credits} credits added to your account!`, { duration: 5000 });
          setPromoCode('');
        } else {
          setPromoError(isHe ? 'שגיאה בהפעלת הקוד' : 'Error applying code');
        }
      } catch (err) {
        setPromoError(isHe ? 'שגיאה בהפעלת הקוד' : 'Error applying code');
      } finally {
        setPromoLoading(false);
      }
      return;
    }

    if (Object.prototype.hasOwnProperty.call(HOSTED_BUTTON_CODES, code)) {
      setHostedButtonCode(code);
      setPromoApplied(true);
    } else if (VALID_CODES.includes(code)) {
      setHostedButtonCode(null);
      setPromoApplied(true);
    } else {
      setPromoError(isHe ? 'קוד פרומו לא תקין' : 'Invalid promo code');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            {isHe ? 'סיפור מותאם אישית' : 'Personalized Story'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {isHe ? 'סיפור טיפולי מותאם לילד/ה שלכם, נשלח תוך 24 שעות' : 'A therapeutic story tailored for your child, delivered within 24 hours'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-2xl shadow-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-amber-600" />
              </div>

              <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
                {isHe ? 'רכישת קרדיטים' : 'Purchase Credits'}
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
              </h2>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-6 mt-2">
                <p className="text-lg font-bold text-amber-800">
                  {isHe ? '⭐ חבילת 20 קרדיטים' : '⭐ 20 Credits Package'}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  {isHe ? '20 קרדיטים = יצירת סיפור אחד מותאם אישית' : '20 credits = 1 personalized story'}
                </p>
              </div>

              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-slate-800">{btnConfig.display}</p>
                {promoApplied && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    {isHe ? '🎉 קוד הנחה הופעל!' : '🎉 Discount applied!'}
                  </p>
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-6 max-w-xs mx-auto">
                {!promoApplied ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder={isHe ? 'קוד פרומו (אופציונלי)' : 'Promo code (optional)'}
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(); }}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo} disabled={promoLoading} className="shrink-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {promoLoading ? (isHe ? '...' : '...') : (isHe ? 'החל' : 'Apply')}
                    </Button>
                  </div>
                ) : (
                  <button className="text-xs text-slate-400 underline" onClick={() => { setPromoApplied(false); setPromoCode(''); setHostedButtonCode(null); }}>
                    {isHe ? 'הסר קוד' : 'Remove code'}
                  </button>
                )}
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
              </div>

              {hasPendingStory && (
                <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">
                    {isHe
                      ? '✅ השאלון שלך שמור — אחרי הרכישה הסיפור ייווצר אוטומטית!'
                      : '✅ Your questionnaire is saved — story will be created automatically after purchase!'}
                  </p>
                </div>
              )}

              {!hasPendingStory && (
                <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                  <p className="text-sm text-blue-700">
                    {isHe
                      ? 'תוכלו לרכוש קרדיטים עכשיו ולמלא את השאלון מאוחר יותר'
                      : 'You can purchase credits now and fill the questionnaire later'}
                  </p>
                </div>
              )}

              {paypalError && (
                <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-600">{paypalError}</p>
                </div>
              )}

              {processing && (
                <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">
                    {isHe ? 'מעבד תשלום...' : 'Processing payment...'}
                  </p>
                </div>
              )}

              {/* PayPal Button */}
              <div className="max-w-xs mx-auto mt-4">
                <div ref={containerRef} />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <Link to={createPageUrl('Contact')}>
                  <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                    {isHe ? 'צרו איתנו קשר' : 'Contact us'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}