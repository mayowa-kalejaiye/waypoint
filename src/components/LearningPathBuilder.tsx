"use client";

import { motion } from "framer-motion";

interface LearningPathBuilderProps {
  visible: boolean;
  progress: number;
  title: string;
  statusMessage?: string | null;
}

const STAGES = [
  "Reading your goal",
  "Mapping the path",
  "Finding the best videos",
  "Finalizing the canvas",
];

export default function LearningPathBuilder({ visible, progress, title, statusMessage }: LearningPathBuilderProps) {
  const activeStage = progress < 25 ? 0 : progress < 50 ? 1 : progress < 80 ? 2 : 3;
  const currentMessage = statusMessage || STAGES[activeStage];

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-app"
    >
      <div className="absolute inset-0 noise-layer" />
      <motion.div
        animate={{ x: [0, 20, -12, 0], y: [0, -10, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-6rem] top-[-6rem] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.16),transparent_68%)] blur-3xl sm:h-[24rem] sm:w-[24rem]"
      />
      <motion.div
        animate={{ x: [0, -18, 10, 0], y: [0, 14, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-4rem] top-[16vh] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.08),transparent_70%)] blur-3xl sm:h-[22rem] sm:w-[22rem]"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-[clamp(1.9rem,4.2vw,4rem)] font-display leading-[0.95] text-primary"
          >
            {currentMessage}
            <span className="inline-flex w-[3ch] justify-start">
              <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}>
                .
              </motion.span>
              <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}>
                .
              </motion.span>
              <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}>
                .
              </motion.span>
            </span>
          </motion.p>
          <p className="mt-4 text-sm font-mono uppercase tracking-[0.35em] text-[color:rgba(255,255,255,0.42)]">
            {title || "Building your path"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
