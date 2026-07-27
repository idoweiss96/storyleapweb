# StoryLeap Design System (Internal Reference)

This document mirrors the `/design-system` page. It describes the app's **current implementation**,
extracted directly from `src/index.css`, `tailwind.config.js`, `src/Layout.jsx`, and the page/component
source files. It does not redesign or change any production page.

Live version: visit **/design-system** in the app.

## Files

- `src/styles/design-tokens.css` — colors, spacing, radius, shadows, breakpoints, z-index, durations (scoped under `.ds-root`, only loaded by the Design System page)
- `src/styles/typography.css` — heading/body/caption/button text styles (scoped under `.ds-root`)
- `src/styles/components.css` — `.ds-btn-*` / `.ds-card-*` reference recipes (scoped under `.ds-root`)
- `src/components/design-system/` — one focused component per documentation section
- `src/components/design-system/designSystemData.js` — single source of truth for all documented values

## Sections on the page

1. **Brand colors** — semantic shadcn tokens, the Kita Alef brand palette, gradients in use, and a list of
   hardcoded hex values that duplicate or nearly duplicate an existing token.
2. **Typography** — no custom font is loaded; all type is the Tailwind default sans stack at various
   hardcoded sizes (hero, section heading, card heading, body, caption, button, badge).
3. **Spacing, radius & shadows** — the actual spacing/radius/shadow values found in use, including
   several arbitrary `rounded-[Npx]` values outside the shared scale.
4. **Buttons** — every shadcn `Button` variant/size, plus the Home hero one-off button and the
   Kita Alef inline-gradient buttons that bypass the shared component.
5. **Cards & containers** — feature cards, story cards, question cards, testimonial cards, info cards.
6. **Form components** — shared `Input`/`Textarea`/`Label` plus the Kita Alef custom-styled inputs,
   chips, and progress bar.
7. **Navigation** — desktop/mobile header, footer, and the questionnaire progress navigation.
8. **Icons & decorative elements** — `lucide-react` icon set actually imported in the app, sizes,
   and the emoji/star decorative elements used instead of icons in places.
9. **Images & assets** — every static image URL referenced in source, with its usage.
10. **Responsive behavior** — breakpoints (Tailwind defaults, none customized) and how key components adapt.
11. **Design tokens** — pointers to the three CSS files above.
12. **Component inventory** — table of reusable components, where they're used, and a keep/merge/replace status.
13. **Quality audit** — duplicate colors, near-duplicate borders, unused brand tokens, one-off colors,
    arbitrary radii, duplicated shadow recipes, missing font tokens, buttons that bypass the shared
    component, and a few contrast/mobile-readability notes.

## Key findings (see page for full detail)

- `--brand-blue` / `--brand-dark` tokens exist in `index.css` but are never referenced in JSX.
- Kita Alef components hand-type hex values (`#FF6FB5`, `#4FC3E8`, etc.) that already exist as
  `kita-*` Tailwind tokens — same color, two representations.
- `#F0E8F5` (used everywhere as the Kita Alef border color) is a near-duplicate of the declared
  `kita-border` token (`#EDE9F8`).
- Several one-off colors (`#ffc157`, `#c07028`, `#C4407A`, the Maya banner gradient) have no token at all.
- Border radius uses both the shared scale (`rounded-xl/2xl/3xl/full`) and arbitrary pixel values
  (`rounded-[10px]`, `rounded-[14px]`, `rounded-[20px]`, `rounded-[24px]`) in the Kita Alef flow.

No existing page, style, or component was modified to produce this documentation.