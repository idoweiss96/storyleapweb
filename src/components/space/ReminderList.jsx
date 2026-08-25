import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Plus, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { todayKey } from '@/lib/childSpace';

const ICONS = ['🎒', '📖', '🌙', '🦷', '🍎', '🚿', '👕', '⭐', '🧸', '🎨'];

const REPEATS = [
  { value: 'daily',    he: 'כל יום',     en: 'Daily' },
  { value: 'weekdays', he: 'ימי חול',    en: 'Weekdays' },
  { value: 'weekly',   he: 'פעם בשבוע',  en: 'Weekly' },
  { value: 'once',     he: 'חד־פעמי',    en: 'Once' },
];

export default function ReminderList({ spaceId, reminders, lang = 'he', onChanged }) {
  const he = lang === 'he';
  const today = todayKey();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [repeat, setRepeat] = useState('daily');
  const [isSaving, setIsSaving] = useState(false);

  const active = reminders
    .filter((r) => r.is_active !== false)
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

  const resetForm = () => {
    setTitle('');
    setTime('');
    setIcon(ICONS[0]);
    setRepeat('daily');
  };

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error(he ? 'צריך למלא מה צריך לעשות' : 'Please describe the reminder');
      return;
    }
    setIsSaving(true);
    try {
      await base44.entities.Reminder.create({
        child_space_id: spaceId,
        title: trimmed,
        time: time || undefined,
        icon,
        repeat,
        done_dates: [],
        is_active: true,
      });
      resetForm();
      setDialogOpen(false);
      await onChanged?.();
    } catch (e) {
      console.error('[ReminderList] create failed:', e);
      toast.error(he ? 'לא הצלחנו לשמור' : "Couldn't save it");
    } finally {
      setIsSaving(false);
    }
  };

  /** Toggling writes the whole array back — the list is a handful of dates. */
  const handleToggleDone = async (reminder) => {
    const done = reminder.done_dates || [];
    const next = done.includes(today) ? done.filter((d) => d !== today) : [...done, today];
    try {
      await base44.entities.Reminder.update(reminder.id, { done_dates: next });
      await onChanged?.();
    } catch (e) {
      console.error('[ReminderList] toggle failed:', e);
      toast.error(he ? 'לא הצלחנו לעדכן' : "Couldn't update it");
    }
  };

  const handleDelete = async (reminder) => {
    try {
      await base44.entities.Reminder.delete(reminder.id);
      await onChanged?.();
    } catch (e) {
      console.error('[ReminderList] delete failed:', e);
      toast.error(he ? 'לא הצלחנו למחוק' : "Couldn't delete it");
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg shadow-amber-50">
        <CardContent className="p-5">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            {he ? 'התזכורות שלנו' : 'Our reminders'}
          </h2>

          {active.length === 0 ? (
            <p className="text-sm text-slate-400 py-3">
              {he ? 'עוד אין תזכורות. הוסיפו את הראשונה.' : 'No reminders yet. Add the first one.'}
            </p>
          ) : (
            <ul className="flex flex-col gap-1 mb-2">
              {active.map((reminder) => {
                const isDone = (reminder.done_dates || []).includes(today);
                return (
                  <li key={reminder.id} className="group flex items-center gap-3 py-2">
                    <span className="text-lg leading-none">{reminder.icon || '⭐'}</span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {reminder.title}
                      </span>
                      {reminder.time && (
                        <span className="block text-xs text-slate-400 tabular-nums">{reminder.time}</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleDone(reminder)}
                      aria-label={he ? 'סימון כבוצע' : 'Mark as done'}
                      aria-pressed={isDone}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-none
                        ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-emerald-400'}`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(reminder)}
                      aria-label={he ? 'מחיקה' : 'Delete'}
                      className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex-none"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-300 hover:text-rose-400" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="w-full text-xs text-amber-600 hover:bg-amber-50 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5 me-1" />
            {he ? 'הוסף תזכורת חדשה' : 'Add a reminder'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {he ? 'תזכורת חדשה' : 'New reminder'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reminder-title">{he ? 'מה צריך לעשות?' : 'What needs doing?'}</Label>
              <Input
                id="reminder-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={he ? 'להכין יחד את התיק לבוקר' : 'Pack the school bag together'}
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{he ? 'אייקון' : 'Icon'}</Label>
              <div className="flex flex-wrap gap-1.5">
                {ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    aria-pressed={icon === emoji}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all
                      ${icon === emoji ? 'bg-amber-100 ring-2 ring-amber-300' : 'bg-slate-50 hover:bg-slate-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reminder-time">{he ? 'שעה' : 'Time'}</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{he ? 'תדירות' : 'Repeats'}</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {REPEATS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRepeat(opt.value)}
                      aria-pressed={repeat === opt.value}
                      className={`px-2 py-1.5 rounded-lg border text-xs transition-all
                        ${repeat === opt.value ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {he ? opt.he : opt.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleCreate}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl"
              >
                {he ? 'הוספה' : 'Add'}
              </Button>
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl text-slate-500">
                {he ? 'ביטול' : 'Cancel'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
