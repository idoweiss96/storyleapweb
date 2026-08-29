import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, Globe, Clock, FileText, Home, Wand2, MessageSquare,
  BookOpen, Sparkles, Repeat, ShieldCheck, CheckCircle, Users,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { base44 } from '@/api/base44Client';
import PageMeta from '@/components/SEO/PageMeta';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import { LEAPY_AVATAR_URI, LEAPY_AVATAR_URI_B } from '@/components/home-new/leapyAvatar';

/*
 * ProfessionalsNew  -  isolated review page at /professionals-new.
 * Reuses the redesigned-HomeNew brand language (same fonts, palette, rounded UI,
 * inherited Layout background) but leans more product-oriented and credible.
 * Nothing here modifies the live site: no shared component is edited, the form
 * uses the EXISTING `sendFormEmail` function (invoked, not changed), and while
 * mounted `hn2-active` hides only the inherited Layout header (reversible).
 *
 * Honest framing throughout: "we're building / developing / exploring".
 * Not a therapy replacement, not diagnostic, not a medical device.
 */

const META = {
  en: {
    title: 'For Professionals - StoryLeap (in development)',
    description:
      "StoryLeap is building a personalization engine that helps professionals turn a child's real situations, goals and needs into personalized social stories and supporting tools. In active development with therapists, educators and child-development professionals.",
  },
  he: {
    title: 'לאנשי מקצוע - StoryLeap (בפיתוח)',
    description:
      'StoryLeap בונה מנוע התאמה אישית שעוזר לאנשי מקצוע להפוך מצבים, מטרות וצרכים אמיתיים של ילד לסיפורים חברתיים מותאמים אישית וכלים תומכים. בפיתוח פעיל עם מטפלים, מחנכים ואנשי התפתחות הילד.',
  },
};

const ROYAL = '#02198B';

function PrimaryCta({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      style={{ background: ROYAL, boxShadow: '0 12px 30px rgba(2,25,139,0.25)' }}
    >
      {children}
      <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
    </a>
  );
}

function SecondaryCta({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-base border-2 transition-colors duration-200 hover:bg-[rgba(2,25,139,0.05)] ${className}`}
      style={{ borderColor: 'rgba(2,25,139,0.22)', color: ROYAL }}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{ background: 'rgba(2,25,139,0.07)', color: ROYAL }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ROYAL }} />
      {children}
    </span>
  );
}

export default function ProfessionalsNew() {
  const { lang, toggleLang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? META.he : META.en;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('hn2-active');
    return () => root.classList.remove('hn2-active');
  }, []);

  /* ---------------- interest form (safe: existing sendFormEmail) ---------------- */
  const [form, setForm] = useState({
    name: '', role: '', workplace: '', email: '', phone: '', need: '', testing: false,
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      await base44.functions.invoke('sendFormEmail', {
        formType: 'Professional Interest - StoryLeap (professionals-new)',
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        additionalFields: {
          'Profession / role': form.role,
          'Where do you work': form.workplace || '-',
          'What would help most': form.need || '-',
          'Interested in testing early versions': form.testing ? 'Yes' : 'No',
        },
      });
      setStatus('done');
    } catch (_) {
      setStatus('error');
    }
  };

  /* ---------------- content ---------------- */
  const pains = [
    {
      icon: Clock,
      t: isHe ? 'יצירת חומרים מותאמים אישית לוקחת זמן' : 'Creating individualized materials takes time',
      d: isHe ? 'לכל ילד מצב אחר, מטרה אחרת, שפה אחרת.' : 'Every child brings a different situation, goal and language.',
    },
    {
      icon: FileText,
      t: isHe ? 'דפי עבודה גנריים לא תמיד מתאימים' : "Generic worksheets don't always fit the child in front of you",
      d: isHe ? 'הם קרובים, אבל לא סביב הילד הספציפי.' : 'Close, but not built around this specific child.',
    },
    {
      icon: Home,
      t: isHe ? 'תרגול בבית מאבד הקשר בין מפגשים' : 'Home practice can lose context between sessions',
      d: isHe ? 'מה שברור במפגש לא תמיד עובר הביתה.' : "What's clear in session doesn't always travel home.",
    },
    {
      icon: Wand2,
      t: isHe ? 'להפוך מצבים מהחיים לכלים בגובה הילד — עבודה ידנית' : 'Turning real-life situations into child-friendly tools is often manual work',
      d: isHe ? 'ניסוח, התאמה, הדפסה, שוב ושוב.' : 'Rewriting, adapting, printing - again and again.',
    },
  ];

  const flow = isHe
    ? ['הקשר הילד', 'מטרה / מצב', 'כלי מותאם אישית', 'מפגש + שימוש בבית']
    : ["Child context", 'Goal / situation', 'Personalized tool', 'Session + home use'];

  const directions = [
    {
      icon: BookOpen,
      t: isHe ? 'סיפורים חברתיים מותאמים אישית' : 'Personalized social stories',
      d: isHe
        ? 'להפוך מצבים, שגרות ומטרות ספציפיים לסיפורים שנבנים סביב הילד.'
        : 'Turn specific situations, routines and goals into stories built around the child.',
    },
    {
      icon: Sparkles,
      t: isHe ? 'פעילויות תומכות' : 'Supporting activities',
      d: isHe
        ? 'ליצור או לבחור פעילויות פשוטות שמחזקות את אותה מטרה או מצב.'
        : 'Create or select simple activities that reinforce the same goal or situation.',
    },
    {
      icon: Home,
      t: isHe ? 'כלים לתרגול בבית' : 'Home-practice tools',
      d: isHe
        ? 'לתת למשפחות משהו ברור ורלוונטי להמשיך איתו בין מפגשים.'
        : 'Give families something clear and relevant to continue between sessions.',
    },
    {
      icon: Repeat,
      t: isHe ? 'תהליכי עבודה לשימוש חוזר' : 'Reusable professional workflows',
      d: isHe
        ? 'לצמצם את הצורך לבנות חומרים מאפס לכל ילד.'
        : 'Reduce the need to rebuild materials from scratch for every child.',
    },
  ];

  const fields = isHe
    ? ['קלינאות תקשורת', 'ריפוי בעיסוק', 'טיפול רגשי', 'תמיכה התנהגותית', 'חינוך מיוחד', 'התפתחות הילד']
    : ['Speech-language pathology', 'Occupational therapy', 'Emotional therapy', 'Behavior support', 'Special education', 'Child development'];

  const learn = isHe
    ? ['מה לוקח יותר מדי זמן היום', 'אילו כלים אתם בונים ידנית', 'איפה ההתאמה האישית באמת חשובה', 'מה קשה להמשיך בבית', 'מה יהפוך את StoryLeap לשימושי באמת בפרקטיקה']
    : ['what takes too much time today', 'what tools you build manually', 'where personalization matters most', "what's hard to continue at home", 'what would make StoryLeap genuinely useful in practice'];

  return (
    <div className="pb-16" style={{ color: '#2D2F33' }}>
      <PageMeta title={meta.title} description={meta.description} />
      <NoIndexMeta />
      <style>{`
        html.hn2-active header.site-chrome { display: none !important; }
        html.hn2-active main { padding-top: 0 !important; }
        html.hn2-active body { overflow-x: hidden; }
      `}</style>

      {/* ---------------- header (StoryLeap chrome, product-focused) ---------------- */}
      <div style={{ width: '100vw', marginInlineStart: 'calc(50% - 50vw)' }}>
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Link to="/HomeNew" className="flex items-center">
              <img
                src="https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg"
                alt="StoryLeap"
                className="h-9 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/HomeNew" className="hidden sm:inline text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl transition-colors">
                {isHe ? 'למשפחות' : 'For families'}
              </Link>
              <button
                onClick={toggleLang}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                title={isHe ? 'English' : 'עברית'}
              >
                <Globe className="w-5 h-5" />
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-white text-sm font-semibold"
                style={{ background: ROYAL }}
              >
                {isHe ? 'דברו איתנו' : 'Contact us'}
              </a>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* ============================ 1 · HERO ============================ */}
        <section className="pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-5"><Eyebrow>{isHe ? 'לאנשי מקצוע · בפיתוח פעיל' : 'For professionals · In active development'}</Eyebrow></div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: ROYAL }}>
                {isHe
                  ? 'כלים מותאמים אישית לאנשי המקצוע שעוזרים לילדים לצמוח'
                  : 'Personalized tools for the professionals who help children grow'}
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-4 max-w-xl">
                {isHe
                  ? 'StoryLeap בונה מנוע ליצירה והתאמה אישית של סיפורים חברתיים וכלים תומכים — סביב המצבים, המטרות והצרכים האמיתיים של כל ילד.'
                  : "StoryLeap is building an engine for creating and personalizing social stories and supporting tools — around each child's real situations, goals and needs."}
              </p>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-7 max-w-xl">
                {isHe
                  ? 'את הגרסה לאנשי מקצוע אנחנו מפתחים יחד עם מטפלים, מחנכים ואנשי התפתחות הילד.'
                  : "We're developing the professional version together with therapists, educators and child-development professionals."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryCta href="#contact" className="w-full sm:w-auto">
                  {isHe ? 'להצטרף כשותפי פיתוח' : 'Join as a design partner'}
                </PrimaryCta>
                <SecondaryCta href="#contact" className="w-full sm:w-auto">
                  {isHe ? 'ספרו לנו מה חסר לכם' : 'Tell us what you need'}
                </SecondaryCta>
              </div>
            </motion.div>

            {/* professional-tool mockup: child/family context -> tool selection -> home continuity */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.12 }}>
              <div className="mx-auto max-w-md rounded-[28px] bg-white border border-slate-200 shadow-2xl shadow-slate-300/40 p-2.5">
                <div className="flex justify-center pb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-200" /></div>
                <div className="rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(160deg, #F7FAFF 0%, #F1ECFB 100%)' }}>
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/70 border-b border-white">
                    <span className="text-[11px] font-bold" style={{ color: ROYAL }}>StoryLeap · {isHe ? 'לאנשי מקצוע' : 'Professional'}</span>
                    <span className="w-5 h-5 rounded-full bg-violet-100" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold shrink-0">
                        {isHe ? 'מ' : 'M'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800">{isHe ? 'מאיה · גיל 5' : 'Maya · age 5'}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {(isHe ? ['מתחילה גן', 'מטרה: פרידה רגועה'] : ['Starting kindergarten', 'Goal: calm separation']).map((c) => (
                            <span key={c} className="text-[10px] rounded-md bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-slate-500">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">{isHe ? 'כלים מוצעים' : 'Suggested tools'}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: BookOpen, label: isHe ? 'סיפור חברתי' : 'Social story', on: true },
                          { icon: Sparkles, label: isHe ? 'פעילות' : 'Activity' },
                          { icon: Home, label: isHe ? 'תרגול בבית' : 'Home practice' },
                        ].map(({ icon: Ic, label, on }) => (
                          <div key={label} className={`rounded-xl p-2 text-center shadow-sm bg-white ${on ? 'border-2' : 'border border-slate-100'}`} style={on ? { borderColor: 'rgba(2,25,139,0.35)' } : undefined}>
                            <Ic className="w-4 h-4 mx-auto mb-1" style={{ color: ROYAL }} />
                            <span className="text-[9px] font-semibold text-slate-600 leading-tight block">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] font-medium" style={{ background: 'rgba(2,25,139,0.06)', color: ROYAL }}>
                      <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {isHe ? 'שותף עם המשפחה · מעקב בעוד 3 ימים' : 'Shared with family · follow-up in 3 days'}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 text-center">
                {isHe ? 'המחשה של הכיוון — עדיין בפיתוח' : 'Illustrative of the direction — still in development'}
              </p>
            </motion.div>
          </div>

          <p className="mt-8 text-xs md:text-sm text-slate-400 max-w-2xl">
            {isHe
              ? 'StoryLeap אינו כלי אבחון, תחליף לטיפול או מכשור רפואי. זו דרך ליצור חומרי תמיכה מותאמים אישית ובגובה הילד.'
              : "StoryLeap is not a diagnostic tool, a therapy replacement, or a medical device. It's a way to create personalized, child-friendly support materials."}
          </p>
        </section>

        {/* ============================ 2 · PROBLEM ============================ */}
        <section className="py-12 md:py-14">
          <div className="text-center mb-9">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {isHe ? 'כל ילד שונה. רוב הכלים לא.' : "Every child is different. Most tools aren't."}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {isHe ? 'מה שאנחנו שומעים שוב ושוב מאנשי מקצוע:' : "What we keep hearing from professionals:"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {pains.map(({ icon: Icon, t, d }) => (
              <Card key={t} className="h-full border-0 shadow-lg shadow-slate-100">
                <CardContent className="p-5 flex gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" style={{ color: ROYAL }} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 leading-snug mb-1">{t}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{d}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ============================ 3 · WHAT WE'RE BUILDING ============================ */}
        <section className="py-12 md:py-14">
          <div className="text-center mb-8">
            <div className="mb-3 flex justify-center"><Eyebrow>{isHe ? 'מה אנחנו בונים' : "What we're building"}</Eyebrow></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {isHe ? 'דרך חכמה יותר ליצור תמיכה מותאמת אישית' : 'A smarter way to create personalized support'}
            </h2>
          </div>

          {/* flow */}
          <div className="rounded-3xl bg-white/80 border border-white shadow-lg shadow-slate-100 p-5 md:p-7 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-3 items-center">
              {flow.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="rounded-2xl text-center px-3 py-4 text-sm font-semibold"
                    style={{ background: 'rgba(2,25,139,0.05)', color: ROYAL }}>
                    {step}
                  </div>
                  {i < flow.length - 1 && (
                    <div className="flex items-center justify-center text-slate-300">
                      <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0 rtl:sm:rotate-180" aria-hidden="true" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {directions.map(({ icon: Icon, t, d }) => (
              <Card key={t} className="h-full border-0 shadow-lg shadow-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
                      {isHe ? 'כיוון מוצר' : 'Product direction'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1.5">{t}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-5">
            {isHe ? 'אלו כיווני מוצר. לא כל יכולת כבר קיימת.' : 'These are product directions. Not every capability exists yet.'}
          </p>
        </section>

        {/* ============================ 4 · MORE THAN A STORY GENERATOR ============================ */}
        <section className="py-12 md:py-14">
          <div
            className="rounded-3xl px-6 py-10 md:px-14 md:py-14 text-center"
            style={{ background: 'linear-gradient(135deg, #EAF1FF 0%, #F1ECFB 100%)', border: '1px solid rgba(2,25,139,0.10)' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: ROYAL }}>
              {isHe ? 'יותר ממחולל סיפורים' : 'More than a story generator'}
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {isHe
                ? 'המטרה שלנו היא מנוע התאמה אישית שעוזר לכם להפוך הקשר, מטרות ומצבים מהחיים של ילד לכלים מעשיים ובגובה הילד — מתחילים בסיפורים חברתיים, ומתרחבים לפעילויות, תרגול בבית ותמיכה משותפת.'
                : "Our goal is a personalization engine that helps you turn a child's context, goals and real-world situations into practical, child-friendly tools — starting with social stories, and expanding into activities, home practice and shared support."}
            </p>
            <p className="text-sm text-slate-500 mt-4">
              {isHe ? 'סיפורים הם נקודת ההתחלה — לא כל התמונה.' : 'Stories are the starting point — not the whole picture.'}
            </p>
          </div>
        </section>

        {/* ============================ 5 · WHO WE'RE BUILDING WITH ============================ */}
        <section className="py-12 md:py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {isHe ? 'נבנה עם אנשי מקצוע שעובדים עם ילדים' : 'Built with child-facing professionals in mind'}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {isHe ? 'רלוונטי למגוון תחומים שעובדים ישירות עם ילדים ומשפחות.' : 'Relevant across the fields that work directly with children and families.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            {fields.map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 shadow-sm px-4 py-2 text-sm font-medium text-slate-700">
                <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* ============================ 6 · DESIGN PARTNER ============================ */}
        <section id="design-partner" className="py-12 md:py-14 scroll-mt-20">
          <div className="text-center mb-8">
            <div className="mb-3 flex justify-center"><Eyebrow>{isHe ? 'שותפי פיתוח' : 'Design partners'}</Eyebrow></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              {isHe ? 'עזרו לנו לבנות את הכלים שאתם באמת צריכים' : 'Help us build the tools you actually need'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {isHe
                ? 'אנחנו בפיתוח פעיל, ואנחנו לא רוצים לבנות כלים לאנשי מקצוע בחלל ריק. אנחנו רוצים ללמוד:'
                : "We're in active development, and we don't want to build professional tools in a vacuum. We want to learn:"}
            </p>
          </div>

          <ul className="max-w-2xl mx-auto grid gap-2 mb-8">
            {learn.map((l) => (
              <li key={l} className="flex items-start gap-2.5 text-sm text-slate-600 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: ROYAL }} aria-hidden="true" />
                {l}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Card className="h-full border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <img src={LEAPY_AVATAR_URI_B} alt="" className="w-7 h-7 rounded-full object-cover" style={{ objectPosition: 'center 12%' }} />
                  <h3 className="text-lg font-bold text-slate-800">{isHe ? 'להיות שותף/ת פיתוח' : 'Become a design partner'}</h3>
                </div>
                <ul className="text-sm text-slate-500 space-y-1.5">
                  {(isHe
                    ? ['לבדוק גרסאות מוקדמות', 'לתת משוב', 'לעזור לעצב תהליכי עבודה', 'להשתתף בפיילוטים']
                    : ['Test early versions', 'Give feedback', 'Help shape workflows', 'Join pilots']
                  ).map((x) => <li key={x} className="flex gap-2"><span style={{ color: ROYAL }}>·</span>{x}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="h-full border-0 shadow-lg shadow-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <img src={LEAPY_AVATAR_URI} alt="" className="w-7 h-7 rounded-full object-cover" style={{ objectPosition: 'center 10%' }} />
                  <h3 className="text-lg font-bold text-slate-800">{isHe ? 'פשוט לדבר איתנו' : 'Just talk to us'}</h3>
                </div>
                <ul className="text-sm text-slate-500 space-y-1.5">
                  {(isHe
                    ? ['בלי התחייבות', 'לספר איך אתם עובדים היום', 'להגיד לנו מה חסר', 'לעזור לנו להבין את הצורך']
                    : ['No commitment', 'Share how you work today', "Tell us what's missing", 'Help us understand the need']
                  ).map((x) => <li key={x} className="flex gap-2"><span style={{ color: ROYAL }}>·</span>{x}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============================ 7 · CONTACT / INTEREST FORM ============================ */}
        <section id="contact" className="py-12 md:py-14 scroll-mt-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-7">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                {isHe ? 'בואו נדבר' : "Let's talk"}
              </h2>
              <p className="text-slate-500">
                {isHe ? 'כמה שדות קצרים. נחזור אליכם.' : 'A few short fields. We’ll get back to you.'}
              </p>
            </div>

            <Card className="border-0 shadow-2xl shadow-slate-300/50 bg-white/95 ring-1 ring-slate-100">
              <CardContent className="p-6 md:p-8">
                {status === 'done' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{isHe ? 'תודה — נחזור אליכם.' : "Thanks — we'll be in touch."}</h3>
                    <p className="text-slate-500 text-sm">{isHe ? 'נשמח להבין איך אתם עובדים ומה יעזור.' : "We'd love to understand how you work and what would help."}</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    {status === 'error' && (
                      <div className="p-3 rounded-xl text-red-700 text-sm bg-red-50 border border-red-100">
                        {isHe ? 'נא למלא שם, אימייל ותחום.' : 'Please add your name, email and profession.'}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-700 font-medium">{isHe ? 'שם' : 'Name'} *</Label>
                        <Input value={form.name} onChange={(e) => set('name', e.target.value)} className="h-11 rounded-xl border-slate-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-700 font-medium">{isHe ? 'תחום / תפקיד' : 'Profession / role'} *</Label>
                        <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder={isHe ? 'קלינאית תקשורת, מרפאה בעיסוק…' : 'SLP, OT, educator…'} className="h-11 rounded-xl border-slate-200" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-700 font-medium">{isHe ? 'איפה אתם עובדים?' : 'Where do you work?'}</Label>
                      <Input value={form.workplace} onChange={(e) => set('workplace', e.target.value)} placeholder={isHe ? 'קליניקה פרטית, מרכז התפתחות, בית ספר…' : 'Private practice, clinic, school…'} className="h-11 rounded-xl border-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-700 font-medium">{isHe ? 'אימייל' : 'Email'} *</Label>
                        <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@work.com" className="h-11 rounded-xl border-slate-200" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-slate-700 font-medium">{isHe ? 'טלפון (לא חובה)' : 'Phone (optional)'}</Label>
                        <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="h-11 rounded-xl border-slate-200" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-700 font-medium">
                        {isHe ? 'מה הכי הייתם רוצים שכלי כמו StoryLeap יעזור לכם לעשות?' : 'What would you most like a tool like StoryLeap to help you do?'}
                      </Label>
                      <Textarea value={form.need} onChange={(e) => set('need', e.target.value)} rows={3} className="rounded-xl border-slate-200 resize-none" />
                    </div>
                    <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.testing}
                        onChange={(e) => set('testing', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#02198B]"
                      />
                      {isHe ? 'מעניין אותי לבדוק גרסאות מוקדמות.' : "I'd be interested in testing early versions."}
                    </label>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full h-12 rounded-full text-white font-semibold transition-all hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: ROYAL }}
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isHe ? 'שולח…' : 'Sending…'}
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          {isHe ? 'בואו נדבר' : "Let's talk"}
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      {isHe ? 'הפנייה נשלחת לצוות StoryLeap במייל. אין שמירת נתונים נוספת בעמוד הזה.' : 'Your message is emailed to the StoryLeap team. No other data is stored from this page.'}
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============================ 8 · FINAL CTA ============================ */}
        <section className="py-12 md:py-16">
          <div
            className="rounded-3xl px-6 py-12 md:px-16 md:py-16 text-center text-white"
            style={{ background: ROYAL, boxShadow: '0 24px 60px rgba(2,25,139,0.30)' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 max-w-2xl mx-auto">
              {isHe ? 'הכלים המקצועיים הטובים ביותר נבנים יחד עם מי שמשתמש בהם.' : 'The best professional tools are built with the people who use them.'}
            </h2>
            <p className="text-white/75 mb-7">
              {isHe ? 'עזרו לנו לבנות את StoryLeap לאנשי מקצוע.' : 'Help us build StoryLeap for professionals.'}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-base bg-white transition-transform hover:-translate-y-0.5"
              style={{ color: ROYAL }}
            >
              {isHe ? 'להיות שותף/ת פיתוח' : 'Become a design partner'}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
