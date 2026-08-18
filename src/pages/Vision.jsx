import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../utils';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const fadeUp = {
  hidden: { opacity: 0.4, y: 10 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] } })
};

const content = {
  he: {
    heroBadge: '✨ StoryLeap',
    pageTitle: 'החזון שלנו',
    pageTagline: 'עולם שבו שום הורה לא מרגיש חסר ביטחון, ושום ילד לא מתמודד עם הקשיים שלו לבד.',
    heroTitle: 'גיבורים קטנים, סיפורים גדולים',
    heroSubtitle: 'בימים הראשונים שלנו ראינו הורים שמחפשים דרך לעזור לילדים שלהם ברגעים קשים ורגשיים, ולא תמיד ידעו איך. ידענו שטכנולוגיה יכולה לעשות יותר, אז התחלנו לבנות את הגשר בין העולם הרגשי לבית.',
    heroMission: 'לא יצאנו לדרך הזו כי זיהינו הזדמנות עסקית טובה. התחלנו כי ראינו ילדים שזקוקים לעזרה, והורים שמשתוקקים לתת אותה, וידענו שאנחנו יכולים לבנות את הגשר ביניהם.',
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
    journeyTitle: 'מסע ההורה: מתסכול לעוצמה',
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
    closing: 'הצטרפו אלינו לבנות את הגשר הזה, סיפור אחר סיפור.',
    closingCta: 'התחילו את המסע המשותף',
    teamTitle: 'תכירו את הצוות',
    team: [
      {
        name: 'ליטל פלוטקין',
        role: 'מייסדת שותפה וראשת מוצר',
        bio: 'ליטל מובילה את המוצר וחוויית המשתמש. עם רקע בממשק אדם מחשב ומחקר UX, היא מתמקדת בהבנת הצרכים של הורים וילדים והפיכתם לחוויה פשוטה ומשמעותית.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/213be887f_WhatsAppImage2026-08-12at111456.jpeg',
      },
      {
        name: 'עומר קראדי',
        role: 'מייסד שותף ומנכ"ל',
        bio: 'עומר מוביל את הצד העסקי של StoryLeap, מאסטרטגיה ושותפויות ועד איתור הזדמנויות חדשות לצמיחה ולהבאת StoryLeap למשפחות נוספות.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/b95570782_WhatsAppImage2026-08-12at1114562.jpeg',
      },
      {
        name: 'עידו וייס',
        role: 'מייסד שותף וראש טכנולוגיות',
        bio: 'עידו מוביל את הטכנולוגיה מאחורי StoryLeap. הוא אחראי על בניית הפלטפורמה ופיתוחה, והפיכת הרעיונות שלנו למוצר שעובד, צומח, ומגיע למשפחות.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/f3288d468_WhatsAppImage2026-08-12at1114561.jpeg',
      },
    ],
    teamClosing: 'יחד אנחנו משלבים עסקים, מוצר, מחקר וטכנולוגיה, למטרה אחת משותפת, ליצור כלים שעוזרים להורים ולילדים להתחבר, לדבר, ולגדול יחד.',
  },
  en: {
    heroBadge: '✨ StoryLeap',
    pageTitle: 'Our Vision',
    pageTagline: 'A world where no parent feels unsure, and no child faces their challenges alone.',
    heroTitle: "Little heroes, big stories",
    heroSubtitle: 'In our early days, we saw parents searching for ways to help their children through hard, emotional moments, not always knowing how. We knew technology could do more, so we set out to build a bridge between the emotional world and home.',
    heroMission: 'We did not start this because it was a good market opportunity. We started because we saw children who needed help, and parents who wanted to give it, and knew we could build the bridge between them.',
    heroCta: 'Create your story now',
    believeTitle: 'What We Believe',
    believe: [
      { icon: '📖', title: 'Every Child, Their Story', desc: 'Children are not a template. Every child carries a unique emotional world.' },
      { icon: '👨‍👩‍👧', title: 'Parents Are the Anchor', desc: 'The struggle comes from a lack of tools and guidance, never from a lack of love.' },
      { icon: '🌉', title: 'A Bridge to Professionals', desc: 'Our long-term vision includes giving professionals technology that helps them reach more families.' },
    ],
    partnersTitle: 'One journey, three partners',
    partners: [
      { icon: '👨‍👩‍👧', label: 'The Parent' },
      { icon: '🌱', label: 'The Child' },
      { icon: '🌱', label: 'Professionals (coming soon)' },
    ],
    partnersHighlight: 'The operator at home: guidance, language, and practical tools that continue the emotional work at home, turning good intentions into effective support.',
    partnersCta: 'Join the StoryLeap journey',
    journeyTitle: "The Parent's Journey: From Frustration to Empowerment",
    journey: [
      { emoji: '😔', emotion: 'Frustrated', sub: 'My child is struggling and I do not know what to do' },
      { emoji: '💛', emotion: 'Relieved', sub: 'This is okay. We are not alone in this' },
      { emoji: '🤝', emotion: 'Connected', sub: 'I have tools. I can do this with my child' },
      { emoji: '🌿', emotion: 'Empowered', sub: 'We grew through this together' },
    ],
    roadmapTitle: 'Our Path - Step by Step',
    roadmap: [
      { tag: 'Now', title: 'Personalized Stories', desc: "Personalized storybooks built around each child's real challenge." },
      { tag: 'Next Step', title: "Tools for Professionals", desc: 'Expanding into videos, art, and games. A smart platform to assign tasks.' },
      { tag: 'Our 10-Year Vision', title: 'The Emotional Navigator', desc: 'A full platform that guides families and connects therapists and parents.' },
    ],
    closing: 'Join us in building that bridge, one story at a time.',
    closingCta: 'Start the shared journey',
    teamTitle: 'Meet the Team',
    team: [
      {
        name: 'Lital Plotkin',
        role: 'Co-Founder & Product Lead',
        bio: 'Lital leads the product and user experience. With a background in Human-Computer Interaction and UX research, she focuses on understanding parents and children and turning their needs into a simple and meaningful experience.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/213be887f_WhatsAppImage2026-08-12at111456.jpeg',
      },
      {
        name: 'Omer Karadi',
        role: 'Co-Founder & CEO',
        bio: 'Omer leads the business side of StoryLeap, from strategy and partnerships to finding new opportunities to grow and bring StoryLeap to more families.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/b95570782_WhatsAppImage2026-08-12at1114562.jpeg',
      },
      {
        name: 'Ido Weiss',
        role: 'Co-Founder & Tech Lead',
        bio: 'Ido leads the technology behind StoryLeap. He is responsible for building and developing the platform and turning our ideas into a product that works, grows, and reaches families.',
        photo: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/f3288d468_WhatsAppImage2026-08-12at1114561.jpeg',
      },
    ],
    teamClosing: 'Together, we combine business, product, research, and technology, with one shared goal: creating tools that help parents and children connect, talk, and grow together.',
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
  const location = useLocation();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="pb-12">
      <PageMeta title="About StoryLeap | Family Emotional Wellbeing" description="StoryLeap helps parents and children navigate emotional moments together through personalized activities, stories, practical guidance and shared experiences." />
      <BreadcrumbSchema items={[{ name: c.pageTitle, path: location.pathname }]} />

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
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#1C2A48' }}>
            {c.pageTitle}
          </h1>
          <p className="text-base md:text-lg mb-8 leading-relaxed font-medium" style={{ color: '#63738A' }}>
            {c.pageTagline}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#1C2A48' }}>
            {c.heroTitle}
          </h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: '#63738A' }}>
            {c.heroSubtitle}
          </p>
          <CtaButton to={createPageUrl('CreateStory')}>{c.heroCta}</CtaButton>
        </motion.div>
      </section>

      {/* MISSION STATEMENT */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.5}
        className="rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto mb-16 border-2" style={{ background: '#FDF6F8', borderColor: '#FDB654' }}>
        <p className="text-lg italic leading-relaxed font-medium" style={{ color: '#1C2A48' }}>{c.heroMission}</p>
      </motion.div>

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

      {/* MEET THE TEAM */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10} className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{c.teamTitle}</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10.5} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {c.team.map((member) => (
          <div key={member.name} className="rounded-2xl p-7 text-center bg-white/70 backdrop-blur-sm" style={{ boxShadow: '0 10px 40px rgba(28,42,72,0.06)' }}>
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover scale-110" />
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#1C2A48' }}>{member.name}</h3>
            <div className="text-sm font-semibold mb-3" style={{ color: '#63738A' }}>{member.role}</div>
            <p className="text-sm leading-relaxed" style={{ color: '#63738A' }}>{member.bio}</p>
          </div>
        ))}
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={11} className="text-center max-w-2xl mx-auto mb-20">
        <p className="text-sm leading-relaxed" style={{ color: '#63738A' }}>{c.teamClosing}</p>
      </motion.div>

      {/* CLOSING */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={12} className="text-center max-w-xl mx-auto">
        <p className="text-lg italic leading-relaxed mb-8" style={{ color: '#63738A' }}>{c.closing}</p>
        <CtaButton to={createPageUrl('CreateStory')}>{c.closingCta}</CtaButton>
      </motion.div>

    </div>
  );
}