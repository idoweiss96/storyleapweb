import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, Wrench, RefreshCw, Mail } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export default function TermsOfUse() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isHe ? 'תנאי שימוש, רכישה וביטול' : 'Terms of Use, Purchase & Cancellation'}
        </h1>
        <p className="text-sm text-slate-500">
          {isHe
            ? 'מה מקבלים, מתי, ומה עושים אם משהו לא בסדר'
            : 'What you get, when, and what to do if something isn\'t right'}
        </p>
      </motion.div>

      <Card className="border-0 shadow-xl shadow-slate-100">
        <CardContent className="p-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-500" />
              {isHe ? 'מה מקבלים ברכישה' : 'What you receive with your purchase'}
            </h2>
            <p>
              {isHe
                ? 'ברכישה אתם מקבלים סיפור טיפולי מותאם אישית לילד/ה שלכם, על בסיס הפרטים שמסרתם בשאלון. הסיפור נשלח אליכם כקישור דיגיטלי, שתוכלו לצפות בו, להקריא ולשמור לצפייה חוזרת.'
                : 'Your purchase gives you a therapeutic story personalized for your child, based on the details you provided in the questionnaire. The story is delivered to you as a digital link that you can view, read aloud, and revisit anytime.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              {isHe ? 'מתי מקבלים את הסיפור' : 'When you\'ll receive the story'}
            </h2>
            <p>
              {isHe
                ? 'הסיפור נכתב במיוחד עבורכם ולוקח בממוצע עד 24 שעות מרגע השלמת הרכישה והשאלון. במקרים חריגים ייתכן עיכוב קצר, ואנחנו מעדכנים אתכם באימייל כשהסיפור מוכן.'
                : 'The story is written just for you and typically takes up to 24 hours from the moment you complete your purchase and questionnaire. In rare cases there may be a short delay, and we\'ll email you as soon as the story is ready.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              {isHe ? 'טעות בסיפור? אנחנו מתקנים' : 'A mistake in the story? We\'ll fix it'}
            </h2>
            <p>
              {isHe
                ? 'אם יש טעות בסיפור - שם שגוי, פרט לא מדויק, תמונה לא נכונה או כל דבר אחר שלא מרגיש נכון - פשוט פנו אלינו ונתקן זאת ללא עלות נוספת עד לשביעות רצונכם.'
                : 'If there\'s a mistake in the story — a wrong name, an inaccurate detail, the wrong photo, or anything else that doesn\'t feel right — just contact us and we\'ll correct it at no extra cost until you\'re happy with it.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-rose-500" />
              {isHe ? 'ביטול והחזר כספי' : 'Cancellation & refunds'}
            </h2>
            <p>
              {isHe
                ? 'ניתן לבטל את הרכישה ולקבל החזר כספי מלא כל עוד יצירת הסיפור עדיין לא התחילה. מרגע שכתיבת הסיפור האישי שלכם התחילה, לא ניתן לבטל את העסקה, שכן מדובר בתוכן דיגיטלי שנוצר במיוחד ובאופן ייחודי עבורכם. אם יש בעיה כלשהי בסיפור שקיבלתם, אנחנו כאן לתקן אותה - ראו סעיף התיקונים למעלה.'
                : 'You can cancel your purchase for a full refund as long as story creation hasn\'t started yet. Once work on your personalized story has begun, the purchase can no longer be cancelled, since this is digital content created uniquely and specifically for you. If there\'s any issue with the story you received, we\'re here to fix it — see the corrections section above.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-500" />
              {isHe ? 'איך אפשר לפנות אלינו' : 'How to contact us'}
            </h2>
            <p>
              {isHe
                ? 'לכל שאלה, בקשת תיקון או בקשת ביטול - אתם מוזמנים לפנות אלינו בכל עת בעמוד "צור קשר" ונשמח לעזור.'
                : 'For any question, correction request, or cancellation request — you\'re welcome to reach out to us anytime via our Contact page, and we\'ll be happy to help.'}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}