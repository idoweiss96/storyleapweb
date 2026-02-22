import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star, BookOpen, Wand2, Heart, ArrowLeft, Dumbbell, ChevronRight, ChevronLeft, Quote } from 'lucide-react';

const testimonials = [
  { name: 'מיכל כ.', text: 'הבת שלי לא הפסיקה לבקש שנקרא את הסיפור שוב ושוב! הרגשנו שהיא מזדהה עם הדמות ובאמת עזר לה להתמודד עם הפחד מהחושך.', stars: 5 },
  { name: 'דנה א.', text: 'מדהים איך הסיפור כיוון בדיוק לנושא שהטריד את הבן שלי. הוא עצמאי פתח איתי שיחה לאחר הקריאה שמעולם לא הייתה לנו. תודה!', stars: 5 },
  { name: 'יוסי ל.', text: 'ההתנגדות לשינויים הייתה ממש קשה אצלנו. הסיפור עשה את העבודה בצורה רכה ועדינה, בלי לחץ. ממליץ בחום!', stars: 5 },
  { name: 'רחל מ.', text: 'חרדת הנטישה של הבת שלי השתפרה משמעותית אחרי שקראנו את הסיפור יחד כל ערב. הרופאה שלה גם הבחינה בשיפור!', stars: 5 },
  { name: 'אייל ד.', text: 'כמה שזה מדויק ואישי! הרגשנו שמישהו באמת הקשיב לנו ויצר משהו מיוחד רק בשביל הילד שלנו.', stars: 5 },
  { name: 'שרה ב.', text: 'הסיפור עזר לנו לפתוח שיחה על קשיים חברתיים בצורה טבעית ולא מאיימת. הילד שלי פשוט נפתח!', stars: 5 },
];

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const prev = () => { setCurrent((current - 1 + testimonials.length) % testimonials.length); setAutoPlay(false); };
  const next = () => { setCurrent((current + 1) % testimonials.length); setAutoPlay(false); };

  const t = testimonials[current];

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">מה ההורים אומרים 💬</h2>
        <p className="text-gray-600">חוויות אמיתיות מהורים שכבר יצרו סיפורים</p>
      </div>
      <div className="max-w-2xl mx-auto relative">
        <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-0 shadow-xl shadow-violet-100">
            <CardContent className="p-8 text-center">
              <Quote className="w-10 h-10 text-violet-300 mx-auto mb-4 rotate-180" />
              <p className="text-gray-700 text-lg leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="font-semibold text-violet-700">{t.name}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-violet-50 transition-colors">
            <ChevronRight className="w-5 h-5 text-violet-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setAutoPlay(false); }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-violet-500 w-6' : 'bg-violet-200'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-violet-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-violet-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

// דף נחיתה ציבורי - פתוח לכולם
export default function Home() {
  const features = [
    {
      icon: Wand2,
      title: 'סיפורים מותאמים אישית',
      description: 'כל סיפור נכתב במיוחד עבור הילד/ה שלכם עם השם והדמויות שבחרתם',
      color: 'violet',
    },
    {
      icon: Dumbbell,
      title: 'העצמה',
      description: 'עוזרים לילדים לזהות ולדבר על רגשותיהם, כדי שירגישו נראים, בטוחים ומובנים',
      color: 'rose',
    },
    {
      icon: Heart,
      title: 'חיבור רגשי',
      description: 'יצירת רגעים שמקרבים ילדים ויקיריהם, מעודדים שיחות עמוקות וחיבור',
      color: 'amber',
    },
  ];

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Star
              key={i}
              className={`absolute w-4 h-4 text-amber-300 fill-amber-200 opacity-50 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              סיפורי קסם לילדים
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              כל ילד/ה ראויים
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                לסיפור משלהם
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              העצמת התפתחותם הרגשית של ילדים באמצעות סיפורים מותאמים אישית.
              <br />
              כל סיפור הוא הרפתקה ייחודית שנכתבה במיוחד עבורם.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('CreateStory')}>
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all"
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  צרו סיפור חדש
                </Button>
              </Link>
              <Link to={createPageUrl('MyStories')}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-xl border-2 border-violet-200 text-violet-700 hover:bg-violet-50"
                >
                  <BookOpen className="w-5 h-5 ml-2" />
                  הסיפורים שלי
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg shadow-violet-50 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-7 h-7 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">גלריית הסיפורים שלנו ✨</h2>
          <p className="text-gray-600">הצצה לעולמות הקסומים שיצרנו</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/ee44ec4b5_image4.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/aacd843f4_image52.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/dd316698e_image51.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/0e345ce30_image5.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/e38dd71a8_image54.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/ad2824198_image53.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/83af1df79_image1.png',
            'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/465dd64af_image3.png',
          ].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={src}
                alt={`גלריה ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl shadow-violet-100">
            <div className="bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 p-8 md:p-12 text-white text-center relative">
              {/* Decorative Stars */}
              <Star className="absolute top-4 right-8 w-6 h-6 text-amber-300 fill-amber-300 opacity-80" />
              <Star className="absolute bottom-6 left-12 w-4 h-4 text-amber-200 fill-amber-200 opacity-60" />
              <Star className="absolute top-8 left-20 w-3 h-3 text-white/50 fill-white/50" />

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                מוכנים ליצור קסם? ✨
              </h2>
              <p className="text-violet-100 mb-6 max-w-lg mx-auto">
                הצטרפו עכשיו וקבלו 3 קרדיטים חינם ליצירת הסיפורים הראשונים שלכם
              </p>
              <Link to={createPageUrl('CreateStory')}>
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-white text-violet-700 hover:bg-violet-50 font-semibold"
                >
                  התחילו עכשיו
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}