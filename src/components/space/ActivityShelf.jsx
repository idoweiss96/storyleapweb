import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Plus, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { GAMES } from '@/pages/Activities';

/** Turn '/activities/emotion-wheel' into 'emotion-wheel'. */
const slugOf = (game) => game.path.split('/').filter(Boolean).pop();

/**
 * The shelf of activities a parent pinned to this space.
 *
 * The DB rows here are pointers: a slug, a counter, a sort order. The
 * activity itself is never stored — it is rendered from GAMES, which is the
 * same registry the public Activities page reads.
 */
export default function ActivityShelf({ spaceId, activities, lang = 'he', onChanged, pickerOpen, setPickerOpen }) {
  const he = lang === 'he';
  const navigate = useNavigate();
  const [busySlug, setBusySlug] = useState(null);

  const pinnedSlugs = new Set(activities.map((a) => a.activity_slug));
  const pinned = activities
    .map((row) => ({ row, game: GAMES.find((g) => slugOf(g) === row.activity_slug) }))
    .filter((x) => x.game) // a slug whose activity was removed from the code just disappears
    .sort((a, b) => (a.row.sort_order ?? 0) - (b.row.sort_order ?? 0));

  const handleAdd = async (game) => {
    const slug = slugOf(game);
    if (pinnedSlugs.has(slug)) return;
    setBusySlug(slug);
    try {
      await base44.entities.SpaceActivity.create({
        child_space_id: spaceId,
        activity_slug: slug,
        is_favorite: true,
        sort_order: activities.length,
        open_count: 0,
      });
      toast.success(he ? 'הפעילות נוספה למרחב' : 'Activity added');
      await onChanged?.();
    } catch (e) {
      console.error('[ActivityShelf] add failed:', e);
      toast.error(he ? 'לא הצלחנו להוסיף' : "Couldn't add it");
    } finally {
      setBusySlug(null);
    }
  };

  const handleRemove = async (row, e) => {
    e.stopPropagation();
    try {
      await base44.entities.SpaceActivity.delete(row.id);
      await onChanged?.();
    } catch (err) {
      console.error('[ActivityShelf] remove failed:', err);
      toast.error(he ? 'לא הצלחנו להסיר' : "Couldn't remove it");
    }
  };

  /** Count the open, then navigate. A failed count must not block the child. */
  const handleOpen = async (row, game) => {
    try {
      await base44.entities.SpaceActivity.update(row.id, {
        open_count: (row.open_count || 0) + 1,
        last_opened_at: new Date().toISOString(),
      });
    } catch (_) { /* counting is best-effort */ }
    navigate(game.path);
  };

  return (
    <>
      <Card className="border-0 shadow-lg shadow-violet-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-300" />
              {he ? 'הפעילויות האהובות' : 'Favourite activities'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setPickerOpen(true)} className="text-xs text-slate-500 rounded-lg">
              <Plus className="w-3.5 h-3.5 me-1" />
              {he ? 'הוסף' : 'Add'}
            </Button>
          </div>

          {pinned.length === 0 ? (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full py-8 px-4 rounded-xl border-2 border-dashed border-slate-200 text-center hover:border-violet-300 hover:bg-violet-50/40 transition-colors"
            >
              <Plus className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {he ? 'הוסיפו פעילויות שאתם חוזרים אליהן' : 'Add the activities you keep coming back to'}
              </p>
            </button>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {pinned.map(({ row, game }) => (
                <div key={row.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleOpen(row, game)}
                    className="w-full h-full text-start p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-2">{game.emoji}</div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                      {he ? game.title.he : game.title.en}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {he ? game.desc.he : game.desc.en}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-violet-500 font-medium">
                      <Play className="w-3 h-3" />
                      {he ? 'שחקו' : 'Play'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(row, e)}
                    aria-label={he ? 'הסרה מהמרחב' : 'Remove from space'}
                    className="absolute top-2 end-2 w-6 h-6 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {he ? 'בחרו פעילויות למרחב' : 'Pick activities for this space'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 -mt-2 mb-2">
            {he
              ? 'כל הפעילויות חינמיות ועובדות גם בלי חיבור לאינטרנט.'
              : 'Every activity is free and works offline.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GAMES.map((game) => {
              const slug = slugOf(game);
              const already = pinnedSlugs.has(slug);
              return (
                <button
                  key={game.path}
                  type="button"
                  disabled={already || busySlug === slug}
                  onClick={() => handleAdd(game)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-start transition-all
                    ${already
                      ? 'border-violet-200 bg-violet-50/60 cursor-default'
                      : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'}`}
                >
                  <span className="text-2xl leading-none mt-0.5">{game.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-slate-800">
                      {he ? game.title.he : game.title.en}
                    </span>
                    <span className="block text-xs text-slate-400 line-clamp-2">
                      {he ? game.desc.he : game.desc.en}
                    </span>
                  </span>
                  {already && (
                    <span className="text-xs text-violet-600 font-medium whitespace-nowrap">
                      {he ? 'במרחב' : 'Added'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
