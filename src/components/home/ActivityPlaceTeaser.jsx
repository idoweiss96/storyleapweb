import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

const TEASER_ITEMS = [
  { path: '/activities/emotion-wheel', emoji: '🎡', title: { en: 'The Emotion Wheel', he: 'גלגל הרגשות' } },
  { path: '/activities/emotion-thermometer', emoji: '🌡️', title: { en: 'The Feelings Thermometer', he: 'מד החום של הרגשות' } },
  { path: '/activities/emotion-drawing', emoji: '🎨', title: { en: 'Draw the Feeling', he: 'ציור הרגש' } },
];

export default function ActivityPlaceTeaser() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <section className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
          {isHe ? 'מקום הפעילויות - כלים קטנים לרגעים גדולים' : 'The Activity Place - Small Tools for Big Moments'}
        </h3>
        <p className="text-slate-500 text-sm">
          {isHe ? 'עשרות פעילויות קצרות לילדים - חלקן חינם לגמרי, חלקן לאחר התחברות' : 'Dozens of short activities for kids - some completely free, some after logging in'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
        {TEASER_ITEMS.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h4 className="text-lg font-bold text-slate-800">{item.title[isHe ? 'he' : 'en']}</h4>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link to="/activities" className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 underline">
          {isHe ? 'לכל הפעילויות' : 'See all activities'}
          <ArrowLeft className={`w-4 h-4 ${isHe ? '' : 'rotate-180'}`} />
        </Link>
      </div>
    </section>
  );
}