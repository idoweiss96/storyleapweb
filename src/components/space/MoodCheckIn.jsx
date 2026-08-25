import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { MOODS, getMood, todayKey, dayKeyOffset, moodStreak } from '@/lib/childSpace';

/**
 * Today's check-in, plus the streak it feeds.
 *
 * One entry per space per day: picking a second time updates the existing
 * row rather than adding another, so the streak counts days and not clicks.
 */
export default function MoodCheckIn({ spaceId, space, moods, lang = 'he', onChanged }) {
  const he = lang === 'he';
  const [isSaving, setIsSaving] = useState(false);

  const today = todayKey();
  const todayEntry = moods.find((m) => m.date === today);
  const streak = moodStreak(moods);

  // Last seven days, oldest first, so the trail reads left-to-right in both directions.
  const trail = Array.from({ length: 7 }, (_, i) => {
    const key = dayKeyOffset(-(6 - i));
    return { key, entry: moods.find((m) => m.date === key) };
  });

  const handlePick = async (value) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (todayEntry) {
        await base44.entities.MoodEntry.update(todayEntry.id, { mood: value });
      } else {
        await base44.entities.MoodEntry.create({
          child_space_id: spaceId,
          date: today,
          mood: value,
        });
      }
      await onChanged?.();
    } catch (e) {
      console.error('[MoodCheckIn] save failed:', e);
      toast.error(he ? 'לא הצלחנו לשמור' : "Couldn't save it");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Streak */}
      <Card className="border-0 shadow-lg shadow-violet-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Flag className="w-4 h-4 text-violet-400" />
              {he ? 'הרצף שלנו' : 'Our streak'}
            </h2>
            <span className="text-sm text-slate-400">
              {streak > 0
                ? (he ? `רצף של ${streak} ימים` : `${streak} day streak`)
                : (he ? 'מתחילים היום' : 'Starts today')}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {trail.map(({ key, entry }, i) => {
              const mood = entry ? getMood(entry.mood) : null;
              const isToday = key === today;
              return (
                <React.Fragment key={key}>
                  {i > 0 && (
                    <span className={`flex-1 h-0.5 rounded-full ${entry ? 'bg-violet-300' : 'bg-slate-100'}`} />
                  )}
                  <span
                    title={key}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-none transition-all
                      ${mood ? 'bg-gradient-to-br from-violet-100 to-pink-100' : 'bg-slate-50'}
                      ${isToday ? 'ring-2 ring-violet-300 ring-offset-1' : ''}`}
                  >
                    {mood ? mood.emoji : <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            {he
              ? 'כל צ׳ק-אין מוסיף יום לרצף. שבעת הימים האחרונים מוצגים כאן.'
              : 'Each check-in adds a day. The last seven days are shown here.'}
          </p>
        </CardContent>
      </Card>

      {/* Today's check-in */}
      <Card className="border-0 shadow-lg shadow-pink-50">
        <CardContent className="p-5">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
            {he ? `איך ${space.name} מרגיש/ה היום?` : `How is ${space.name} feeling today?`}
          </h2>

          <div className="flex items-center justify-between gap-1">
            {MOODS.map((mood) => {
              const isPicked = todayEntry?.mood === mood.value;
              return (
                <button
                  key={mood.value}
                  type="button"
                  disabled={isSaving}
                  onClick={() => handlePick(mood.value)}
                  aria-pressed={isPicked}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border transition-all disabled:opacity-60
                    ${isPicked ? `${mood.color} font-medium scale-105` : 'border-transparent hover:bg-slate-50'}`}
                >
                  <span className="text-2xl leading-none">{mood.emoji}</span>
                  <span className="text-[11px] text-center leading-tight">{he ? mood.he : mood.en}</span>
                </button>
              );
            })}
          </div>

          {todayEntry && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              {he ? 'נשמר להיום. אפשר לשנות בכל רגע.' : 'Saved for today. You can change it anytime.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
