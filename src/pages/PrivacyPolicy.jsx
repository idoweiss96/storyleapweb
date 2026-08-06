import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Camera, Mail, BarChart3 } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isHe ? 'מדיניות פרטיות' : 'Privacy Policy'}
        </h1>
        <p className="text-sm text-slate-500">
          {isHe
            ? 'איך אנחנו אוספים ומשתמשים במידע שלכם ושל הילד/ה שלכם'
            : 'How we collect and use your information and your child\'s information'}
        </p>
      </motion.div>

      <Card className="border-0 shadow-xl shadow-slate-100">
        <CardContent className="p-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet-500" />
              {isHe ? 'איזה מידע אנחנו אוספים' : 'What information we collect'}
            </h2>
            <p>
              {isHe
                ? 'כדי ליצור עבורכם סיפור מותאם אישית, אנחנו אוספים את שם ההורה, שם הילד/ה, גיל, מגדר, כתובת אימייל ומספר טלפון ליצירת קשר, וכן תמונה של הילד/ה (ובמקרים מסוימים גם תמונת משפחה) שאתם בוחרים להעלות.'
                : 'To create your personalized story, we collect the parent\'s name, the child\'s name, age, gender, an email address and phone number for contact, and a photo of your child (and in some cases a family photo) that you choose to upload.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {isHe ? 'למה אנחנו משתמשים במידע' : 'Why we use this information'}
            </h2>
            <p>
              {isHe
                ? 'המידע משמש אך ורק כדי לכתוב וליצור את הסיפור המותאם אישית עבור הילד/ה שלכם, לשלוח לכם עדכונים על הסיפור ולתת מענה אם יש שאלה או בעיה. אנחנו לא מוכרים ולא משתפים את המידע שלכם עם צדדים שלישיים לצרכי שיווק.'
                : 'This information is used only to write and create your child\'s personalized story, to send you updates about it, and to respond if you have a question or an issue. We do not sell or share your information with third parties for marketing purposes.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              {isHe ? 'איך תמונת הילד/ה שלכם משמשת אותנו' : 'How your child\'s photo is used'}
            </h2>
            <p>
              {isHe
                ? 'תמונת הילד/ה שאתם מעלים משמשת רק כהשראה ליצירת האיורים והדמות בסיפור האישי שלכם, ואינה מתפרסמת, אינה משותפת עם צדדים שלישיים ואינה נשמרת לשימוש בכל סיפור אחר מלבד הסיפור שביקשתם. אתם יכולים לבקש מחיקה של התמונה בכל שלב על ידי פנייה אלינו.'
                : 'The photo you upload is used solely to inspire the illustrations and character in your own personalized story. It is never published, never shared with third parties, and is not reused for any story other than the one you requested. You may ask us to delete the photo at any time by contacting us.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-500" />
              {isHe ? 'ניתוח שימוש ושיפור המוצר' : 'Usage Analytics & Product Improvement'}
            </h2>
            <p>
              {isHe
                ? 'אנחנו משתמשים בכלי אנליטיקס אנונימי כדי להבין איך משתמשים באתר ולשפר את החוויה, כולל הקלטות מסך אנונימיות של הגלישה. פרטים רגישים כמו תמונת הילד/ה וכתובת המייל תמיד מוסתרים (מטושטשים) בהקלטות הללו ואינם ניתנים לצפייה.'
                : 'We use anonymized analytics tools to understand how the site is used and to improve the experience, including anonymized session recordings of browsing activity. Sensitive details such as your child\'s photo and your email address are always hidden (masked) in these recordings and cannot be viewed.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              {isHe ? 'איך אפשר לפנות אלינו' : 'How to contact us'}
            </h2>
            <p>
              {isHe
                ? 'אם יש לכם שאלה על המידע שלכם, או שתרצו לבקש עיון, תיקון או מחיקה של המידע, אתם מוזמנים לפנות אלינו בכל עת בעמוד "צור קשר".'
                : 'If you have any question about your information, or would like to request access, correction, or deletion of your information, you\'re welcome to reach out to us anytime via our Contact page.'}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}