"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Re-mounts on every navigation, so it's the right place for route
 * transitions. We animate opacity only — never transform — so the hero's
 * sticky/scroll-expand behavior is never trapped in a transformed ancestor.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
