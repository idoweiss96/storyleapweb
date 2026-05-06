import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Star, Crown, Zap } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from '@/api/base44Client';

export default function Pricing() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'starter',
      icon: Zap,
      color: 'blue',
      price: 19,
      credits: 5,
      name: t('pkg_starter'),
      features: [`5 ${t('pkg_stories_unit')}`, t('feat_2'), t('feat_3')],
    },
    {
      id: 'family',
      icon: Star,
      color: 'amber',
      price: 49,
      credits: 15,
      isPopular: true,
      name: t('pkg_family'),
      features: [`15 ${t('pkg_stories_unit')}`, t('feat_2'), t('feat_3'), t('feat_4')],
    },
    {
      id: 'premium',
      icon: Crown,
      color: 'rose',
      price: 89,
      credits: 30,
      name: t('pkg_premium'),
      features: [`30 ${t('pkg_stories_unit')}`, t('feat_2'), t('feat_3'), t('feat_4'), t('feat_5')],
    },
  ];

  const handleGetStarted = () => {
    base44.auth.redirectToLogin(createPageUrl('Credits'));
  };

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

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`relative h-full border-2 transition-all hover:shadow-2xl ${plan.isPopular ? 'border-amber-300 shadow-xl shadow-amber-100 scale-105' : 'border-transparent shadow-lg shadow-slate-100 hover:border-slate-200'}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="text-white px-4 py-1" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                      <Sparkles className="w-3 h-3 mr-1" />{t('pkg_popular')}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: plan.id === 'starter' ? 'linear-gradient(135deg, #BAD1FA, #9ab8f5)' : plan.id === 'family' ? 'linear-gradient(135deg, #fde8d0, #fbbf24)' : 'linear-gradient(135deg, #fad4e0, #f472b6)' }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
                    <div className="flex items-end justify-center gap-1 mb-1">
                      <span className="text-4xl font-bold text-slate-900">₪{plan.price}</span>
                    </div>
                    <p className="text-sm text-slate-500">{plan.credits} {t('pkg_stories_unit')}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #BAD1FA, #9ab8f5)' }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleGetStarted}
                    className={`w-full h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 ${plan.isPopular ? '' : ''}`}
                    style={{ background: plan.isPopular ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #BAD1FA, #7eb3f5)' }}>
                    {t('pricing_get_started')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-center p-6 rounded-2xl border border-slate-100 bg-white/60">
        <p className="text-slate-500 text-sm">{t('credits_no_expiry')}</p>
        <p className="mt-2 text-sm text-slate-400">
          {t('pricing_questions')}{' '}
          <Link to={createPageUrl('Contact')} className="text-blue-500 hover:underline font-medium">{t('pricing_contact_us')}</Link>
        </p>
      </motion.div>
    </div>
  );
}