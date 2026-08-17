import React, { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SaveScreen({ childName, email, lang, storyId, onContinue }) {
  const isEn = lang === 'en';
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSaveForLater = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      await base44.functions.invoke('sendKitaAlefResumeLink', { story_id: storyId, email, lang });
    } catch (_) {
      // Don't block the guest on email delivery failure
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  const handleGoogleSignIn = () => {
    base44.auth.redirectToLogin(`/KitaAlefStory?story_id=${storyId}&lang=${lang}`);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center rounded-3xl px-4 py-6" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <div className="max-w-md w-full rounded-3xl border bg-white p-6 text-center space-y-5" style={{ borderColor: '#F0E8F5', boxShadow: '0 4px 20px rgba(255,111,181,0.08), 0 2px 10px rgba(79,195,232,0.06)' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1A1A6E' }}>
          {isEn ? `We saved everything you told us about ${childName}` : `שמרנו את כל מה שסיפרתם לנו על ${childName}`}
        </h2>
        <p className="text-sm text-slate-500">
          {isEn ? 'Want to save this and continue later, or continue now?' : 'רוצים לשמור את זה ולהמשיך מאוחר יותר, או להמשיך עכשיו?'}
        </p>

        <button
          onClick={onContinue}
          className="w-full px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
        >
          {isEn ? 'Continue now' : 'המשך עכשיו'}
        </button>

        {sent ? (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            {isEn ? `We sent a link to ${email}` : `שלחנו קישור למייל ${email}`}
          </p>
        ) : (
          <button
            onClick={handleSaveForLater}
            disabled={sending}
            className="w-full px-6 py-3 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
            style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {isEn ? 'Save & remind me' : 'שמור ותזכיר לי'}
          </button>
        )}

        <button onClick={handleGoogleSignIn} className="text-xs text-slate-400 underline hover:text-slate-600 block mx-auto">
          {isEn ? 'or sign in with Google to save' : 'או התחברו עם Google כדי לשמור'}
        </button>
      </div>
    </div>
  );
}