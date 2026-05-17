import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

const PAYPAL_CLIENT_ID = 'BAAp7sBZcp1O2D_XYhhyHfg20nzgXC1O3hN8Dr6-8EFfnkGkpYKC8fTivDyIm91hiaKIFhxTilvzExmmXU';
const HOSTED_BUTTON_ID = 'L5DBB2XDQ7QFC';

export default function Pricing() {
  const { t, lang } = useLanguage();
  const [hasDraft, setHasDraft] = useState(false);
  const paypalContainerRef = useRef(null);
  const paypalRendered = useRef(false);

  useEffect(() => {
    setHasDraft(!!localStorage.getItem('storyFormDraft'));
  }, []);

  useEffect(() => {
    if (paypalRendered.current) return;
    paypalRendered.current = true;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=ILS`;
    script.onload = () => {
      if (window.paypal && paypalContainerRef.current) {
        window.paypal.HostedButtons({
          hostedButtonId: HOSTED_BUTTON_ID,
        }).render(paypalContainerRef.current);
      }
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">סיפור מותאם אישית</h1>
          <p className="text-sm text-slate-500 mb-6">סיפור טיפולי מותאם לילד/ה שלכם, נשלח תוך 24 שעות</p>
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
                רכישת קרדיטים
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
              </h2>

              {/* Price Display */}
              <div className="text-center mb-6 mt-4">
                <p className="text-3xl font-bold text-slate-800">₪45</p>
              </div>

              {hasDraft &&
                <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-700 font-medium">
                    {lang === 'he' ? 'השאלון שמילאת שמור — אחרי הרכישה תחזור אליו ישירות' : 'Your questionnaire is saved — you\'ll return to it right after purchase'}
                  </p>
                </div>
              }

              {/* PayPal Hosted Button */}
              <div className="max-w-xs mx-auto mt-4">
                <div ref={paypalContainerRef} />
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