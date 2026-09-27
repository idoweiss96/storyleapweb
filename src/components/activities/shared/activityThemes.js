/**
 * activityThemes.js — how each activity looks around its content: which
 * character hosts it, which drawn place it happens in, its colour, and the
 * group it belongs to on the hub. Content and behaviour stay in each
 * activity's own folder; this is presentation only.
 *
 * `host` is a Critter species (games/shared/art/Critter.jsx).
 * `scene` is a backdrop in ActivityBackdrop.jsx.
 */

export const GROUPS = [
  { id: 'feelings', he: 'רגשות', en: 'Feelings', color: '#FF6FB5', tint: '#FFF0F7' },
  { id: 'calm', he: 'הרגעה', en: 'Calming down', color: '#4FC3E8', tint: '#EAF8FD' },
  { id: 'routine', he: 'סדר יום ושגרה', en: 'Routines', color: '#F5B942', tint: '#FFF8E6' },
  { id: 'independence', he: 'עצמאות', en: 'Doing it myself', color: '#5BC98C', tint: '#EDFAF2' },
];

export const THEMES = {
  'feelings-explorer': { host: 'fox', scene: 'meadow', color: '#4FC3E8', group: 'feelings' },
  'emotion-wheel': { host: 'bunny', scene: 'meadow', color: '#FF6FB5', group: 'feelings' },
  'emotion-cards': { host: 'cat', scene: 'room', color: '#A78BFA', group: 'feelings' },
  'emotion-drawing': { host: 'panda', scene: 'art', color: '#FF9F5A', group: 'feelings' },
  'emotion-thermometer': { host: 'penguin', scene: 'room', color: '#EF6B6B', group: 'feelings' },
  'emotion-checkin': { host: 'koala', scene: 'room', color: '#4FC3E8', group: 'feelings' },
  'body-map': { host: 'bear', scene: 'meadow', color: '#FF6FB5', group: 'feelings' },
  'strength-cards': { host: 'dog', scene: 'meadow', color: '#F5B942', group: 'feelings' },
  breathing: { host: 'bunny', scene: 'night', color: '#4FC3E8', group: 'calm' },
  'safe-place': { host: 'turtle', scene: 'night', color: '#5BC98C', group: 'calm' },
  'calm-corner': { host: 'koala', scene: 'room', color: '#5BC98C', group: 'calm' },
  'coping-cards': { host: 'frog', scene: 'meadow', color: '#5BC98C', group: 'calm' },
  'break-card': { host: 'penguin', scene: 'room', color: '#EF6B6B', group: 'calm' },
  'routine-board': { host: 'bear', scene: 'morning', color: '#F5B942', group: 'routine' },
  'first-then': { host: 'topi', scene: 'morning', color: '#FF6FB5', group: 'routine' },
  'routine-checklist': { host: 'cat', scene: 'morning', color: '#4FC3E8', group: 'routine' },
  'visual-timer': { host: 'fox', scene: 'room', color: '#A78BFA', group: 'routine' },
  'visual-rules': { host: 'dog', scene: 'room', color: '#FF9F5A', group: 'routine' },
  'choice-board': { host: 'panda', scene: 'room', color: '#FF6FB5', group: 'routine' },
  'task-analysis': { host: 'frog', scene: 'morning', color: '#5BC98C', group: 'independence' },
  'adl-sequence': { host: 'turtle', scene: 'morning', color: '#4FC3E8', group: 'independence' },
};

export function themeFor(slug) {
  return THEMES[slug] || { host: 'topi', scene: 'meadow', color: '#FF6FB5', group: 'feelings' };
}
