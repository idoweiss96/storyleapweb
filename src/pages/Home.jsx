import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star, BookOpen, Wand2, Heart, Users, ArrowLeft, Dumbbell } from 'lucide-react';

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