"use client";

import { motion } from "framer-motion";

export default function PageEnterTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0.7, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.7 }}
    >
      {children}
    </motion.div>
  );
}