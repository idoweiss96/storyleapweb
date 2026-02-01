import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Check, Crown, Zap, Gift } from 'lucide-react';
import { toast } from 'sonner';

const creditPackages = [
  {
    id: 'starter',
    name: 'מתחילים',
    credits: 5,
    price: 19,
    icon: Zap,
    color: 'violet',
    features: ['5 סיפורים מותאמים אישית', 'הורדה והדפסה', 'שמירה בענן'],
  },
  {
    id: 'family',
    name: 'משפחתי',
    credits: 15,
    price: 49,
    icon: Star,
    color: 'amber',
    isPopular: true,
    features: ['15 סיפורים מותאמים אישית', 'הורדה והדפסה', 'שמירה בענן', 'תמיכה מועדפת'],
  },
  {
    id: 'premium',
    name: 'פרימיום',
    credits: 30,
    price: 89,
    icon: Crown,
    color: 'rose',
    features: ['30 סיפורים מותאמים אישית', 'הורדה והדפסה', 'שמירה בענן', 'תמיכה מועדפת', 'גישה לנושאים בלעדיים'],
  },
];

export default function Credits() {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setCredits(currentUser.credits ?? 0);
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const handlePurchase = async (pkg) => {
    setIsProcessing(pkg.id);
    
    // Simulate purchase (in production, this would redirect to Stripe/payment)
    // For demo purposes, we'll just add credits
    try {
      const newCredits = credits + pkg.credits;
      await base44.auth.updateMe({ credits: newCredits });
      setCredits(newCredits);
      toast.success(`נרכשו ${pkg.credits} קרדיטים בהצלחה!`);
    } catch (err) {
      toast.error('אירעה שגיאה. נסו שוב.');
    } finally {
      setIsProcessing(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            חבילות קרדיטים
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">רכישת קרדיטים</h1>
          <p className="text-gray-600">בחרו את החבילה המתאימה לכם</p>
        </motion.div>

        {/* Current Credits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
            <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            <div className="text-right">
              <p className="text-violet-100 text-sm">היתרה שלכם</p>
              <p className="text-2xl font-bold">{credits} קרדיטים</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditPackages.map((pkg, index) => {
          const Icon = pkg.icon;
          const isProcessingThis = isProcessing === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full border-2 transition-all hover:shadow-xl ${
                  pkg.isPopular
                    ? 'border-amber-300 shadow-lg shadow-amber-100'
                    : 'border-transparent shadow-lg shadow-violet-50 hover:border-violet-200'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1">
                      <Sparkles className="w-3 h-3 ml-1" />
                      הכי פופולרי
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-${pkg.color}-100 flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-7 h-7 text-${pkg.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">
                      ₪{pkg.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      {pkg.credits} סיפורים
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className={`w-4 h-4 text-${pkg.color}-500 flex-shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchase(pkg)}
                    disabled={isProcessing}
                    className={`w-full h-12 rounded-xl ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white'
                        : 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white'
                    }`}
                  >
                    {isProcessingThis ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        מעבד...
                      </span>
                    ) : (
                      'רכישה'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500">
          כל הקרדיטים אינם פוגעים ניתנים לשימוש ללא הגבלת זמן
        </p>
      </motion.div>
    </div>
  );
}