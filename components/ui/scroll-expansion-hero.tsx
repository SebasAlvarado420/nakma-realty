'use client';

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import BrandName from '@/components/ui/BrandName';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgMediaSrc?: string;
  title?: string;
  eyebrow?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgMediaSrc,
  title = 'Natural, refined real estate rooted in Costa Rica.',
  eyebrow = 'NAKMA REALTY · COSTA RICA',
  scrollToExpand = 'Scroll to explore',
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Smooth lerp animation loop
  const animate = useCallback(() => {
    const current = progressRef.current;
    const target = targetRef.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.0003) {
      const next = current + diff * 0.09;
      progressRef.current = next;
      setProgress(next);

      if (next >= 0.995 && !expandedRef.current) {
        progressRef.current = 1;
        targetRef.current = 1;
        setProgress(1);
        setExpanded(true);
        expandedRef.current = true;
      } else if (next < 0.98 && expandedRef.current) {
        setExpanded(false);
        expandedRef.current = false;
      }

      rafRef.current = requestAnimationFrame(animate);
    } else {
      progressRef.current = target;
      setProgress(target);
      rafRef.current = null;
    }
  }, []);

  const startAnimate = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const nudgeTarget = useCallback(
    (delta: number) => {
      targetRef.current = clamp(targetRef.current + delta, 0, 1);
      startAnimate();
    },
    [startAnimate]
  );

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const atTop = window.scrollY <= 4;

      if (!expandedRef.current) {
        e.preventDefault();
        window.scrollTo(0, 0);
        nudgeTarget(e.deltaY * 0.00085);
        return;
      }

      if (expandedRef.current && e.deltaY < 0 && atTop) {
        e.preventDefault();
        nudgeTarget(e.deltaY * 0.00085);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const currentY = e.touches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - currentY;
      const atTop = window.scrollY <= 4;

      if (!expandedRef.current || (expandedRef.current && deltaY < 0 && atTop)) {
        e.preventDefault();
        window.scrollTo(0, 0);
        nudgeTarget(deltaY * 0.005);
        touchStartYRef.current = currentY;
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const onScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('scroll', onScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nudgeTarget]);

  // Split title into two balanced lines
  const words = title.trim().split(' ');
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  const eased = easeOutQuart(progress);

  // Video panel: starts as centered card, expands to fill
  const panelW = isMobile
    ? clamp(76 + eased * 24, 76, 100)
    : clamp(32 + eased * 68, 32, 100);
  const panelH = isMobile
    ? clamp(52 + eased * 48, 52, 100)
    : clamp(60 + eased * 40, 60, 100);
  const borderRadius = clamp(28 - eased * 28, 0, 28);

  // Title splits apart as scroll increases
  const titleOffset = eased * (isMobile ? 68 : 44);
  const titleOpacity = clamp(1 - progress * 1.55, 0, 1);

  // Background dims as panel expands
  const bgOpacity = clamp(1 - eased * 0.92, 0.06, 1);

  // Vignette on the video card fades away
  const cardOverlay = clamp(0.28 - eased * 0.24, 0.04, 0.3);

  // Below-fold content fades in near the end
  const contentOpacity = clamp((progress - 0.84) / 0.16, 0, 1);
  const contentY = clamp((1 - progress) * 30, 0, 30);

  // Brand lockup that fades in and STAYS large once the video has expanded
  const endTitleOpacity = clamp((progress - 0.6) / 0.34, 0, 1);

  return (
    <section
      className="relative overflow-hidden bg-[var(--nakma-dark)]"
      style={{ minHeight: children ? '120vh' : '100vh' }}
    >
      {/* ─── Sticky viewport ────────────────────────────────────────── */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden">

        {/* Background: full-bleed video or gradient */}
        <div
          className="absolute inset-0"
          style={{ opacity: bgOpacity, willChange: 'opacity' }}
        >
          {bgMediaSrc ? (
            <video
              className="h-full w-full object-cover"
              src={bgMediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(155deg,#243529_0%,#16110d_55%,#0d0b07_100%)]" />
          )}
          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_38%,rgba(0,0,0,0.04),rgba(0,0,0,0.58))]" />
        </div>

        {/* Top gradient for navbar legibility once expanded */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 100%)',
            opacity: clamp(progress * 2.5, 0, 1),
          }}
        />

        {/* ─── Expanding media panel ──────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative overflow-hidden"
            style={{
              width: `${panelW}vw`,
              height: `${panelH}vh`,
              maxWidth: '100vw',
              borderRadius: `${borderRadius}px`,
              boxShadow:
                progress < 0.88
                  ? '0 40px 120px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.07)'
                  : 'none',
              willChange: 'width, height, border-radius',
            }}
          >
            {mediaType === 'video' ? (
              <video
                className="h-full w-full object-cover"
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={mediaSrc}
                alt={title}
              />
            )}

            {/* Card vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, rgba(0,0,0,${cardOverlay}) 0%, rgba(0,0,0,${cardOverlay + 0.14}) 100%)`,
              }}
            />

            {/* Bottom text-legibility gradient — only visible before expand */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 100%)',
                opacity: clamp(1 - eased * 1.15, 0, 1),
              }}
            />
          </div>
        </div>

        {/* ─── Hero headline ──────────────────────────────────────── */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center ${
            textBlend ? 'mix-blend-difference' : ''
          }`}
          style={{ opacity: titleOpacity, willChange: 'opacity' }}
        >
          {/* Eyebrow label */}
          <p className="nakma-body mb-6 text-[10px] uppercase tracking-[0.48em] text-white/72 md:text-[11px]">
            {eyebrow}
          </p>

          {/* Large display title */}
          <h1
            className="nakma-display select-none text-[clamp(2.9rem,8.8vw,8.4rem)] leading-[0.9] tracking-[-0.01em]"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 28px rgba(0,0,0,0.45)",
              fontFeatureSettings: '"liga" 1, "kern" 1',
            }}
          >
            <span
              className="block"
              style={{
                transform: `translateX(-${titleOffset}vw)`,
                willChange: 'transform',
              }}
            >
              {line1}
            </span>
            <span
              className="block"
              style={{
                transform: `translateX(${titleOffset}vw)`,
                willChange: 'transform',
              }}
            >
              {line2}
            </span>
          </h1>

          {/* Scroll prompt */}
          <p
            className="nakma-body mt-9 text-[10px] uppercase tracking-[0.38em] text-white/58"
            style={{ opacity: clamp(1 - progress * 4, 0, 1) }}
          >
            {scrollToExpand}
          </p>
        </div>

        {/* ─── End-of-animation brand lockup — fades in and stays large ─── */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: endTitleOpacity, willChange: "opacity" }}
        >
          {/* Legibility scrim so the brand reads over any bright footage */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 72% 56% at 50% 50%, rgba(0,0,0,0.46), transparent 75%)",
            }}
          />
          <h2
            className="nakma-brand relative leading-none"
            style={{
              color: "#ffffff",
              fontSize: "clamp(3.2rem, 12vw, 10rem)",
              letterSpacing: "0.18em",
              textShadow: "0 6px 44px rgba(0,0,0,0.5)",
            }}
          >
            <BrandName />
          </h2>
          <p
            className="nakma-body relative mt-6 uppercase"
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "clamp(0.72rem, 1.8vw, 1.15rem)",
              letterSpacing: "0.46em",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Realty · Costa Rica
          </p>
        </div>

        {/* ─── Animated scroll bar indicator ─────────────────────── */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center"
          style={{
            opacity: progress < 0.06 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div className="h-12 w-px overflow-hidden bg-white/22">
            <div className="h-1/2 w-full bg-[var(--nakma-bg)] animate-[nakma-scroll_1.6s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* ─── Below-fold content — flush, no gap ─────────────────── */}
      {children ? (
        <div
          className="relative z-20"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentY}px)`,
            willChange: 'opacity, transform',
            marginTop: 0,
          }}
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
