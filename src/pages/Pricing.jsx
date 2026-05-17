import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Star, Crown, Zap } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';
import PayPalButton from '../components/PayPalButton';

export default function Pricing() {
  const { t } = useLanguage();
  const [showPaypal, setShowPaypal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-amber-200 text-amber-700 text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #fff8ed, #fde8d0)' }}>
            <Sparkles className="w-4 h-4" />
            {t('pricing_badge')}
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">{t('pricing_title')}</h1>
          <p className="text-slate-500 text-lg">{t('pricing_subtitle')}</p>
        </motion.div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-2xl shadow-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">סיפור מותאם אישית ✨</h2>
              <p className="text-slate-500 mb-6">סיפור טיפולי מותאם לילד/ה שלכם, נשלח תוך 24 שעות</p>

              {/* Price */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-2xl text-slate-400 line-through">₪45</span>
                <span className="text-5xl font-bold text-slate-800">₪15</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">67% הנחה</span>
              </div>

              {/* Buy Button + PayPal */}
              <div className="max-w-xs mx-auto space-y-3">
                {!showPaypal ? (
                  <Button
                    onClick={() => setShowPaypal(true)}
                    className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 transition-all"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    רכישה עכשיו — ₪15
                  </Button>
                ) : (
                  <div>
                    <p className="text-sm text-slate-500 mb-3">בחרו אמצעי תשלום:</p>
                    <PayPalButton />
                  </div>
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