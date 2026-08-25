import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { getActiveSpaceId, getActiveSpaceName, setActiveSpaceId, getAvatar } from '@/lib/childSpace';

/**
 * "Save to my space" — the counterpart to each activity's print button.
 *
 * Print takes the work off the screen and onto paper. This takes it into a
 * child's space, so a parent can look back at what was actually done.
 *
 * The activity stays the source of truth for its own content: it passes a
 * `getEntry()` returning the one-line summary and a JSON snapshot. Nothing
 * about the activity itself is stored — only what this child made.
 *
 * Props:
 *   slug     — activity id, e.g. 'emotion-wheel'
 *   getEntry — () => { summary, payload, imageDataUrl? } | null
 *              Returning null means "nothing worth saving yet".
 */
export default function SaveToSpace({ slug, getEntry, lang = 'he', label, savedLabel, className = '' }) {
  const he = lang === 'he';
  const [state, setState] = useState('idle'); // idle | saving | saved
  const [spaces, setSpaces] = useState(null); // null until first load
  const [visible, setVisible] = useState(!!getActiveSpaceId());
  const [picking, setPicking] = useState(false);

  const cachedName = getActiveSpaceName();

  // A parent who has spaces but has not opened the space page yet has nothing
  // cached locally. Ask the server once so the button is not silently missing.
  // A logged-out visitor simply throws here and the button stays hidden.
  useEffect(() => {
    if (visible) return;
    let cancelled = false;
    base44.entities.ChildSpace.list('-created_date')
      .then((list) => {
        if (cancelled) return;
        const open = (list || []).filter((s) => !s.is_archived);
        setSpaces(open);
        setVisible(open.length > 0);
      })
      .catch(() => { /* not signed in, or no access — leave hidden */ });
    return () => { cancelled = true; };
  }, [visible]);

  if (!visible) return null;

  const persist = async (space) => {
    const entry = getEntry?.();
    if (!entry) {
      toast.error(he ? 'עוד אין מה לשמור' : 'Nothing to save yet');
      return;
    }
    setState('saving');
    try {
      let imageUrl;
      if (entry.imageDataUrl) {
        // Canvas work is uploaded as a real file rather than inlined as base64,
        // which would bloat every later read of the entry.
        const blob = await (await fetch(entry.imageDataUrl)).blob();
        const file = new File([blob], `${slug}.png`, { type: 'image/png' });
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        imageUrl = file_url;
      }

      await base44.entities.ActivityEntry.create({
        child_space_id: space.id,
        activity_slug: slug,
        summary: entry.summary || undefined,
        payload: entry.payload || undefined,
        image_url: imageUrl,
      });

      // Saving somewhere makes it the space the parent is working in.
      setActiveSpaceId(space.id, space.name);
      setState('saved');
      toast.success(he ? `נשמר במרחב של ${space.name}` : `Saved to ${space.name}'s space`);
    } catch (e) {
      console.error('[SaveToSpace] save failed:', e);
      setState('idle');
      toast.error(he ? 'לא הצלחנו לשמור. נסו שוב' : "Couldn't save. Please try again");
    }
  };

  const handleClick = async () => {
    if (state !== 'idle') return;
    // Nothing to save is worth catching before any network call.
    if (!getEntry?.()) {
      toast.error(he ? 'עוד אין מה לשמור' : 'Nothing to save yet');
      return;
    }

    let list = spaces;
    if (!list) {
      setState('saving');
      try {
        const all = await base44.entities.ChildSpace.list('-created_date');
        list = (all || []).filter((s) => !s.is_archived);
        setSpaces(list);
      } catch (e) {
        console.error('[SaveToSpace] could not load spaces:', e);
        setState('idle');
        toast.error(he ? 'לא הצלחנו לטעון את המרחבים' : "Couldn't load your spaces");
        return;
      }
      setState('idle');
    }

    if (list.length === 0) {
      setVisible(false);
      return;
    }
    if (list.length === 1) {
      await persist(list[0]);
      return;
    }
    setPicking(true);
  };

  // With one child the button names them outright, so it is always clear where
  // the work is going without an extra tap.
  const onlyName = spaces?.length === 1 ? spaces[0].name : (spaces === null ? cachedName : null);
  const text = state === 'saved'
    ? (savedLabel || (he ? 'נשמר במרחב' : 'Saved'))
    : (label || (onlyName
      ? (he ? `שמור אצל ${onlyName}` : `Save to ${onlyName}`)
      : (he ? 'שמור במרחב האישי' : 'Save to a space')));

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={state !== 'idle'}
        className={`no-print inline-flex items-center gap-2 px-6 py-3 rounded-full transition-colors disabled:cursor-default
          ${state === 'saved'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-violet-500 text-white hover:bg-violet-600'} ${className}`}
      >
        {state === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === 'saved' && <Check className="w-4 h-4" />}
        {state === 'idle' && <Heart className="w-4 h-4" />}
        {text}
      </button>

      {picking && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPicking(false)}
        >
          <div
            dir={he ? 'rtl' : 'ltr'}
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-slate-800 text-lg">
              {he ? 'לאיזה מרחב לשמור?' : 'Save to which space?'}
            </h2>
            <ul className="flex flex-col gap-2">
              {spaces.map((space) => {
                const avatar = getAvatar(space.avatar_id);
                return (
                  <li key={space.id}>
                    <button
                      type="button"
                      onClick={() => { setPicking(false); persist(space); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-colors text-start"
                    >
                      <span className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-xl flex-none`}>
                        {avatar.emoji}
                      </span>
                      <span className="font-medium text-slate-800">{space.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setPicking(false)}
              className="text-sm text-slate-500 hover:text-slate-700 py-1"
            >
              {he ? 'ביטול' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
