---
name: Release Hub
description: Internal PM tool for authoring and publishing release announcements
colors:
  violet-accent: "#aa3bff"
  violet-accent-dark: "#c084fc"
  violet-accent-bg: "#f3e8ff"
  violet-active-nav-bg: "#ede9fe"
  page-bg: "#f9fafb"
  surface: "#ffffff"
  border: "#e5e7eb"
  border-input: "#d1d5db"
  text-primary: "#111827"
  text-secondary: "#374151"
  text-muted: "#6b7280"
  text-placeholder: "#9ca3af"
  status-pending-bg: "#fef3c7"
  status-pending-text: "#b45309"
  status-pending-dot: "#f59e0b"
  status-approved-bg: "#dbeafe"
  status-approved-text: "#1d4ed8"
  status-approved-dot: "#3b82f6"
  status-published-bg: "#dcfce7"
  status-published-text: "#15803d"
  status-published-dot: "#22c55e"
  status-neutral-bg: "#f3f4f6"
  status-neutral-text: "#4b5563"
  status-neutral-dot: "#9ca3af"
typography:
  display:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  body-renderer:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
  label:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.violet-accent}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "#8b22e0"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  nav-item-default:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.violet-active-nav-bg}"
    textColor: "#6d28d9"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  status-badge:
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Release Hub

## 1. Overview

**Creative North Star: "The Signal Tower"**

Release Hub is a tool that disappears. PMs open it, do their work, and close it. The interface should never compete for attention with the releases being published — it exists to move content through a workflow, not to be noticed. Surfaces are quiet: off-white backgrounds, gray infrastructure, no decorative flourishes. The only color on screen is color that means something.

The violet accent (`#aa3bff`) is the one voice that speaks. It appears on action buttons, focus rings, and active nav states — the exact points where a PM is committing to something. The status system extends this logic: amber for pending, blue for approved, green for published. These colors are signals, not decoration. When a PM scans the release table and sees green, they know a release is live. That recognition is the interface doing its job.

The renderer (the announcement widget embedded in other products) inherits this same system. The violet CTA button in a published release is the same violet as the builder's primary action button. PMs author and their audiences receive in one visual language.

**Key Characteristics:**
- Flat, tonal surfaces: depth through gray-50 vs white, not shadow or blur
- Violet reserved for decision points and the active state of things in flight
- Status colors are load-bearing: semantic, never decorative
- System-ui typography: no personality of its own, maximum legibility
- Compact information density; the builder is a production board, not a dashboard

## 2. Colors: The Tower Palette

A restrained neutral infrastructure with a single electric voice at 295 degrees.

### Primary
- **Tower Violet** (`#aa3bff`): The single action accent. Primary buttons, focus rings, active nav indicator, accent dots in Template C. Its rarity on any given screen is what makes it feel like a notification. Dark-mode equivalent: `#c084fc` (same hue, pulled back to 72% lightness).

### Neutral
- **Page Ground** (`#f9fafb`): App shell background. The furthest-back layer.
- **Surface White** (`#ffffff`): Cards, panels, sidebar, topbar. One step forward from the ground.
- **Divider** (`#e5e7eb`): Borders between surfaces, table row dividers, sidebar right edge.
- **Input Edge** (`#d1d5db`): Form input borders at rest.
- **Quiet Text** (`#6b7280`): Muted labels, placeholder context, empty-state copy.
- **Secondary Text** (`#374151`): Body copy, form labels.
- **Heading Text** (`#111827`): Page titles, table column headers, release template headings.

### Status (The Signal Colors)
Semantic only. Never used for decoration.
- **Pending** (`#fef3c7` bg / `#b45309` text / `#f59e0b` dot): Waiting for approval.
- **Approved** (`#dbeafe` bg / `#1d4ed8` text / `#3b82f6` dot): Cleared, not yet live.
- **Published** (`#dcfce7` bg / `#15803d` text / `#22c55e` dot): Live. The most important state.
- **Draft / Archived** (`#f3f4f6` bg / `#4b5563` text / `#9ca3af` dot): At rest; not in flow.

### Named Rules
**The One Voice Rule.** Violet appears on at most 10% of any given screen. One primary button. One active nav item. One focus ring at a time. Two violet elements competing on the same screen is prohibited.

**The Status Purity Rule.** Amber, blue, and green appear exclusively inside status badges. If you need a callout or highlight block, use a gray-50 tint. Status colors are reserved for workflow state.

**The Retirement Rule.** `indigo-600` (`#4f46e5`) and every Tailwind indigo-* value is retired. Violet (`#aa3bff`) is the canonical accent. No new code references indigo as a primary action color.

## 3. Typography

**All Roles:** system-ui, 'Segoe UI', Roboto, sans-serif
**Mono:** ui-monospace, Consolas, monospace

**Character:** Deliberately unpretentious. System-ui resolves to the user's OS typeface, so the interface feels native and frictionless. There is no brand typography; the content of the releases is the typography story. The builder's job is legibility under pressure; the renderer's job is reading comfort.

### Hierarchy
- **Display** (500 weight, clamp(2.25rem, 5vw, 3.5rem), line-height 1.05, tracking -0.03em): Release headings in the renderer only. Big, tight, pulled slightly in. Appears nowhere in the builder.
- **Headline** (500 weight, 24px, line-height 1.18, tracking -0.01em): Section headings in renderer templates (h2). Slightly tracked-in for polish.
- **Title** (500 weight, 14px, line-height 1.5): Page title in the topbar. Panel section labels in the editor. Medium weight; no size drama.
- **Body** (400 weight, 14px/1.5 in builder; 18px/1.45 in renderer): The workhorse. Builder body is compact for dense editing UI. Renderer body is relaxed for reading comfort. Max line length 65ch in the renderer.
- **Label** (600 weight, 11px, letter-spacing 0.05em, UPPERCASE): Table column headers and field section labels only. All-caps at 11px is the only uppercase context in the system.

### Named Rules
**The Renderer Exception.** Body text in the renderer runs at 18px, not 14px. The builder is a production environment; the renderer is a communication surface. Different jobs, different comfort.

**The Uppercase Ceiling.** All-caps text is permitted only at 11px label weight. Never on body copy, never on headings, never on button labels.

## 4. Elevation

This system is flat by default. Surfaces are distinguished by tonal value (`#f9fafb` vs `#ffffff`), not by shadow or blur. The page background sits at Page Ground (gray-50); cards and panels sit at Surface White. That one-step tonal shift is the only depth signal at rest.

Shadows appear in exactly one context: hover feedback on interactive elements in the renderer (social link buttons). The shadow there is ambient, diffuse, and structural — it lifts the element to confirm interactivity, then disappears on mouse-out.

### Shadow Vocabulary
- **Ambient Hover** (`rgba(0,0,0,0.1) 0 10px 15px -3px, rgba(0,0,0,0.05) 0 4px 6px -2px`): Renderer interactive elements at hover only. Not used anywhere in the builder.

### Named Rules
**The Flat-By-Default Rule.** No surface has a shadow at rest. Shadows are hover-state feedback only, and only in the renderer. If you are reaching for a `box-shadow` to add depth to a static card in the builder, use a tonal background shift instead.

## 5. Components

### Buttons
The primary button is the most violet surface in the builder. It should be the only one.
- **Shape:** Gently curved (8px radius)
- **Primary:** Tower Violet (`#aa3bff`) background, white text, 10px top/bottom / 16px left/right padding. Transitions to `#8b22e0` on hover, 150ms ease-out.
- **Focus:** 2px violet outline, 2px offset. Always visible; never suppressed.
- **Ghost:** No background, Quiet Text (`#6b7280`), 6px radius. Used for secondary inline actions only (add bullet, text link-style triggers).

### Status Badges
The visual heartbeat of the release table. Every release carries exactly one.
- **Shape:** Pill (9999px radius), 2px top/bottom / 8px left/right padding
- **Content:** 6x6px dot + 11px semibold label
- **Five states:** Draft (neutral), Pending (amber), Approved (blue), Published (green), Archived (neutral-faded)
- **Rule:** Badge background is always the tinted semantic hue at 10-15% opacity. Never solid fill.

### Inputs / Fields
Stroke inputs on white surfaces; border shifts to focus ring on interaction.
- **Style:** White background, `#d1d5db` 1px border at rest, 8px radius
- **Focus:** Border disappears; 2px violet ring at 0 offset. Ring only — no border + ring double-treatment.
- **Placeholder:** `#9ca3af`
- **Textarea:** Same treatment as text inputs; `resize: none` in the editor context.
- **Error (not yet implemented):** Follow the same ring pattern in red (`#ef4444`). No border-left stripe.

### Cards / Panels
The primary container throughout the builder.
- **Corner Style:** Generously rounded (12px)
- **Background:** Surface White (`#ffffff`)
- **Border:** 1px `#e5e7eb`
- **Shadow:** None at rest
- **Internal Padding:** 16px standard; 24px for more spacious content panels

### Navigation (Sidebar)
- **Container:** Surface White, 224px wide, 1px right border at `#e5e7eb`
- **Wordmark:** 14px semibold, uppercase, violet (`#aa3bff`), tracking-wide. The only uppercase text above 11px in the system; justified by its badge-like nature.
- **Nav items:** 6px radius, 8px/12px padding. Default: `#4b5563` text, transparent background. Hover: `#f3f4f6` background. Active: `#ede9fe` background (violet-100 tint), `#6d28d9` text. 150ms transition.
- **Icons:** 16px, matching the text color, stroke-based.

### Topbar
- **Height:** 56px, Surface White background, 1px bottom border at `#e5e7eb`
- **Content:** Page title only. 14px, 500 weight, `#374151`. No actions, no breadcrumbs. It names the view; nothing more.

### Release Templates (Renderer)
Three layout variants: A (media top), B (text-only), C (bullets). All share:
- **CTA Button:** Tower Violet (`#aa3bff`), white text, 8px radius. Same as builder primary button; the one moment of shared accent between the two surfaces.
- **Heading:** 500 weight, 24px, gray-900. Display size (clamp) only when it is the sole element above the fold.
- **Body text:** 18px, `#4b5563` (Quiet Text shifted one step darker for reading comfort), relaxed line-height.

## 6. Do's and Don'ts

### Do:
- **Do** use violet exclusively as the primary action color: one button, one active nav item, one focus ring per screen. That is the budget.
- **Do** use the tonal shift (gray-50 ground / white surface) as the primary depth signal at rest. It is sufficient.
- **Do** use status colors only inside status badges tied to release lifecycle states. If it is not a state in the machine (draft, pending, approved, published, archived), it has no status color.
- **Do** use `rounded-xl` (12px) for panels and cards; `rounded-lg` (8px) for inputs and buttons; `rounded-full` for badges. Keep the radius vocabulary consistent.
- **Do** write table column headers and editor section labels in 11px semibold uppercase. That is the only all-caps context.
- **Do** keep the topbar to a title only. It names the view. It does not act.
- **Do** use the renderer's body size (18px) for any surface that is read, not operated. The builder is operated; renderer templates are read.

### Don't:
- **Don't** use `indigo-600` (`#4f46e5`) or any Tailwind indigo value as a primary action color. It is retired. Violet (`#aa3bff`) is canonical.
- **Don't** add shadows to builder cards, panels, or surfaces at rest. Flat-By-Default Rule applies in the builder without exception.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any component. Rewrite with a background tint, a leading status dot, or nothing.
- **Don't** add a second violet element to a screen to reinforce hierarchy. Competing violet elements collapse the signal.
- **Don't** use status semantic colors (amber, blue, green) outside of status badges. A callout block is gray-50 with a gray-200 border, not amber.
- **Don't** add glassmorphism, blurred backdrops, or gradient fills. The builder is infrastructure; it does not perform.
- **Don't** build a hero-metric panel (big number, supporting stats, gradient accent). This is a production board, not a marketing dashboard.
- **Don't** use uppercase text above 11px outside the sidebar wordmark. The Uppercase Ceiling is firm.
