import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Send, Loader2, VolumeX } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPetTalkController } from './petTalkController';
import { mountDog3D, webglAvailable } from './petTalkDog3D';
import PetTalk from './PetTalk';

// פוצי בתלת-ממד: לוחצים עליה (או על המיקרופון) ומדברים, או כותבים לה בתיבה למטה.
// בלי WebGL (מכשיר ישן) — הדמות הדו-ממדית, עם אותה פונקציה בשרת.
//   <PetTalk3D />   <PetTalk3D childGender="f" />

async function talk(payload) {
  try {
    const res = await base44.functions.invoke('petTalk', payload);
    return res.data;
  } catch (e) {
    // שגיאת HTTP מהפונקציה עדיין מחזירה { state: 'error', error }
    return e?.response?.data || { state: 'error', error: String(e?.message || e) };
  }
}

const MIC = {
  idle: { label: 'דברו איתי', Icon: Mic, cls: 'bg-violet-500 hover:bg-violet-600 shadow-violet-300' },
  listening: { label: 'סיימתי', Icon: Square, cls: 'bg-rose-500 hover:bg-rose-600 shadow-rose-300' },
  thinking: { label: 'חושבת...', Icon: Loader2, cls: 'bg-violet-300 cursor-default shadow-none' },
  speaking: { label: 'שקט', Icon: VolumeX, cls: 'bg-amber-500 hover:bg-amber-600 shadow-amber-300' },
};

export default function PetTalk3D({ name = 'פוצי', childGender = 'u', className = '' }) {
  const stageRef = useRef(null);
  const ctrlRef = useRef(null);
  const [has3d] = useState(() => typeof window !== 'undefined' && webglAvailable());
  const [ui, setUi] = useState({ state: 'idle', reply: '', childText: '', note: '' });
  const [text, setText] = useState('');

  useEffect(() => {
    if (!has3d || !stageRef.current) return undefined;
    const ctrl = createPetTalkController({ talk, childGender, onChange: setUi });
    ctrlRef.current = ctrl;
    const dog = mountDog3D(stageRef.current, { controller: ctrl, onPress: () => ctrl.press() });
    return () => {
      dog.destroy();
      ctrl.destroy();
      ctrlRef.current = null;
    };
  }, [has3d, childGender]);

  if (!has3d) return <PetTalk name={name} childGender={childGender} className={className} />;

  const busy = ui.state === 'thinking';
  const mic = MIC[ui.state] || MIC.idle;
  const status = ui.note || (ui.state === 'listening' ? 'אני מקשיבה...' : ui.state === 'thinking' ? 'רגע, אני חושבת...' : '');

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    const sent = await ctrlRef.current?.sendText(text);
    if (sent) setText('');
  };

  return (
    <div dir="rtl" className={`w-full max-w-xl mx-auto flex flex-col items-center ${className}`} data-testid="pet-talk-3d">
      {/* בועת הדיבור */}
      <div className="w-full px-2 min-h-[5.5rem] flex flex-col items-center justify-end gap-1">
        {ui.childText && (
          <p className="text-sm text-stone-500" data-testid="pet-child-text">
            {ui.childText}
          </p>
        )}
        <div
          aria-live="polite"
          data-testid="pet-bubble"
          className="relative max-w-full rounded-3xl bg-white px-5 py-3 text-center text-lg sm:text-xl leading-relaxed text-stone-800 shadow-md after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white after:border-b-0"
        >
          {ui.reply || `היי! אני ${name}. לחצו עליי ודברו איתי, או כתבו לי למטה`}
        </div>
      </div>

      {/* הכלבה */}
      <div
        ref={stageRef}
        role="button"
        tabIndex={0}
        aria-label={`דברו עם ${name}`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), ctrlRef.current?.press())}
        className="relative w-full h-[46vh] min-h-[300px] max-h-[520px] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 rounded-3xl"
        data-testid="pet-stage"
      />

      <p className="min-h-[1.5rem] text-sm text-stone-500" data-testid="pet-status">{status}</p>

      {/* מיקרופון */}
      <button
        type="button"
        onClick={() => ctrlRef.current?.press()}
        disabled={busy}
        data-testid="pet-mic"
        className={`mt-1 flex items-center gap-2 rounded-full px-8 py-4 text-xl font-bold text-white shadow-lg transition active:scale-95 ${mic.cls}`}
      >
        <mic.Icon className={`h-6 w-6 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
        {mic.label}
      </button>

      {/* כתיבה */}
      <form onSubmit={submit} className="mt-5 flex w-full items-center gap-2 px-2" data-testid="pet-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
          dir="rtl"
          placeholder={`כתבו ל${name}...`}
          aria-label={`הודעה ל${name}`}
          data-testid="pet-input"
          className="min-h-[52px] flex-1 rounded-full border-2 border-violet-200 bg-white px-5 text-lg text-stone-800 placeholder:text-stone-400 focus:border-violet-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          aria-label="שליחה"
          data-testid="pet-send"
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-violet-500 text-white shadow-md transition hover:bg-violet-600 disabled:bg-violet-200 disabled:shadow-none"
        >
          <Send className="h-5 w-5 -scale-x-100" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
