import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const IMAGES = [
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/203904ade_image.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e36f50cc6_image1.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/12d35ea63_image2.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/31f3e5033_image3.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/6f2d287ae_image4.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/af073b167_image5.png',
  'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/d4e03c503_image6.png',
];

const PAGES = [
  { type: 'cover' },
  {
    type: 'story', pageNum: 1, image: IMAGES[1],
    text: "Inside a beautiful palace lived Princess Maya. She had a wonderful room, full of colors, glitter, and everything needed for art. Maya loved to draw, cut, and paste very much. Her best friend, the fairy doll Tinkerbell, always sat beside her and watched the magic. In this room, everything was familiar and pleasant, and Maya's heart was full of peace.",
  },
  {
    type: 'story', pageNum: 2, image: IMAGES[2],
    text: "One day, a gray and confused cloud arrived at the palace. It was 'The Cloud of Confusion'. It quietly entered and wrapped all of Maya's things in a fog. Suddenly, the familiar room disappeared, and she found herself in a new and unfamiliar room in a different palace. Nothing looked the same. Maya felt very small and lost. She wanted to be held like a baby and couldn't find her words.",
  },
  {
    type: 'story', pageNum: 3, image: IMAGES[3],
    text: "The King and Queen, Maya's father and mother, entered the room and found her with big, sad eyes. Mom bent down and hugged her tightly. 'Oh, our dear Maya,' she said softly. 'We see that the Cloud of Confusion has arrived. It's completely okay to feel a little lost when everything is new and different. It's not your fault.' Dad stroked her hair. 'All your feelings are allowed. We are here for you.'",
  },
  {
    type: 'story', pageNum: 4, image: IMAGES[4],
    text: "'I have an idea,' said Dad. 'We have the power to add color and joy to this new place. You are the best artist in the whole kingdom!' Mom brought large sheets of paper and all the boxes of colors. 'Let's re-draw this room, just the way you want it to be!' she suggested. Maya, with the help of Tinkerbell who whispered magical ideas to her, began to draw. She drew flowers on the walls, stars on the ceiling, and a glittery path leading to the bed.",
  },
  {
    type: 'story', pageNum: 5, image: IMAGES[5],
    text: "Slowly, the new room filled with Maya's colors and imagination. The Cloud of Confusion, which was watching from the side, began to shrink. The more Maya added of herself to the room, the smaller and more transparent the cloud became, until finally, it just evaporated and disappeared. Maya looked around. It was a new room, but now it was her room. She smiled a big smile. She knew that even in a new place, she had the power to create a home for herself.",
  },
  { type: 'end' },
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function MayaStory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (currentPage < PAGES.length - 1) { setDirection(1); setCurrentPage(p => p + 1); }
  };
  const goPrev = () => {
    if (currentPage > 0) { setDirection(-1); setCurrentPage(p => p - 1); }
  };
  const restart = () => { setDirection(-1); setCurrentPage(0); };

  const page = PAGES[currentPage];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-2"
      style={{ background: 'linear-gradient(135deg, #fdf3e3 0%, #f5e6cc 100%)' }}>
      <div className="w-full max-w-4xl">

        {/* Book */}
        <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#fff8ed' }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            >
              {/* COVER */}
              {page.type === 'cover' && (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[500px]"
                  style={{ background: 'linear-gradient(135deg, #c07028 0%, #8b4500 100%)' }}>
                  <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight"
                    style={{ color: '#fde68a', textShadow: '2px 2px 8px rgba(0,0,0,0.5)', fontFamily: 'Georgia, serif' }}>
                    Princess Maya and<br />the Cloud of Confusion
                  </h1>
                  <img src={IMAGES[0]} alt="Maya" className="w-52 md:w-64 object-contain drop-shadow-2xl mb-8" />
                  <button onClick={goNext}
                    className="px-8 py-2 rounded-full border border-amber-300 text-amber-200 text-sm hover:bg-amber-800/40 transition-colors">
                    Start ›
                  </button>
                </div>
              )}

              {/* STORY PAGE */}
              {page.type === 'story' && (
                <div className="flex flex-col min-h-[500px]">
                  {/* Image - full width, fixed height */}
                  <div className="w-full overflow-hidden" style={{ height: '280px' }}>
                    <img src={page.image} alt={`Page ${page.pageNum}`}
                      className="w-full h-full object-cover object-top" />
                  </div>
                  {/* Text below image */}
                  <div className="p-6 md:p-8 flex-1">
                    <p className="text-xs text-amber-600 font-semibold tracking-wide mb-3">Page {page.pageNum}</p>
                    <p className="text-slate-700 text-base md:text-lg leading-relaxed"
                      style={{ fontFamily: 'Georgia, serif' }}>
                      {page.text}
                    </p>
                  </div>
                </div>
              )}

              {/* END */}
              {page.type === 'end' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-8"
                  style={{ background: 'linear-gradient(135deg, #1a5c38 0%, #0d3b22 100%)' }}>
                  <div className="text-6xl mb-4">⭐</div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8"
                    style={{ color: '#fde68a', fontFamily: 'Georgia, serif', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                    The End
                  </h2>
                  <button onClick={restart}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-amber-400/60 text-amber-300 text-sm hover:bg-green-900/50 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Read Again
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 px-1">
          <button onClick={goPrev} disabled={currentPage === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/80 shadow text-slate-600 hover:bg-white disabled:opacity-30 transition-all text-sm">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-2 items-center">
            {PAGES.map((_, i) => (
              <button key={i}
                onClick={() => { setDirection(i > currentPage ? 1 : -1); setCurrentPage(i); }}
                className={`h-2 rounded-full transition-all ${i === currentPage ? 'bg-amber-600 w-5' : 'bg-slate-300 w-2'}`} />
            ))}
          </div>

          <button onClick={goNext} disabled={currentPage === PAGES.length - 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/80 shadow text-slate-600 hover:bg-white disabled:opacity-30 transition-all text-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}