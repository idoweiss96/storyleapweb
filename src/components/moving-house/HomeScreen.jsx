import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function HomeScreen({ onStart }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const PILLS = isEn
    ? [
        { emoji: '👨‍👩‍👧', text: 'Shared parent-child experience' },
        { emoji: '⏱', text: 'About 5 minutes' },
      ]
    : [
        { emoji: '👨‍👩‍👧', text: 'חוויה משותפת הורה-ילד' },
        { emoji: '⏱', text: 'כ-5 דקות' },
      ];

  const SECTIONS = isEn
    ? [
        { emoji: '💭', title: 'Feelings', desc: "Emotions about the move, things that might feel unsettling, and what's hard to say goodbye to." },
        { emoji: '👨‍👩‍👧', title: 'Who matters to you?', desc: "Close people and friends you'll want to stay connected with." },
        { emoji: '🎨', title: 'What do you love?', desc: 'Hobbies, favorite things, and what helps when things feel uncomfortable.' },
        { emoji: '📦', title: 'The Move', desc: "What's changing, what's staying the same, and getting to know the new home." },
        { emoji: '🌟', title: 'Wishes', desc: 'Wishes from the child and from you for the new chapter.' },
        { emoji: '📸', title: 'Photos', desc: 'Your photo and family photos, to prepare the story.' },
      ]
    : [
        { emoji: '💭', title: 'רגשות', desc: 'רגשות לגבי המעבר, דברים שעלולים להרגיש לא יציבים, ומה קשה להיפרד ממנו.' },
        { emoji: '👨‍👩‍👧', title: 'מי חשוב לך?', desc: 'אנשים קרובים וחברים שתרצו להישאר איתם בקשר.' },
        { emoji: '🎨', title: 'מה אוהבים?', desc: 'תחביבים, דברים אהובים, ומה עוזר כשדברים מרגישים לא נוח.' },
        { emoji: '📦', title: 'המעבר', desc: 'מה משתנה, מה נשאר אותו דבר, והיכרות עם הבית החדש.' },
        { emoji: '🌟', title: 'משאלות', desc: 'משאלות של הילד/ה ושלכם לפרק החדש.' },
        { emoji: '📸', title: 'תמונות', desc: 'תמונה שלך ותמונות משפחה, לקראת הכנת הסיפור.' },
      ];

  const introText = isEn
    ? 'For parents ♥ This is a time for a fun, shared conversation with your child about the upcoming move. Ask together, answer together, and feel free to add your own perspective in the fields marked "Parent". Along the way, we\'ll go through several parts together:'
    : 'להורים ♥ זה הזמן לשיח משותף וכיפי עם הילד/ה על המעבר הקרוב. שאלו יחד, ענו ביחד, ותהיו מוזמנים להוסיף גם את הטעם שלכם בשדות המסומנות "הורה". לאורך הדרך נעבור יחד בכמה חלקים:';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <div className="text-5xl text-center mb-4">📦</div>

        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-[20px] text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            {isEn ? '✨ Moving House Companion' : '✨ ליווי למעבר דירה'}
          </span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2" style={{ color: '#1A1A6E' }}>
          {isEn ? 'Getting Ready to Move, Together 🏠' : 'מתכוננים למעבר, ביחד 🏠'}
        </h1>
        <p className="text-[13px] text-center mb-4" style={{ color: '#FF6FB5' }}>
          {isEn ? 'A joint questionnaire for child and parent, 5 minutes' : 'שאלון משותף לילד ולהורה, 5 דקות'}
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
          {isEn ? "Let's start together →" : 'בואו נתחיל יחד ←'}
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