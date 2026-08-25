import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AVATARS, THEMES, getTheme } from '@/lib/childSpace';

const THEME_KEYS = Object.keys(THEMES);

const THEME_LABELS = {
  violet:  { he: 'סגול',  en: 'Violet' },
  pink:    { he: 'ורוד',  en: 'Pink' },
  sky:     { he: 'תכלת',  en: 'Sky' },
  amber:   { he: 'כתום',  en: 'Amber' },
  emerald: { he: 'ירוק',  en: 'Green' },
};

/**
 * Create or edit one child space. `space` null means create.
 * onSaved receives the saved record so the caller can select it.
 */
export default function SpaceDialog({ open, onOpenChange, space, lang = 'he', onSaved }) {
  const he = lang === 'he';
  const isEdit = !!space;

  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState(AVATARS[0].id);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [colorTheme, setColorTheme] = useState('violet');
  const [tagline, setTagline] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(space?.name || '');
    setAvatarId(space?.avatar_id || AVATARS[0].id);
    setBirthDate(space?.birth_date || '');
    setGender(space?.gender || '');
    setColorTheme(space?.color_theme || 'violet');
    setTagline(space?.tagline || '');
  }, [open, space]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(he ? 'צריך למלא שם' : 'A name is required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: trimmed,
        avatar_id: avatarId,
        birth_date: birthDate || undefined,
        gender: gender || undefined,
        color_theme: colorTheme,
        tagline: tagline.trim() || undefined,
      };
      const saved = isEdit
        ? await base44.entities.ChildSpace.update(space.id, payload)
        : await base44.entities.ChildSpace.create(payload);
      toast.success(isEdit
        ? (he ? 'המרחב עודכן' : 'Space updated')
        : (he ? `המרחב של ${trimmed} נוצר` : `${trimmed}'s space is ready`));
      // `update` can resolve without echoing the record back; fall back to the
      // values we just sent so the caller always gets a usable object.
      onSaved?.(saved?.id ? saved : { ...space, ...payload, id: space?.id });
      onOpenChange(false);
    } catch (e) {
      console.error('[SpaceDialog] save failed:', e);
      toast.error(he ? 'לא הצלחנו לשמור. נסו שוב' : "Couldn't save. Please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {isEdit
              ? (he ? 'עריכת המרחב' : 'Edit space')
              : (he ? 'מרחב חדש לילד/ה' : 'A new space for your child')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="space-name">{he ? 'איך קוראים לילד/ה?' : "What's your child's name?"}</Label>
            <Input
              id="space-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={he ? 'נועם' : 'Noam'}
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{he ? 'בחרו דמות' : 'Pick a character'}</Label>
            <div className="grid grid-cols-8 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatarId(a.id)}
                  aria-label={a.id}
                  aria-pressed={avatarId === a.id}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-xl transition-all
                    ${avatarId === a.id ? 'ring-2 ring-offset-2 ring-slate-700 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{he ? 'צבע המרחב' : 'Space colour'}</Label>
            <div className="flex flex-wrap gap-2">
              {THEME_KEYS.map((key) => {
                const theme = getTheme(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColorTheme(key)}
                    aria-pressed={colorTheme === key}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm
                      ${colorTheme === key ? `${theme.soft} ${theme.text} ${theme.border} font-medium` : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${theme.dot}`} />
                    {THEME_LABELS[key][he ? 'he' : 'en']}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="space-birth">{he ? 'תאריך לידה' : 'Birth date'}</Label>
              <Input
                id="space-birth"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-xl"
              />
              <span className="text-xs text-slate-400">{he ? 'אופציונלי, לחישוב הגיל' : 'Optional, used for age'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{he ? 'מגדר' : 'Gender'}</Label>
              <div className="flex gap-1.5">
                {[
                  { value: 'girl',  he: 'בת',   en: 'Girl' },
                  { value: 'boy',   he: 'בן',   en: 'Boy' },
                  { value: 'other', he: 'אחר',  en: 'Other' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGender(gender === opt.value ? '' : opt.value)}
                    aria-pressed={gender === opt.value}
                    className={`flex-1 px-2 py-2 rounded-xl border text-sm transition-all
                      ${gender === opt.value ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {he ? opt.he : opt.en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="space-tagline">{he ? 'משפט אישי' : 'A personal line'}</Label>
            <Input
              id="space-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={he ? 'כל יום צעד קטן, כל סיפור כוח גדול' : 'A small step each day'}
              className="rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? (he ? 'שמירה' : 'Save') : (he ? 'יצירת המרחב' : 'Create space'))}
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl text-slate-500">
              {he ? 'ביטול' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
