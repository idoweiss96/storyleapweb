import React, { useState, useEffect, useRef } from 'react';
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

// Price config (must match what's set on PayPal hosted buttons)
const PRICES = {
  he: { full: { amount: '45.00', currency: 'ILS', display: '₪45' }, discount: { amount: '15.00', currency: 'ILS', display: '₪15' } },
  en: { full: { amount: '15.00', currency: 'USD', display: '$15' }, discount: { amount: '5.00',  currency: 'USD', display: '$5'  } },
};

export default function Pricing() {
  const { lang, isHe: langIsHe } = useLanguage();
  const navigate = useNavigate();
  const [hasPendingStory, setHasPendingStory] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [paypalError, setPaypalError] = useState('');
  const [processing, setProcessing] = useState(false);
  const containerRef = useRef(null);
  const renderKeyRef = useRef(0);
  const pendingOrderIdRef = useRef(null);

  const isHe = lang === 'he';
  const mode = promoApplied ? 'discount' : 'full';
  const priceConfig = PRICES[isHe ? 'he' : 'en'][mode];
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setHasPendingStory(!!localStorage.getItem('pendingStoryId'));
    // Fetch the real PayPal client ID from backend
    base44.functions.invoke('getPaypalClientId', {})
      .then(res => { if (res.data?.client_id) setClientId(res.data.client_id); })
      .catch(() => {});
  }, []);

  // Render PayPal buttons using JS SDK (not Hosted Buttons)
  useEffect(() => {
    if (!clientId) return;
    renderKeyRef.current += 1;
    const currentKey = renderKeyRef.current;

    const renderButton = () => {
      if (renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.Buttons || !containerRef.current) return;
      containerRef.current.innerHTML = '';

      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },

        createOrder: async () => {
          setPaypalError('');
          const pendingStoryId = localStorage.getItem('pendingStoryId');
          try {
            if (pendingStoryId) {
              // Has questionnaire — create story order
              const res = await base44.functions.invoke('createPaypalOrder', { story_id: pendingStoryId });
              pendingOrderIdRef.current = res.data.order_id;
              return res.data.paypal_order_id;
            } else {
              // No questionnaire — create credits-only order
              const res = await base44.functions.invoke('createCreditsOrder', {
                currency: priceConfig.currency,
                amount: priceConfig.amount,
              });
              return res.data.paypal_order_id;
            }
          } catch (err) {
            setPaypalError(isHe ? 'שגיאה ביצירת הזמנה' : 'Error creating order');
            return null;
          }
        },

        onApprove: async (data) => {
          setProcessing(true);
          setPaypalError('');
          try {
            const pendingStoryId = localStorage.getItem('pendingStoryId');
            const orderId = pendingOrderIdRef.current;

            if (pendingStoryId) {
              // Has questionnaire — capture story order
              const res = await base44.functions.invoke('capturePaypalOrder', {
                paypal_order_id: data.orderID,
                order_id: orderId,
              });
              if (res.data?.success) {
                localStorage.removeItem('pendingStoryId');
                window.dispatchEvent(new Event('credits-updated'));
                navigate('/PaymentSuccess?story_id=' + pendingStoryId);
              }
            } else {
              // No questionnaire — capture credits order
              const res = await base44.functions.invoke('captureCreditsOrder', {
                paypal_order_id: data.orderID,
                credits: 20,
              });
              if (res.data?.success) {
                window.dispatchEvent(new Event('credits-updated'));
                toast.success(isHe
                  ? '🎉 הקרדיטים התווספו לחשבונך! כעת תוכלו למלא שאלון וליצור את הסיפור שלכם.'
                  : '🎉 Credits added to your account! You can now fill the questionnaire and create your story.'
                , { duration: 6000 });
              }
            }
          } catch (err) {
            setPaypalError(isHe ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
          } finally {
            setProcessing(false);
          }
        },

        onError: () => {
          setPaypalError(isHe ? 'שגיאה בתשלום, אנא נסו שוב' : 'Payment error, please try again');
        },

        onCancel: () => {
          setPaypalError(isHe ? 'התשלום בוטל' : 'Payment cancelled');
        },
      }).render(containerRef.current);
    };

    // Load SDK with correct currency and real client ID
    const currency = priceConfig.currency;
    const existingScript = document.querySelector(`script[data-paypal-sdk="${clientId}"]`);

    if (window.paypal?.Buttons && existingScript) {
      renderButton();
      return;
    }

    // Remove old script if client changed
    document.querySelectorAll('script[data-paypal-sdk]').forEach(s => s.remove());
    delete window.paypal;

    const script = document.createElement('script');
    script.setAttribute('data-paypal-sdk', clientId);
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
    script.onload = () => renderButton();
    document.body.appendChild(script);
    return () => {};
  }, [clientId, priceConfig.currency, isHe]);

  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (FREE_CREDIT_CODES[code] !== undefined) {
      // Free credits coupon — add credits directly
      try {
        const credits = FREE_CREDIT_CODES[code];
        await base44.functions.invoke('captureCreditsOrder', { paypal_order_id: `COUPON_${code}`, credits, coupon: true });
        window.dispatchEvent(new Event('credits-updated'));
        toast.success(isHe ? `🎉 ${credits} קרדיטים התווספו לחשבונך!` : `🎉 ${credits} credits added to your account!`, { duration: 5000 });
        setPromoCode('');
      } catch (err) {
        setPromoError(isHe ? 'שגיאה בהפעלת הקוד' : 'Error applying code');
      }
      return;
    }

    if (VALID_CODES.includes(code)) {
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
                <p className="text-3xl font-bold text-slate-800">{priceConfig.display}</p>
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
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo} className="shrink-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {isHe ? 'החל' : 'Apply'}
                    </Button>
                  </div>
                ) : (
                  <button className="text-xs text-slate-400 underline" onClick={() => { setPromoApplied(false); setPromoCode(''); }}>
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