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

const PAYPAL_CLIENT_ID = 'BAAp7sBZcp1O2D_XYhhyHfg20nzgXC1O3hN8Dr6-8EFfnkGkpYKC8fTivDyIm91hiaKIFhxTilvzExmmXU';

// Hosted Button IDs
const HOSTED_BUTTONS = {
  he: {
    full:     { hostedButtonId: 'L5DBB2XDQ7QFC', currency: 'ILS', display: '₪45' },
    discount: { hostedButtonId: 'Q84GCTNCHU63A', currency: 'ILS', display: '₪15' },
  },
  en: {
    full:     { hostedButtonId: '2DYQ8YVVY86D6', currency: 'USD', display: '$15' },
    discount: { hostedButtonId: 'J9LB6MKVFTFFW', currency: 'USD', display: '$5'  },
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

  const isHe = lang === 'he';
  const mode = promoApplied ? 'discount' : 'full';
  const btnConfig = HOSTED_BUTTONS[isHe ? 'he' : 'en'][mode];

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

  // Render PayPal Hosted Button
  useEffect(() => {
    renderKeyRef.current += 1;
    const currentKey = renderKeyRef.current;

    const renderButton = () => {
      if (renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.HostedButtons || !containerRef.current) return;
      containerRef.current.innerHTML = '';

      window.paypal.HostedButtons({
        hostedButtonId: btnConfig.hostedButtonId,
        onApprove: async (data) => {
          setProcessing(true);
          setPaypalError('');
          try {
            const pendingStoryId = localStorage.getItem('pendingStoryId');
            if (pendingStoryId) {
              // Capture story order
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
              // Capture credits order
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
        onError: (err) => {
          setPaypalError(isHe ? 'שגיאה בתשלום, נסו שנית' : 'Payment error, please try again');
        },
        onCancel: () => {
          setPaypalError(isHe ? 'התשלום בוטל' : 'Payment cancelled');
        },
      }).render(containerRef.current);
    };

    // Load SDK with hosted-buttons component
    const scriptKey = `${PAYPAL_CLIENT_ID}-${btnConfig.currency}`;
    const existingScript = document.querySelector(`script[data-paypal-hosted="${scriptKey}"]`);

    if (window.paypal?.HostedButtons && existingScript) {
      renderButton();
      return;
    }

    document.querySelectorAll('script[data-paypal-hosted]').forEach(s => s.remove());
    delete window.paypal;

    const script = document.createElement('script');
    script.setAttribute('data-paypal-hosted', scriptKey);
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=${btnConfig.currency}`;
    script.onload = () => renderButton();
    script.onerror = () => setPaypalError(isHe ? 'שגיאה בטעינת PayPal, נסו לרענן את הדף' : 'Failed to load PayPal, please refresh');
    document.body.appendChild(script);
    return () => {};
  }, [btnConfig.hostedButtonId, btnConfig.currency, isHe]);

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
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo} disabled={promoLoading} className="shrink-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {promoLoading ? (isHe ? '...' : '...') : (isHe ? 'החל' : 'Apply')}
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