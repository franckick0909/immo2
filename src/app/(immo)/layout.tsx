"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ImmoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const pageTransition = {
    initial: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
        restDelta: 0.001,
      },
    },
    exit: {
      opacity: 0.5,
      scale: 0.9,
      y: -50,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
      },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="min-h-screen w-full"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showOverlay && (
          <>
            {/* Overlay principal */}
            <motion.div
            key={`overlay-${pathname}`}
            className="fixed inset-0 z-10 bg-black"
            initial={{ clipPath: `inset(100% 0 0 0)`, opacity: 1 }}
            animate={{ clipPath: `inset(0 0 0 0)`, opacity: 1,
              transition: {
                duration: 1,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            exit={{
              clipPath: [ `inset(0 0 100% 0)`],
              transition: {
                clipPath: {
                  duration: 0.7,
                  ease: [0.76, 0, 0.24, 1],
                },
              },
            }}
          />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
