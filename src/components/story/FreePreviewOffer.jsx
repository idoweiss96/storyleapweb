import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';

// Low-friction alternative to the primary purchase action on the recap screen:
// lets a guest request a free 2-page preview by email instead of buying right away.
export default function FreePreviewOffer({ previewState, onRequest, isHe }) {
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
      <p className="text-sm text-slate-600 mb-2">
        {isHe ? 'עדיין לא בטוחים? קבלו תצוגה מקדימה חינמית של 2 העמודים הראשונים במייל' : 'Not ready to buy yet? Get a free preview of the first 2 pages by email'}
      </p>
      <Button type="button" variant="outline" onClick={onRequest} disabled={previewState === 'sending'} className="rounded-xl border-slate-300">
        {previewState === 'sending' ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Mail className="w-4 h-4 ml-2" />}
        {isHe ? 'שלחו לי תצוגה מקדימה חינם' : 'Send me a free preview'}
      </Button>
      <p className="text-xs text-slate-400 mt-2">{isHe ? 'התצוגה המקדימה תגיע במייל תוך מספר שעות' : 'Arrives by email within a few hours'}</p>
      {previewState === 'error' && (
        <p className="text-xs text-red-500 mt-2">{isHe ? 'שגיאה בשליחת הבקשה, נסו שוב' : 'Error sending your request, please try again'}</p>
      )}
    </div>
  );
}