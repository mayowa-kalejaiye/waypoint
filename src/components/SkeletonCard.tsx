"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-subtle bg-card p-5">
      <div className="space-y-4">
        <div className="h-4 w-24 rounded-full bg-[color:#1a1a1a]" />
        <div className="h-5 w-3/4 rounded-full bg-[color:#1a1a1a]" />
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[color:#1a1a1a]">
          <motion.div
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:#252525] to-transparent"
          />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-[color:#1a1a1a]" />
          <div className="h-4 w-5/6 rounded-full bg-[color:#1a1a1a]" />
          <div className="h-4 w-2/3 rounded-full bg-[color:#1a1a1a]" />
        </div>
      </div>
    </div>
  );
}
