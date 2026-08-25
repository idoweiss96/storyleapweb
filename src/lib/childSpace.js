/**
 * childSpace.js — everything about a child space that does NOT belong in the DB.
 *
 * The split this file protects: the DB stores what differs per child (which
 * avatar, which activity slug, which mood on which day). Everything that looks
 * the same for every family — the avatar art, the theme palettes, the mood
 * scale, the wording of an insight — lives here in code, exactly like the
 * activities themselves do. See src/components/activities/README.md.
 */

const ACTIVE_SPACE_KEY = 'sl_active_space_id';
const ACTIVE_SPACE_NAME_KEY = 'sl_active_space_name';

/* ------------------------------------------------------------------ *
 * Avatar library
 * The DB stores only `avatar_id`. The art is here.
 * ------------------------------------------------------------------ */
export const AVATARS = [
  { id: 'fox',     emoji: '🦊', gradient: 'from-orange-200 to-amber-300' },
  { id: 'bear',    emoji: '🐻', gradient: 'from-amber-200 to-orange-300' },
  { id: 'bunny',   emoji: '🐰', gradient: 'from-pink-200 to-rose-300' },
  { id: 'cat',     emoji: '🐱', gradient: 'from-yellow-200 to-amber-300' },
  { id: 'panda',   emoji: '🐼', gradient: 'from-slate-200 to-slate-300' },
  { id: 'lion',    emoji: '🦁', gradient: 'from-amber-200 to-yellow-300' },
  { id: 'koala',   emoji: '🐨', gradient: 'from-slate-200 to-blue-200' },
  { id: 'penguin', emoji: '🐧', gradient: 'from-sky-200 to-indigo-200' },
  { id: 'frog',    emoji: '🐸', gradient: 'from-green-200 to-emerald-300' },
  { id: 'owl',     emoji: '🦉', gradient: 'from-purple-200 to-violet-300' },
  { id: 'unicorn', emoji: '🦄', gradient: 'from-fuchsia-200 to-purple-300' },
  { id: 'dragon',  emoji: '🐲', gradient: 'from-emerald-200 to-teal-300' },
  { id: 'star',    emoji: '⭐', gradient: 'from-yellow-200 to-amber-300' },
  { id: 'rocket',  emoji: '🚀', gradient: 'from-indigo-200 to-blue-300' },
  { id: 'rainbow', emoji: '🌈', gradient: 'from-sky-200 to-pink-200' },
  { id: 'flower',  emoji: '🌸', gradient: 'from-pink-200 to-fuchsia-200' },
];

export function getAvatar(avatarId) {
  return AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
}

/* ------------------------------------------------------------------ *
 * Theme palettes — `color_theme` on the entity picks one of these.
 * ------------------------------------------------------------------ */
export const THEMES = {
  violet:  { ring: 'ring-violet-300',  bar: 'from-violet-500 to-purple-500',   soft: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  dot: 'bg-violet-400' },
  pink:    { ring: 'ring-pink-300',    bar: 'from-pink-500 to-rose-500',       soft: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    dot: 'bg-pink-400' },
  sky:     { ring: 'ring-sky-300',     bar: 'from-sky-500 to-cyan-500',        soft: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     dot: 'bg-sky-400' },
  amber:   { ring: 'ring-amber-300',   bar: 'from-amber-500 to-orange-500',    soft: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400' },
  emerald: { ring: 'ring-emerald-300', bar: 'from-emerald-500 to-teal-500',    soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
};

export function getTheme(name) {
  return THEMES[name] || THEMES.violet;
}

/* ------------------------------------------------------------------ *
 * Mood scale — five faces, matching the check-in row.
 * `value` is what lands in MoodEntry.mood.
 * ------------------------------------------------------------------ */
export const MOODS = [
  { value: 1, emoji: '😞', he: 'קשה לי',     en: 'Hard day',  color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { value: 2, emoji: '😕', he: 'לא כזה טוב', en: 'Not great', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 3, emoji: '😐', he: 'בסדר',       en: 'Okay',      color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 4, emoji: '🙂', he: 'טוב',        en: 'Good',      color: 'bg-lime-100 text-lime-700 border-lime-200' },
  { value: 5, emoji: '🤩', he: 'מעולה',      en: 'Great',     color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

export function getMood(value) {
  return MOODS.find((m) => m.value === value) || null;
}

/* ------------------------------------------------------------------ *
 * Active space — which space the parent is currently looking at.
 * Deliberately localStorage and not a field on User: it is a per-device
 * view preference, not data worth a round trip.
 * ------------------------------------------------------------------ */
export function getActiveSpaceId() {
  try {
    return localStorage.getItem(ACTIVE_SPACE_KEY) || null;
  } catch (_) {
    return null;
  }
}

/**
 * The name is cached alongside the id purely so the header can label the nav
 * item "Noam's Space" without every page paying for an entity query.
 */
export function setActiveSpaceId(id, name) {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_SPACE_KEY, id);
      if (name) localStorage.setItem(ACTIVE_SPACE_NAME_KEY, name);
    } else {
      localStorage.removeItem(ACTIVE_SPACE_KEY);
      localStorage.removeItem(ACTIVE_SPACE_NAME_KEY);
    }
  } catch (_) { /* private mode — the page still works, it just forgets */ }
  try {
    window.dispatchEvent(new Event('active-space-changed'));
  } catch (_) { /* no window during SSR-style renders */ }
}

/** Cached display name of the active space, or null before one is picked. */
export function getActiveSpaceName() {
  try {
    return localStorage.getItem(ACTIVE_SPACE_NAME_KEY) || null;
  } catch (_) {
    return null;
  }
}

/**
 * Resolve which space to show: the remembered one if it still exists,
 * otherwise the first. Returns null when the parent has no spaces yet.
 */
export function resolveActiveSpace(spaces) {
  if (!spaces || spaces.length === 0) return null;
  const rememberedId = getActiveSpaceId();
  return spaces.find((s) => s.id === rememberedId) || spaces[0];
}

/* ------------------------------------------------------------------ *
 * Dates
 * ------------------------------------------------------------------ */
/** Local calendar day as YYYY-MM-DD. Not toISOString() — that shifts by timezone. */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dayKeyOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return todayKey(d);
}

export function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const monthDiff = now.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < born.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

/**
 * How many consecutive days ending today (or yesterday) have a check-in.
 * Counting from yesterday too means the streak doesn't look broken at 8am
 * before the parent has checked in.
 */
export function moodStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  const days = new Set(entries.map((e) => e.date));
  let streak = 0;
  let offset = days.has(todayKey()) ? 0 : -1;
  if (offset === -1 && !days.has(dayKeyOffset(-1))) return 0;
  while (days.has(dayKeyOffset(offset))) {
    streak += 1;
    offset -= 1;
  }
  return streak;
}

/* ------------------------------------------------------------------ *
 * Parent insights — derived, never stored.
 *
 * Each rule reads the data already on the page and returns a sentence, or
 * null when there isn't enough evidence to say anything honest. Rules that
 * cannot fire stay silent rather than padding the card with filler.
 * ------------------------------------------------------------------ */
export function buildInsights({ space, stories = [], entries = [], moods = [], lang = 'he' }) {
  const he = lang === 'he';
  const name = space?.name || (he ? 'הילד/ה' : 'your child');
  const out = [];

  // 1. The activity actually returned to most. Needs a real winner: one saved
  // entry says nothing, and a 1-vs-1 tie is not a preference.
  const bySlug = entries.reduce((acc, e) => {
    acc[e.activity_slug] = (acc[e.activity_slug] || 0) + 1;
    return acc;
  }, {});
  const ranked = Object.entries(bySlug).sort((a, b) => b[1] - a[1]);
  if (ranked.length > 0 && ranked[0][1] >= 2 && ranked[0][1] > (ranked[1]?.[1] || 0)) {
    const [slug, count] = ranked[0];
    out.push({
      icon: 'sparkles',
      text: he
        ? `${name} חזר/ה לפעילות הזו ${count} פעמים — יותר מלכל אחרת`
        : `${name} came back to one activity ${count} times — more than any other`,
      slug,
    });
  }

  // 2. Mood trend — only with enough days to mean something.
  const recent = [...moods].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7);
  if (recent.length >= 3) {
    const avg = recent.reduce((sum, m) => sum + (m.mood || 0), 0) / recent.length;
    if (avg >= 4) {
      out.push({
        icon: 'heart',
        text: he
          ? `השבוע האחרון של ${name} היה טוב ברובו — שווה לשאול מה עזר`
          : `${name} had a mostly good week — worth asking what helped`,
      });
    } else if (avg <= 2.4) {
      out.push({
        icon: 'heart',
        text: he
          ? `כמה ימים קשים ברצף אצל ${name}. אולי זה הזמן לפעילות הרגעה משותפת`
          : `A few hard days in a row for ${name}. A calming activity together might help`,
      });
    }
  }

  // 3. A story is ready but was never opened.
  const unopened = stories.find((s) => s.story_link && !s.link_opened_at);
  if (unopened) {
    out.push({
      icon: 'book',
      text: he
        ? `הסיפור «${unopened.child_name}» מוכן וטרם נפתח — אולי הערב`
        : `The story for ${unopened.child_name} is ready and hasn't been opened yet`,
    });
  }

  // 4. Nothing else fired — say something true rather than nothing at all.
  if (out.length === 0) {
    out.push({
      icon: 'sparkles',
      text: he
        ? `ככל שתשתמשו במרחב של ${name}, כאן יופיעו תובנות אישיות`
        : `As you use ${name}'s space, personal insights will appear here`,
    });
  }

  return out.slice(0, 3);
}
