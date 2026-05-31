"use client";

import { AnimatePresence, motion } from "framer-motion";

interface WhyTooltipProps {
  text: string;
  visible: boolean;
}

export default function WhyTooltip({ text, visible }: WhyTooltipProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[inherit] border-t border-line bg-gradient-to-t from-[color:rgba(0,0,0,0.86)] via-[color:rgba(0,0,0,0.76)] to-transparent p-4"
        >
          <p className="max-w-[95%] text-xs leading-5 text-[color:var(--muted)]">{text}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
