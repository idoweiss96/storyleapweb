import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

// Landing screen of the prepare-story book. Same layout language as the hero-story and
// moving-house intros, with a deliberate difference in tone from both: this one must not
// read as a book for a child who is struggling. Nothing here says "worried", "afraid" or
// "cope" — the product prepares a child for something new, and most families arrive with
// no difficulty at all. Saying otherwise on the very first screen would tell a parent
// their child has a problem before they have answered a single question.
export default function HomeScreen({ onStart }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const PILLS = isEn
    ? [
        { emoji: '🌱', text: 'A preparation book' },
        { emoji: '⏱', text: 'About 5 minutes' },
        { emoji: '📖', text: '5 illustrated pages' },
      ]
    : [
        { emoji: '🌱', text: 'ספר הכנה' },
        { emoji: '⏱', text: 'כ-5 דקות' },
        { emoji: '📖', text: '5 עמודים מאוירים' },
      ];

  const SECTIONS = isEn
    ? [
        { emoji: '🗓️', title: 'The topic', desc: 'Moving house, a new sibling, a first dentist visit, potty training, starting kindergarten — and 46 more.' },
        { emoji: '📋', title: 'What happens', desc: "Describe what's expected to happen, step by step and in order. This is one of the most important parts of the book." },
        { emoji: '👂', title: 'How it will feel', desc: 'What they will see, hear and feel — so the real experience will feel more familiar and expected.' },
        { emoji: '🙋', title: 'Their role', desc: 'What they will get to do, choose or say during the event. When a child has a clear role, it is easier to feel part of what is happening.' },
        { emoji: '📸', title: 'Photos', desc: "Upload a photo of your child, so the character in the illustrations really looks like them." },
      ]
    : [
        { emoji: '🗓️', title: 'הנושא', desc: 'מעבר דירה, אח חדש, ביקור ראשון אצל רופא השיניים, גמילה, כניסה לגן ועוד 46 נושאים.' },
        { emoji: '📋', title: 'מה יקרה', desc: 'תארו את מה שצפוי לקרות, שלב אחר שלב ולפי הסדר. זה אחד החלקים החשובים ביותר בספר.' },
        { emoji: '👂', title: 'איך זה ירגיש', desc: 'מה הילד או הילדה יראו, ישמעו וירגישו, כדי שהחוויה האמיתית תהיה מוכרת וצפויה יותר.' },
        { emoji: '🙋', title: 'התפקיד שלהם', desc: 'מה הם יוכלו לעשות, לבחור או להגיד במהלך האירוע. כשיש לילד תפקיד ברור, קל יותר להרגיש חלק ממה שקורה.' },
        { emoji: '📸', title: 'תמונות', desc: 'העלו תמונה של הילד או הילדה, כדי שהדמות באיורים תהיה דומה להם.' },
      ];

  const introText = isEn
    ? 'A preparation book works best when it is accurate and concrete. When a child knows in advance what is about to happen, what things will look like, what they will hear and what the order will be, the event turns from something unfamiliar into something they already met in a story. So the more concrete you are with the details, the better the book can prepare them.'
    : 'ספר הכנה עובד הכי טוב כשהוא מדויק ומוחשי. כשילד או ילדה יודעים מראש מה עומד לקרות, איך הדברים ייראו, מה הם ישמעו ומה יהיה הסדר, האירוע הופך ממשהו לא מוכר למשהו שכבר פגשו בסיפור. לכן, ככל שתהיו קונקרטיים יותר בפרטים, כך הספר יוכל להכין אותם טוב יותר.';

  const noWorry = isEn
    ? 'If your child has not asked about it or seemed concerned, say so — and the book will contain no worry at all. That is deliberate: a book can plant a worry, not only answer one.'
    : 'אם הילד/ה לא שאל/ה ולא הביע/ה חשש — כתבו את זה, והספר לא יזכיר שום חשש. זה מכוון: ספר יכול לשתול דאגה, לא רק לענות עליה.';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="text-5xl text-center mb-4">🌱</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            {isEn ? '✨ Getting ready for something new' : '✨ מתכוננים למשהו חדש'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
          {isEn ? 'Known before it happens 🗓️' : 'מוכר עוד לפני שזה קורה 🗓️'}
        </h1>
        <p className="text-[13px] text-center mb-4" style={{ color: '#FF6FB5' }}>
          {isEn ? 'A personalized digital preparation book, 5 minutes to create' : 'ספר הכנה דיגיטלי מותאם אישית, 5 דקות ליצירה'}
        </p>

        <div className="mb-5 rounded-2xl p-4 border" style={{ background: '#FFF8EC', borderColor: '#F5C842' }}>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#7A5000' }}>
            <span className="font-semibold">{isEn ? 'Before you start ♥' : 'לפני שמתחילים ♥'}</span> {introText}
          </p>
          <ul className="space-y-1.5">
            {SECTIONS.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: '#7A5000' }}>
                <span>{s.emoji}</span>
                <span><span className="font-semibold">{s.title}:</span> {s.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-5 rounded-2xl p-4 border" style={{ background: '#EAF8FD', borderColor: '#B8EBF7' }}>
          <p className="text-[12.5px] leading-relaxed" style={{ color: '#1A1A6E' }}>
            <span className="font-semibold">{isEn ? 'No difficulty required 🌤️' : 'לא צריך שיהיה קושי 🌤️'}</span> {noWorry}
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          {isEn ? "Let's create it →" : 'בואו ניצור אותו ←'}
        </button>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-md">
        {PILLS.map((pill, i) => (
          <span key={i} className="px-3 py-1.5 rounded-full bg-white border text-xs" style={{ borderColor: i % 2 === 0 ? '#B8EBF7' : '#FFD6EC', color: '#6b6b8a' }}>
            {pill.emoji} {pill.text}
          </span>
        ))}
      </div>
    </div>
  );
}