import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { trackEvent } from '@/lib/posthog';
import PageMeta from '@/components/SEO/PageMeta';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import ProductSchema from '@/components/SEO/ProductSchema';

const PRICING_META = {
  he: { title: 'רכישת קרדיטים - סיפור מותאם אישית | StoryLeap', description: 'סיפור מותאם אישית לילד/ה שלכם, נשלח תוך 24 שעות. רכשו קרדיטים בקלות ובאמצעי תשלום מאובטח.' },
  en: { title: 'StoryLeap Pricing & Credits', description: 'A personalized story tailored for your child, delivered within 24 hours. Purchase credits securely.' },
};

// Special test codes — routed through the same dynamic PayPal order flow as everything
// else (createCreditsOrder), NOT a PayPal Hosted Button. Hosted Buttons carry their own
// fixed amount/currency/item-name baked into the PayPal dashboard, which caused a
// currency mismatch with the SDK's `currency` query param and PayPal's generic
// "Something went wrong" error. Using the dynamic flow guarantees the currency and
// item description sent to PayPal always match what's shown on screen.
const HOSTED_BUTTON_CODES = {
  'IDO10': { amount: '0.10', currency: 'ILS', display: '₪0.10' },
};



// Meta Pixel helpers — fbq is loaded by the base code in index.html; never fire without checking it exists.
function fbqTrack(eventName, params) {
  try {
    const fbqExists = typeof window !== 'undefined' && typeof window.fbq === 'function';
    if (eventName === 'Purchase') console.log('[MetaPixelDiag] fbqTrack(Purchase) — fbq available:', fbqExists);
    if (fbqExists) {
      window.fbq('track', eventName, params);
      if (eventName === 'Purchase') console.log('[MetaPixelDiag] fbq("track","Purchase") call executed');
    }
  } catch (error) {
    console.warn('Meta Pixel tracking failed:', eventName, error);
  }
}
function parseAmountFromDisplay(display) {
  const num = parseFloat((display || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

// Default fixed prices by language, used only as a fallback when there's no DB
// CreditPackage / applied coupon for the active language. Routed through the same
// dynamic PayPal order flow as everything else (see note above on Hosted Buttons).
const HOSTED_BUTTONS = {
  he: {
    full: { amount: '70', currency: 'ILS', display: '₪70', original: '₪110' },
  },
  en: {
    full: { amount: '25', currency: 'USD', display: '$25', original: '$40' },
  },
};

export default function Pricing() {
  const { lang, isHe: langIsHe } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasPendingStory, setHasPendingStory] = useState(false);
  const [isAuthed, setIsAuthed] = useState(null); // null = still checking
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [creditsPopup, setCreditsPopup] = useState(null);
  const [bonusPopup, setBonusPopup] = useState(null);
  const [paypalError, setPaypalError] = useState('');
  const [paypalRetryNonce, setPaypalRetryNonce] = useState(0);
  const [paypalClientId, setPaypalClientId] = useState(null);
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
  // Tracks PayPal order IDs already reported as Purchase to Meta Pixel, to guarantee a single fire per transaction.
  const purchaseTrackedRef = useRef(new Set());

  const isHe = lang === 'he';
  const [hostedButtonCode, setHostedButtonCode] = useState(null); // e.g. 'IDO10'
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, price_ils, price_usd } from DB
  const [selectedPackage, setSelectedPackage] = useState(null); // CreditPackage from DB (dynamic price)
  const btnConfig = useMemo(() => {
    if (hostedButtonCode) return HOSTED_BUTTON_CODES[hostedButtonCode];
    const langKey = isHe ? 'he' : 'en';
    if (appliedCoupon) {
      // All discount coupons use the dynamic regular button (DB-sourced price)
      return isHe
        ? { amount: String(appliedCoupon.price_ils), currency: 'ILS', display: `₪${appliedCoupon.price_ils}` }
        : { amount: String(appliedCoupon.price_usd), currency: 'USD', display: `$${appliedCoupon.price_usd}` };
    }
    // Default: dynamic pricing from the CreditPackage in the DB (Hebrew only; no fixed payment link)
    if (langKey === 'he' && selectedPackage) {
      return { package_id: selectedPackage.id, currency: 'ILS', display: `₪${selectedPackage.price}`, original: '₪110' };
    }
    return HOSTED_BUTTONS[langKey].full;
  }, [hostedButtonCode, appliedCoupon, isHe, selectedPackage]);

  // Fires Purchase to Meta Pixel at most once per PayPal order ID.
  const trackPurchaseOnce = (orderId, amount, currency) => {
    try {
      console.log('[MetaPixelDiag] trackPurchaseOnce reached — orderId present:', !!orderId, 'already tracked:', orderId ? purchaseTrackedRef.current.has(orderId) : null, 'amount:', amount, 'currency:', currency);
      if (!orderId || purchaseTrackedRef.current.has(orderId)) return;
      purchaseTrackedRef.current.add(orderId);
      const value = Number.isFinite(amount) && amount > 0 ? amount : parseAmountFromDisplay(btnConfig.display);
      fbqTrack('Purchase', { value, currency: currency || btnConfig.currency });
    } catch (error) {
      console.warn('Meta Pixel Purchase tracking failed:', error);
    }
  };

  // Track once the guest sign-in/register prompt is actually shown on this page
  useEffect(() => {
    if (isAuthed === false) trackEvent('login_register_reached');
  }, [isAuthed]);

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
          console.log('[MetaPixelDiag] path=mobile-story success:', res.data?.success, 'already_processed:', res.data?.already_processed, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
          if (res.data?.success) {
            if (!res.data.already_processed) trackPurchaseOnce(paypalToken, res.data.amount, res.data.currency);
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
              credits: 110,
            });
            console.log('[MetaPixelDiag] path=mobile-gift success:', res.data?.success, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
            if (res.data?.success) {
              trackPurchaseOnce(paypalToken, res.data.amount, res.data.currency);
              localStorage.removeItem('giftMode');
              localStorage.removeItem('giftRecipient');
              setGiftSuccess({ code: res.data.code, recipient: storedRecipient });
            } else {
              setPaypalError(isHe ? 'שגיאה בעיבוד התשלום, נסו שנית' : 'Payment processing error, please try again');
            }
          } else {
            const res = await base44.functions.invoke('captureCreditsOrder', {
              paypal_order_id: paypalToken,
              credits: 110,
            });
            console.log('[MetaPixelDiag] path=mobile-credits success:', res.data?.success, 'already_processed:', res.data?.already_processed, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
            if (res.data?.success && !res.data.already_processed) {
              trackPurchaseOnce(paypalToken, res.data.amount, res.data.currency);
              try { await base44.auth.updateMe({ credits: res.data.new_total }); } catch (_) {}
              window.dispatchEvent(new Event('credits-updated'));
              const added = res.data.credits_added || 110;
              const bonus = res.data.bonus || 0;
              const total = res.data.new_total;
              setCreditsPopup({ added, total: total - bonus, navigateOnClose: true });
              if (bonus) setBonusPopup({ added: bonus, total });
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
    trackEvent('purchase_screen_reached');
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
      setIsAuthed(authed);
      if (!authed) return;

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

  // Load the real PayPal REST client ID (same credential used server-side for order create/capture).
  // Only once the visitor is confirmed logged in — anonymous visitors have no payment context yet,
  // so we must not attempt this (and must not show a PayPal error) before they sign in.
  useEffect(() => {
    if (!isAuthed) return;
    base44.functions.invoke('getPaypalClientId', {})
      .then((res) => { if (res.data?.client_id) setPaypalClientId(res.data.client_id); })
      .catch(() => setPaypalError(isHe ? 'שגיאה בטעינת PayPal, נסו לרענן את הדף' : 'Failed to load PayPal, please refresh'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  // Load CreditPackage from DB for dynamic (non-fixed-link) pricing
  useEffect(() => {
    base44.entities.CreditPackage.list()
      .then((pkgs) => {
        if (pkgs.length > 0) {
          const popular = pkgs.find((p) => p.is_popular);
          setSelectedPackage(popular || pkgs[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Render PayPal Buttons
  useEffect(() => {
    if (!paypalClientId || !isAuthed) return;
    renderKeyRef.current += 1;
    const currentKey = renderKeyRef.current;
    isRenderedRef.current = false;
    let cancelled = false;
    let instance = null;

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
          console.log('[MetaPixelDiag] path=desktop-story success:', res.data?.success, 'already_processed:', res.data?.already_processed, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
          if (res.data?.success) {
            if (!res.data.already_processed) {
              trackPurchaseOnce(data.orderID, res.data.amount, res.data.currency);
              trackEvent('payment_completed', { type: 'story' });
            }
            localStorage.removeItem('pendingStoryId');
            window.dispatchEvent(new Event('credits-updated'));
            navigate('/PaymentSuccess?story_id=' + pendingStoryId);
          }
        } else {
          if (giftModeRef.current && recipientEmailRef.current) {
            const res = await base44.functions.invoke('captureGiftOrder', {
              paypal_order_id: data.orderID,
              recipient_email: recipientEmailRef.current,
              credits: 110,
            });
            console.log('[MetaPixelDiag] path=desktop-gift success:', res.data?.success, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
            if (res.data?.success) {
              trackPurchaseOnce(data.orderID, res.data.amount, res.data.currency);
              trackEvent('payment_completed', { type: 'gift' });
              setGiftSuccess({ code: res.data.code, recipient: recipientEmailRef.current });
            } else {
              setPaypalError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
            }
          } else {
            const res = await base44.functions.invoke('captureCreditsOrder', {
              paypal_order_id: data.orderID,
              credits: 110,
            });
            console.log('[MetaPixelDiag] path=desktop-credits success:', res.data?.success, 'already_processed:', res.data?.already_processed, 'amount:', res.data?.amount, 'currency:', res.data?.currency);
            if (res.data?.success && !res.data.already_processed) {
              trackPurchaseOnce(data.orderID, res.data.amount, res.data.currency);
              trackEvent('payment_completed', { type: 'credits' });
              await base44.auth.updateMe({ credits: res.data.new_total });
              setTimeout(() => window.dispatchEvent(new Event('credits-updated')), 300);
              const added = res.data.credits_added || 110;
              const bonus = res.data.bonus || 0;
              const total = res.data.new_total;
              setCreditsPopup({ added, total: total - bonus, navigateOnClose: true });
              if (bonus) setBonusPopup({ added: bonus, total });
            }
          }
        }
      } catch (err) {
        setPaypalError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
      } finally {
        setProcessing(false);
      }
    };

    const renderRegular = () => {
      if (cancelled || renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.Buttons || !containerRef.current) return;
      if (isRenderedRef.current) return;
      isRenderedRef.current = true;
      containerRef.current.innerHTML = '';
      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
        onClick: () => fbqTrack('InitiateCheckout', { value: parseAmountFromDisplay(btnConfig.display), currency: btnConfig.currency }),
        createOrder: async () => {
          if (giftModeRef.current && recipientEmailRef.current) {
            localStorage.setItem('giftMode', 'true');
            localStorage.setItem('giftRecipient', recipientEmailRef.current);
          } else {
            localStorage.removeItem('giftMode');
            localStorage.removeItem('giftRecipient');
          }
          const payload = btnConfig.package_id
            ? { package_id: btnConfig.package_id, currency: btnConfig.currency, return_url: window.location.href, cancel_url: window.location.href }
            : { currency: btnConfig.currency, amount: btnConfig.amount, return_url: window.location.href, cancel_url: window.location.href };
          const res = await base44.functions.invoke('createCreditsOrder', payload);
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
        instance = buttons;
        buttons.render(containerRef.current);
      } else {
        console.warn('[PayPal] buttons not eligible');
        isRenderedRef.current = false;
      }
    };

    const components = 'buttons';
    const sdkCurrency = btnConfig.currency;
    const scriptKey = `${paypalClientId}-${sdkCurrency}-${components}`;

    if (containerRef.current) containerRef.current.innerHTML = '';
    isRenderedRef.current = false;

    const tryRender = () => {
      if (cancelled) return;
      renderRegular();
    };

    // Cleanup: runs on unmount and before every rerender of this effect.
    // Closes any live button instance, invalidates pending async renders/timeouts,
    // clears the container, and resets the render guard so a fresh mount can render again.
    const cleanup = () => {
      cancelled = true;
      renderKeyRef.current += 1;
      if (instance && typeof instance.close === 'function') {
        try { instance.close().catch?.(() => {}); } catch (_) {}
      }
      instance = null;
      if (containerRef.current) containerRef.current.innerHTML = '';
      isRenderedRef.current = false;
    };

    // Loads the SDK script for scriptKey, retrying automatically on network/script
    // errors instead of dead-ending on a single failure (up to 3 attempts, backing off).
    const loadScript = (attempt = 0) => {
      if (cancelled) return;
      // Clear out scripts for a different client/currency, but never tear down one
      // that's already loading for this exact key (that was the source of the race
      // condition — removing an in-flight script made it error out spuriously).
      document.querySelectorAll('script[data-paypal-sdk]').forEach((s) => {
        if (s.getAttribute('data-paypal-sdk') !== scriptKey) s.remove();
      });
      try { if (!document.querySelector(`script[data-paypal-sdk="${scriptKey}"]`)) delete window.paypal; } catch (_) {}

      const script = document.createElement('script');
      script.setAttribute('data-paypal-sdk', scriptKey);
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&components=${components}&currency=${sdkCurrency}&disable-funding=venmo,credit&enable-funding=paylater`;
      script.onload = () => { setPaypalError(''); trackEvent('paypal_button_loaded'); setTimeout(() => tryRender(), 300); };
      script.onerror = () => {
        script.remove();
        if (cancelled) return;
        if (attempt < 2) {
          setTimeout(() => loadScript(attempt + 1), 1000 * (attempt + 1));
        } else {
          trackEvent('paypal_button_failed');
          setPaypalError(isHe ? 'לא ניתן להתחבר ל-PayPal כרגע. מנסים שוב אוטומטית...' : "Can't connect to PayPal right now. Retrying automatically...");
          setTimeout(() => { if (!cancelled) { setPaypalError(''); loadScript(0); } }, 5000);
        }
      };
      document.body.appendChild(script);
    };

    const existingScript = document.querySelector(`script[data-paypal-sdk="${scriptKey}"]`);
    if (window.paypal?.Buttons && existingScript) {
      // SDK already loaded for this exact client/currency — just re-render
      setTimeout(() => tryRender(), 50);
    } else if (existingScript) {
      // Script tag present but still mid-load (e.g. from a fast-following rerender) —
      // wait for it instead of recreating it.
      existingScript.addEventListener('load', () => { setPaypalError(''); setTimeout(() => tryRender(), 50); }, { once: true });
      existingScript.addEventListener('error', () => loadScript(0), { once: true });
    } else {
      loadScript(0);
    }
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnConfig, giftMode, paypalClientId, isAuthed, paypalRetryNonce]);

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

  const pricingMeta = PRICING_META[isHe ? 'he' : 'en'];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <PageMeta title={pricingMeta.title} description={pricingMeta.description} />
      <BreadcrumbSchema items={[{ name: isHe ? 'רכישת קרדיטים' : 'Pricing', path: location.pathname }]} />
      <ProductSchema
        name={isHe ? 'סיפור מותאם אישית' : 'Personalized Story'}
        description={pricingMeta.description}
        price={parseAmountFromDisplay(btnConfig.display)}
        currency={btnConfig.currency}
        path={location.pathname}
      />
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            {isHe ? 'סיפור מותאם אישית' : 'Personalized Story'}
          </h1>
          <p className="text-sm text-slate-500 mb-1">
            {isHe ? 'סיפור מותאם אישית לילד/ה שלכם, מוכן תוך שעות בודדות' : 'A personalized story, made for your child, ready within a few hours'}
          </p>
          <p className="text-xs text-slate-400 mb-6">
            {isHe ? 'תקבלו אותו כסיפור דיגיטלי, ישירות למייל שלכם' : "You'll receive it as a digital story, delivered straight to your email"}
          </p>
        </motion.div>
      </div>

      <div id="purchase-block" className="max-w-2xl mx-auto">
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
                  {selectedPackage
                    ? `⭐ ${selectedPackage.credits} ${isHe ? 'קרדיטים' : 'Credits'}`
                    : (isHe ? '⭐ 110 קרדיטים' : '⭐ 110 Credits')}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  {isHe ? '110 קרדיטים = יצירת סיפור אחד מותאם אישית' : 'Includes one personalized story'}
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
                  <Input type="email" placeholder={isHe ? 'מייל מקבל/ת המתנה' : 'Recipient email'} value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="text-sm ph-mask" />
                  <p className="text-xs text-slate-400 mt-1 text-center">{isHe ? 'הקוד יישלח למייל זה לאחר התשלום' : 'The gift code will be sent to this email after payment'}</p>
                </div>
              )}

              <div className="text-center mb-6">
                {btnConfig.original && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-3">
                    ☀️ {isHe ? 'מבצע חופש גדול' : 'Summer Sale'}
                  </div>
                )}
                <div className="flex items-center justify-center gap-3">
                  {btnConfig.original && (
                    <span className="text-xl text-slate-400 line-through">{btnConfig.original}</span>
                  )}
                  <p className="text-3xl font-bold text-slate-800">{btnConfig.display}</p>
                </div>
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
                <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between gap-3">
                  <p className="text-sm text-red-600">{paypalError}</p>
                  <Button variant="outline" size="sm" onClick={() => { setPaypalError(''); setPaypalRetryNonce((n) => n + 1); }} className="shrink-0 border-red-300 text-red-600 hover:bg-red-100">
                    {isHe ? 'ניסיון חדש' : 'Retry'}
                  </Button>
                </div>
              )}

              {processing && (
                <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">
                    {isHe ? 'מעבד תשלום...' : 'Processing payment...'}
                  </p>
                </div>
              )}

              {/* PayPal Button — purchase itself requires signing in, browsing pricing does not */}
              <div className="max-w-xs mx-auto mt-4">
                {isAuthed === false && (
                  <div className="p-4 bg-slate-50 rounded-xl text-center space-y-3">
                    <p className="text-sm text-slate-500">
                      {isHe ? 'יש להתחבר או להירשם כדי להשלים את הרכישה' : 'Sign in or register to complete your purchase'}
                    </p>
                    <Button
                      onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      {isHe ? 'התחברות / הרשמה לרכישה' : 'Sign in / Register to purchase'}
                    </Button>
                  </div>
                )}
                {isAuthed && giftMode && !recipientEmail && (
                  <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-sm text-slate-400">
                      {isHe ? 'הזינו מייל של מקבל/ת המתנה כדי להמשיך' : 'Enter recipient email to continue'}
                    </p>
                  </div>
                )}
                {isAuthed && (!giftMode || recipientEmail) && (
                  <div ref={containerRef} />
                )}
              </div>

              <p className="text-xs text-slate-400 mt-4">
                {isHe ? 'בלחיצה על התשלום אתם מאשרים את ' : 'By proceeding to payment you agree to our '}
                <Link to="/TermsOfUse" className="underline hover:text-slate-600">
                  {isHe ? 'תנאי השימוש, הרכישה והביטול' : 'Terms of Use, Purchase & Cancellation'}
                </Link>
                {isHe ? ' ואת ' : ' and '}
                <Link to="/PrivacyPolicy" className="underline hover:text-slate-600">
                  {isHe ? 'מדיניות הפרטיות' : 'Privacy Policy'}
                </Link>
              </p>

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
            setCreditsPopup(null);
            if (!bonusPopup) navigate('/MyStories');
          }}
        />
      )}
      {!creditsPopup && bonusPopup && (
        <CreditsAddedPopup
          bonus
          added={bonusPopup.added}
          total={bonusPopup.total}
          onClose={() => {
            setBonusPopup(null);
            navigate('/MyStories');
          }}
        />
      )}
    </div>
  );
}