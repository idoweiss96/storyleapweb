// Central data source for the StoryLeap internal Design System page.
// Extracted from actual usage across src/index.css, tailwind.config.js,
// src/Layout.jsx, src/pages/*, and src/components/kita-alef/*.
// This file documents CURRENT reality — not recommendations.

export const semanticColors = [
  { name: '--background', hex: '#FFFFFF', rgb: '255,255,255', hsl: '0 0% 100%', usage: 'Page background (light)' },
  { name: '--foreground', hex: '#292C33', rgb: '41,44,51', hsl: '220 15% 18%', usage: 'Default text color' },
  { name: '--primary', hex: '#292C33', rgb: '41,44,51', hsl: '220 15% 18%', usage: 'Primary buttons, header text, logout icon' },
  { name: '--secondary', hex: '#EEF1F6', rgb: '238,241,246', hsl: '215 30% 95%', usage: 'Secondary surfaces' },
  { name: '--muted-foreground', hex: '#7C8697', rgb: '124,134,151', hsl: '215 15% 50%', usage: 'Helper / muted text' },
  { name: '--destructive', hex: '#EF4444', rgb: '239,68,68', hsl: '0 84.2% 60.2%', usage: 'Errors, destructive actions' },
  { name: '--border', hex: '#D8DEE8', rgb: '216,222,232', hsl: '215 20% 88%', usage: 'shadcn component borders (Input, Select, Card)' },
  { name: '--brand-blue', hex: '#ADC5E8', rgb: '173,197,232', hsl: '215 60% 75%', usage: 'Declared brand token — not referenced anywhere in JSX' },
  { name: '--brand-dark', hex: '#292C33', rgb: '41,44,51', hsl: '220 15% 18%', usage: 'Declared brand token — not referenced anywhere in JSX' },
];

export const kitaColors = [
  { name: 'kita-navy', hex: '#1A1A6E', usage: 'Kita Alef headings' },
  { name: 'kita-purple', hex: '#6B5CE7', usage: 'Defined in tailwind.config, not used in JSX' },
  { name: 'kita-lavender', hex: '#A89BE8', usage: 'Defined in tailwind.config, not used in JSX' },
  { name: 'kita-pink', hex: '#FF6FB5', usage: 'Kita Alef gradients, accents, active chip state' },
  { name: 'kita-pink-soft', hex: '#FFD6EC', usage: 'Kita Alef badge backgrounds, borders' },
  { name: 'kita-pink-bg', hex: '#FFF0F7', usage: 'Kita Alef section gradients' },
  { name: 'kita-sky', hex: '#4FC3E8', usage: 'Kita Alef gradients, "together" tag, active chip state' },
  { name: 'kita-sky-soft', hex: '#B8EBF7', usage: 'Kita Alef badge backgrounds, borders' },
  { name: 'kita-sky-bg', hex: '#EAF8FD', usage: 'Kita Alef section gradients' },
  { name: 'kita-bg', hex: '#F0EEF8', usage: 'Defined in tailwind.config, not used in JSX' },
  { name: 'kita-border', hex: '#EDE9F8', usage: 'Defined in tailwind.config — QuestionCard uses hardcoded #F0E8F5 instead (near-duplicate)' },
  { name: 'kita-text', hex: '#1A1A2E', usage: 'Kita Alef headings/body text' },
  { name: 'kita-subtext', hex: '#6B6B8A', usage: 'Kita Alef secondary text' },
  { name: 'kita-yellow', hex: '#F5C842', usage: 'Parent info box border' },
  { name: 'kita-yellow-text', hex: '#7A5000', usage: 'Parent info box text' },
  { name: 'kita-yellow-bg', hex: '#FFF8EC', usage: 'Parent info box background' },
  { name: 'kita-input-bg', hex: '#FAFAFE', usage: 'Text/textarea input backgrounds in questionnaire' },
];

export const hardcodedInlineColors = [
  { hex: '#FF6FB5', note: 'Duplicates kita-pink — used inline instead of the Tailwind token in Questionnaire.jsx, QuestionCard.jsx, HomeScreen.jsx' },
  { hex: '#4FC3E8', note: 'Duplicates kita-sky — used inline the same way' },
  { hex: '#F0E8F5', note: 'Near-duplicate of kita-border (#EDE9F8) — a slightly different shade used as the default card/input border across all Kita Alef components' },
  { hex: '#C4407A', note: 'One-off — "child" tag text color and photo-remove icon color, no token' },
  { hex: '#ffc157', note: 'One-off — Home hero primary CTA background, no token, not reused anywhere else' },
  { hex: '#BAD1FA / #9ab8f5', note: 'Home hero hover + CTA card gradient — close to --brand-blue (#ADC5E8) but not the same value; brand-blue token goes unused while a near match is hand-typed twice' },
  { hex: '#c07028', note: 'One-off — Maya Story CTA button background' },
  { hex: '#fff8ed / #fde8c8', note: 'One-off gradient — Maya Story banner background' },
];

export const gradients = [
  { name: 'Hero heading gradient', css: 'linear-gradient(to right, #334155, #0f172a)', usage: 'Home hero "hero_title2" text (slate-700 → slate-900 via bg-clip-text)' },
  { name: 'Kita Alef page background', css: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)', usage: 'HomeScreen, Questionnaire, Home Kita-Alef banner section backgrounds' },
  { name: 'Kita Alef primary action', css: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)', usage: 'Start/Finish buttons, badges' },
  { name: 'Kita Alef secondary action', css: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)', usage: '"Next" button, "together" tag' },
  { name: 'CTA section', css: 'linear-gradient(135deg, #BAD1FA, #9ab8f5)', usage: 'Home bottom CTA card' },
  { name: 'StoryCard top bar', css: 'linear-gradient(to right, #a78bfa, #8b5cf6, #fbbf24)', usage: 'Tailwind: from-violet-400 via-violet-500 to-amber-400' },
];

export const typography = [
  { role: 'Hero heading (H1)', classes: 'text-4xl md:text-6xl font-bold leading-tight', example: 'Every child deserves their own story', where: 'Home.jsx hero' },
  { role: 'Section heading (H2)', classes: 'text-2xl md:text-3xl font-bold', example: 'Our Story Gallery ✨', where: 'Home.jsx section titles' },
  { role: 'Card / dialog heading (H3)', classes: 'text-lg md:text-xl font-bold', example: 'Princess Maya and the Cloud of Confusion', where: 'Card titles' },
  { role: 'Kita Alef heading', classes: 'text-xl font-bold (inline color #1A1A6E)', example: 'הכנה לכיתה א׳ ביחד', where: 'HomeScreen.jsx / QuestionCard.jsx' },
  { role: 'Body text', classes: 'text-base / text-lg leading-relaxed', example: 'Empowering children\'s emotional growth…', where: 'Hero subtitle, card body' },
  { role: 'Small / caption text', classes: 'text-xs / text-[13px] / text-[12.5px]', example: 'Page 1 of 6', where: 'Kita Alef progress label, pills, hints' },
  { role: 'Button label', classes: 'text-sm font-medium / font-semibold', example: 'Create My Story', where: 'Button.jsx variants' },
  { role: 'Badge / tag', classes: 'text-xs font-medium', example: '💛 Together', where: 'QuestionCard.jsx Tag component' },
];

export const spacingScale = [
  { token: 'gap-1 / gap-1.5', px: '4px / 6px', usage: 'Chip groups, pill rows' },
  { token: 'gap-2 / gap-3', px: '8px / 12px', usage: 'Icon+label pairs, form field groups' },
  { token: 'gap-4 / gap-6', px: '16px / 24px', usage: 'Grid/section gaps (feature cards, gallery)' },
  { token: 'p-3 / p-4', px: '12px / 16px', usage: 'Card content padding (compact), QuestionCard' },
  { token: 'p-5 / p-6', px: '20px / 24px', usage: 'StoryCard / feature card padding' },
  { token: 'p-8 / p-12', px: '32px / 48px', usage: 'CTA / Maya banner large sections' },
  { token: 'py-12 / py-16 / md:py-24', px: '48 / 64 / 96px', usage: 'Section vertical rhythm on Home.jsx' },
  { token: 'px-4 (container)', px: '16px', usage: 'max-w-6xl mx-auto px-4 — global content gutter (Layout.jsx main)' },
];

export const radiusScale = [
  { token: '--radius (rounded-md/lg/sm)', px: '0.5rem base (8/6/4px)', usage: 'shadcn Button, Input, Select, Card' },
  { token: 'rounded-xl', px: '12px', usage: 'Buttons, badges' },
  { token: 'rounded-2xl', px: '16px', usage: 'Feature icon boxes, family-photo rows' },
  { token: 'rounded-3xl', px: '24px', usage: 'Page-level containers (QuestionCard, HomeScreen, Questionnaire wrapper)' },
  { token: 'rounded-[10px]', px: '10px', usage: 'Kita Alef text/textarea inputs — arbitrary value, not on the shared scale' },
  { token: 'rounded-[14px]', px: '14px', usage: 'Kita Alef buttons — arbitrary value' },
  { token: 'rounded-[20px]', px: '20px', usage: 'Kita Alef tag pills — arbitrary value' },
  { token: 'rounded-[24px]', px: '24px', usage: 'HomeScreen card — arbitrary value, ~= rounded-3xl (duplicate)' },
  { token: 'rounded-full', px: '9999px', usage: 'Avatars, photo uploads, pill badges' },
];

export const shadowScale = [
  { token: 'shadow-sm / shadow-md', usage: 'Default shadcn components' },
  { token: 'shadow-lg shadow-slate-100', usage: 'Feature & testimonial cards on Home.jsx' },
  { token: 'shadow-xl shadow-slate-200', usage: 'Card hover state' },
  { token: 'shadow-lg shadow-violet-50 / shadow-xl shadow-violet-100', usage: 'StoryCard default / hover' },
  { token: 'shadow-2xl shadow-slate-200', usage: 'Bottom CTA card' },
  { token: 'custom: 0 10px 40px rgba(255,111,181,.15), 0 4px 20px rgba(79,195,232,.1)', usage: 'Kita Alef "glow" shadow — hand-written, not a token, repeated in 2 files' },
  { token: 'custom: 0 4px 20px rgba(255,111,181,.08), 0 2px 10px rgba(79,195,232,.06)', usage: 'QuestionCard shadow — same pattern, different values (inconsistent)' },
];

export const breakpoints = [
  { name: 'sm', value: '640px', usage: 'sm:flex-row, sm:grid-cols-6 (emoji grid)' },
  { name: 'md', value: '768px', usage: 'Most common breakpoint — md:text-*, md:py-*, md:grid-cols-3, hidden md:block' },
  { name: 'lg', value: '1024px', usage: 'Rare — mostly md: covers desktop in this app' },
];

export const zIndexScale = [
  { token: 'z-0', usage: 'Decorative star/background layers (Layout.jsx)' },
  { token: 'z-50', usage: 'Sticky header (Layout.jsx), Radix popover/select content' },
];

export const durations = [
  { token: 'duration-200 / 0.2s', usage: 'Question card page transition (Questionnaire.jsx)' },
  { token: 'duration-300', usage: 'Card hover transitions, gallery image scale' },
  { token: '0.4-0.6s (framer-motion)', usage: 'Hero + testimonial entrance animations' },
  { token: 'spring stiffness 200 damping 25-30', usage: 'Progress bar fill, HomeScreen card entrance' },
];

export const componentInventory = [
  { name: 'Button', file: 'src/components/ui/button.jsx', pages: 'Home, Pricing, CreateStory, MyStories, Admin', props: 'variant, size, asChild', variants: 'default, destructive, outline, secondary, ghost, link · sm/default/lg/icon', responsive: 'No built-in responsive variants', status: 'Keep' },
  { name: 'Card / CardContent', file: 'src/components/ui/card.jsx', pages: 'Home, StoryCard, Pricing', props: 'className', variants: 'n/a (composed)', responsive: 'Padding adjusted per usage', status: 'Keep' },
  { name: 'Input / Textarea / Select', file: 'src/components/ui/*.jsx', pages: 'Contact, CreateStory, Admin', props: 'standard HTML props', variants: 'n/a', responsive: 'md:text-sm override on Textarea', status: 'Keep' },
  { name: 'StoryCard', file: 'src/components/story/StoryCard.jsx', pages: 'MyStories', props: 'story, onClick, index', variants: 'per-setting color map (space/forest/castle/sports/real_life)', responsive: 'Single column → grid via parent', status: 'Keep' },
  { name: 'QuestionCard + QuestionInput', file: 'src/components/kita-alef/QuestionCard.jsx, QuestionInput.jsx', pages: 'KitaAlef', props: 'question, answers, onAnswerChange', variants: 'text, textarea, emoji, chips, photo, family_photos', responsive: 'grid-cols-3 sm:grid-cols-6 for emoji grid', status: 'Keep — but re-implements buttons/inputs with inline styles instead of shared UI components' },
  { name: 'Raw gradient buttons (inline style)', file: 'HomeScreen.jsx, Questionnaire.jsx, QuestionCard tags', pages: 'KitaAlef flow', props: 'none (hand-rolled)', variants: 'primary pink→sky gradient, secondary sky gradient', responsive: 'None', status: 'Merge — should become Button variants to avoid duplicating hover/disabled logic' },
  { name: 'Layout header/nav', file: 'src/Layout.jsx', pages: 'All pages', props: 'children, currentPageName', variants: 'authenticated vs public nav items, mobile drawer', responsive: 'hidden md:flex nav, md:hidden burger menu', status: 'Keep' },
];

export const auditItems = [
  { severity: 'high', title: 'Duplicate color values', detail: '#FF6FB5, #4FC3E8, #FFD6EC, #B8EBF7, #EAF8FD, #FFF0F7, #F5C842, #7A5000, #FFF8EC, #FAFAFE are all already defined as kita-* Tailwind tokens, but are re-typed as inline hex strings throughout the Kita Alef components instead of using the token classes.' },
  { severity: 'medium', title: 'Near-duplicate border color', detail: '#F0E8F5 (used everywhere in Kita Alef as the card/input border) is a slightly different shade from the declared kita-border token (#EDE9F8). Likely meant to be the same value.' },
  { severity: 'medium', title: 'Unused brand tokens', detail: '--brand-blue and --brand-dark are declared in index.css but never referenced in JSX; instead, Home.jsx hand-types close-but-not-identical hex values (#BAD1FA, #9ab8f5) for the same brand-blue role.' },
  { severity: 'low', title: 'One-off colors with no token', detail: '#ffc157 (hero CTA), #c07028 (Maya button), #fff8ed/#fde8c8 (Maya banner), #C4407A (child tag / remove icon) each appear exactly once and have no corresponding design token.' },
  { severity: 'medium', title: 'Arbitrary border-radius values', detail: 'Kita Alef components use rounded-[10px], rounded-[14px], rounded-[20px], rounded-[24px] — arbitrary pixel values sitting outside the shared radius scale (rounded-md/xl/2xl/3xl/full) used by the rest of the app.' },
  { severity: 'low', title: 'Two different "glow shadow" recipes', detail: 'HomeScreen/Questionnaire and QuestionCard each hand-write a similar pink/sky glow shadow with different rgba values — should be a single reusable token.' },
  { severity: 'medium', title: 'No custom heading/body font tokens', detail: 'index.css defines no --font-heading/--font-body tokens; the whole app relies on the Tailwind default sans stack. All type sizes are ad-hoc Tailwind classes (text-4xl md:text-6xl etc.) repeated per page rather than centralized text-style classes.' },
  { severity: 'medium', title: 'Inline-styled buttons bypass the Button component', detail: 'Kita Alef flow (HomeScreen "start" button, Questionnaire "Next/Finish", chip/emoji selectors) are plain <button> elements with inline gradient styles and manual hover:opacity-90 / disabled:opacity-60, duplicating logic already centralized in ui/button.jsx.' },
  { severity: 'low', title: 'Contrast check needed', detail: 'kita-yellow-text (#7A5000) on kita-yellow-bg (#FFF8EC) and white text on kita-pink/kita-sky gradients read fine at normal sizes, but small captions (text-[11px]/text-[12.5px]) on light backgrounds (e.g. kita-subtext #6B6B8A on white) are close to WCAG AA minimum for small text — worth a contrast pass.' },
  { severity: 'low', title: 'Mobile text below 12px', detail: 'Several Kita Alef captions use text-[11px]/text-[12.5px]/text-[13px], smaller than the 14px baseline used elsewhere; can be hard to read on small mobile screens.' },
];

export const assets = [
  { name: 'StoryLeap logo', path: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg', usage: 'Layout.jsx header logo' },
  { name: 'App background illustration', path: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e62ec3a0d_generated_image.png', usage: 'Layout.jsx page background' },
  { name: 'Princess Maya illustration', path: 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/7455564e3_MAYA.png', usage: 'Home.jsx Maya Story CTA' },
  { name: 'Gallery sample images (×8)', path: 'qtrypzzcjebvfcihiynt.supabase.co/.../image1–5, 51–54.png', usage: 'Home.jsx "Our Story Gallery" grid' },
];

export const icons = {
  library: 'lucide-react',
  used: [
    'Sparkles', 'Star', 'BookOpen', 'Wand2', 'Heart', 'ArrowLeft', 'Dumbbell', 'ChevronRight', 'ChevronLeft', 'Quote',
    'Home', 'Menu', 'X', 'LogOut', 'Mail', 'Globe', 'Loader2', 'Plus', 'Calendar',
  ],
  sizes: ['w-3 h-3 (12px, captions)', 'w-4 h-4 (16px, inline with text)', 'w-5 h-5 (20px, buttons)', 'w-6/7 h-6/7 (24-28px, feature icons)', 'w-10 h-10 (40px, header icon badges)'],
  strokeWidth: 'Default lucide-react stroke (2px) everywhere — no custom stroke-width used',
  decorative: ['✦ / ★ text-emoji "stars" absolutely positioned with CSS keyframe animations (twinkle, float-star, drift) — see Layout.jsx <style> block', 'Emoji used directly as icons in Kita Alef (📷, 🎒, 💛, 🌟) instead of an icon set'],
};