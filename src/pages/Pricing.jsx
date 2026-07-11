import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, CheckCircle, Tag, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import CreditsAddedPopup from '../components/story/CreditsAddedPopup';

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
  const [creditsPopup, setCreditsPopup] = useState(null);
  const [paypalError, setPaypalError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [giftMode, setGiftMode] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftSuccess, setGiftSuccess] = useState(null);
  const giftModeRef = useRef(false);
  const recipientEmailRef = useRef('');
  giftModeRef.current = giftMode;
  recipientEmailRef.current = recipientEmail;
  const containerRef = useRef(null);
  const renderKeyRef = useRef(0);
  const isRenderedRef = useRef(false);

  const isHe = lang === 'he';
  const [hostedButtonCode, setHostedButtonCode] = useState(null); // e.g. 'IDO10'
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, price_ils, price_usd } from DB
  const btnConfig = useMemo(() => {
    if (hostedButtonCode) return HOSTED_BUTTON_CODES[hostedButtonCode];
    if (appliedCoupon) {
      return isHe
        ? { amount: String(appliedCoupon.price_ils), currency: 'ILS', display: `₪${appliedCoupon.price_ils}` }
        : { amount: String(appliedCoupon.price_usd), currency: 'USD', display: `$${appliedCoupon.price_usd}` };
    }
    return PRICE_CONFIG[isHe ? 'he' : 'en'].full;
  }, [hostedButtonCode, appliedCoupon, isHe]);

  // Handle PayPal redirect return on mobile
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paypalToken = urlParams.get('token');
    const payerID = urlParams.get('PayerID');
    if (!paypalToken) return;

    // Clean URL immediately
    window.history.replaceState({}, '', window.location.pathname);
    setProcessing(true);

    const capture = async () => {
      try {
        const pendingStoryId = localStorage.getItem('pendingStoryId');
        if (pendingStoryId) {
          const res = await base44.functions.invoke('capturePaypalOrder', {
            paypal_order_id: paypalToken,
            story_id: pendingStoryId,
          });
          if (res.data?.success) {
            localStorage.removeItem('pendingStoryId');
            window.dispatchEvent(new Event('credits-updated'));
            navigate('/PaymentSuccess?story_id=' + pendingStoryId);
          } else {
            setPaypalError(isHe ? 'שגיאה בעיבוד התשלום, נסו שנית' : 'Payment processing error, please try again');
          }
        } else {
          const storedGiftMode = localStorage.getItem('giftMode') === 'true';
          const storedRecipient = localStorage.getItem('giftRecipient');
          if (storedGiftMode && storedRecipient) {
            const res = await base44.functions.invoke('captureGiftOrder', {
              paypal_order_id: paypalToken,
              recipient_email: storedRecipient,
              credits: 20,
            });
            if (res.data?.success) {
              localStorage.removeItem('giftMode');
              localStorage.removeItem('giftRecipient');
              setGiftSuccess({ code: res.data.code, recipient: storedRecipient });
            } else {
              setPaypalError(isHe ? 'שגיאה בעיבוד התשלום, נסו שנית' : 'Payment processing error, please try again');
            }
          } else {
            const res = await base44.functions.invoke('captureCreditsOrder', {
              paypal_order_id: paypalToken,
              credits: 20,
              coupon: true,
            });
            if (res.data?.success) {
              try { await base44.auth.updateMe({ credits: res.data.new_total }); } catch (_) {}
              window.dispatchEvent(new Event('credits-updated'));
              setCreditsPopup({ added: 20, total: res.data.new_total, navigateOnClose: true });
            } else {
              setPaypalError(isHe ? 'שגיאה בעיבוד התשלום, נסו שנית' : 'Payment processing error, please try again');
            }
          }
        }
      } catch (err) {
        console.error('[PayPal] redirect capture error:', err);
        setPaypalError(isHe ? 'שגיאה בעיבוד התשלום, נסו שנית' : 'Payment processing error, please try again');
      } finally {
        setProcessing(false);
      }
    };
    capture();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-apply coupon code from URL (redirected from CreateStory)
    const urlParams = new URLSearchParams(window.location.search);
    const couponCode = urlParams.get('code');
    if (couponCode) {
      window.history.replaceState({}, '', window.location.pathname);
      setPromoCode(couponCode.toUpperCase());
      setTimeout(() => applyPromoCode(couponCode.toUpperCase()), 300);
    }

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
          if (giftModeRef.current && recipientEmailRef.current) {
            const res = await base44.functions.invoke('captureGiftOrder', {
              paypal_order_id: data.orderID,
              recipient_email: recipientEmailRef.current,
              credits: 20,
            });
            if (res.data?.success) {
              setGiftSuccess({ code: res.data.code, recipient: recipientEmailRef.current });
            } else {
              setPaypalError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
            }
          } else {
            const isHostedButton = !!btnConfig.hostedButtonId;
            const res = await base44.functions.invoke('captureCreditsOrder', {
              paypal_order_id: data.orderID,
              credits: 20,
              coupon: isHostedButton,
            });
            if (res.data?.success) {
              await base44.auth.updateMe({ credits: res.data.new_total });
              setTimeout(() => window.dispatchEvent(new Event('credits-updated')), 300);
              setCreditsPopup({ added: 20, total: res.data.new_total, navigateOnClose: true });
            }
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
          if (giftModeRef.current && recipientEmailRef.current) {
            localStorage.setItem('giftMode', 'true');
            localStorage.setItem('giftRecipient', recipientEmailRef.current);
          } else {
            localStorage.removeItem('giftMode');
            localStorage.removeItem('giftRecipient');
          }
          const res = await base44.functions.invoke('createCreditsOrder', {
            currency: btnConfig.currency,
            amount: btnConfig.amount,
            return_url: window.location.href,
            cancel_url: window.location.href,
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

    if (containerRef.current) containerRef.current.innerHTML = '';
    isRenderedRef.current = false;

    const tryRender = () => isHosted ? renderHosted() : renderRegular();
    const sdkReady = isHosted ? window.paypal?.HostedButtons : window.paypal?.Buttons;

    // If the right SDK is already loaded, just re-render
    if (sdkReady && existingScript) {
      setTimeout(() => tryRender(), 50);
      return;
    }

    // Need to reload SDK — remove old scripts and window.paypal
    document.querySelectorAll('script[data-paypal-sdk]').forEach(s => s.remove());
    try { delete window.paypal; } catch (_) {}

    const script = document.createElement('script');
    script.setAttribute('data-paypal-sdk', scriptKey);
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=${components}&currency=${sdkCurrency}&disable-funding=venmo,credit&enable-funding=paylater`;
    script.onload = () => setTimeout(() => tryRender(), 300);
    script.onerror = () => setPaypalError(isHe ? 'שגיאה בטעינת PayPal, נסו לרענן את הדף' : 'Failed to load PayPal, please refresh');
    document.body.appendChild(script);
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnConfig]);

  const applyPromoCode = async (rawCode) => {
    setPromoError('');
    const code = rawCode.trim().toUpperCase();
    if (!code) return;

    // Special case: hosted buttons (e.g. IDO10)
    if (Object.prototype.hasOwnProperty.call(HOSTED_BUTTON_CODES, code)) {
      setHostedButtonCode(code);
      setAppliedCoupon(null);
      setPromoApplied(true);
      return;
    }

    setPromoLoading(true);
    try {
      // Validate against database (validate_only = true, don't redeem yet)
      const validateRes = await base44.functions.invoke('validateCoupon', { code, validate_only: true });

      if (!validateRes.data?.valid) {
        setPromoError(isHe ? 'קוד פרומו לא תקין' : 'Invalid promo code');
        return;
      }

      if (validateRes.data.type === 'free') {
        // Free coupon — redeem now (adds credits directly)
        const redeemRes = await base44.functions.invoke('validateCoupon', { code });
        if (redeemRes.data?.valid && redeemRes.data.credits_added) {
          await base44.auth.updateMe({ credits: redeemRes.data.new_total });
          window.dispatchEvent(new Event('credits-updated'));
          setCreditsPopup({ added: redeemRes.data.credits_added, total: redeemRes.data.new_total, navigateOnClose: true });
          setPromoCode('');
          setPromoCode('');
        } else {
          setPromoError(redeemRes.data?.error || (isHe ? 'שגיאה בהפעלת הקוד' : 'Error applying code'));
        }
      } else {
        // Discount coupon — apply price from DB to PayPal button
        setAppliedCoupon({ code, price_ils: validateRes.data.price_ils, price_usd: validateRes.data.price_usd });
        setHostedButtonCode(null);
        setPromoApplied(true);
      }
    } catch (err) {
      setPromoError(isHe ? 'קוד פרומו לא תקין' : 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleApplyPromo = () => applyPromoCode(promoCode);

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

              {/* Gift Mode Toggle */}
              <div className="mb-6">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button onClick={() => { setGiftMode(false); setGiftSuccess(null); }} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${!giftMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                    <Star className="w-4 h-4" />
                    {isHe ? 'רכישה עבורי' : 'Buy for myself'}
                  </button>
                  <button onClick={() => { setGiftMode(true); setPromoApplied(false); setPromoCode(''); setHostedButtonCode(null); setAppliedCoupon(null); }} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${giftMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                    <Gift className="w-4 h-4" />
                    {isHe ? 'שלח כמתנה' : 'Send as gift'}
                  </button>
                </div>
              </div>

              {giftMode && (
                <div className="mb-6 max-w-xs mx-auto">
                  <Input type="email" placeholder={isHe ? 'מייל מקבל/ת המתנה' : 'Recipient email'} value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="text-sm" />
                  <p className="text-xs text-slate-400 mt-1 text-center">{isHe ? 'הקוד יישלח למייל זה לאחר התשלום' : 'The gift code will be sent to this email after payment'}</p>
                </div>
              )}

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
                  <button className="text-xs text-slate-400 underline" onClick={() => { setPromoApplied(false); setPromoCode(''); setHostedButtonCode(null); setAppliedCoupon(null); }}>
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
                      ? 'לאחר התשלום תועברו לדף הסיפורים שם תוכלו להשלים את יצירת הסיפור'
                      : 'After payment you\'ll be taken to your stories page to complete the story creation'}
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

      {giftSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-0 shadow-2xl max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{isHe ? 'המתנה נשלחה! 🎁' : 'Gift sent! 🎁'}</h3>
                <p className="text-slate-500 mb-4 text-sm">
                  {isHe ? `שלחנו מייל עם קוד המתנה ל-${giftSuccess.recipient}` : `We sent a gift email to ${giftSuccess.recipient}`}
                </p>
                <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-4 mb-4">
                  <p className="text-sm text-amber-600 mb-1">{isHe ? 'קוד המתנה:' : 'Gift code:'}</p>
                  <p className="text-2xl font-bold tracking-wider text-slate-800">{giftSuccess.code}</p>
                </div>
                <Button onClick={() => { setGiftSuccess(null); setGiftMode(false); setRecipientEmail(''); navigate('/MyStories'); }} className="w-full">
                  {isHe ? 'סיום' : 'Done'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {creditsPopup && (
        <CreditsAddedPopup
          added={creditsPopup.added}
          total={creditsPopup.total}
          onClose={() => {
            const shouldNavigate = creditsPopup.navigateOnClose;
            setCreditsPopup(null);
            if (shouldNavigate) navigate('/MyStories');
          }}
        />
      )}
    </div>
  );
}