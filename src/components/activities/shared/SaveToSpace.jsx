import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { getActiveSpaceId, getActiveSpaceName } from '@/lib/childSpace';

/**
 * "Save to my space" — the counterpart to each activity's print button.
 *
 * Print takes the work off the screen and onto paper. This takes it into the
 * child's space, so a parent can look back at what was actually done.
 *
 * The activity stays the source of truth for its own content: it passes a
 * `getEntry()` that returns the one-line summary and a JSON snapshot. Nothing
 * about the activity itself is stored — only what this child made.
 *
 * Props:
 *   slug     — activity id, e.g. 'emotion-wheel'
 *   getEntry — () => { summary, payload, imageDataUrl? } | null
 *              Returning null means "nothing worth saving yet".
 *   label / savedLabel — optional copy overrides
 *   className — merged into the button, so each activity keeps its own look
 */
export default function SaveToSpace({ slug, getEntry, lang = 'he', label, savedLabel, className = '' }) {
  const he = lang === 'he';
  const [state, setState] = useState('idle'); // idle | saving | saved

  const spaceId = getActiveSpaceId();
  const spaceName = getActiveSpaceName();

  // No space yet — the button would only lead to a dead end, so it stays hidden.
  if (!spaceId) return null;

  const handleSave = async () => {
    if (state !== 'idle') return;
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
        // which would bloat every read of the entry.
        const blob = await (await fetch(entry.imageDataUrl)).blob();
        const file = new File([blob], `${slug}.png`, { type: 'image/png' });
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        imageUrl = file_url;
      }

      await base44.entities.ActivityEntry.create({
        child_space_id: spaceId,
        activity_slug: slug,
        summary: entry.summary || undefined,
        payload: entry.payload || undefined,
        image_url: imageUrl,
      });

      setState('saved');
      toast.success(spaceName
        ? (he ? `נשמר במרחב של ${spaceName}` : `Saved to ${spaceName}'s space`)
        : (he ? 'נשמר במרחב' : 'Saved to the space'));
    } catch (e) {
      console.error('[SaveToSpace] save failed:', e);
      setState('idle');
      toast.error(he ? 'לא הצלחנו לשמור. נסו שוב' : "Couldn't save. Please try again");
    }
  };

  const text = state === 'saved'
    ? (savedLabel || (he ? 'נשמר במרחב' : 'Saved'))
    : (label || (he ? 'שמור במרחב האישי' : 'Save to my space'));

  return (
    <button
      type="button"
      onClick={handleSave}
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
  );
}
