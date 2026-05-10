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
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Coming Soon 🚀</h2>
              <p className="text-lg text-slate-600 mb-8">
                We're working on bringing you amazing new pricing plans. Stay tuned!
              </p>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl h-12 px-8">
                  {t('pricing_contact_us')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}