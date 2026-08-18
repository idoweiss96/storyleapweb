import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const METHODS_META = {
  he: { title: 'השיטות שלנו | StoryLeap', description: 'שש שיטות מוכחות, מביבליותרפיה ועד טיפול נרטיבי, שעליהן מבוסס כל סיפור מותאם אישית ב-StoryLeap.' },
  en: { title: 'Our Methods | StoryLeap', description: 'Six proven approaches, from bibliotherapy to narrative therapy, behind every personalized StoryLeap story.' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const CONTENT = {
  en: {
    eyebrow: 'StoryLeap',
    h1: 'Every story is built on proven principles',
    subtext: "We don't start from a blank page. Every StoryLeap story draws on six methods that professionals already know and trust, brought together into a story shaped for your child, not a template.",
    note: "This isn't therapy, it's a thoughtful way of telling stories, built from ideas that already work.",
    gridHeading: 'Six methods, one story',
    gridSubtext: 'Tap a method to see exactly how it shapes the way we write.',
    readFull: 'Read the full idea',
    methodLabel: 'Method',
    takeLabel: 'What we take from this',
    notLabel: "What We Don't Do",
    nextLabel: 'Next',
    nextLast: 'See it in a story',
    ctaTagline: 'Little heroes, big stories',
    ctaH2: 'See the thinking in a story',
    ctaSubtext: 'The best way to understand these methods is to see them at work, inside a story made for your child.',
    ctaPrimary: 'Create your story now',
    ctaGhost: 'Back to methods',
    methods: [
      { icon: '📖', title: 'Bibliotherapy', oneliner: 'Stories open a gentler path into feelings that are hard to talk about directly.', deeper: 'Children often find it easier to approach a difficult feeling through a character than through a direct question. The story creates a little emotional distance, enough room to look at something hard without feeling exposed by it.', take: 'We use story as a bridge, a shared thing a parent and child can enter together, and a starting point for conversation rather than an interrogation.', dontClaim: "We don't offer bibliotherapy as treatment, and a story on its own doesn't resolve a hard experience. It opens a door, and the conversation that follows matters just as much." },
      { icon: '🧵', title: 'Narrative Therapy', oneliner: 'The child is never the problem. The problem is the problem.', deeper: 'A worry, an anger, or a fear can start to feel like part of who a child is. Narrative thinking treats the difficulty as something separate from the child, something they have a relationship with, rather than something they are.', take: "Our stories often give a challenge its own shape, like a 'worry voice' or a 'grump cloud', so the child can notice it, name it, and see moments where they already have some say over it.", dontClaim: "We don't provide narrative therapy, and we're not a substitute for it. We draw on its central insight: separating a child from their struggle can be freeing on its own." },
      { icon: '🔄', title: 'CBT', oneliner: 'What we think shapes what we feel, and what we feel shapes what we do next.', deeper: "A situation, a thought, a feeling, a body sensation, and an action are all connected. The same event can look different depending on how a character makes sense of it, and that's not the same as thinking positive.", take: 'Stories can show a character notice what happened, what they thought, how it felt in their body, and a next step they try, often landing on a more flexible way to see things, not a forced cheerful one.', dontClaim: "StoryLeap doesn't provide CBT, exposure work, or any clinical treatment. We use it as a structure for showing feelings clearly inside a story." },
      { icon: '🌱', title: 'Developmental Psychology', oneliner: 'A five year old and a seven year old understand feelings differently, so stories should too.', deeper: "How a child understands a feeling, follows a story, or takes another person's perspective changes as they grow. Age is a useful starting point, but never the whole picture of a child.", take: 'We adjust language, story complexity, point of view, and the kind of coping tool offered, and we think about what role a parent plays at each stage, not just what words a child can read.', dontClaim: "We don't diagnose or clinically assess a child's development. Age tells us where to start, not who a child is." },
      { icon: '✒️', title: 'Storytelling', oneliner: 'A real story carries an emotional idea further than any lesson can.', deeper: 'A character wants something, meets an obstacle, acts, and changes. That shape is what makes a story worth entering, and what makes an emotional idea land, instead of being announced.', take: 'We write toward a real narrative arc: desire, obstacle, choice, change, instead of a moral tacked onto the end. Meaning should come from what happens, not a sentence that explains it.', dontClaim: "This is craft, not clinical technique, but it's the reason the other methods actually reach a child." },
      { icon: '🌤️', title: 'Positive Psychology', oneliner: 'Strength, hope, and connection matter as much as struggle does.', deeper: "This isn't about replacing hard feelings with happy ones. It's about noticing a child's existing strengths, the people around them, and a believable next step, the ingredients of real hope, not forced positivity.", take: 'Alongside a difficulty, our stories look for a strength already present, a relationship the child can lean on, and one small, believable step forward.', dontClaim: "We don't promise resilience as a guaranteed outcome, and we're careful never to wave away a hard feeling with a cheerful one." },
    ],
  },
  he: {
    eyebrow: 'StoryLeap',
    h1: 'כל סיפור בנוי על עקרונות מוכחים',
    subtext: 'אנחנו לא מתחילים מדף חלק. כל סיפור של StoryLeap מבוסס על שש שיטות שאנשי מקצוע כבר מכירים ובוטחים בהן, שמשולבות יחד לכדי סיפור המותאם לילד שלכם, לא תבנית גנרית.',
    note: 'זה לא טיפול, זו דרך מחשבתית לספר סיפורים, שבנויה מתוך רעיונות שכבר עובדים.',
    gridHeading: 'שש שיטות, סיפור אחד',
    gridSubtext: 'הקליקו על שיטה כדי לראות בדיוק איך היא מעצבת את הדרך שבה אנחנו כותבים.',
    readFull: 'קראו את הרעיון המלא',
    methodLabel: 'שיטה',
    takeLabel: 'מה אנחנו לוקחים מזה',
    notLabel: 'מה אנחנו לא עושים',
    nextLabel: 'הבא',
    nextLast: 'לראות את זה בסיפור',
    ctaTagline: 'גיבורים קטנים, סיפורים גדולים',
    ctaH2: 'לראות את החשיבה בתוך סיפור',
    ctaSubtext: 'הדרך הטובה ביותר להבין את השיטות האלה היא לראות אותן בפעולה, בתוך סיפור שנוצר בשביל הילד שלכם.',
    ctaPrimary: 'צרו את הסיפור שלכם עכשיו',
    ctaGhost: 'חזרה לשיטות',
    methods: [
      { icon: '📖', title: 'ביבליותרפיה', oneliner: 'סיפורים פותחים דרך עדינה יותר לרגשות שקשה לדבר עליהם באופן ישיר.', deeper: 'לרוב קל יותר לילדים לגשת לרגש קשה דרך דמות, מאשר דרך שאלה ישירה. הסיפור יוצר מרחק רגשי קטן, מספיק מקום כדי להתבונן במשהו קשה בלי להרגיש חשופים בגללו.', take: 'אנחנו משתמשים בסיפור כגשר, דבר משותף שהורה וילד יכולים להיכנס אליו יחד, ונקודת פתיחה לשיחה ולא לתחקיר.', dontClaim: 'אנחנו לא מציעים ביבליותרפיה כטיפול, וסיפור בעצמו לא פותר חוויה קשה. הוא פותח דלת, והשיחה שמגיעה אחריו חשובה בדיוק כמוהו.' },
      { icon: '🧵', title: 'טיפול נרטיבי', oneliner: 'הילד לעולם אינו הבעיה. הבעיה היא הבעיה.', deeper: 'דאגה, כעס או פחד יכולים להתחיל להרגיש כמו חלק ממי שהילד הוא. חשיבה נרטיבית מתייחסת לקושי כמשהו נפרד מהילד, משהו שיש לו איתו מערכת יחסים, ולא משהו שהוא.', take: "הסיפורים שלנו נותנים לרוב לאתגר צורה משלו, כמו 'קול הדאגה' או 'עננת הרוגז', כדי שהילד יוכל לשים לב אליו, לתת לו שם, ולראות רגעים שבהם יש לו כבר מילה בעניין.", dontClaim: 'אנחנו לא מספקים טיפול נרטיבי, ואיננו תחליף לו. אנחנו שואבים מהתובנה המרכזית שלו, שהפרדת הילד מהמאבק שלו יכולה להיות משמעותית בפני עצמה.' },
      { icon: '🔄', title: 'טיפול קוגניטיבי התנהגותי', oneliner: 'מה שאנחנו חושבים מעצב את מה שאנחנו מרגישים, ומה שאנחנו מרגישים מעצב את מה שאנחנו עושים בהמשך.', deeper: "מצב, מחשבה, רגש, תחושה גופנית ופעולה, כולם מחוברים זה לזה. אותו אירוע יכול להיראות שונה בהתאם לאיך שדמות מבינה אותו, וזה לא אותו דבר כמו 'לחשוב חיובי'.", take: 'סיפורים יכולים להראות דמות ששמה לב למה שקרה, למה שהיא חשבה, איך זה הרגיש בגוף שלה, ולצעד הבא שהיא מנסה, ולרוב מגיעים לדרך גמישה יותר להתבונן בדברים, לא לדרך שמחה בכפייה.', dontClaim: 'StoryLeap אינה מספקת טיפול קוגניטיבי התנהגותי, חשיפה טיפולית או כל טיפול קליני. אנחנו משתמשים בו כמסגרת להצגת רגשות בצורה ברורה בתוך סיפור.' },
      { icon: '🌱', title: 'פסיכולוגיה התפתחותית', oneliner: 'ילד בן חמש וילד בן שבע מבינים רגשות בצורה שונה, אז גם הסיפורים צריכים להיות שונים.', deeper: 'האופן שבו ילד מבין רגש, עוקב אחרי סיפור, או מאמץ נקודת מבט של אדם אחר, משתנה ככל שהוא גדל. הגיל הוא נקודת פתיחה שימושית, אבל לעולם לא כל התמונה של הילד.', take: 'אנחנו מתאימים שפה, מורכבות עלילה, נקודת מבט, וסוג כלי ההתמודדות שמוצע, וחושבים על התפקיד שהורה משחק בכל שלב, לא רק אילו מילים ילד יכול לקרוא.', dontClaim: 'אנחנו לא מאבחנים ולא מעריכים קלינית את ההתפתחות של הילד. הגיל אומר לנו איפה להתחיל, לא מי הילד הוא.' },
      { icon: '✒️', title: 'אומנות הסיפור', oneliner: 'סיפור אמיתי נושא רעיון רגשי הרבה יותר רחוק מכל שיעור מוסר.', deeper: 'דמות רוצה משהו, נתקלת במכשול, פועלת, ומשתנה. הצורה הזאת היא מה שגורם לסיפור להיות כדאי להיכנס אליו, ומה שגורם לרעיון רגשי לנחות, במקום רק להיאמר.', take: 'אנחנו כותבים לכיוון קשת עלילה אמיתית, רצון, מכשול, בחירה, שינוי, במקום מוסר שמודבק בסוף. המשמעות צריכה לנבוע ממה שקורה, לא ממשפט שמסביר אותו.', dontClaim: 'זו אומנות, לא טכניקה קלינית, אבל היא הסיבה שהשיטות האחרות בכלל מגיעות לילד.' },
      { icon: '🌤️', title: 'פסיכולוגיה חיובית', oneliner: 'חוזק, תקווה וחיבור חשובים בדיוק כמו המאבק.', deeper: 'זה לא על החלפת רגשות קשים ברגשות שמחים. זה על שימת לב לחוזקות הקיימות של הילד, לאנשים שסביבו, ולצעד הבא שאפשר להאמין בו, המרכיבים של תקווה אמיתית, לא חיוביות מאולצת.', take: 'לצד קושי, הסיפורים שלנו מחפשים חוזק שכבר קיים, מערכת יחסים שהילד יכול להישען עליה, וצעד קטן וממשי אחד קדימה.', dontClaim: 'אנחנו לא מבטיחים חוסן כתוצאה מובטחת, ואנחנו נזהרים שלא לבטל רגש קשה בעזרת רגש שמח.' },
    ],
  },
};

function Reveal({ children, className }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function OurMethods() {
  const { lang, isRTL } = useLanguage();
  const c = CONTENT[lang] || CONTENT.he;
  const meta = METHODS_META[lang] || METHODS_META.he;
  const arrow = isRTL ? '←' : '→';
  const location = useLocation();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="pb-12">
      <PageMeta title={meta.title} description={meta.description} />
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'השיטות שלנו' : 'Our Methods', path: location.pathname }]} />

      {/* HERO */}
      <section className="relative py-16 md:py-20 overflow-hidden rounded-[3rem] mb-16" style={{ background: 'rgba(255,255,255,0.55)' }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(22)].map((_, i) => (
            <Star key={i}
              className={`absolute w-3 h-3 text-blue-200 fill-blue-100 opacity-60 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
              style={{ top: `${5 + (i * 13) % 90}%`, left: `${(i * 17) % 100}%` }} />
          ))}
        </div>
        <Reveal className="relative text-center max-w-2xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
            ✨ {c.eyebrow}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#1C2A48' }}>
            {c.h1}
          </h1>
          <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: '#63738A' }}>
            {c.subtext}
          </p>
          <span className="inline-block px-5 py-2.5 rounded-full text-sm italic font-medium border-2" style={{ background: '#FDF6F8', borderColor: '#FDB654', color: '#1C2A48' }}>
            {c.note}
          </span>
        </Reveal>
      </section>

      {/* METHODS GRID */}
      <Reveal className="text-center mb-3">
        <h2 id="methods-grid" className="text-2xl md:text-3xl font-bold scroll-mt-24" style={{ color: '#1C2A48' }}>{c.gridHeading}</h2>
      </Reveal>
      <Reveal className="text-center mb-10">
        <p className="text-base md:text-lg" style={{ color: '#63738A' }}>{c.gridSubtext}</p>
      </Reveal>
      <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {c.methods.map((m) => (
          <a key={m.title} href={`#method-${c.methods.indexOf(m)}`}
            className="block rounded-2xl p-7 bg-white/70 backdrop-blur-sm transition-transform hover:scale-[1.02]"
            style={{ boxShadow: '0 10px 40px rgba(28,42,72,0.06)' }}>
            <div className="text-3xl mb-3">{m.icon}</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1C2A48' }}>{m.title}</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#63738A' }}>{m.oneliner}</p>
            <span className="text-sm font-semibold" style={{ color: '#FDB654' }}>{c.readFull} {arrow}</span>
          </a>
        ))}
      </Reveal>

      {/* DETAIL SECTIONS */}
      {c.methods.map((m, i) => {
        const isLast = i === c.methods.length - 1;
        const next = isLast ? null : c.methods[i + 1];
        return (
          <section key={m.title} id={`method-${i}`} className="scroll-mt-24 mb-16 md:mb-20">
            <Reveal className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
                {c.methodLabel} {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{m.title}</h3>
              </div>
              <p className="text-base md:text-lg font-medium mb-4" style={{ color: '#1C2A48' }}>{m.oneliner}</p>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#63738A' }}>{m.deeper}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: '#DCEEFA' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1C2A48' }}>{c.takeLabel}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#1C2A48' }}>{m.take}</p>
                </div>
                <div className="rounded-2xl p-5 border-2" style={{ background: '#FDF6F8', borderColor: '#FDB654' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1C2A48' }}>{c.notLabel}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#1C2A48' }}>{m.dontClaim}</p>
                </div>
              </div>
              <a href={next ? `#method-${i + 1}` : '#closing-cta'} className="inline-flex items-center gap-1 mt-6 font-semibold" style={{ color: '#1C2A48' }}>
                {c.nextLabel}: {next ? next.title : c.nextLast} {arrow}
              </a>
            </Reveal>
          </section>
        );
      })}

      {/* CLOSING CTA */}
      <section id="closing-cta" className="scroll-mt-24">
        <Reveal className="text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold mb-2" style={{ color: '#FDB654' }}>{c.ctaTagline}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1C2A48' }}>{c.ctaH2}</h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: '#63738A' }}>
            {c.ctaSubtext}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/">
              <span className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-white font-semibold shadow-lg transition-transform hover:scale-[1.03] bg-[#FDB654]">
                <Sparkles className="w-4 h-4" />
                {c.ctaPrimary}
              </span>
            </Link>
            <a href="#methods-grid" className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold transition-colors" style={{ color: '#1C2A48' }}>
              ↑ {c.ctaGhost}
            </a>
          </div>
        </Reveal>
      </section>

    </div>
  );
}