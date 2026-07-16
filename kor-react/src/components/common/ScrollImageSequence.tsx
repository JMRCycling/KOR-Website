import React, { useEffect, useRef, useState } from 'react';

interface ScrollImageSequenceProps {
  /** Path template with a literal "{index}" placeholder, e.g. "/images/app-welcome-sequence/frame_{index}.webp" */
  framePathTemplate: string;
  frameCount: number;
  /** Zero-pad width for {index} in framePathTemplate. Default 4. */
  frameDigits?: number;
  /** Scroll runway length as a multiplier of 100vh. Default 2 (200vh). */
  scrollLength?: number;
  /** 'contain' (default) letterboxes to avoid cropping transparent-padded content; 'cover' crop-fills. */
  fit?: 'contain' | 'cover';
  /** Horizontal anchor, 0–1, same convention as CSS `object-position`/`background-position`: 0 =
   * left-aligned (crops/reveals from the right), 0.5 = centered (default), 1 = right-aligned. Use
   * to shift the subject left/right — e.g. to clear space for overlay text. */
  focalX?: number;
  /** Vertical anchor, 0–1, same convention: 0 = top-aligned, 0.5 = centered (default), 1 =
   * bottom-aligned (crops from the top, keeps the bottom flush — e.g. to ground a subject at the
   * bottom of the viewport instead of leaving it centered with an awkward gap below). */
  focalY?: number;
  /** Extra overscan multiplied onto the fit scale (default 1 = no zoom). Only useful together with
   * `focalX`: a `contain` frame can be flush against one edge with zero slack left to shift into at
   * some viewport aspects — a small zoom (e.g. 1.15) manufactures shiftable slack. Safe only when
   * the source has generous transparent padding around the subject on the side being cropped into;
   * verify against your specific frames before raising this. */
  zoom?: number;
  /** IntersectionObserver rootMargin used to start preloading before the section is in view. */
  lookaheadMargin?: string;
  /** Concurrent in-flight frame requests during preload. */
  preloadConcurrency?: number;
  /** Static image shown on mobile / prefers-reduced-motion instead of the animated sequence. */
  fallbackImageSrc: string;
  fallbackAlt: string;
  /** CSS selector for an element above this component (e.g. a page header) that isn't itself
   * fixed/sticky and will scroll away. The pinned content is pulled up to start behind it
   * (via negative margin) so that once it scrolls off, the full-height pin is already there
   * with no gap — rather than reserving permanent empty space for it. Requires that element
   * to stack above this component during the brief initial overlap (e.g. `z-index` on it).
   * Measured on mount and on resize. Omit if nothing sits above. */
  topOffsetSelector?: string;
  runwayClassName?: string;
  /** Merged onto the sticky pin wrapper — e.g. reuse an existing CSS grid class. */
  stickyClassName?: string;
  /** Wraps the canvas / fallback image — e.g. reuse an existing centering class. */
  canvasWrapperClassName?: string;
  canvasClassName?: string;
  /** Rendered inside the pinned viewport alongside the canvas (e.g. a text column). */
  children?: React.ReactNode;
  /** Called with the currently-displayed frame index whenever it changes (active branch only —
   * never fires on the static fallback, which has no frame concept). Use this to drive
   * frame-gated reveals (e.g. show a caption once a given frame is reached). */
  onFrameChange?: (frameIndex: number) => void;
}

const STATIC_FALLBACK_QUERY = '(max-width: 900px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const computeStaticFallback = () =>
  typeof window === 'undefined'
    ? false
    : window.matchMedia(STATIC_FALLBACK_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches;

const ScrollImageSequence: React.FC<ScrollImageSequenceProps> = ({
  framePathTemplate,
  frameCount,
  frameDigits = 4,
  scrollLength = 2,
  fit = 'contain',
  focalX = 0.5,
  focalY = 0.5,
  zoom = 1,
  lookaheadMargin = '600px 0px',
  preloadConcurrency = 6,
  fallbackImageSrc,
  fallbackAlt,
  topOffsetSelector,
  runwayClassName,
  stickyClassName,
  canvasWrapperClassName,
  canvasClassName,
  children,
  onFrameChange,
}) => {
  const [isStaticFallback, setIsStaticFallback] = useState(computeStaticFallback);
  const [topOffset, setTopOffset] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onFrameChangeRef = useRef(onFrameChange);

  // Keep the latest callback available to the scroll effect without needing it in that
  // effect's dependency array (which would tear down/rebuild the preload + listeners on
  // every parent re-render a frame-driven callback like this naturally causes).
  useEffect(() => {
    onFrameChangeRef.current = onFrameChange;
  }, [onFrameChange]);

  // Live-update the fallback decision so DevTools emulation / real resizes take effect without a reload.
  useEffect(() => {
    const narrowQuery = window.matchMedia(STATIC_FALLBACK_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setIsStaticFallback(narrowQuery.matches || reducedMotionQuery.matches);
    narrowQuery.addEventListener('change', update);
    reducedMotionQuery.addEventListener('change', update);
    return () => {
      narrowQuery.removeEventListener('change', update);
      reducedMotionQuery.removeEventListener('change', update);
    };
  }, []);

  // Measure the height of whatever sits above this component (e.g. a sticky header) so the
  // pinned viewport can fit below it instead of being partly hidden behind it.
  useEffect(() => {
    if (!topOffsetSelector) return;
    const measure = () => {
      const el = document.querySelector(topOffsetSelector);
      const height = el ? el.getBoundingClientRect().height : 0;
      setTopOffset(height);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [topOffsetSelector]);

  useEffect(() => {
    if (isStaticFallback) return;

    const runway = runwayRef.current;
    const canvas = canvasRef.current;
    if (!runway || !canvas) return;

    let aborted = false;
    let preloadStarted = false;
    let ticking = false;
    let lastDrawnIndex = -1;
    let rafId = 0;

    const images: HTMLImageElement[] = new Array(frameCount);
    const loaded: boolean[] = new Array(frameCount).fill(false);
    let contiguousLoaded = 0;
    let nextIndex = 0;

    const buildFramePath = (i: number) =>
      framePathTemplate.replace('{index}', String(i).padStart(frameDigits, '0'));

    const recomputeContiguous = () => {
      while (contiguousLoaded < frameCount && loaded[contiguousLoaded]) contiguousLoaded++;
    };

    const resizeCanvasToDisplaySize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        return true;
      }
      return false;
    };

    const drawFrame = (img: HTMLImageElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      resizeCanvasToDisplaySize();
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      const baseScale =
        fit === 'cover'
          ? Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
          : Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const scale = baseScale * zoom;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      // Standard object-position/background-position formula: 0 = top/left-aligned, 1 =
      // bottom/right-aligned, 0.5 = centered — self-clamping since focalX/focalY are 0-1.
      const dx = (cw - drawW) * focalX;
      const dy = (ch - drawH) * focalY;
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    const maybeDraw = (index: number) => {
      if (index === 0 && lastDrawnIndex === -1 && images[0]?.complete) {
        drawFrame(images[0]);
        lastDrawnIndex = 0;
        onFrameChangeRef.current?.(0);
      }
    };

    const loadOne = () => {
      if (aborted || nextIndex >= frameCount) return;
      const i = nextIndex++;
      const img = new Image();
      img.onload = () => {
        if (aborted) return;
        loaded[i] = true;
        recomputeContiguous();
        maybeDraw(i);
        loadOne();
      };
      img.onerror = () => {
        if (aborted) return;
        loadOne();
      };
      img.src = buildFramePath(i);
      images[i] = img;
    };

    const startPreload = () => {
      for (let c = 0; c < preloadConcurrency; c++) loadOne();
    };

    const computeProgress = () => {
      const rect = runway.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return rect.top <= 0 ? 1 : 0;
      return clamp(-rect.top / scrollable, 0, 1);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const progress = computeProgress();
        const desired = Math.round(progress * (frameCount - 1));
        const clamped = Math.min(desired, contiguousLoaded - 1);
        if (clamped >= 0 && clamped !== lastDrawnIndex) {
          drawFrame(images[clamped]);
          lastDrawnIndex = clamped;
          onFrameChangeRef.current?.(clamped);
        }
        ticking = false;
      });
    };

    const onResize = () => {
      resizeCanvasToDisplaySize();
      if (lastDrawnIndex >= 0 && images[lastDrawnIndex]) drawFrame(images[lastDrawnIndex]);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!preloadStarted) {
            preloadStarted = true;
            startPreload();
          }
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onResize);
          onScroll();
        } else {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize);
        }
      },
      { rootMargin: lookaheadMargin }
    );
    visibilityObserver.observe(runway);

    return () => {
      aborted = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      visibilityObserver.disconnect();
    };
  }, [isStaticFallback, framePathTemplate, frameCount, frameDigits, fit, focalX, focalY, zoom, lookaheadMargin, preloadConcurrency]);

  if (isStaticFallback) {
    return (
      <div className={stickyClassName}>
        {children}
        <div className={canvasWrapperClassName}>
          <img
            className={`scroll-image-sequence-fallback ${canvasClassName ?? ''}`}
            src={fallbackImageSrc}
            alt={fallbackAlt}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={runwayRef}
      className={`scroll-image-sequence-runway ${runwayClassName ?? ''}`}
      style={{ height: `${scrollLength * 100}vh`, marginTop: topOffsetSelector ? -topOffset : undefined }}
    >
      <div className={`scroll-image-sequence-sticky ${stickyClassName ?? ''}`}>
        {children}
        <div className={canvasWrapperClassName}>
          <canvas
            ref={canvasRef}
            className={`scroll-image-sequence-canvas ${canvasClassName ?? ''}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollImageSequence;
