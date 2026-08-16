import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useNavPath } from '@/lib/useNavPath';
import { createPageUrl } from '../../utils';
import { GALLERY_TIPS } from '@/lib/galleryTipsContent';
import GalleryTipPopup from './GalleryTipPopup';

const GALLERY_ITEMS = [
  { id: 'kindergarten', dedicated: 'KitaAlef', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/ee44ec4b5_image4.png', he: 'התחלת גן', en: 'Starting kindergarten' },
  { id: 'moving', dedicated: 'MovingHouse', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/aacd843f4_image52.png', he: 'התמודדות עם מעבר דירה', en: 'Coping with a big move' },
  { id: 'friends', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/dd316698e_image51.png', he: 'הכרת חברים חדשים', en: 'Making new friends' },
  { id: 'bedtime', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/0e345ce30_image5.png', he: 'רגשות גדולים לפני השינה', en: 'Big feelings before bedtime' },
  { id: 'goodbye', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/e38dd71a8_image54.png', he: 'פרידה מדי בוקר בגן', en: 'Saying goodbye each morning' },
  { id: 'sibling', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/ad2824198_image53.png', he: 'קבלת אח או אחות חדש/ה', en: 'Welcoming a new sibling' },
  { id: 'dark', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/83af1df79_image1.png', he: 'התמודדות עם פחד מהחושך', en: 'Facing a fear of the dark' },
  { id: 'hug', src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/465dd64af_image3.png', he: 'חיבוק מרגיע אחרי יום קשה', en: 'A comforting hug after a hard day' },
];

export default function StoryGallery() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const navPath = useNavPath();
  const isHe = lang === 'he';
  const [activeTipId, setActiveTipId] = useState(null);

  const handleItemClick = (item) => {
    if (item.dedicated === 'KitaAlef') { navigate(navPath('KitaAlef')); return; }
    if (item.dedicated === 'MovingHouse') { navigate('/MovingHouse'); return; }
    setActiveTipId(item.id);
  };

  const handleTipContinue = () => {
    const tip = GALLERY_TIPS[activeTipId];
    setActiveTipId(null);
    navigate(`${createPageUrl('CreateStory')}?from=${tip.chip}`);
  };

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{t('gallery_title')}</h2>
        <p className="text-slate-500">{t('gallery_subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GALLERY_ITEMS.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
            onClick={() => handleItemClick(item)}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
            <div className="aspect-square overflow-hidden">
              <img src={item.src} alt={isHe ? item.he : item.en} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="text-xs text-slate-600 text-center py-2 px-2 leading-snug">
              {isHe ? item.he : item.en}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeTipId && (
          <GalleryTipPopup
            tip={GALLERY_TIPS[activeTipId]}
            onClose={() => setActiveTipId(null)}
            onContinue={handleTipContinue}
          />
        )}
      </AnimatePresence>
    </section>
  );
}