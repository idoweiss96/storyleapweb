import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';

export default function Pricing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(!!localStorage.getItem('storyFormDraft'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>

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
              <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
                {t('pricing_title')}
              </h2>
              <p className="text-slate-500 mb-6">{t('pricing_subtitle')}</p>

              {/* Price */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-2xl text-slate-400 line-through">{t('pricing_old_price')}</span>
                <span className="text-5xl font-bold text-slate-800">{t('pricing_new_price')}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">{t('pricing_discount')}</span>
              </div>

              {/* Buy Button */}
              <div className="max-w-xs mx-auto space-y-3">
                <Button
                  onClick={() => navigate('/Contact')}
                  className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t('pricing_buy_now')}
                </Button>
                {hasDraft && (
                  <p className="text-sm text-slate-500 text-center">
                    {t('lang') === 'he' ? 'השאלון שמילאת שמור ויחכה לך אחרי הרכישה' : 'Your questionnaire is saved and will be waiting after purchase'}
                  </p>
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
    </div>);

}