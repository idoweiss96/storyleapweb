import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star, BookOpen, Wand2, Heart, ArrowLeft, Dumbbell, ChevronRight, ChevronLeft, Quote, Tablet, MessageCircle, Book } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { useLocation } from 'react-router-dom';
import { navPathFor } from '@/lib/marketingRoutes';
import StoryGallery from '@/components/home/StoryGallery';
import StartModal from '@/components/home/StartModal';
import { trackEvent } from '@/lib/posthog';
import PageMeta from '@/components/SEO/PageMeta';
import FloatingKitaAlefBadge from '@/components/FloatingKitaAlefBadge';

const HOME_META = {
  en: { title: "StoryLeap - Helping Families Through Childhood's Moments", description: 'StoryLeap helps families navigate the emotional moments of childhood, with guidance for parents, tools and activities for children, and personalized stories.' },
  he: { title: 'סטוריליפ - מלווים משפחות ברגעים הרגשיים של הילדות', description: 'סטוריליפ מלווה משפחות ברגעים הרגשיים של הילדות, בעזרת הכוונה להורים, כלים ופעילויות לילדים, וסיפורים מותאמים אישית.' },
};

const CHIP_ITEMS = [
  { key: 'chip_new', icon: '🌱', className: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300' },
  { key: 'chip_fear', icon: '🌙', className: 'bg-violet-50 border-violet-200 text-violet-800 hover:bg-violet-100 hover:border-violet-300' },
  { key: 'chip_moving', icon: '🏠', className: 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100 hover:border-sky-300' },
  { key: 'chip_friendship', icon: '🤝', className: 'bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100 hover:border-pink-300' },
  { key: 'chip_separation', icon: '👋', className: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100 hover:border-teal-300' },
  { key: 'chip_emotions', icon: '💗', className: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300' },
  { key: 'chip_other', icon: '✨', className: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300' },
];

// Where each chip leads: /PrepareStory for "getting ready for something new" topics
// (with the topic pre-selected), /CreateStory for emotional-challenge topics
// (with the challenge pre-selected), and a generic CreateStory for "something else".
function chipDestination(key) {
  switch (key) {
    case 'chip_new': return '/PrepareStory';
    case 'chip_moving': return '/PrepareStory?topic=moving_home';
    case 'chip_separation': return `${createPageUrl('CreateStory')}?from=chip_separation&challenge=separation_anxiety`;
    case 'chip_fear': return `${createPageUrl('CreateStory')}?from=chip_fear&challenge=fears`;
    case 'chip_friendship': return `${createPageUrl('CreateStory')}?from=chip_friendship&challenge=social_difficulty`;
    case 'chip_emotions': return `${createPageUrl('CreateStory')}?from=chip_emotions&challenge=emotional_regulation`;
    default: return `${createPageUrl('CreateStory')}?from=chip_other`;
  }
}

function TestimonialsCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
  { name: t('t1_name'), text: t('t1_text'), stars: 5 },
  { name: t('t2_name'), text: t('t2_text'), stars: 5 },
  { name: t('t3_name'), text: t('t3_text'), stars: 5 },
  { name: t('t4_name'), text: t('t4_text'), stars: 5 },
  { name: t('t5_name'), text: t('t5_text'), stars: 5 },
  { name: t('t6_name'), text: t('t6_text'), stars: 5 }];


  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const prev = () => {setCurrent((current - 1 + testimonials.length) % testimonials.length);setAutoPlay(false);};
  const next = () => {setCurrent((current + 1) % testimonials.length);setAutoPlay(false);};
  const item = testimonials[current];

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{t('testimonials_title')}</h2>
        <p className="text-slate-500">{t('testimonials_subtitle')}</p>
      </div>
      <div className="max-w-2xl mx-auto relative">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-0 shadow-xl shadow-slate-100">
            <CardContent className="p-8 text-center">
              <Quote className="w-10 h-10 text-slate-300 mx-auto mb-4 rotate-180" />
              <p className="text-slate-700 text-lg leading-relaxed mb-6">"{item.text}"</p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(item.stars)].map((_, i) =>
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                )}
              </div>
              <p className="font-semibold text-slate-700">{item.name}</p>
            </CardContent>
          </Card>
        </motion.div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) =>
            <button key={i} onClick={() => {setCurrent(i);setAutoPlay(false);}}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-slate-700 w-6' : 'bg-slate-300'}`} />
            )}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>);

}

export default function Home() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const kitaAlefPath = navPathFor('KitaAlef', location.pathname, lang);
  const [showStartModal, setShowStartModal] = useState(false);

  useEffect(() => {
    trackEvent('homepage_viewed');
  }, []);



  const features = [
  { icon: Wand2, title: t('feature1_title'), description: t('feature1_desc'), bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { icon: Dumbbell, title: t('feature2_title'), description: t('feature2_desc'), bg: 'bg-rose-50', iconColor: 'text-rose-500' },
  { icon: Heart, title: t('feature3_title'), description: t('feature3_desc'), bg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { icon: MessageCircle, title: t('feature4_title'), description: t('feature4_desc'), bg: 'bg-indigo-50', iconColor: 'text-indigo-500', isNew: true }];


  const homeMeta = HOME_META[lang] || HOME_META.en;

  return (
    <div className="pb-12">
      <PageMeta title={homeMeta.title} description={homeMeta.description} />
      <FloatingKitaAlefBadge />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) =>
          <Star key={i}
          className={`absolute w-3 h-3 text-blue-200 fill-blue-100 opacity-60 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
          style={{ top: `${10 + i * 7 % 80}%`, left: `${i * 9 % 100}%` }} />
          )}
        </div>
        <div className="relative text-center max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <Sparkles className="w-4 h-4" />
               {t('hero_badge')}
              </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              {t('hero_headline')}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed whitespace-pre-line">
               {t('hero_headline_sub')}
             </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/70 text-slate-600" style={{ fontSize: '12.5px' }}>
                <Star className="w-3.5 h-3.5 text-amber-400" />
                {t('hero_pill_stories')}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/70 text-slate-600" style={{ fontSize: '12.5px' }}>
                <Tablet className="w-3.5 h-3.5 text-blue-400" />
                {t('hero_pill_digital')}
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowStartModal(true)}
              className="h-14 px-10 rounded-full text-lg font-bold text-white shadow-lg mb-6 hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300 border-0"
              style={{ background: 'linear-gradient(135deg, #FFB5B5, #FFD9A0, #A8DDEF, #C3B8F0, #FFC2E2)' }}
            >
              {lang === 'he' ? 'בואו נתחיל יחד ←' : "Let's start together →"}
            </Button>
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                ☀️ {lang === 'he' ? 'מבצע חופש גדול' : 'Summer Sale'}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="line-through text-amber-400">{lang === 'he' ? '₪110' : '$40'}</span>
                <span className="font-bold">{lang === 'he' ? '₪70' : '$25'}</span>
              </div>
            </div>
            <div id="what-going-through-card" className="mb-4 rounded-2xl bg-white/75 shadow-lg shadow-slate-200/60 px-4 py-6 md:px-8 md:py-8">
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4">{t('hero_chips_title')}</p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
                {CHIP_ITEMS.map((chip) => (
                  <Link key={chip.key} to={chipDestination(chip.key)}>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 ${chip.className}`}>
                      <span>{chip.icon}</span>
                      {t(chip.key)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kita Alef Special Banner */}
      <section className="py-4">
        <Link to={kitaAlefPath}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl p-6 md:p-8 text-center cursor-pointer relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)', border: '1px solid #FFD6EC', boxShadow: '0 8px 30px rgba(255,111,181,0.12)' }}
          >
            {/* Decorative floating stars */}
            <div className="absolute top-3 right-6 text-2xl opacity-60 star-float-1">✦</div>
            <div className="absolute bottom-3 left-8 text-lg opacity-50 star-float-2">★</div>
            <div className="absolute top-6 left-12 text-sm opacity-40 star-twinkle">✦</div>

            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ background: 'linear-gradient(135deg, #FFD6EC, #B8EBF7)', color: '#1A1A6E' }}>
               {lang === 'he' ? '✨ ספיישל כיתה א׳' : '✨ Starting School Special'}
             </span>
            <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ color: '#1A1A6E' }}>
              {lang === 'he' ? 'הכנה לכיתה א׳ ביחד 💗' : 'Getting Ready for Kindergarten Together 💖'}
            </h3>
            <p className="text-sm md:text-base mb-4" style={{ color: '#6b6b8a' }}>
              {lang === 'he' ? 'שאלון משותף לילד ולהורה - 5 דקות 🎒' : 'A joint questionnaire for child and parent, 5 minutes 🎒'}
            </p>
            <span
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
            >
              <Sparkles className="w-4 h-4" />
              {lang === 'he' ? 'לחצו כאן להתחלה' : 'Click here to start'}
            </span>
          </motion.div>
        </Link>
      </section>

      {/* Free Activities Section */}
      <section className="py-8">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
            {lang === 'he' ? 'פעילויות חינמיות לקראת כיתה א׳' : 'Free Activities for Starting School'}
          </h3>
          <p className="text-slate-500 text-sm">
            {lang === 'he' ? 'בלי הרשמה, בלי תשלום, פשוט לעשות יחד' : 'No signup, no payment, just do it together'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Link to="/FreeActivityGoodbye">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {lang === 'he' ? 'טקס הפרידה שלנו' : 'Our Goodbye Ritual'}
                </h4>
                <p className="text-slate-500 text-sm">
                  {lang === 'he' ? 'בונים יחד פרידה קבועה ומרגיעה לשער בית הספר' : 'Build a calm, consistent goodbye routine together'}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/FreeActivityMorningEvening">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {lang === 'he' ? 'הבוקר והערב שלי' : 'My Morning and Evening'}
                </h4>
                <p className="text-slate-500 text-sm">
                  {lang === 'he' ? 'בונים לוח שגרה אישי להדפסה לבוקר ולערב' : 'Build a printable personal routine board'}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/FreeActivityLittleHeart">
            <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  {lang === 'he' ? 'לב קטן מהבית' : 'A Little Heart from Home'}
                </h4>
                <p className="text-slate-500 text-sm">
                  {lang === 'he' ? 'יוצרים יחד כרטיס, מכתב או ציור לקחת בתיק' : 'Create a card, letter, or drawing to take along'}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <StoryGallery />

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative">
                {feature.isNew && (
                  <span className="absolute -top-3 left-4 z-10 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">
                    {t('badge_new')}
                  </span>
                )}
                <Card className={`h-full shadow-lg shadow-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 ${feature.isNew ? 'border-2 border-blue-300' : 'border-0'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>);

          })}
        </div>
      </section>

      {/* Maya Story CTA */}
      <section className="py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg shadow-amber-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8"
              style={{ background: 'linear-gradient(135deg, #fff8ed 0%, #fde8c8 100%)' }}>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">✨ {t('maya_sample')}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('maya_title')}</h3>
                  <Link to="/MayaStory">
                    <Button className="rounded-xl px-6" style={{ background: '#c07028', color: 'white' }}>
                       📖 {t('maya_btn')}
                     </Button>
                  </Link>
                </div>
                <img src="https://media.base44.com/images/public/697f4b704975c71e9cf56f59/7455564e3_MAYA.png"
                alt="Princess Maya"
                className="w-36 md:w-44 object-contain drop-shadow-lg rounded-md" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Security Badge */}
      <section className="py-4 flex justify-center">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm text-slate-500">
          <span className="flex items-center gap-2"><span className="text-green-500">🔒</span> {lang === 'he' ? 'המידע שלכם מוצפן ומאובטח' : 'Your data is encrypted & secure'}</span>
          <span className="w-px h-4 bg-slate-200 hidden sm:block" />
          <span className="flex items-center gap-2"><span>🛡️</span> {lang === 'he' ? 'לא נשתף מידע עם צד שלישי' : 'We never share your data'}</span>
          <span className="w-px h-4 bg-slate-200 hidden sm:block" />
          <span className="flex items-center gap-2"><span>✅</span> {lang === 'he' ? 'עמידה בתקני פרטיות' : 'Privacy compliant'}</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="overflow-hidden border-0 shadow-2xl shadow-slate-200">
            <div className="p-8 md:p-12 text-white text-center relative" style={{ background: 'linear-gradient(135deg, #BAD1FA, #9ab8f5)' }}>
              <Star className="absolute top-4 right-8 w-6 h-6 text-blue-300 fill-blue-300 opacity-60" />
              <Star className="absolute bottom-6 left-12 w-4 h-4 text-blue-200 fill-blue-200 opacity-40" />
              <Star className="absolute top-8 left-20 w-3 h-3 text-white/30 fill-white/30" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('cta_title')}</h2>
              <p className="mb-6 max-w-lg mx-auto text-slate-500">{t('cta_desc')}</p>
              <Link to={createPageUrl('CreateStory')}>
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-semibold">
                  {t('cta_btn')}
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      <AnimatePresence>
        {showStartModal && (
          <StartModal onClose={() => setShowStartModal(false)} />
        )}
      </AnimatePresence>
    </div>);

}