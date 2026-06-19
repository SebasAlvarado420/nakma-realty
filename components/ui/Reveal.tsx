"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in seconds — use to stagger siblings. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  className?: string;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
};

/**
 * Scroll-reveal wrapper. Fades + lifts its children into place when they
 * scroll into view. Honors the user's reduced-motion preference by rendering
 * a plain container with no animation.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
