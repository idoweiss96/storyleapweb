import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

// Landing screen of the hero_story gift book. Same layout language as the moving-house
// and kita-alef intros, with one deliberate difference in tone: those questionnaires open
// by preparing a parent for a hard conversation. This one is a present — nothing here
// hints at a difficulty, because the product does not address one.
export default function HomeScreen({ onStart }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const PILLS = isEn
    ? [
        { emoji: '🎁', text: 'A gift book' },
        { emoji: '⏱', text: 'About 4 minutes' },
        { emoji: '📖', text: '7 illustrated pages' },
      ]
    : [
        { emoji: '🎁', text: 'ספר מתנה' },
        { emoji: '⏱', text: 'כ-4 דקות' },
        { emoji: '📖', text: '7 עמודים מאוירים' },
      ];

  const SECTIONS = isEn
    ? [
        { emoji: '🗺️', title: 'The World', desc: 'Pick the world the adventure happens in — dinosaurs, space, the reef, a kingdom and more.' },
        { emoji: '🎨', title: 'What they love', desc: 'The most important part: whatever your child loves is what solves the story.' },
        { emoji: '👨‍👩‍👧', title: 'Who comes along', desc: 'Family, a friend, or the family pet — they travel with the hero.' },
        { emoji: '💌', title: 'The Gift', desc: 'The occasion, who it is from, and a personal dedication for the opening page.' },
        { emoji: '📸', title: 'Photos', desc: "Your child's photo, so the hero in the illustrations really looks like them." },
      ]
    : [
        { emoji: '🗺️', title: 'העולם', desc: 'בוחרים את העולם שבו קורית ההרפתקה — דינוזאורים, חלל, שונית, ממלכה ועוד.' },
        { emoji: '🎨', title: 'מה אוהבים', desc: 'החלק הכי חשוב: מה שהילד/ה אוהב/ת הוא מה שפותר את הסיפור.' },
        { emoji: '👨‍👩‍👧', title: 'מי מצטרף', desc: 'משפחה, חבר/ה, או הכלב של הבית — הם יוצאים להרפתקה יחד.' },
        { emoji: '💌', title: 'המתנה', desc: 'האירוע, ממי המתנה, והקדשה אישית לעמוד הפתיחה.' },
        { emoji: '📸', title: 'תמונות', desc: 'תמונה של הילד/ה, כדי שהגיבור/ה באיורים באמת ידמו לו/ה.' },
      ];

  const introText = isEn
    ? 'This questionnaire is what makes the book theirs. The more specific you are — the exact thing they love, the way they say it, the name of the dog — the more the story will feel like it could only have been written for this one child.'
    : 'השאלון הזה הוא מה שהופך את הספר לשלהם. ככל שתהיו ספציפיים יותר — מה בדיוק הוא אוהב, איך היא אומרת את זה, איך קוראים לכלב — כך הסיפור ירגיש כאילו הוא יכול היה להיכתב רק לילד/ה הזה/ו.';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="text-5xl text-center mb-4">🦸</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            {isEn ? '✨ A book where they are the hero' : '✨ ספר שבו הם הגיבורים'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
          {isEn ? 'Their own adventure 🗺️' : 'ההרפתקה שלהם 🗺️'}
        </h1>
        <p className="text-[13px] text-center mb-4" style={{ color: '#FF6FB5' }}>
          {isEn ? 'A personalized gift book, 4 minutes to create' : 'ספר מתנה מותאם אישית, 4 דקות ליצירה'}
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
