# Design System — KOR (Keep On Rolling)

## Product Context

- **What this is:** Bike maintenance tracking app that integrates with Strava — automatically calculates component wear from every ride and alerts you before parts fail.
- **Who it's for:** Cyclists who use Strava and want to stop guessing when to service their bike. Both individual riders (B2C personal plans) and bike shops managing customer fleets (B2B shop portal).
- **Space/industry:** Cycling / fitness apps. Peers: Strava, Wahoo, Zwift. Key differentiator: none of them own "maintenance peace of mind" — KOR is the only product in this space whose core job is making sure your bike is handled.
- **Project types:**
  - `kor-react` — marketing website + web portals (shop dashboard, personal dashboard, articles)
  - Native iOS / Android app — companion app for riders
- **Memorable thing:** "Finally, maintenance made easy" + "Built by cyclists, for cyclists." Approachable relief + authentic cyclist credibility. Not a performance dashboard, not a gear catalog.

---

## Aesthetic Direction

- **Direction:** Cycling Heritage Utility — the visual language of classic race programs and workshop manuals, made digital-native. Functional, warm, confident. Think: trusted mechanic who also rides.
- **Decoration level:** Intentional — typography and color do the primary work. Subtle texture or rule lines are acceptable; blobs, gradients, icon-in-circle grids are not.
- **Mood:** Serious enough to be trusted with a $5,000 bike. Human enough to feel like it was built by someone who rides. Relieving — when you open KOR, maintenance feels handled.
- **What to avoid:** Orange (Strava/Zwift territory), purple gradients, centered-everything, generic SaaS grids, stock-photo-as-hero, system-ui as primary font.
- **Reference sites reviewed:** strava.com (social/community focus, Boathouse + Inter, Strava orange), wahoofitness.com (hardware-centric, dark premium, data-dense), zwift.com (gamified, Zwift orange, entertainment-first).
# KOR Design System

> **Memorable thing:** "Your bike talked to you first."  
> The site should feel like getting a smart mechanic's report before a big ride — precise, honest, grounded in the trail. Not a Silicon Valley app landing page.

---

## Color System

```css
:root {
  /* Core palette */
  --color-navy:    #2e4053;   /* primary brand — header, dark sections */
  --color-orange:  #E8821A;   /* action — CTAs, alerts, primary buttons */
  --color-green:   #678d58;   /* HEALTH STATUS ONLY — "Good" state in wear indicators */
  --color-warn:    #E8511A;   /* WARN state — "Replace Soon" in wear indicators */

  /* Surface scale */
  --color-dark:    #0d1520;   /* near-black — dark section backgrounds */
  --color-mid:     #1e2d3d;   /* slightly lighter dark surface */
  --color-white:   #ffffff;
  --color-off-white: #f4f4f2; /* cards, light section background */

  /* Text */
  --color-text-primary:  #111111;   /* body on white */
  --color-text-muted:    #555555;   /* secondary body on white */
  --color-text-on-dark:  #ffffff;
  --color-text-on-dark-muted: rgba(255, 255, 255, 0.65);
}
```

### Color rules

- `--color-green` is reserved for **"Good" status** in wear indicators and progress bars. Never use it as generic paragraph text color on white — that was an accident in the original CSS, and it reads as unintentional.
- `--color-orange` is for **actions and alerts only** — primary CTA buttons, "Replace Soon" warnings, links that need energy.
- `--color-navy` is the anchor — header background, dark hero overlays, footer.
- Remove `--accent1-color: #85ffc7`, `--nav-background-color: #fc4c02` — these are stray values that conflict with the palette.

---

## Typography

### Web (kor-react)

- **Display / Hero:** [League Gothic](https://fonts.google.com/specimen/League+Gothic) — ultra-condensed, uppercase, tight letter-spacing. Classic cycling poster energy, nothing in the competitor set has it. Already in use and working well.
  - Usage: page hero headlines, section titles, large callouts
  - Treatment: `text-transform: uppercase; letter-spacing: 0.01em; line-height: 0.9–1`
- **Body / UI:** [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) — replaces Lato. Same approachable readability, more character at mid-sizes, less generic.
  - Usage: paragraphs, labels, nav links, button text, form inputs
  - Weights: 400 (body), 500 (UI labels), 600 (buttons, emphasis)
- **Data / Numbers:** [Geist Mono](https://fonts.google.com/specimen/Geist+Mono) — for component wear percentages, distances, mileage counters, timestamps.
  - Usage: `font-variant-numeric: tabular-nums` always on. Any numeric data that changes or aligns in a table.
  - Weights: 400 (secondary data), 500 (primary data display)
- **Code:** Geist Mono (same family)

```html
<!-- Google Fonts load -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
--font-display: 'League Gothic', Arial Narrow, Arial, sans-serif;
--font-body:    'Instrument Sans', system-ui, sans-serif;
--font-data:    'Geist Mono', 'JetBrains Mono', monospace;
```

### Type Scale

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Hero | League Gothic | 80–128px | — | Page hero, first viewport |
| H1 | League Gothic | 48px | — | Section main title |
| H2 | League Gothic | 32px | — | Sub-section title |
| H3 | Instrument Sans | 22px | 600 | Card titles, feature names |
| Body Large | Instrument Sans | 18px | 400 | Lead paragraphs |
| Body | Instrument Sans | 16px | 400 | Default body copy |
| Body Small | Instrument Sans | 14px | 400 | Captions, secondary info |
| Label | Instrument Sans | 13px | 600 | Form labels, UI labels (uppercase, `letter-spacing: 0.04em`) |
| Data | Geist Mono | 28–40px | 400–500 | Component wear percentages, stats |
| Mono Small | Geist Mono | 11–13px | 400 | Timestamps, sync status, badges (uppercase, `letter-spacing: 0.08em`) |

### Mobile App Typography (native iOS/Android)

The current native app uses system fonts (SF Pro on iOS, Roboto on Android) with bold/heavy weights for headings. This is intentional for native feel. If the app ever moves toward custom fonts, Instrument Sans is the recommended choice — it renders well at mobile sizes and bridges the brand identity.

---

## Color

### Approach: Restrained — mint is the only active signal

The mint accent (`#85ffc7`) is the single color that means "action" or "success" on the web. It should appear only on: primary CTAs, active states, healthy component indicators, and success messages. When mint appears, it carries full semantic weight. Everything else is dark, neutral, or typographic.

### Web Palette

```css
:root {
  /* Brand */
  --col-bg:         #0f1a26;  /* Page background · hero surfaces */
  --col-navy:       #2e4053;  /* Secondary surfaces · nav · card backgrounds */
  --col-navy-mid:   #3a4f63;  /* Hover states on navy */
  --col-mint:       #85ffc7;  /* PRIMARY ACCENT — CTA buttons, success, active only */
  --col-warm-white: #f5f2ed;  /* Light mode page surface (not pure white — warmer) */
  --col-cool-gray:  #c8d4de;  /* Secondary text on dark surfaces */
  --col-slate:      #4a5a6a;  /* Borders · muted text on light surfaces */

  /* Semantic */
  --col-success:    #28a745;  /* Component healthy (supplemental to mint on dark) */
  --col-warning:    #ffc107;  /* Component needs attention soon */
  --col-error:      #dc3545;  /* Component overdue · critical · form errors */
  --col-info:       #17a2b8;  /* Strava sync status · informational */

  /* Neutrals */
  --col-near-black: #060d14;  /* Deepest background (footer, dark sections) */
  --col-card-dark:  #1a2d40;  /* Card backgrounds on dark page */
  --col-border:     #2a3d4f;  /* Dividers and borders on dark surfaces */
}
```

### Dark Mode (web — default for marketing)

Dark is the primary mode for the marketing site hero and shop dashboard. Light (`#f5f2ed`) is used for content-heavy sections (articles, feature breakdowns, pricing).

```css
/* Dark surface tokens */
--surface-page:   #0f1a26;
--surface-card:   #1a2d40;
--surface-raised: #2e4053;
--text-primary:   #ffffff;
--text-secondary: #c8d4de;
--text-muted:     #6b7f8f;
--border:         #2a3d4f;

/* Light surface tokens (sections, articles, pricing) */
[data-theme="light"] {
  --surface-page:   #f5f2ed;
  --surface-card:   #ffffff;
  --surface-raised: #eceae6;
  --text-primary:   #0f1a26;
  --text-secondary: #2e4053;
  --text-muted:     #4a5a6a;
  --border:         #d4cfc9;
}
```

### Mobile App Colors (current, as observed in production)

The native app uses a distinct color set. This is documented for awareness — the web design system above is the authoritative source for `kor-react`.

| Role | Color | Usage |
|------|-------|-------|
| Bike card — light | `~#8aad7a` | Inactive/unselected bike tile |
| Bike card — dark | `~#4a7a4a` | Selected bike tile |
| Progress bar fill | `~#22cc00` (bright green) | Component wear progress bar |
| Progress bar track | `#cccccc` | Empty track |
| Component row bg | `~#2a2a2a` | Dark mode card row |
| Button (Customize) | `#2e4053` | Matches web navy — consistent |
| Active nav icon | Cyan/teal `~#4db8d4` | Bottom tab bar active state |
| Page bg (dark) | `~#111111` | Darker than web dark bg |
| Page bg (light) | `#ffffff` | Pure white in light mode |

**Recommendation:** The app's bright green progress bars (`#22cc00`) and cyan nav icon are functional but diverge from the web brand. A future mobile design pass should evaluate: replacing the bright green with a variant of `#85ffc7` mint for progress bars, and aligning the nav active state to the same mint. The muted sage greens for bike cards are charming and could be kept.

---

## Spacing

- **Base unit:** 8px
- **Density:** Comfortable — maintenance data needs breathing room to be scannable. Cramped UI feels anxious; KOR's whole pitch is that maintenance is handled.

```css
--sp-1:  8px;   /* tight inline gaps */
--sp-2:  16px;  /* standard padding */
--sp-3:  24px;  /* card padding */
--sp-4:  32px;  /* section sub-spacing */
--sp-6:  48px;  /* section padding */
--sp-8:  64px;  /* large section gaps */
--sp-12: 96px;  /* page-level section breaks */
```

---

## Layout

- **Approach:** Hybrid
  - Marketing pages (Home, Our Story, Our App, Personal Plans): editorial, asymmetric, strong typographic hierarchy. First viewport as poster, not document. League Gothic headlines can bleed or break the grid.
  - App/portal pages (Shop Dashboard, Personal Dashboard, QR Guide): structured grid, data-dense but breathable. Cards align to a strict 8-column system.
- **Grid:** 12 columns, 24px gutter, 1200px max content width
- **Breakpoints:**
  - Mobile: `< 640px` — single column, full-width
  - Tablet: `640px–1024px` — 2 columns
  - Desktop: `> 1024px` — 12-column grid active
- **Border radius:**
  - `--r-sm: 4px` — buttons, inputs, badges
  - `--r-md: 8px` — small cards, tooltips
  - `--r-lg: 12px` — large cards, panels, modals
  - `--r-full: 9999px` — pill badges only
- **Max content width:** 1200px

---

## Motion

- **Approach:** Intentional — motion aids comprehension and communicates state changes. No scroll-driven theater. No entrance animations on every element.
- **Key moments for motion:**
  - Component status changing (green → amber → red) — medium transition, communicates urgency gradually
  - Dashboard data loading in — short fade-up, not bounce
  - Modal / sheet open — medium ease-in-out
  - Button hover — micro, transform only
  - Alert appearing — short ease-out from top/bottom

```css
/* Easing */
--ease-enter: cubic-bezier(0, 0, 0.2, 1);   /* ease-out: things arriving */
--ease-exit:  cubic-bezier(0.4, 0, 1, 1);   /* ease-in: things leaving */
--ease-move:  cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out: things repositioning */

/* Durations */
--dur-micro:  75ms;   /* icon states, toggle switches */
--dur-short:  200ms;  /* buttons, hover, tooltips */
--dur-medium: 320ms;  /* modals, page transitions, status changes */
--dur-long:   500ms;  /* onboarding sequences, celebration states */
```

---

## Component Conventions

### Buttons

- **Primary** (`--col-mint` bg, `#0f1a26` text): Download CTAs, primary form submit, primary shop action
- **Secondary** (transparent bg, `--col-mint` border + text): Supporting CTAs, "Learn More"
- **Ghost** (transparent bg, `--border` border, `--text-secondary` text): Nav actions, "Log In"
- **Dark** (`--col-navy` bg, `--col-warm-white` text): Dark-on-light-mode CTAs, "For Shops"
- Never use gradient fills on buttons. Never use border-radius above `--r-sm` on primary buttons (keep them sharp, not bubbly).

### Cards

- Maintenance cards: always show component name, wear percentage in `--font-data`, progress bar, and time/distance until service
- Wear status drives border-left color: mint (healthy) → warning yellow → error red
- Shop dashboard cards: follow the same pattern but add "bike owner" and "scheduled date" fields

### Progress Bars

- Track height: 4px
- Fill colors: `--col-mint` (>50%), `--col-warning` (20–50%), `--col-error` (<20%)
- Always pair with a numeric readout in `--font-data` — never a bar alone

### Forms

- Labels: `--font-body` 13px 600, uppercase, `--text-secondary`
- Inputs: `--surface-raised` bg, `--border` default, `--col-mint` focus ring
- Error state: `--col-error` border, error message below in `--font-data` 11px
- No floating labels — they obscure context when the field is filled

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-11 | Initial design system created | `/design-consultation` — based on product context, competitive research (Strava, Wahoo, Zwift), and mobile app screenshots |
| 2026-06-11 | League Gothic kept as display font | Already in use and distinctively KOR — no competitor in the cycling space has it |
| 2026-06-11 | Lato replaced with Instrument Sans | Lato is on the overused-fonts list; Instrument Sans is the same approachability DNA with more character |
| 2026-06-11 | Geist Mono added for data display | Component wear numbers and mileage deserve a purpose-built monospace with tabular-nums |
| 2026-06-11 | Mint `#85ffc7` as the only active signal | Stripping all decorative color use so mint carries full semantic weight when it appears |
| 2026-06-11 | Warm off-white `#f5f2ed` for light surfaces | "Workshop paper" feel — human-made, not SaaS. Deliberately not pure white. |
| 2026-06-11 | Mobile app colors documented separately | App uses different greens (sage, bright green) and a cyan nav — noted as a future unification opportunity, not changed in this pass |
| 2026-06-11 | No AI-generated app mockups in design assets | Real app screenshots are the source of truth for mobile UI; synthetic renders that don't match the actual app create false reference |
| 2026-07-15 | Scroll-scrubbed image-sequence hero exempted from "No scroll-driven theater" | Our App page's first hero section uses a canvas-rendered, IntersectionObserver-gated frame sequence pinned via CSS `position: sticky` to play the app's welcome screen settling into view as the user scrolls, replacing a static screenshot. Deliberate, scoped exception — one hero section, not a site-wide pattern — with a static-image fallback under `prefers-reduced-motion` and on mobile (<900px), matching the existing `.parallax-group` breakpoint. See `SCROLL-ANIMATIONS.md`. |
| 2026-07-16 | Second scroll-scrubbed image-sequence use, replacing "Your ride, at a glance" | Same technique/component as the first hero, applied to a second section on the Our App page: a phone rotating from a close-up camera shot to the app's maintenance dashboard, replacing the static `Dashboard.png` screenshot. Full-bleed overlay, `fit="contain"` with a horizontally-shifted focal point (new `focalX` prop on `ScrollImageSequence`) so the phone sits in the left half, clear of the caption. Same mobile/reduced-motion fallback pattern as hero 1. Scoped, deliberate per-use sign-off per `SCROLL-ANIMATIONS.md` §1 — still not a site-wide pattern. |
| 2026-07-18 | Third scroll-scrubbed image-sequence use, replacing "Full part history" | Same technique/component as heroes 1–2, applied to a third section on the Our App page: a part popping into view and settling as the user scrolls, illustrating full part history, replacing the static `PartPopup.png` screenshot. Full-bleed overlay, `fit="contain"` (subject's alpha bounding box moves widely across the frame — no safe crop margin for `cover`). Same mobile/reduced-motion fallback pattern as heroes 1–2 (`PartPopup.png` reused as the fallback image). Scoped, deliberate per-use sign-off per `SCROLL-ANIMATIONS.md` §1 — still not a site-wide pattern. |
```css
:root {
  --font-heading: 'League Gothic', sans-serif;
  --font-body:    'Lato', Helvetica, sans-serif;
}
```

### Scale

| Use | Size | Weight | Font |
|---|---|---|---|
| Hero title | `clamp(3.5rem, 8vw, 7rem)` | normal (League Gothic is inherently heavy) | heading |
| Section heading | `clamp(2rem, 4vw, 3.5rem)` | normal | heading |
| Subheading | `1.25rem` | 600 | body |
| Body | `1rem` | 400 | body |
| Caption / label | `0.85rem` | 400–600 | body |

### Typography rules

- League Gothic at large sizes with **no letter-spacing** override. The font was designed to be used at display sizes — trust it.
- NEVER wrap H1 text in a colored pill/box with `background-color`. Let the heading be type, not a badge.
- Use a **text-shadow** (`0 2px 20px rgba(0,0,0,0.6)`) on headings that appear directly over photos.

---

## Spacing

- Base unit: `8px`
- Section vertical padding: `80px` desktop, `48px` mobile
- Card padding: `24px` internal, `16px` gap between cards
- Max content width: `1200px`, centered

---

## Components

### Hero

**What it should do:** Put the trail photo front and center with nearly nothing obscuring it. The title and store buttons float on the photo.

**What to avoid:**
- ❌ Semi-transparent dark box around the CTA (`rgba(0,0,0,0.4)` with `border-radius: 15px`)
- ❌ Navy pill around H1 (`.title_box` pattern)
- ❌ Bullet list of "Smart Tracking / Strava Integration / Proactive Alerts" in the hero — abstract, no user sees themselves in it

**What to do instead:**
- White League Gothic title directly on photo, text-shadow for legibility
- App store buttons below the title, side-by-side (already correct)
- Keep the parallax effect

### Component Wear Demo (replaces "Why Choose KOR?")

The biggest homepage upgrade: **show the product**. Three feature cards describing "Simple & Intuitive" tell nobody anything. A live component health readout shows the exact value KOR provides.

Render three wear indicators with animated percentages:

```
Chain          ████████░░  81%   Replace Soon (orange)
Brake Pads     ████░░░░░░  45%   Good (green)
Cassette       ███░░░░░░░  28%   Good (green)
```

Use **ReactBits CountUp** to animate the percentages counting up as the section enters the viewport. Pair with `GlareHover` on the card container.

Section header: **"Know before it fails."** (Not "Why Choose KOR?")

### Stats Row (optional, high-impact)

Between hero and features:

```
_________ rides synced   |   _________ components tracked   |   Free forever
```

Use ReactBits **CountUp** on the numbers. Background: ReactBits **DotField** at ~15% opacity in `--color-navy`. This feels like a technical readout — a mileage dashboard.

### CTA Button

```css
.btn-primary {
  background-color: var(--color-orange);
  color: white;
  padding: 14px 28px;
  border-radius: 6px;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  letter-spacing: 0.03em;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(232, 130, 26, 0.4);
}
```

The personal plans link in the hero (`KOR's personal plans keep your maintenance dialed in...`) is currently a wall of text in a link. Replace with: **"Personal plans →"** as a secondary button or text link. Never use a paragraph as a CTA.

### Cards / Feature Items

- Use ReactBits **GlareHover** wrapper on any card that should feel premium
- Corner radius: `8px` (not `20px` — rounding that aggressive feels consumer-app, not precision-tool)
- Cards on dark background: `background-color: var(--color-mid)`, 1px border `rgba(255,255,255,0.08)`
- Cards on white: `background-color: var(--color-off-white)`, box-shadow `0 2px 12px rgba(0,0,0,0.06)`

### Header

Current header is solid. Keep the dark navy, keep the logo left + nav center layout.

One fix: the "Log In" link on the right should visually separate from nav links — add a subtle border or make it an outlined button so it's clear it's an auth action, not a nav link.

### Footer

Currently minimal to the point of being useless. Minimum required:
- App store download links (iOS + Android) — the whole point of the site
- Real social links (not placeholder `facebook.com`)
- Navigation links: Articles, Our Story, FAQ, Contact
- Copyright

---

## ReactBits Integration

Install from the [ReactBits registry](https://reactbits.dev/get-started/installation):

```bash
npx shadcn@latest add https://reactbits.dev/r/<component-name>
```

### Approved components for KOR

| Component | URL | Use case | Priority |
|---|---|---|---|
| CountUp | `/text-animations/count-up` | Wear percentages, stats row numbers | High |
| SplitText | `/text-animations/split-text` | Hero headline animating in word-by-word | Medium |
| GlareHover | `/animations/glare-hover` | Wraps feature cards for depth | Medium |
| DotField | `/backgrounds/dot-field` | Stats section background, navy at 15% opacity | Medium |
| ScrollReveal | `/text-animations/scroll-reveal` | Body copy entering on scroll in features section | Low |
| ClickSpark | `/animations/click-spark` | Optional: spark on app store button click | Low |

### Do not use

These are visual gimmicks that fight the brand's "precision tool" feeling:
- PixelTrail, GlitchText, AsciiText, Ballpit, Ribbons, MagicRings, GhostCursor

---

## What to build next

Priority order — each is a standalone PR:

1. **`fix/hero-title-pill`** — Remove `.title_box` navy background, replace with white League Gothic + text-shadow
2. **`feat/component-wear-section`** — Replace "Why Choose KOR?" 3-card grid with animated component health demo using CountUp
3. **`feat/footer-app-links`** — Add real App Store / Google Play buttons to footer, fix social links
4. **`fix/css-token-cleanup`** — Remove stray CSS variables (`--accent1-color`, `--nav-background-color`, old duplicate `.parallax-container`), rename `--paragraph-color-on-white` to reserve green for status use only
5. **`feat/stats-row`** — Add countup stats between hero and features with DotField background
6. **`feat/reactbits-countup`** — Wire in CountUp to component wear percentages
