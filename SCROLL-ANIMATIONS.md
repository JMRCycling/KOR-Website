# Scroll Animations — Reference

Technique reference for scroll-driven animation on the KOR marketing site, written after building the first one (the "Our App" page hero image sequence). Use this before adding another one.

---

## 1. When to use this

`DESIGN.md`'s Motion section is explicit: **"No scroll-driven theater. No entrance animations on every element."** Scroll-driven animation (pinning a section, scrubbing frames or transforms as the user scrolls) is an **exception to that guideline, not a default pattern**. Every new use needs the same explicit, scoped sign-off the Our App hero got — see the Decisions Log entry in `DESIGN.md` dated 2026-07-15.

Before reaching for this: ask whether a short `whileInView`/`.slide-in`-style entrance (the existing convention — see `src/components/common/ScrollAnimations.tsx`) already does the job. Scroll-scrubbed sequences are for the rare case where the motion itself is the content (e.g. dramatizing a product in a hero), not a general-purpose page-liveliness tool.

---

## 2. The reusable component

`src/components/common/ScrollImageSequence.tsx` renders a canvas-based image sequence pinned via `position: sticky` for a scroll "runway," with a static-image fallback on mobile and under `prefers-reduced-motion`.

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `framePathTemplate` | `string` | — | Path with a literal `{index}` placeholder, e.g. `/images/app-welcome-sequence/frame_{index}.webp` |
| `frameCount` | `number` | — | Total frame count |
| `frameDigits` | `number` | `4` | Zero-pad width for `{index}` |
| `scrollLength` | `number` | `2` | Runway height as a multiplier of `100vh` |
| `fit` | `'contain' \| 'cover'` | `'contain'` | `contain` letterboxes (safe default — doesn't crop transparent-padded content); `cover` crop-fills (for full-bleed backgrounds) |
| `lookaheadMargin` | `string` | `'600px 0px'` | `IntersectionObserver` `rootMargin` — how far before the section preload starts |
| `preloadConcurrency` | `number` | `6` | Concurrent in-flight frame requests |
| `fallbackImageSrc` | `string` | — (required) | Static image for mobile / reduced-motion. Use a purpose-shot image, not a derived frame — see §5. Fades/slides in on mount automatically (skipped under reduced-motion) — no extra wiring needed |
| `fallbackAlt` | `string` | — (required) | Alt text for the fallback image |
| `topOffsetSelector` | `string` | — | CSS selector for a non-fixed element above this component that will scroll away (e.g. `"header"`). The pinned content is pulled up to start *behind* it (negative `margin-top`) rather than reserving permanent space for it — see §2 for why, and the z-index requirement that goes with it. Measured live on mount + resize |
| `runwayClassName` | `string` | — | Applied to the outer runway wrapper |
| `stickyClassName` | `string` | — | Merged onto the sticky pin wrapper — reuse an existing layout class here (e.g. a CSS grid) so the component doesn't need to know about your layout |
| `canvasWrapperClassName` | `string` | — | Wraps the canvas/fallback image — reuse an existing centering class if one exists |
| `canvasClassName` | `string` | — | Sizing/aspect-ratio for the canvas itself |
| `children` | `ReactNode` | — | Rendered inside the pinned viewport alongside the canvas (e.g. a text column that should stay pinned together with the visual) |
| `onFrameChange` | `(frameIndex: number) => void` | — | Fires whenever the displayed frame changes (active branch only — never fires on the static fallback, which has no frame concept). Use this to drive frame-gated reveals, e.g. show a caption once a given frame is reached — see the worked example below |

### Tuning playback pacing

Two independent levers control how a sequence *feels* once it's built — tune both after seeing it in the browser, not by guessing upfront. (The specific numbers below are Our App's — a different source video will have a different total frame count and a different scroll feel, so treat these as a worked example, not a default to copy.)

- **`scrollLength`** — how much scroll distance plays the whole sequence. Lower = frames advance faster per scroll click (less scrolling needed to see the whole thing); higher = slower, more deliberate. There's no "correct" value — it's a feel decision. The Our App hero shipped at `1.3` (130vh) after starting at `2` (200vh) and finding that too slow/scroll-heavy in practice.
- **`frameCount`** — beyond its use as a memory/payload lever (§3, §6), it also directly controls *where the sequence ends*. You don't need to touch the compressed asset folder to trim an animation short — if the visually-interesting part of a 420-frame sequence finishes by frame 337, just pass `frameCount={338}` and the component simply never requests frames 338-419. They stay on disk unused, which is fine (§6 covers the resulting payload/memory math either way).

Both are trivial one-line prop changes — reach for them before considering any change to the source frames or compression pipeline.

### Frame-gated reveals (`onFrameChange`)

Sometimes a piece of overlay content shouldn't appear until the sequence reaches a specific point (e.g. a caption that only makes sense once the subject has settled into a particular pose). `onFrameChange` reports the currently-displayed frame index; the *consuming page* owns the resulting show/hide state and styling — the component itself stays agnostic to what "frame 265" means content-wise.

Pattern: track the frame in the page's own `useState`, derive a boolean/class from it, and toggle a CSS class on whatever `children` element should react to it. Keep the actual hide/reveal styling (`opacity`/`transform`/`position`) in CSS, driven by that class, with a `transition` for a smooth fade rather than an instant cut:

```tsx
const [heroFrame, setHeroFrame] = useState(0);
const isCaptionVisible = heroFrame >= 265;
// ...
<ScrollImageSequence ... onFrameChange={setHeroFrame}>
  <div className={`caption${isCaptionVisible ? ' is-visible' : ''}`}>...</div>
</ScrollImageSequence>
```

**Don't put `onFrameChange` (or anything derived from it) in dependencies that would affect the component's own heavy effect.** It fires on essentially every scroll tick where the frame changes, so if the main preload/scroll-listener effect depended on it, that effect would tear down and rebuild constantly. Internally, `ScrollImageSequence` stores the latest callback in a ref and calls `ref.current?.(frame)` from inside the scroll handler specifically to avoid this — the same pattern is worth reusing for any future callback prop that reports high-frequency scroll state.

### Two composition patterns

The component is layout-agnostic — `stickyClassName`/`canvasWrapperClassName`/`children` let the *page* decide the layout, not the component. Two patterns came up building the Our App hero; pick based on how much of the source frame the actual subject occupies:

**Boxed column** — canvas sized to a fixed box (e.g. `aspect-ratio: 16/9; max-width: 420px`) sitting in a normal grid column next to text. Simple, predictable. **Only works well if the subject fills most of the frame.** If the source has a lot of transparent/empty padding around the subject (check with an alpha-bounding-box measurement — see §3), the subject renders far smaller than the box, because you're scaling the *whole frame* down, padding included.

**Full-bleed overlay** — canvas is `position: absolute; inset: 0` filling the entire section, with text `position: relative; z-index: 1` floating on top (matches `DESIGN.md`'s Hero pattern: "photo front and center, title floats on top, text-shadow for legibility"). This is what the Our App hero actually uses. It sidesteps the boxed-column sizing problem — since the source scales to the *section's* size (typically close to full viewport height), the subject reads at a comparable or larger size than a small boxed column would ever allow, even though it occupies the same fraction of the frame. Do the math with real numbers before assuming a small box will look right.

**`contain` vs `cover` in a full-bleed section whose height fills the viewport:** the section's own aspect ratio (width ÷ viewport height) almost never matches the source frame's aspect ratio, so one of them has to give. `contain` letterboxes — the full frame is always visible, with the mismatch showing up as transparent bars (parallax visible through them) on whichever axis doesn't fill. `cover` crops instead — it fills both axes of the section completely (typically height-constrained on ordinary widescreen viewports, since a viewport-height-tall section is usually narrower-than-16:9), and crops the excess width. The Our App hero uses `cover`: it reads more cinematic (true full-bleed, no visible letterbox bars) and the crop only eats into the source frame's already-transparent padding around the subject in most frames. **Check this against your specific source frames before assuming it's safe** — if a frame's content bleeds all the way to the edge (verify with an alpha-bounding-box measurement — see §3), `cover` *will* crop into real content at extreme viewport aspect ratios, not just padding.

**Fitting the pin below a page header that isn't itself fixed** (`topOffsetSelector`): a naive fix — reserve `headerHeight` of space by giving the sticky element `top: headerHeight; height: calc(100vh - headerHeight)` — looks right at first, but produces a **permanent empty gap** at the top of the viewport for the rest of the scroll, because a non-fixed header scrolls away entirely once you pass it, while that reserved space stays reserved forever. The actual fix: leave the sticky element's own `height`/`top` alone (still a full `100vh` at `top: 0`), and instead pull the *runway* up to start at `y: 0` from the very beginning via `margin-top: -headerHeight` — so the pin already spans the full viewport even while the header is still visible, just partially covered by it. This requires the header to visually stack *above* the pinned content during that brief initial overlap (`z-index` on the header — see `.header { z-index: 5 }` in `styles.css`), otherwise the canvas would incorrectly paint over the header instead of the other way around. Once scrolled past, the header is gone and the already-full-height pin is immediately visible with nothing to fill in.

### Worked example (Our App hero, `src/components/pages/OurApp.tsx` — full-bleed overlay, current as shipped)

```tsx
const HERO_CAPTION_REVEAL_FRAME = 265;
// ...
const [heroFrame, setHeroFrame] = useState(0);
const isHeroCaptionVisible = heroFrame >= HERO_CAPTION_REVEAL_FRAME;
// ...
<section className="app-screen-section app-hero-overlay-section">
  <ScrollImageSequence
    framePathTemplate="/images/app-welcome-sequence/frame_{index}.webp"
    frameCount={338}       // trimmed from the full 420 compressed — see "Tuning playback pacing"
    scrollLength={1.3}     // tuned down from 2 for a snappier feel
    fit="cover"
    lookaheadMargin="600px 0px"
    fallbackImageSrc="/images/Welcome.png"
    fallbackAlt="App Home Screen"
    topOffsetSelector="header"
    runwayClassName="app-hero-sequence-runway"
    stickyClassName="app-hero-sequence-sticky"
    canvasWrapperClassName="app-hero-sequence-canvas-wrapper"
    canvasClassName="app-hero-sequence-canvas"
    onFrameChange={setHeroFrame}
  >
    <div className={`our_app_textbox app-hero-overlay-text${isHeroCaptionVisible ? ' is-visible' : ''}`}>
      <h1>The Keep On Rolling App</h1>
      {/* ...copy... */}
    </div>
  </ScrollImageSequence>
</section>
```

```css
/* Full-bleed section itself — zero padding at every breakpoint. Must come after
   the page's responsive .app-screen-section padding rules in the cascade (same
   0,1,0 specificity), or it'll get overridden back to padded at 768px+. */
.app-hero-overlay-section { padding: 0; }

.app-hero-sequence-canvas-wrapper { display: flex; justify-content: center; } /* mobile fallback: normal flow */
.app-hero-sequence-canvas { width: 100%; max-width: 380px; height: auto; aspect-ratio: 16/9; }

/* Mobile (below 901px): a normal top-aligned, always-visible block — same
   compound-selector trick (must out-specificity the page's base .our_app_textbox
   rule regardless of source order), plus a transition so the desktop opacity/
   transform toggle below fades smoothly rather than cutting instantly. */
.our_app_textbox.app-hero-overlay-text {
  position: relative; z-index: 1; max-width: 560px;
  padding: 3rem 1.25rem; text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

@media (min-width: 901px) {   /* match the JS breakpoint exactly */
  .app-hero-sequence-canvas-wrapper { position: absolute; inset: 0; }
  .app-hero-sequence-canvas { width: 100%; height: 100%; max-width: none; aspect-ratio: auto; }

  /* Desktop: repositioned to a bottom-left caption, hidden until .is-visible
     (toggled by OurApp.tsx from onFrameChange — see "Frame-gated reveals" above). */
  .our_app_textbox.app-hero-overlay-text {
    position: absolute; left: 2rem; bottom: 2rem; padding: 0;
    opacity: 0; transform: translateY(16px); pointer-events: none;
  }
  .our_app_textbox.app-hero-overlay-text.is-visible {
    opacity: 1; transform: translateY(0); pointer-events: auto;
  }
}
```

**Gotcha: don't combine the overlay text with `.slide-in`.** The existing `.slide-in` reveal (`ScrollAnimations.tsx` — one page-level `IntersectionObserver` that adds `.visible` once, on mount) is designed for elements sitting in normal document flow. Layered onto text that's absolutely-adjacent to a `position: sticky` + `position: absolute` canvas stack, it was observed to leave the text stuck at `opacity: 0` (its pre-reveal state) — reproducible across fresh reloads at multiple viewport widths, not just a timing fluke. Rather than debug the interaction further, drop `slide-in` from this element: a hero headline overlaying an already-animating background doesn't need a *second*, separate slide-in motion competing with it — the phone animation is already the section's reveal. If a future overlay text block needs an entrance animation, use a scroll-progress-linked opacity/transform tied to the sequence's own `progress` value instead of the page-level `.slide-in` observer.

---

## 3. Asset prep workflow

1. **Export frames from source video** with `ffmpeg` (works fine on any machine with a standard ffmpeg build):
   ```bash
   ffmpeg -i input.mp4 -start_number 0 -vsync 0 -q:v 1 frames/frame_%06d.png
   ```
2. **Compress to alpha-preserving WebP** with the repo's script — **not ffmpeg**. The Homebrew ffmpeg build on the dev machine used for this feature (8.1.1) has **no libwebp encoder** (`ffmpeg -h encoder=libwebp` → "Codec not recognized"). Python 3 + Pillow is already installed and handles RGBA→WebP correctly:
   ```bash
   python3 scripts/compress-scroll-sequence.py <src_dir> <out_dir> [--width 960] [--quality 80]
   ```
   (If you'd rather use ffmpeg: `brew install webp` or a libwebp-enabled ffmpeg build both work, but aren't necessary — the Pillow path is already verified.)
3. **Sizing/quality guidance** — real benchmark from the Our App sequence (1920×1080 source, sampled 10 frames):

   | width | quality | avg/frame | est. total @ 420 frames |
   |---|---|---|---|
   | 960px | 80 | 31.4KB | ~13MB |
   | 960px | 70 | 26.2KB | ~11MB |
   | 640px | 80 | 18.6KB | ~7.6MB |

   960px covers 2x-retina density for a sequence displayed around 400-520px CSS width. Start there; `--width 640` is the first lever if payload needs to shrink further.
4. **Frame count** — don't assume you need to keep every exported frame, and don't treat any specific number (420, 338, or otherwise) as a target to match. **Every source video is different — frame count depends entirely on the source footage's length and your export frame rate, and will vary per animation.** As a rule of thumb, temporal resolution finer than ~60-150 frames total is often more than a scroll input can resolve anyway, regardless of how many frames the source exports to. This didn't end up mattering for the Our App sequence (see §6 — payload fit comfortably at the full compressed count), but it's the first lever if a future sequence's *decoded memory* footprint is a problem (frame count, not width, drives that — see §6). Separately, once a sequence exists, `frameCount` can also just trim where playback *ends* — see "Tuning playback pacing" in §2, a zero-pipeline-change lever distinct from sampling at compression time.
5. **Git hygiene** — raw frame exports (hundreds of MB of PNGs) are never committed. Gitignore the raw source folder; only the compressed output folder is tracked. See the `.gitignore` entry added for `public/images/opening_animation_frames/` as the pattern to follow (mirror the folder name for a new sequence).

---

## 4. Why these technique choices

- **`<canvas>` + `drawImage`, not `<img src>` swapping.** Swapping `<img>` src on every scroll tick can flash/flicker, especially before a frame is decoded. Canvas persists the same element and only repaints pixels — no flicker, and it's the standard technique behind "Apple-style" scroll-scrubbed product pages.
- **Section-relative `getBoundingClientRect()` progress math, not document `scrollY`/`scrollHeight`.** `progress = clamp(-rect.top / (rect.height - viewportHeight), 0, 1)` stays correct no matter what else is on the page — portable to any future usage site without recalibration.
- **CSS `position: sticky` for the pin, not JS-driven `position: fixed`.** Simpler, no manual top/bottom boundary tracking, and it's what a tall "runway" wrapper + a `100vh` sticky inner element gives you for free.
- **`IntersectionObserver`-gated preload and scroll listener**, matching the existing convention in `ScrollAnimations.tsx`/`SplitText.tsx`/`CountUp.tsx`. The scroll listener is only attached while the section is near the viewport — no listener at all while the section is nowhere close.
- **Concurrency-limited preload with contiguous-run clamping.** Frames load via a small worker pool (`preloadConcurrency`), and the frame the canvas is allowed to display is clamped to the *longest unbroken run of loaded frames from index 0* — not just a raw loaded-count. This guarantees the displayed frame never references a gap even if network responses resolve out of order.
- **`requestAnimationFrame` ticking-flag throttle** on the scroll handler — coalesces scroll events to at most one recompute+redraw per animation frame.
- **No new dependency.** GSAP/Framer Motion/motion.dev weren't installed in this codebase and weren't needed — everything here is hand-rolled `IntersectionObserver` + rAF + canvas, consistent with the rest of the site's scroll-animation code.

---

## 5. Mobile & accessibility checklist

- **Gate in JS, before the preload starts** — not just visually hidden by a CSS media query. `ScrollImageSequence` decides `isStaticFallback` via `matchMedia('(max-width: 900px)')` (matches the codebase's existing `.parallax-group` iOS-jank breakpoint) OR `matchMedia('(prefers-reduced-motion: reduce)')`, and when true, the runway/sticky/canvas DOM is never constructed and the frame preload never starts. This is what actually saves the bandwidth on mobile — a CSS-only fallback would still fetch every frame.
- **Live-updating gate.** Both `matchMedia` queries get `change` listeners, so DevTools emulation (viewport resize, reduced-motion toggle) takes effect without a page reload — makes this testable in the browser preview tools.
- **Fallback image should be a real, purpose-shot asset**, not a frame pulled from the sequence — a single extracted frame may look worse standalone than in motion. The Our App hero reuses the pre-existing `Welcome.png` screenshot for this reason.
- **Fallback image gets a built-in fade/slide entrance** (`.scroll-image-sequence-fallback` in `styles.css`) matching the site's existing `.slide-in` visual parameters, but implemented as a self-contained CSS `@keyframes` animation rather than the shared `ScrollAnimations.tsx` `IntersectionObserver` mechanism — that mechanism was found to leave text stuck at `opacity: 0` when combined with this component's sticky/absolute layout (see §2's full-bleed worked example). Automatically skipped under `prefers-reduced-motion` via a `@media (prefers-reduced-motion: no-preference)` guard — no extra wiring needed.
- **Fallback image gets its own aspect ratio reset, unconditionally.** The `<img>` receives both `canvasClassName` *and* `.scroll-image-sequence-fallback`. If `canvasClassName` sets `aspect-ratio`/`height` for the canvas's source-frame ratio (e.g. `16/9`, common for a landscape sequence), that same rule would otherwise also apply to the fallback `<img>` — and if the fallback image has a *different* natural shape (the Our App hero's fallback is a portrait phone screenshot), the browser stretches it to fill the forced box, visibly distorting it. `.scroll-image-sequence-fallback { height: auto; aspect-ratio: auto; }` in the component's base styles resets this unconditionally so the fallback always renders at its own natural proportions — this is why the rule exists even though it looks redundant at a glance.
- **Non-fixed header above the section?** Pass `topOffsetSelector` (e.g. `"header"`) so the pin extends seamlessly to the top of the viewport once that header scrolls away, instead of leaving a permanent gap — see §2 for the full mechanism and its `z-index` requirement.
- **Canvas is `aria-hidden="true"`** — treat it as decorative/supplementary when adjacent text already carries the section's meaning (as in the Our App hero). If a future sequence has no adjacent descriptive text, don't just hide it — give the runway wrapper a real `aria-label` instead.
- **Fallback `<img>` gets real `alt` text** via the required `fallbackAlt` prop.

---

## 6. Performance budget

Two separate budgets — don't conflate them. The formulas below are universal; the numbers plugged into them (frame count, dimensions) are Our App's specific values and will be different for every other animation — recompute for your own sequence rather than assuming these figures apply.

- **Compressed transfer size** (what's downloaded): keep a full sequence under ~10-15MB for a marketing hero. Controlled by frame **width** and WebP **quality**. For the Our App sequence: 420 compressed frames on disk (~13MB total), but the component's `frameCount={338}` prop means only frames 0-337 are ever requested at runtime (~10.5MB actually transferred) — trimming playback with `frameCount` (see "Tuning playback pacing") reduces the runtime transfer for free, without touching the compressed folder or re-running the pipeline.
- **Decoded memory** (what's resident in the browser while frames are preloaded as `Image` objects): roughly `width × height × 4 bytes × frameCount`. For the Our App sequence as shipped — 960×540 RGBA × 338 frames — that's **~670MB resident**, a real cost separate from the transfer size above. This is fine on desktop (where the sequence is active) but is exactly why mobile gets the lightweight static fallback instead of a scaled-down sequence. Controlled by frame **count**, not width/quality.

If a future sequence's decoded memory footprint is a problem in practice (check DevTools' Memory panel during verification), the levers are: reducing `frameCount` — either by trimming where playback ends (free, no pipeline changes, see "Tuning playback pacing") or by sampling every 2nd/3rd source frame during compression (§3, changes the pipeline) — not shrinking `--width` further, which only helps the transfer-size budget.

---

## 7. Checklist for adding a new scroll sequence

1. Get your sign-off logged — add a row to `DESIGN.md`'s Decisions Log describing the scope (this guideline is opt-in per-use, not a standing exception).
2. Export/collect your source frames (PNG, alpha if you need transparency).
3. Put the raw frame folder under `public/images/<name>_raw/` (or similar) and add it to `kor-react/.gitignore` immediately — before you forget and it ends up staged.
4. Run `scripts/compress-scroll-sequence.py <raw_dir> public/images/<name>/`. Spot-check a few output frames visually and check the total folder size against the budget in §6.
5. Drop in `<ScrollImageSequence>` with a `framePathTemplate` pointing at the new folder, `frameCount` matching your output count (this will be whatever your source video produced — see §3), and a `fallbackImageSrc` pointing at a real, purpose-shot static image (not a sequence frame). If a non-fixed header sits above the section, pass `topOffsetSelector` too (§2).
6. Reuse existing layout CSS classes via `stickyClassName`/`canvasWrapperClassName` where you can; only add new CSS for sizing/aspect-ratio specific to the new canvas. Decide `contain` vs `cover` based on your source frames' alpha bounding box (§2), not by default.
7. Verify: frame 0 shows immediately (no flash), scroll-scrub is smooth, alpha composites correctly if applicable, mobile/reduced-motion fallback renders with zero frame requests (check the Network panel), and DevTools Memory panel is sane for your frame count. If the dev server hangs indefinitely at "Starting the development server..." during this step, it's very likely a stale/corrupted `node_modules`, not your changes — confirm with `git stash` on a clean tree (still hangs = environment, not code) before debugging further, then fix with a clean reinstall (`rm -rf node_modules && npm ci`). This cost significant time building the Our App hero and wasn't related to the feature at all.
8. Tune pacing (`scrollLength`, `frameCount`-as-trim — see "Tuning playback pacing" in §2) by eye, in the browser, after the above all works — not before.
