import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';

const COVER_IMAGE = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/203904ade_image.png';

const PAGES_EN = [
  { type: 'cover' },
  {
    type: 'story', pageNum: 1,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/f638f6573_image11.png',
    text: "Inside a beautiful palace lived Princess Maya. She had a wonderful room, full of colors, glitter, and everything needed for art. Maya loved to draw, cut, and paste very much. Her best friend, the fairy doll Tinkerbell, always sat beside her and watched the magic. In this room, everything was familiar and pleasant, and Maya's heart was full of peace."
  },
  {
    type: 'story', pageNum: 2,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/28647736e_image22.png',
    text: "One day, a gray and confused cloud arrived at the palace. It was 'The Cloud of Confusion'. It quietly entered and wrapped all of Maya's things in a fog. Suddenly, the familiar room disappeared, and she found herself in a new and unfamiliar room in a different palace. Nothing looked the same. Maya felt very small and lost. She wanted to be held like a baby and couldn't find her words."
  },
  {
    type: 'story', pageNum: 3,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/06c9aabb1_image33.png',
    text: "The King and Queen, Maya's father and mother, entered the room and found her with big, sad eyes. Mom bent down and hugged her tightly. 'Oh, our dear Maya,' she said softly. 'We see that the Cloud of Confusion has arrived. It's completely okay to feel a little lost when everything is new and different. It's not your fault.' Dad stroked her hair. 'All your feelings are allowed. We are here for you.'"
  },
  {
    type: 'story', pageNum: 4,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/956c78c53_image44.png',
    text: "'I have an idea,' said Dad. 'We have the power to add color and joy to this new place. You are the best artist in the whole kingdom!' Mom brought large sheets of paper and all the boxes of colors. 'Let's re-draw this room, just the way you want it to be!' she suggested. Maya, with the help of Tinkerbell who whispered magical ideas to her, began to draw. She drew flowers on the walls, stars on the ceiling, and a glittery path leading to the bed."
  },
  {
    type: 'story', pageNum: 5,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/18b3cc357_image55.png',
    text: "Slowly, the new room filled with Maya's colors and imagination. The Cloud of Confusion, which was watching from the side, began to shrink. The more Maya added of herself to the room, the smaller and more transparent the cloud became, until finally, it just evaporated and disappeared. Maya looked around. It was a new room, but now it was her room. She smiled a big smile. She knew that even in a new place, she had the power to create a home for herself."
  },
  { type: 'end' }
];

const PAGES_HE = [
  { type: 'cover' },
  {
    type: 'story', pageNum: 1,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/f638f6573_image11.png',
    text: "בתוך ארמון יפהפה גרה הנסיכה מאיה. הייתה לה חדר נפלא, מלא בצבעים, נצנצים וכל מה שצריך ליצירה. מאיה אהבה מאוד לצייר, לגזור ולהדביק. חברתה הטובה ביותר, בובת הפיה טינקרבל, תמיד ישבה לידה וצפתה בקסם. בחדר הזה הכל היה מוכר ונעים, ולב מאיה היה מלא שלווה."
  },
  {
    type: 'story', pageNum: 2,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/28647736e_image22.png',
    text: "יום אחד הגיע לארמון ענן אפור ומבולבל. זו הייתה 'עננת הבלבול'. היא נכנסה בשקט ועטפה את כל הדברים של מאיה בערפל. פתאום, החדר המוכר נעלם, ומאיה מצאה את עצמה בחדר חדש ולא מוכר בארמון אחר. שום דבר לא נראה אותו דבר. מאיה הרגישה קטנה מאוד ואבודה. רצתה שיחזיקו אותה כמו תינוקת ולא מצאה את מילותיה."
  },
  {
    type: 'story', pageNum: 3,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/06c9aabb1_image33.png',
    text: "המלך והמלכה, אבא ואמא של מאיה, נכנסו לחדר ומצאו אותה עם עיניים גדולות ועצובות. אמא כפפה ואיחדה אותה חזק. 'אוי, מאיה היקרה שלנו,' אמרה בעדינות. 'אנחנו רואים שעננת הבלבול הגיעה. לגמרי בסדר להרגיש קצת אבוד כשהכל חדש ושונה. זה לא אשמתך.' אבא ליטף את שערה. 'כל הרגשות שלך מותרים. אנחנו כאן בשבילך.'"
  },
  {
    type: 'story', pageNum: 4,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/956c78c53_image44.png',
    text: "'יש לי רעיון,' אמר אבא. 'יש לנו כוח להוסיף צבע ושמחה למקום החדש הזה. את האמנית הכי טובה בכל הממלכה!' אמא הביאה דפים גדולים וכל קופסאות הצבעים. 'בואי נצייר מחדש את החדר הזה, בדיוק כמו שאת רוצה שיהיה!' הציעה. מאיה, בעזרת טינקרבל שלחשה לה רעיונות קסומים, החלה לצייר. ציירה פרחים על הקירות, כוכבים על התקרה, ושביל נצנצים שמוביל אל המיטה."
  },
  {
    type: 'story', pageNum: 5,
    image: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/18b3cc357_image55.png',
    text: "לאט לאט, החדר החדש התמלא בצבעים ובדמיון של מאיה. עננת הבלבול, שצפתה מהצד, החלה להתכווץ. ככל שמאיה הוסיפה מעצמה לחדר, כך הענן נעשה קטן יותר ושקוף יותר, עד שלבסוף פשוט התאדה ונעלם. מאיה הביטה סביבה. זה היה חדר חדש, אבל עכשיו זה היה החדר שלה. היא חייכה חיוך גדול. ידעה שגם במקום חדש, יש לה כוח ליצור בית לעצמה."
  },
  { type: 'end' }
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })
};

export default function MayaStory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(null);
  const { lang, isRTL } = useLanguage();

  const PAGES = lang === 'he' ? PAGES_HE : PAGES_EN;

  const goNext = () => {
    if (currentPage < PAGES.length - 1) { setDirection(isRTL ? -1 : 1); setCurrentPage((p) => p + 1); }
  };
  const goPrev = () => {
    if (currentPage > 0) { setDirection(isRTL ? 1 : -1); setCurrentPage((p) => p - 1); }
  };
  const restart = () => { setDirection(-1); setCurrentPage(0); };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const swipeForward = isRTL ? diff < 0 : diff > 0;
      swipeForward ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  const page = PAGES[currentPage];

  const coverTitle = lang === 'he' ? 'הנסיכה מאיה\nועננת הבלבול' : 'Princess Maya and\nthe Cloud of Confusion';
  const startBtn = lang === 'he' ? 'התחילי ›' : 'Start ›';
  const endTitle = lang === 'he' ? 'סוף' : 'The End';
  const readAgain = lang === 'he' ? 'קראי שוב' : 'Read Again';
  const pageLabel = lang === 'he' ? 'עמוד' : 'Page';
  const prevLabel = lang === 'he' ? 'הקודם' : 'Previous';
  const nextLabel = lang === 'he' ? 'הבא' : 'Next';
  const homeLabel = lang === 'he' ? 'בית' : 'Home';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col items-center justify-center py-6 px-2"
      style={{ background: 'linear-gradient(135deg, #fdf3e3 0%, #f5e6cc 100%)' }}>
      <div className="w-full max-w-5xl">

        {/* Book */}
        <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff8ed' }}
          onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}>

              {/* COVER */}
              {page.type === 'cover' &&
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[500px]"
                  style={{ background: 'linear-gradient(135deg, #c07028 0%, #8b4500 100%)' }}>
                  <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight whitespace-pre-line"
                    style={{ color: '#fde68a', textShadow: '2px 2px 8px rgba(0,0,0,0.5)', fontFamily: 'Georgia, serif' }}>
                    {coverTitle}
                  </h1>
                  <button onClick={goNext}
                    className="px-8 py-2 rounded-full border border-amber-300 text-amber-200 text-sm hover:bg-amber-800/40 transition-colors">
                    {startBtn}
                  </button>
                </div>
              }

              {/* STORY PAGE */}
              {page.type === 'story' &&
                <div className="flex flex-col md:flex-row min-h-[500px]">
                  {/* Image */}
                  <div className="md:w-1/2 w-full overflow-hidden flex-shrink-0" style={{ minHeight: '300px' }}>
                    <img src={page.image} alt={`${pageLabel} ${page.pageNum}`}
                      className="w-full h-full object-cover" style={{ minHeight: '300px' }} />
                  </div>
                  {/* Text */}
                  <div className="md:w-1/2 w-full p-6 md:p-10 flex flex-col justify-center">
                    <p className="text-xs text-amber-600 font-semibold tracking-wide mb-4">{pageLabel} {page.pageNum}</p>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed"
                      style={{ fontFamily: 'Georgia, serif' }}>
                      {page.text}
                    </p>
                  </div>
                </div>
              }

              {/* END */}
              {page.type === 'end' &&
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-8"
                  style={{ background: 'linear-gradient(135deg, #1a5c38 0%, #0d3b22 100%)' }}>
                  <div className="text-6xl mb-4">⭐</div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8"
                    style={{ color: '#fde68a', fontFamily: 'Georgia, serif', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                    {endTitle}
                  </h2>
                  <button onClick={restart}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-amber-400/60 text-amber-300 text-sm hover:bg-green-900/50 transition-colors">
                    <RotateCcw className="w-4 h-4" /> {readAgain}
                  </button>
                </div>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-start mt-3 px-1 mb-1">
          <Link to="/" className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 shadow text-slate-500 hover:bg-white transition-all text-sm">
            <Home className="w-4 h-4" /> {homeLabel}
          </Link>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <button onClick={goPrev} disabled={currentPage === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/80 shadow text-slate-600 hover:bg-white disabled:opacity-30 transition-all text-sm">
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />} {prevLabel}
          </button>

          <div className="flex gap-2 items-center">
            {PAGES.map((_, i) =>
              <button key={i}
                onClick={() => { setDirection(i > currentPage ? (isRTL ? -1 : 1) : (isRTL ? 1 : -1)); setCurrentPage(i); }}
                className={`h-2 rounded-full transition-all ${i === currentPage ? 'bg-amber-600 w-5' : 'bg-slate-300 w-2'}`} />
            )}
          </div>

          <button onClick={goNext} disabled={currentPage === PAGES.length - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/80 shadow text-slate-600 hover:bg-white disabled:opacity-30 transition-all text-sm">
            {nextLabel} {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}