import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageContext';

const ACTIVITIES = [
  {
    path: '/FreeActivityGoodbye',
    title: { en: 'Our Goodbye Ritual', he: 'טקס הפרידה שלנו' },
    desc: { en: 'Build a calm, consistent goodbye routine together', he: 'בונים יחד פרידה קבועה ומרגיעה לשער בית הספר' },
  },
  {
    path: '/FreeActivityMorningEvening',
    title: { en: 'My Morning and Evening', he: 'הבוקר והערב שלי' },
    desc: { en: 'Build a printable personal routine board', he: 'בונים לוח שגרה אישי להדפסה לבוקר ולערב' },
  },
  {
    path: '/FreeActivityLittleHeart',
    title: { en: 'A Little Heart from Home', he: 'לב קטן מהבית' },
    desc: { en: 'Create a card, letter, or drawing to take along', he: 'יוצרים יחד כרטיס, מכתב או ציור לקחת בתיק' },
  },
];

export default function FreeActivitiesHighlight() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <div className="mb-8">
      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 text-center">
        {isHe ? 'מעדיפים לנסות משהו חינמי קודם?' : 'Prefer to try something free first?'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACTIVITIES.map((activity) => (
          <Link key={activity.path} to={activity.path}>
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-base font-bold text-slate-800 mb-2">
                  {isHe ? activity.title.he : activity.title.en}
                </h4>
                <p className="text-slate-500 text-sm">
                  {isHe ? activity.desc.he : activity.desc.en}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}