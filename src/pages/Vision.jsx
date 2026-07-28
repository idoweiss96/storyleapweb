import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../utils';
import { useLanguage } from '@/components/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } })
};

const content = {
  he: {
    heroBadge: '✨ StoryLeap',
    heroTitle: 'StoryLeap – לא משאירים אף ילד להתמודד לבד',
    heroSubtitle: 'בימים הראשונים של המלחמה ראינו הורים חסרי אונים. ידענו שטכנולוגיה יכולה לעשות יותר, אז התחלנו לבנות את הגשר בין העולם הקליני לבית.',
    heroCta: 'צרו את הסיפור שלכם עכשיו',
    believeTitle: 'במה אנחנו מאמינים',
    believe: [
      { icon: '📖', title: 'לכל ילד סיפור', desc: 'ילדים הם לא תבנית. לכל ילד יש עולם רגשי ייחודי משלו.' },
      { icon: '👨‍👩‍👧', title: 'ההורים הם העוגן', desc: 'הקושי נובע מחוסר כלים והכוונה, לעולם לא מחוסר אהבה.' },
      { icon: '🩺', title: 'טכנולוגיה למטפלים', desc: 'מגיעה לאנשי המקצוע טכנולוגיה שתאפשר להגיע ליותר משפחות.' },
    ],
    partnersTitle: 'מסע אחד, שלושה שותפים',
    partners: [
      { icon: '👨‍👩‍👧', label: 'ההורה' },
      { icon: '🌱', label: 'הילד/ה' },
      { icon: '🩺', label: 'המטפל/ת' },
    ],
    partnersHighlight: 'המפעיל בבית: הדרכה, שפה וכלים מעשיים שממשיכים את העבודה הרגשית בבית, ומתרגמים כוונות טובות לתמיכה אפקטיבית.',
    partnersCta: 'הצטרפו למסע של StoryLeap',
    journeyTitle: 'מסע ההורה: מחוסר אונים לעוצמה',
    journey: [
      { emoji: '😔', emotion: 'תסכול', sub: 'הילד שלי מתקשה ואני לא יודע/ת מה לעשות' },
      { emoji: '💛', emotion: 'הקלה', sub: 'זה בסדר. אנחנו לא לבד בזה' },
      { emoji: '🤝', emotion: 'חיבור', sub: 'יש לי כלים. אני יכול/ה לעשות את זה יחד איתו' },
      { emoji: '🌿', emotion: 'העצמה', sub: 'צמחנו מזה ביחד' },
    ],
    roadmapTitle: 'הדרך שלנו - צעד אחר צעד',
    roadmap: [
      { tag: 'עכשיו', title: 'סיפורים מותאמים אישית', desc: 'ספרי ילדים טיפוליים הנבנים סביב האתגר הספציפי.' },
      { tag: 'השלב הבא', title: 'ארגז הכלים של המטפל', desc: 'התרחבות לסרטונים, יצירות ומשחקים. פלטפורמה חכמה להקצאת משימות.' },
      { tag: 'החזון שלנו ל-10 שנים', title: 'המנחה הרגשי', desc: 'פלטפורמה שלמה המלווה משפחות בכל שלב ומחברת בין מטפלים והורים.' },
    ],
    closing: 'לא יצאנו לדרך הזו כי זיהינו הזדמנות עסקית טובה. התחלנו כי ראינו ילדים שזקוקים לעזרה, והורים שמשתוקקים לתת אותה – וידענו שאנחנו יכולים לבנות את הגשר ביניהם.',
    closingCta: 'התחילו את המסע המשותף',
  },
  en: {
    heroBadge: '✨ StoryLeap',
    heroTitle: "Little heroes, big stories",
    heroSubtitle: 'In the early days of the war, we watched parents feel helpless. We knew technology could do more, so we started building the bridge between the clinical world and home.',
    heroCta: 'Create your story now',
    believeTitle: 'What We Believe',
    believe: [
      { icon: '📖', title: 'Every Child, Their Story', desc: 'Children are not a template. Every child carries a unique emotional world.' },
      { icon: '👨‍👩‍👧', title: 'Parents Are the Anchor', desc: 'The struggle comes from a lack of tools and guidance, never from a lack of love.' },
      { icon: '🩺', title: 'Technology for Therapists', desc: 'We give professionals technology that reaches more families.' },
    ],
    partnersTitle: 'One journey, three partners',
    partners: [
      { icon: '👨‍👩‍👧', label: 'The Parent' },
      { icon: '🌱', label: 'The Child' },
      { icon: '🩺', label: 'The Therapist' },
    ],
    partnersHighlight: 'The operator at home: guidance, language, and practical tools that continue the emotional work at home, turning good intentions into effective support.',
    partnersCta: 'Join the StoryLeap journey',
    journeyTitle: "The Parent's Journey: From Helpless to Empowered",
    journey: [
      { emoji: '😔', emotion: 'Frustrated', sub: 'My child is struggling and I do not know what to do' },
      { emoji: '💛', emotion: 'Relieved', sub: 'This is okay. We are not alone in this' },
      { emoji: '🤝', emotion: 'Connected', sub: 'I have tools. I can do this with my child' },
      { emoji: '🌿', emotion: 'Empowered', sub: 'We grew through this together' },
    ],
    roadmapTitle: 'Our Path - Step by Step',
    roadmap: [
      { tag: 'Now', title: 'Personalized Stories', desc: "Therapeutic storybooks built around each child's real challenge." },
      { tag: 'Next Step', title: "A Therapist's Toolkit", desc: 'Expanding into videos, art, and games. A smart platform to assign tasks.' },
      { tag: 'Our 10-Year Vision', title: 'The Emotional Navigator', desc: 'A full platform that guides families and connects therapists and parents.' },
    ],
    closing: 'We did not start this because it was a good market opportunity. We started because we saw children who needed help, and parents who wanted to give it — and knew we could build the bridge between them.',
    closingCta: 'Start the shared journey',
  }
};

function CtaButton({ children, to }) {
  return (
    <Link to={to}>
      <span className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-white font-semibold shadow-lg transition-transform hover:scale-[1.03] bg-[#FDB654]">
        <Sparkles className="w-4 h-4" />
        {children}
      </span>
    </Link>
  );
}

export default function Vision() {
  const { lang, isRTL } = useLanguage();
  const c = content[lang] || content.he;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="pb-12">

      {/* HERO */}
      <section className="relative py-16 md:py-20 overflow-hidden rounded-[3rem] mb-16" style={{ background: 'rgba(255,255,255,0.55)' }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(22)].map((_, i) => (
            <Star key={i}
              className={`absolute w-3 h-3 text-blue-200 fill-blue-100 opacity-60 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
              style={{ top: `${5 + (i * 13) % 90}%`, left: `${(i * 17) % 100}%` }} />
          ))}
        </div>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="relative text-center max-w-2xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
            {c.heroBadge}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight" style={{ color: '#1C2A48' }}>
            {c.heroTitle}
          </h1>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: '#63738A' }}>
            {c.heroSubtitle}
          </p>
          <CtaButton to={createPageUrl('CreateStory')}>{c.heroCta}</CtaButton>
        </motion.div>
      </section>

      {/* WHAT WE BELIEVE */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{c.believeTitle}</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
        {c.believe.map((b) => (
          <div key={b.title} className="rounded-2xl p-7 text-center bg-white/70 backdrop-blur-sm" style={{ boxShadow: '0 10px 40px rgba(28,42,72,0.06)' }}>
            <div className="text-3xl mb-3">{b.icon}</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1C2A48' }}>{b.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#63738A' }}>{b.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* PARTNERS */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{c.partnersTitle}</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="flex items-center justify-center gap-4 md:gap-8 mb-8">
        {c.partners.map((p, i) => (
          <div key={p.label} className="flex items-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2" style={{ background: '#DCEEFA' }}>
                {p.icon}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#1C2A48' }}>{p.label}</div>
            </div>
            {i < c.partners.length - 1 && <div className="w-8 md:w-16 h-0.5 rounded-full" style={{ background: '#DCEEFA' }} />}
          </div>
        ))}
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
        className="rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto mb-8" style={{ background: '#FDF6F8' }}>
        <p className="text-base leading-relaxed" style={{ color: '#1C2A48' }}>{c.partnersHighlight}</p>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="text-center mb-20">
        <CtaButton to={createPageUrl('CreateStory')}>{c.partnersCta}</CtaButton>
      </motion.div>

      {/* PARENT'S JOURNEY */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7} className="rounded-2xl p-8 md:p-10 mb-20" style={{ background: '#FDF6F8' }}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: '#1C2A48' }}>{c.journeyTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" dir="ltr">
          {c.journey.map((step, i) => (
            <div key={step.emotion} className="relative text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 bg-white" style={{ boxShadow: '0 10px 30px rgba(28,42,72,0.06)' }}>
                {step.emoji}
              </div>
              <div className="font-bold mb-1" style={{ color: '#1C2A48' }}>{step.emotion}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#63738A' }}>{step.sub}</div>
              {i < c.journey.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-6 -right-8 w-5 h-5 opacity-40" style={{ color: '#1C2A48' }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ROADMAP */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8} className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{c.roadmapTitle}</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9} className="max-w-md mx-auto mb-20">
        {c.roadmap.map((r, i) => (
          <div key={r.title}>
            <div className="rounded-2xl p-6 bg-white" style={{ boxShadow: '0 10px 40px rgba(28,42,72,0.06)' }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
                {r.tag}
              </span>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1C2A48' }}>{r.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#63738A' }}>{r.desc}</p>
            </div>
            {i < c.roadmap.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-6" style={{ background: '#DCEEFA' }} />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* CLOSING */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10} className="text-center max-w-xl mx-auto">
        <p className="text-lg italic leading-relaxed mb-8" style={{ color: '#63738A' }}>{c.closing}</p>
        <CtaButton to={createPageUrl('CreateStory')}>{c.closingCta}</CtaButton>
      </motion.div>

    </div>
  );
}