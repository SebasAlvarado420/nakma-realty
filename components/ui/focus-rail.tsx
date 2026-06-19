"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
  price?: string;
  location?: string;
  code?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 1,
};

const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 20,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 5000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        if (delta > 0) handleNext();
        else handlePrev();
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) handleNext();
    else if (swipe > swipeConfidenceThreshold) handlePrev();
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-[var(--nakma-dark)] select-none outline-none",
        className
      )}
      style={{ minHeight: "680px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* ─── Ambient background bloom ──────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top fade — merges with hero's dark end */}
        <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-[var(--nakma-dark)] to-transparent pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeItem.imageSrc}
              alt=""
              className="h-full w-full object-cover blur-[80px] saturate-150 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--nakma-dark)] via-[var(--nakma-dark)]/60 to-transparent" />
          </motion.div>
        </AnimatePresence>
        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.025] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
      </div>

      {/* ─── Section label ──────────────────────────────────────── */}
      <div className="relative z-10 flex items-end justify-between px-6 pt-10 pb-0 md:px-12 lg:px-16">
        <div>
          <p className="nakma-body text-[10px] uppercase tracking-[0.46em] text-[var(--nakma-sand)]/80">
            Featured Listings
          </p>
          <h2 className="nakma-display mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[var(--nakma-bg)] md:text-[36px]">
            Exceptional properties in{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeItem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="inline-block text-[var(--nakma-sand)]"
              >
                {activeItem.meta ?? "Costa Rica"}
              </motion.span>
            </AnimatePresence>
          </h2>
        </div>

        {/* Desktop nav controls */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all duration-200 hover:border-white/30 hover:text-white active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[52px] text-center font-mono text-[11px] text-white/30">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all duration-200 hover:border-white/30 hover:text-white active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── 3D Card Rail ───────────────────────────────────────── */}
      <motion.div
        className="relative z-10 mx-auto flex h-[400px] w-full items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
      >
        {visibleIndices.map((offset) => {
          const absIndex = active + offset;
          const index = wrap(0, count, absIndex);
          const item = items[index];

          if (!loop && (absIndex < 0 || absIndex >= count)) return null;

          const isCenter = offset === 0;
          const dist = Math.abs(offset);

          const xOffset = offset * 300;
          const zOffset = -dist * 160;
          const scale = isCenter ? 1 : 0.84;
          const rotateY = offset * -18;
          const opacity = isCenter ? 1 : Math.max(0.08, 1 - dist * 0.48);
          const blur = isCenter ? 0 : dist * 5;
          const brightness = isCenter ? 1 : 0.45;

          return (
            <motion.div
              key={absIndex}
              className={cn(
                "absolute w-[240px] md:w-[280px] lg:w-[300px] rounded-[24px] overflow-hidden shadow-2xl",
                isCenter ? "z-20" : "z-10",
                !isCenter && "cursor-pointer"
              )}
              style={{
                aspectRatio: "3/4",
                transformStyle: "preserve-3d",
              }}
              initial={false}
              animate={{
                x: xOffset,
                z: zOffset,
                scale,
                rotateY,
                opacity,
                filter: `blur(${blur}px) brightness(${brightness})`,
              }}
              transition={(key: string) => {
                if (key === "scale") return TAP_SPRING;
                return BASE_SPRING;
              }}
              onClick={() => {
                if (offset !== 0) setActive((p) => p + offset);
              }}
            >
              {/* Property image */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="h-full w-full object-cover pointer-events-none"
              />

              {/* Glass specular top */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-transparent pointer-events-none rounded-[24px]" />

              {/* Bottom card info overlay (center card only) */}
              {isCenter && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="absolute inset-x-0 bottom-0 p-5 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(22,17,13,0.88) 0%, rgba(22,17,13,0.60) 50%, transparent 100%)",
                  }}
                >
                  {item.code && (
                    <span className="nakma-body text-[9px] uppercase tracking-[0.36em] text-[var(--nakma-sand)]/80">
                      {item.code}
                    </span>
                  )}
                  {item.price && (
                    <p className="nakma-display mt-1 text-[18px] font-semibold text-white">
                      {item.price}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Border ring */}
              <div
                className={cn(
                  "absolute inset-0 rounded-[24px] pointer-events-none",
                  isCenter
                    ? "ring-1 ring-white/18"
                    : "ring-1 ring-white/08"
                )}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ─── Active card info + CTA ─────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pb-14 md:flex-row md:items-end md:justify-between md:px-12 lg:px-16">
        {/* Text info */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left" style={{ minHeight: "100px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.28 }}
              className="space-y-1.5"
            >
              <h3 className="nakma-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--nakma-bg)] md:text-[26px]">
                {activeItem.title}
              </h3>
              {activeItem.location && (
                <p className="nakma-body text-[13px] text-[var(--nakma-sand)]/75">
                  {activeItem.location}
                </p>
              )}
              {activeItem.description && (
                <p className="nakma-body max-w-sm text-[13px] leading-relaxed text-white/45">
                  {activeItem.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls + CTA */}
        <div className="flex items-center gap-3">
          {/* Mobile nav */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 md:hidden">
            <button
              onClick={handlePrev}
              className="rounded-full p-2.5 text-white/50 transition hover:bg-white/8 hover:text-white active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[38px] text-center font-mono text-[10px] text-white/30">
              {activeIndex + 1}/{count}
            </span>
            <button
              onClick={handleNext}
              className="rounded-full p-2.5 text-white/50 transition hover:bg-white/8 hover:text-white active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Explore CTA */}
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              className="group nakma-body flex items-center gap-2 rounded-full bg-[var(--nakma-bg)] px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-dark)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              View Property
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              href="/listings"
              className="group nakma-body flex items-center gap-2 rounded-full bg-[var(--nakma-bg)] px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-[var(--nakma-dark)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              All Listings
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
