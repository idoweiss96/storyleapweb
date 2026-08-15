import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { CHECKIN_SITUATIONS, CHECKIN_FEELINGS, CHECKIN_RESULTS } from './checkInContent';

export default function QuickCheckIn() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const [age, setAge] = useState('');
  const [situation, setSituation] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const canSeeResult = situation && feeling;

  const scrollToPurchase = () => {
    document.getElementById('purchase-block')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const result = situation ? CHECKIN_RESULTS[situation] : null;

  return (
    <Card className="border-0 shadow-xl shadow-slate-200 mb-6">
      <CardContent className="p-6 md:p-8">
        {!showResult ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1 text-center">
              {isHe ? 'בואו נתחיל עם בדיקה קצרה' : "Let's start with a quick check-in"}
            </h2>
            <p className="text-sm text-slate-400 mb-6 text-center">
              {isHe ? '30 שניות, בלי הרשמה' : '30 seconds, no signup'}
            </p>

            <div className="mb-5 max-w-xs mx-auto">
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">
                {isHe ? 'בן/בת כמה הילד/ה שלכם?' : "How old is your child?"}
              </p>
              <Input
                type="number"
                min="0"
                max="18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="text-sm text-center"
                placeholder={isHe ? 'למשל: 5' : 'e.g.: 5'}
              />
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">
                {isHe ? 'מה קורה אצלכם עכשיו?' : "What's going on right now?"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {CHECKIN_SITUATIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSituation(s.key)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      situation === s.key
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {isHe ? s.he : s.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">
                {isHe ? 'איך זה נראה שמשפיע עליו/ה?' : 'How does it seem to be affecting them?'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {CHECKIN_FEELINGS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeeling(f.key)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      feeling === f.key
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {isHe ? f.he : f.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button
                disabled={!canSeeResult}
                onClick={() => setShowResult(true)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isHe ? 'קבלו תובנה' : 'Get insight'}
              </Button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">
              {isHe ? result?.he : result?.en}
            </p>
            <Button onClick={scrollToPurchase} className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-6">
              {isHe ? 'בואו נבנה את הסיפור של הילד/ה' : "Build your child's story"}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}