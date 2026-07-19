import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function HomeScreen({ onStart }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const PILLS = isEn
    ? [
        { emoji: '💜', text: 'Based on psychological therapy methods' },
        { emoji: '👨‍👩‍👧', text: 'Shared parent-child experience' },
        { emoji: '⏱', text: 'About 3 minutes' },
      ]
    : [
        { emoji: '💜', text: 'מבוסס על שיטות טיפול פסיכולוגיות' },
        { emoji: '👨‍👩‍👧', text: 'חוויה משותפת הורה-ילד' },
        { emoji: '⏱', text: 'כ-3 דקות' },
      ];

  const SECTIONS = isEn
    ? [
        { emoji: '🧒', title: 'Who are you?', desc: 'Getting to know each other: name, personal strength, and a photo.' },
        { emoji: '💭', title: 'Feelings', desc: 'Emotions before starting 1st grade, things that might be a bit scary, and moments of separation.' },
        { emoji: '👨‍👩‍👧', title: 'Who matters to you?', desc: 'Close people, friends, and photos of family members.' },
        { emoji: '🎨', title: 'What do you love?', desc: 'Hobbies, heroes, and what helps when things feel uncomfortable.' },
        { emoji: '🎒', title: '1st Grade', desc: 'Expectations, small worries, and visiting the school.' },
        { emoji: '🌟', title: 'Wishes', desc: "Wishes from the child and from you for the coming year." },
      ]
    : [
        { emoji: '🧒', title: 'מי אתה/את?', desc: 'היכרות: שם, כוח אישי ותמונה.' },
        { emoji: '💭', title: 'רגשות', desc: 'תחושות לפני העלייה לכיתה א׳, דברים שאולי קצת מפחידים ורגעי פרידה.' },
        { emoji: '👨‍👩‍👧', title: 'מי חשוב לך?', desc: 'אנשים קרובים, חברים ותמונות של בני המשפחה.' },
        { emoji: '🎨', title: 'מה אוהבים?', desc: 'תחביבים, גיבורים ומה שעוזר כשלא נעים.' },
        { emoji: '🎒', title: 'כיתה א׳', desc: 'ציפיות, דאגות קטנות וביקור בבית הספר.' },
        { emoji: '🌟', title: 'משאלות', desc: 'איחולים של הילד/ה ושלכם לקראת השנה.' },
      ];

  const introText = isEn
    ? "This is a time for a fun, shared conversation with your child about starting 1st grade. Ask together, answer together, and feel free to add your own perspective in the fields marked \"Parent\". Along the way, we'll go through several parts together:"
    : 'זה הזמן לשיח משותף וכיפי עם הילד/ה לקראת העלייה לכיתה א׳. שאלו יחד, ענו ביחד, ותהיו מוזמנים להוסיף גם את הטעם שלכם בשדות המסומנות "הורה". לאורך הדרך נעבור יחד בכמה חלקים:';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="text-5xl text-center mb-4">🎒</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            {isEn ? '✨ 1st Grade Special' : '✨ ספיישל כיתה א׳'}
          </span>
        </div>

        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
          {isEn ? 'Getting Ready for 1st Grade Together 💗' : 'הכנה לכיתה א׳ ביחד 💗'}
        </h2>
        <p className="text-[13px] text-center mb-4" style={{ color: '#FF6FB5' }}>
          {isEn ? 'A joint questionnaire for child and parent — 3 minutes' : 'שאלון משותף לילד ולהורה — 3 דקות'}
        </p>

        {/* Parent intro — what to expect */}
        <div className="mb-5 rounded-2xl p-4 border" style={{ background: '#FFF8EC', borderColor: '#F5C842' }}>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#7A5000' }}>
            <span className="font-semibold">{isEn ? 'For parents ♥' : 'להורים ♥'}</span> {introText}
          </p>
          <ul className="space-y-1.5">
            {SECTIONS.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: '#7A5000' }}>
                <span>{s.emoji}</span>
                <span><span className="font-semibold">{s.title}</span> — {s.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          {isEn ? 'Let\'s start together →' : 'בואו נתחיל יחד ←'}
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