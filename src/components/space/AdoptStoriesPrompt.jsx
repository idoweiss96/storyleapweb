import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FolderPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { AVATARS } from '@/lib/childSpace';

/**
 * Stories created before spaces existed have no child_space_id. Rather than
 * guessing silently, group them by the child's name and let the parent
 * confirm — they see exactly how many stories move before anything changes.
 */
export default function AdoptStoriesPrompt({ stories, spaces, lang = 'he', onAdopted, onDismiss }) {
  const he = lang === 'he';
  const [busyName, setBusyName] = useState(null);

  // Group unassigned stories by child name.
  const groups = stories.reduce((acc, story) => {
    const key = (story.child_name || '').trim();
    if (!key) return acc;
    (acc[key] = acc[key] || []).push(story);
    return acc;
  }, {});

  const names = Object.keys(groups).filter((name) => !spaces.some((s) => s.name === name));
  if (names.length === 0) return null;

  const handleAdopt = async (name) => {
    setBusyName(name);
    const group = groups[name];
    try {
      const space = await base44.entities.ChildSpace.create({
        name,
        // A stable-but-varied character per child, so two spaces don't look alike.
        avatar_id: AVATARS[name.length % AVATARS.length].id,
        color_theme: 'violet',
      });

      // The merged list holds two different entities. `source` says which.
      let moved = 0;
      for (const story of group) {
        const entity = story.source === 'kitaalef'
          ? base44.entities.KitaAlefStory
          : base44.entities.Story;
        try {
          await entity.update(story.id, { child_space_id: space.id });
          moved += 1;
        } catch (err) {
          console.error('[AdoptStories] could not attach story', story.id, err);
        }
      }

      if (moved < group.length) {
        toast.warning(he
          ? `שויכו ${moved} מתוך ${group.length} סיפורים. השאר נשארו ב"הסיפורים שלי"`
          : `Moved ${moved} of ${group.length}. The rest stayed in My Stories`);
      } else {
        toast.success(he ? `המרחב של ${name} מוכן` : `${name}'s space is ready`);
      }
      await onAdopted?.(space);
    } catch (e) {
      console.error('[AdoptStories] create failed:', e);
      toast.error(he ? 'לא הצלחנו ליצור את המרחב' : "Couldn't create the space");
    } finally {
      setBusyName(null);
    }
  };

  return (
    <Card className="border-0 shadow-lg shadow-amber-50 bg-gradient-to-br from-amber-50/70 to-white mb-6">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-500" />
              {he ? 'מצאנו סיפורים קיימים' : 'We found existing stories'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {he
                ? 'אפשר לאסוף אותם למרחב לפי שם הילד/ה. שום דבר לא נמחק — הסיפורים רק מקבלים בית.'
                : 'You can collect them into a space by name. Nothing is deleted — the stories just get a home.'}
            </p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={he ? 'סגירה' : 'Dismiss'}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/70 flex-none"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {names.map((name) => (
            <Button
              key={name}
              variant="outline"
              size="sm"
              disabled={busyName !== null}
              onClick={() => handleAdopt(name)}
              className="rounded-xl border-amber-200 bg-white hover:bg-amber-50 text-slate-700"
            >
              {busyName === name
                ? <Loader2 className="w-3.5 h-3.5 animate-spin me-1.5" />
                : <FolderPlus className="w-3.5 h-3.5 me-1.5 text-amber-500" />}
              {he
                ? `צרו מרחב ל${name} (${groups[name].length})`
                : `Create ${name}'s space (${groups[name].length})`}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
