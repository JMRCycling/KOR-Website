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
