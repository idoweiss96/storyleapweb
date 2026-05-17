import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, CheckCircle, Tag } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';

const VALID_PROMO_CODES = ['STORYLEAP', 'MAGIC2024', 'WELCOME'];

export default function Pricing() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const paypalButtonRef = useRef(null);
  const paypalRendered = useRef(false);

  const isHebrew = lang === 'he';
  const currentPrice = isHebrew ? '₪45' : (promoApplied ? '$3' : '$15');
  const oldPrice = isHebrew ? '₪45' : '$15';
  const discountPercent = isHebrew ? '67%' : '80%';
  const discount = `${discountPercent} ${isHebrew ? 'הנחה' : 'OFF'}`;

  const handleApplyPromo = () => {
    setPromoError('');
    if (VALID_PROMO_CODES.includes(promoCode.trim().toUpperCase())) {
      setPromoApplied(true);
    } else {
      setPromoError(t('pricing_promo_invalid'));
    }
  };

  useEffect(() => {
    setHasDraft(!!localStorage.getItem('storyFormDraft'));
  }, []);

  useEffect(() => {
    if (!paypalOrderId || !paypalClientId || paypalRendered.current) return;
    paypalRendered.current = true;

    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=ILS&components=buttons`;
    script.setAttribute('data-namespace', 'paypal_sdk');
    script.onload = () => {
      if (window.paypal_sdk && paypalButtonRef.current) {
        window.paypal_sdk.Buttons({
          createOrder: () => paypalOrderId,
          onApprove: async () => {
            setLoading(true);
            try {
              await base44.functions.invoke('captureCreditsOrder', { paypal_order_id: paypalOrderId });
              window.dispatchEvent(new Event('credits-updated'));
              if (hasDraft) {
                navigate('/CreateStory');
              } else {
                navigate('/CreateStory?credits_purchased=true');
              }
            } catch (err) {
              setError(lang === 'he' ? 'שגיאה בעיבוד התשלום, אנא נסה שנית' : 'Payment error, please try again');
              setLoading(false);
            }
          },
          onError: () => {
            setError(lang === 'he' ? 'שגיאה בתשלום PayPal' : 'PayPal payment error');
          },
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
        }).render(paypalButtonRef.current);
      }
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [paypalOrderId, paypalClientId]);

  const handleBuyNow = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await base44.functions.invoke('createCreditsOrder', {});
      setPaypalOrderId(res.data.paypal_order_id);
      setPaypalClientId(res.data.client_id);
    } catch (err) {
      setError(lang === 'he' ? 'שגיאה ביצירת הזמנה, אנא נסה שנית' : 'Error creating order, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">רכישת קרדיטים</h1>
          <p className="text-slate-500 text-lg">{t('pricing_subtitle')}</p>
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
                {t('pricing_title')}
              </h2>
              <p className="text-slate-500 mb-6">{t('pricing_subtitle')}</p>



              {/* Price Display */}
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-slate-800">{currentPrice}</p>
              </div>

              {/* Promo Code */}
              <div className="mb-6 max-w-xs mx-auto">
                {promoApplied ? (
                  <p className="text-green-600 text-sm font-medium">{t('pricing_promo_valid')}</p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('pricing_promo_placeholder')}
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyPromo} className="shrink-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {t('pricing_promo_apply')}
                    </Button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
              </div>

              {hasDraft && (
                <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-700 font-medium">
                    {lang === 'he' ? 'השאלון שמילאת שמור — אחרי הרכישה תחזור אליו ישירות' : 'Your questionnaire is saved — you\'ll return to it right after purchase'}
                  </p>
                </div>
              )}

              {/* Buy / PayPal */}
              <div className="max-w-xs mx-auto space-y-3">
                {!paypalOrderId ? (
                  <Button
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {lang === 'he' ? 'טוען...' : 'Loading...'}
                      </span>
                    ) : (
                      t('pricing_buy_now')
                    )}
                  </Button>
                ) : (
                  <div>
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 py-4">
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-600">{lang === 'he' ? 'מעבד תשלום...' : 'Processing payment...'}</span>
                      </div>
                    ) : (
                      <div ref={paypalButtonRef} />
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <Link to={createPageUrl('Contact')}>
                  <Button variant="ghost" className="text-slate-500 hover:text-slate-700">
                    {t('pricing_contact_us')}
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