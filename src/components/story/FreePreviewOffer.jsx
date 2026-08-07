import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';

// Low-friction alternative to the primary purchase action on the recap screen:
// lets a guest request a free 2-page preview by email instead of buying right away.
export default function FreePreviewOffer({ previewState, onRequest, isHe, childName }) {
  if (previewState === 'sent') {
    return (
      <div className="mt-2 mb-1 p-4 bg-green-50 rounded-xl border border-green-200 text-center text-sm text-green-700">
        {isHe ? '✅ בקשתכם התקבלה! תקבלו מייל עם תצוגה מקדימה חינמית תוך מספר שעות.' : "✅ Got it! You'll receive an email with your free preview within a few hours."}
      </div>
    );
  }

  if (previewState === 'already_used') {
    return (
      <div className="mt-2 mb-1 p-4 bg-amber-50 rounded-xl border border-amber-200 text-center text-sm text-amber-700">
        {isHe
          ? 'כבר קיבלתם תצוגה מקדימה חינמית עם המייל הזה. בדקו את תיבת הדואר, או המשיכו לרכישת הסיפור המלא למעלה!'
          : "You've already used your free preview with this email. Check your inbox, or continue to purchase the full story above!"}
      </div>
    );
  }

  return (
    <div className="mt-2 mb-1 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
      <p className="text-sm font-semibold text-slate-700 mb-1">
        {isHe ? '✨ רוצים הצצה קטנה קודם?' : '✨ Want a sneak peek first?'}
      </p>
      <p className="text-sm text-slate-600 mb-3">
        {isHe
          ? `קבלו הצצה חינמית לשני העמודים הראשונים של הסיפור של ${childName || 'הילד/ה'}, יגיע למייל תוך כמה שעות.`
          : `Get a free peek at ${childName || "your child"}'s first two pages, delivered to your inbox within a few hours.`}
      </p>
      <Button type="button" variant="outline" onClick={onRequest} disabled={previewState === 'sending'} className="rounded-xl border-slate-300">
        {previewState === 'sending' ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Mail className="w-4 h-4 ml-2" />}
        {isHe ? 'שלחו לי הצצה חינמית' : 'Send me a free preview'}
      </Button>
      {previewState === 'error' && (
        <p className="text-xs text-red-500 mt-2">{isHe ? 'שגיאה בשליחת הבקשה, נסו שוב' : 'Error sending your request, please try again'}</p>
      )}
    </div>
  );
}