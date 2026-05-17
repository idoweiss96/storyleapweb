import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Star, CheckCircle, Tag } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

const CLIENT_ID = 'BAAp7sBZcp1O2D_XYhhyHfg20nzgXC1O3hN8Dr6-8EFfnkGkpYKC8fTivDyIm91hiaKIFhxTilvzExmmXU';

const BUTTONS = {
  he: {
    full:     { buttonId: 'L5DBB2XDQ7QFC',   price: '₪45', currency: 'ILS' },
    discount: { buttonId: 'Q84GCTNCHU63A',   price: '₪15', currency: 'ILS' },
  },
  en: {
    full:     { buttonId: '2DYQ8YVVY86D6',   price: '$15', currency: 'USD' },
    discount: { buttonId: 'J9LB6MKVFTFFW',   price: '$5',  currency: 'USD' },
  },
};

const VALID_CODES = ['MIL30', 'NYUD30', 'SHNK30', 'MIAMI30'];

export default function Pricing() {
  const { lang } = useLanguage();
  const [hasPendingStory, setHasPendingStory] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const containerRef = useRef(null);
    const renderKeyRef = useRef(0);

  const isHe = lang === 'he';
  const mode = promoApplied ? 'discount' : 'full';
  const { buttonId, price, currency } = BUTTONS[isHe ? 'he' : 'en'][mode];

  useEffect(() => {
    setHasPendingStory(!!localStorage.getItem('pendingStoryId'));
  }, []);

  useEffect(() => {
    renderKeyRef.current += 1;
    const currentKey = renderKeyRef.current;

    const renderButton = () => {
      if (renderKeyRef.current !== currentKey) return;
      if (!window.paypal?.HostedButtons || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      window.paypal.HostedButtons({ hostedButtonId: buttonId }).render(containerRef.current);
    };

    // SDK already loaded — just re-render
    if (window.paypal?.HostedButtons) {
      renderButton();
      return;
    }

    // Already loading — wait for it
    if (document.querySelector('script[data-paypal-sdk]')) {
      const interval = setInterval(() => {
        if (window.paypal?.HostedButtons) {
          clearInterval(interval);
          renderButton();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // First load — use ILS always (single SDK instance)
    const script = document.createElement('script');
    script.setAttribute('data-paypal-sdk', 'true');
    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=ILS`;
    script.onload = () => renderButton();
    document.body.appendChild(script);
  }, [buttonId]);

  const handleApplyPromo = () => {
    setPromoError('');
    if (VALID_CODES.includes(promoCode.trim().toUpperCase())) {
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

              {/* Package Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-6 mt-2">
                <p className="text-lg font-bold text-amber-800">
                  {isHe ? '⭐ חבילת 20 קרדיטים' : '⭐ 20 Credits Package'}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  {isHe ? '20 קרדיטים = יצירת סיפור אחד מותאם אישית' : '20 credits = 1 personalized story'}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-slate-800">{price}</p>
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
                  <button
                    className="text-xs text-slate-400 underline"
                    onClick={() => { setPromoApplied(false); setPromoCode(''); }}
                  >
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