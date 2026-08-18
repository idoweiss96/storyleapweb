import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import PageMeta from '@/components/SEO/PageMeta';
import JsonLd from '@/components/SEO/JsonLd';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const META = {
  he: { title: 'שאלות נפוצות | StoryLeap', description: 'תשובות על יצירת סיפור מותאם אישית ב-StoryLeap: איך זה עובד, מחירים, תשלום, ותמונות הילד/ה.' },
  en: { title: 'FAQ | StoryLeap', description: "Answers about creating a personalized StoryLeap story: how it works, pricing, payment, and your child's photo." },
};

const faqData = {
  he: {
    title: 'שאלות נפוצות',
    items: [
      { q: 'מה זה StoryLeap?', a: 'StoryLeap יוצר סיפור מותאם אישית לילד שלכם, בהתבסס על שאלון קצר שאתם ממלאים. הסיפור נכתב סביב האתגר הרגשי הספציפי של הילד/ה שלכם, למשל פחדים, קשיים חברתיים, או קושי בפרידות, ומטרתו לפתוח שיחה משמעותית בין הורה לילד/ה.' },
      { q: 'איך זה עובד?', a: 'ממלאים שאלון קצר על הילד/ה, משלמים בקרדיטים, והפרטים עוברים ליצירת הסיפור. ברגע שהסיפור מוכן, תקבלו התראה במייל ותוכלו לראות אותו גם באזור האישי שלכם באתר.' },
      { q: 'כמה זמן לוקח לקבל את הסיפור?', a: 'יצירת הסיפור אורכת עד 24 שעות מרגע התשלום.' },
      { q: 'איך משלמים?', a: 'התשלום מתבצע באמצעות קרדיטים שרוכשים באתר, בכרטיס אשראי או PayPal. סיפור מותאם אישית עולה ₪70 (מבצע חופש גדול, במקום ₪110). ניתן לצפות במחירים המלאים בעמוד רכישת הקרדיטים בלי להתחבר, וההתחברות נדרשת רק בשלב התשלום עצמו.' },
      { q: 'מה קורה לתמונה של הילד/ה שאני מעלה?', a: 'התמונה משמשת אך ורק ליצירת הסיפור המותאם אישית, ואנחנו מתחייבים למחוק אותה מהמאגר שלנו תוך חודש מיום ההעלאה.' },
      { q: 'אפשר לבטל או לקבל החזר?', a: 'אנא עיינו בעמוד תנאי השימוש, הרכישה והביטולים לפרטים המלאים. באופן כללי, ככל שהיצירה טרם החלה, ניתן לפנות אלינו לבירור ביטול.' },
      { q: 'מה קורה אם יש טעות בסיפור?', a: 'פנו אלינו ונשמח לבדוק ולתקן. אנא כללו את פרטי ההזמנה שלכם בפנייה.' },
      { q: 'איפה אני רואה את הסיפור אחרי שהוא מוכן?', a: 'גם באימייל שתקבלו (עם קישור ישיר לסיפור) וגם באזור האישי באתר, תחת "הסיפורים שלי".' },
      { q: 'מה ההבדל בין הסיפור הרגיל לשאלון "הכנה לכיתה א\'"?', a: 'השאלון הרגיל מתאים לכל אתגר רגשי שהילד/ה חווה. שאלון "הכנה לכיתה א\'" הוא שאלון ייעודי, משותף להורה ולילד/ה, שמתמקד ספציפית במעבר לכיתה א\', ומגיע גם עם פעילות המשך, "מפת הרגשות", לעשות יחד אחרי קריאת הסיפור.' },
      { q: 'לאיזה גילאים זה מתאים?', a: 'לילדים בגילאי 3–9.' },
      { q: 'אפשר לתת את זה במתנה?', a: 'כן, אפשר לרכוש קרדיטים ולשלוח אותם במתנה למישהו אחר, שיוכל להשתמש בהם כדי ליצור סיפור לילד/ה שלו/שלה.' },
      { q: 'האתר זמין גם באנגלית?', a: 'כן, האתר והשאלונים זמינים גם בעברית וגם באנגלית.' },
      { q: 'איך יוצרים איתכם קשר?', a: 'דרך עמוד "צור קשר" באתר.' },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What is StoryLeap?', a: "StoryLeap creates a personalized story for your child, based on a short questionnaire you fill out. The story is built around your child's specific emotional challenge, such as fears, social difficulties, or trouble with separations, designed to open up a meaningful conversation between parent and child." },
      { q: 'How does it work?', a: "Fill out a short questionnaire about your child, pay with credits, and your answers go into creating the story. Once it's ready, you'll get an email notification, and you can also view it in your personal area on the site." },
      { q: 'How long does it take to receive the story?', a: 'Story creation takes up to 24 hours from the moment of payment.' },
      { q: 'How do I pay?', a: 'Payment is made using credits purchased on the site, via credit card or PayPal. A personalized story is $25 (Summer Sale, regularly $40). You can view full pricing on the credits page without signing in, sign in is only required at the actual payment step.' },
      { q: 'What happens to the photo I upload of my child?', a: 'The photo is used only to create the personalized story, and we commit to deleting it from our database within one month of upload.' },
      { q: 'Can I cancel or get a refund?', a: 'Please see our Terms of Use, Purchase & Cancellation page for full details. Generally, if story creation hasn\'t started yet, you can contact us to request a cancellation.' },
      { q: "What if there's a mistake in the story?", a: "Contact us and we'll review and correct it, please include your order details in your message." },
      { q: "Where do I see the story once it's ready?", a: 'Both in the email you\'ll receive (with a direct link to the story) and in your personal area on the site, under "My Stories."' },
      { q: 'What\'s the difference between the regular story and the "Kindergarten" questionnaire?', a: 'The regular questionnaire fits any emotional challenge your child is facing. The Kindergarten questionnaire is a dedicated one, filled out together by parent and child, focused specifically on the transition to kindergarten, and comes with a follow-up activity, the "Feelings Map," to do together after reading the story.' },
      { q: 'What ages is this for?', a: 'Children ages 3–9.' },
      { q: 'Can I give this as a gift?', a: 'Yes, you can purchase credits and send them as a gift to someone else, who can then use them to create a story for their own child.' },
      { q: 'Is the site available in English too?', a: 'Yes, the site and questionnaires are available in both Hebrew and English.' },
      { q: 'How do I contact you?', a: 'Through the "Contact" page on the site.' },
    ],
  },
};

export default function FAQ() {
  const { lang, isRTL } = useLanguage();
  const location = useLocation();
  const content = faqData[lang] || faqData.he;
  const meta = META[lang] || META.he;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto px-4 py-10">
      <PageMeta title={meta.title} description={meta.description} />
      <JsonLd id="faq-schema" data={faqSchema} />
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'שאלות נפוצות' : 'FAQ', path: location.pathname }]} />
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-amber-100 mb-4">
          <HelpCircle className="w-7 h-7 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{content.title}</h1>
      </div>

      <div className="bg-white/90 rounded-3xl shadow-lg p-4 sm:p-6">
        <Accordion type="single" collapsible className="w-full">
          {content.items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-start text-base font-semibold text-slate-800">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}