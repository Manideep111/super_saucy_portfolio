"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageVeil() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(false));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-veil"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-0 z-[80]"
          style={{ background: "#0a0612" }}
          aria-hidden
        />
      ) : null}
    </AnimatePresence>
  );
}
