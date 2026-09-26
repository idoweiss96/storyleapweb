import React from 'react';
import PetTalk3D from '@/components/pet-talk/PetTalk3D';

// /pet-talk — פוצי, הכלבלבה התלת-ממדית. מסך מלא, בלי התפריט של האתר, כדי שילד לא יברח ממנו בלחיצה.
export default function PetTalkPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8"
      style={{ background: 'linear-gradient(180deg, #FFF8EF 0%, #F3ECFF 100%)' }}
    >
      <h1 className="mb-2 text-2xl font-extrabold text-violet-700">פוצי</h1>
      <PetTalk3D />
      {/* R19: מוצר לילדים עם AI — בליווי מבוגר, ובכנות לגבי מה שהדמות היא */}
      <p className="mt-6 max-w-md text-center text-xs leading-relaxed text-stone-400">
        פוצי היא דמות מצוירת שעונה בעזרת מחשב, במילים פשוטות שילדים מכירים. מומלץ לשוחח איתה בליווי מבוגר.
      </p>
    </div>
  );
}
