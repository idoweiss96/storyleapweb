import React, { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { mountPetTalk } from './petTalkWidget';

// הדמות המדברת כרכיב React. אפשר לשים אותה בכל דף:
//   <PetTalk />                 ← ברירת מחדל: הפונקציה petTalk ב-Base44
//   <PetTalk name="פוצי" childGender="f" />   ← אם ידוע (אחרת מוסק מהדיבור)
export default function PetTalk({ name = 'פוצי', showText = true, childGender = 'u', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const widget = mountPetTalk(ref.current, {
      name,
      showText,
      childGender,
      talk: async (payload) => {
        try {
          const res = await base44.functions.invoke('petTalk', payload);
          return res.data;
        } catch (e) {
          // שגיאת HTTP מהפונקציה עדיין מחזירה { state: 'error', error }
          return e?.response?.data || { state: 'error', error: String(e?.message || e) };
        }
      },
    });
    return () => widget.destroy();
  }, [name, showText, childGender]);

  return <div ref={ref} className={className} />;
}
