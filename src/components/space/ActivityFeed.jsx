import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gamepad2, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { GAMES } from '@/pages/Activities';

const slugOf = (game) => game.path.split('/').filter(Boolean).pop();
const gameFor = (slug) => GAMES.find((g) => slugOf(g) === slug);

/**
 * Turn one payload value into something readable, without inventing labels.
 * Anything we can't confidently name is skipped rather than guessed at.
 */
function describe(value, lang) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const labels = value.map((v) => describe(v, lang)).filter(Boolean);
    return labels.length ? labels.join(' · ') : `${value.length}`;
  }
  if (typeof value === 'object') {
    const label = value[lang] ?? value.he ?? value.label ?? value.title ?? value.text ?? value.name;
    if (typeof label === 'string') return `${value.emoji ? value.emoji + ' ' : ''}${label}`;
    if (label && typeof label === 'object') {
      const nested = label[lang] ?? label.he ?? label.label;
      if (typeof nested === 'string') return `${value.emoji ? value.emoji + ' ' : ''}${nested}`;
    }
    if (typeof value.emoji === 'string') return value.emoji;
    return null;
  }
  return null;
}

/**
 * What the child actually did, newest first.
 *
 * The activity itself still lives in code — this reads back only the snapshot
 * the child saved from it, so the feed grows without any activity changing.
 */
export default function ActivityFeed({ entries, lang = 'he', onChanged }) {
  const he = lang === 'he';
  const [viewing, setViewing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (entry, e) => {
    e.stopPropagation();
    setDeletingId(entry.id);
    try {
      await base44.entities.ActivityEntry.delete(entry.id);
      await onChanged?.();
    } catch (err) {
      console.error('[ActivityFeed] delete failed:', err);
      toast.error(he ? 'לא הצלחנו למחוק' : "Couldn't delete it");
    } finally {
      setDeletingId(null);
    }
  };

  const viewingGame = viewing ? gameFor(viewing.activity_slug) : null;

  return (
    <>
      <Card className="border-0 shadow-lg shadow-violet-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-violet-400" />
              {he ? 'הפעילויות שעשינו' : 'What we did'}
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-slate-500 rounded-lg">
              <Link to="/activities">
                <Plus className="w-3.5 h-3.5 me-1" />
                {he ? 'לפעילות חדשה' : 'New activity'}
              </Link>
            </Button>
          </div>

          {entries.length === 0 ? (
            <Link
              to="/activities"
              className="block py-8 px-4 rounded-xl border-2 border-dashed border-slate-200 text-center hover:border-violet-300 hover:bg-violet-50/40 transition-colors"
            >
              <Plus className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                {he
                  ? 'עוד לא שמרתם פעילות. בכל פעילות יש כפתור «שמור במרחב האישי».'
                  : 'Nothing saved yet. Every activity has a "Save to my space" button.'}
              </p>
            </Link>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entries.map((entry) => {
                const game = gameFor(entry.activity_slug);
                return (
                  <li key={entry.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => setViewing(entry)}
                      className="w-full h-full text-start p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex gap-3"
                    >
                      {entry.image_url ? (
                        <img
                          src={entry.image_url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-slate-100 flex-none"
                        />
                      ) : (
                        <span className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center text-2xl flex-none">
                          {game?.emoji || '✨'}
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-slate-800 truncate">
                          {game ? (he ? game.title.he : game.title.en) : entry.activity_slug}
                        </span>
                        {entry.summary && (
                          <span className="block text-xs text-slate-500 truncate">{entry.summary}</span>
                        )}
                        {entry.created_date && (
                          <span className="block text-[11px] text-slate-400 tabular-nums mt-0.5">
                            {format(new Date(entry.created_date), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === entry.id}
                      onClick={(e) => handleDelete(entry, e)}
                      aria-label={he ? 'מחיקה' : 'Delete'}
                      className="absolute top-2 end-2 w-6 h-6 rounded-full bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">{viewingGame?.emoji || '✨'}</span>
                  {viewingGame ? (he ? viewingGame.title.he : viewingGame.title.en) : viewing.activity_slug}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {viewing.created_date && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(viewing.created_date), 'dd/MM/yyyy HH:mm')}
                  </p>
                )}

                {viewing.image_url && (
                  <img
                    src={viewing.image_url}
                    alt=""
                    className="w-full rounded-xl border border-slate-100"
                  />
                )}

                {viewing.summary && (
                  <p className="text-base text-slate-700 font-medium">{viewing.summary}</p>
                )}

                {viewing.payload && (
                  <dl className="flex flex-col gap-2">
                    {Object.entries(viewing.payload).map(([key, value]) => {
                      const text = describe(value, lang);
                      if (!text) return null;
                      return (
                        <div key={key} className="flex gap-2 text-sm">
                          <dt className="text-slate-400 font-mono text-xs pt-0.5 flex-none">{key}</dt>
                          <dd className="text-slate-700 flex-1">{text}</dd>
                        </div>
                      );
                    })}
                  </dl>
                )}

                {viewingGame && (
                  <Button asChild variant="outline" className="rounded-xl w-full border-slate-200">
                    <Link to={viewingGame.path}>
                      <ExternalLink className="w-4 h-4 me-2" />
                      {he ? 'לעשות את זה שוב' : 'Do it again'}
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
