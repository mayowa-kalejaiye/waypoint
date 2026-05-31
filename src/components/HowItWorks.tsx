"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "State the outcome",
    description:
      "Tell Waypoint what you want to learn, plus the level and time you actually have.",
  },
  {
    number: "02",
    title: "Shape the sequence",
    description:
      "Concepts, prerequisites, and video quality get arranged into a tighter path with less noise.",
  },
  {
    number: "03",
    title: "Learn from the best videos",
    description:
      "You get a premium curriculum assembled from real YouTube content, scored and ranked for credibility and fit.",
  },
];

function useInViewOnce<T extends HTMLElement>() {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<T | null>(null);

  useEffect(() => {
    if (!node || inView) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, node]);

  return { ref: setNode, inView };
}

function InputIllustration() {
  return (
    <div className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3">
      <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[#444444]">
        <span>Goal</span>
        <div className="h-px flex-1 bg-[color:var(--border)]" />
      </div>
      <div className="mt-3 flex items-center gap-1 rounded-full border border-[color:#2a2a2a] bg-[#0d0d0d] px-4 py-3 font-mono text-[11px] text-[#999999]">
        <span>Learn React in 3 weeks...</span>
        <motion.span animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="h-4 w-px bg-[color:var(--accent)]" />
      </div>
    </div>
  );
}

function GraphIllustration() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-5 sm:px-6">
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#444444]">Dependency graph</div>
      <div className="mt-5 space-y-3 text-[10px] font-mono uppercase tracking-[0.24em] text-[#999999] sm:text-[11px] sm:tracking-[0.28em]">
        {[
          ["JavaScript", "Foundation layer"],
          ["JSX", "Syntax bridge"],
          ["React Components", "Rendered output"],
        ].map(([label, detail], index) => (
          <div key={label} className="rounded-[16px] border border-[color:rgba(255,255,255,0.06)] bg-[#101010] px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-3 w-3 shrink-0 rounded-full border border-[color:var(--accent)] bg-[#0f0f0f]" />
              <div className="min-w-0">
                <span className="block whitespace-normal break-words leading-tight text-[#d8d8d8]">{label}</span>
                <span className="mt-1 block text-[9px] leading-tight tracking-[0.28em] text-[#555555] sm:text-[10px]">{detail}</span>
              </div>
            </div>
            {index < 2 ? <div className="ml-[0.4rem] mt-3 h-px w-px bg-[color:var(--accent)]" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StackIllustration() {
  return (
    <div className="relative h-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute left-6 top-6 h-20 w-[78%] rounded-[18px] border border-[color:var(--border)] bg-[#101010]"
      >
        <div className="flex h-full items-center gap-3 px-4">
          <div className="flex h-10 w-16 items-center justify-center rounded-md bg-[#0d0d0d] text-[10px] font-mono uppercase tracking-[0.3em] text-[#999999]">Video</div>
          <div>
            <div className="h-2 w-24 rounded-full bg-[#222222]" />
            <div className="mt-2 h-2 w-16 rounded-full bg-[#1a1a1a]" />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
        className="absolute left-2 top-0 h-20 w-[78%] rounded-[18px] border border-[color:var(--border)] bg-[#151515]"
      >
        <div className="flex h-full items-center gap-3 px-4">
          <div className="flex h-10 w-16 items-center justify-center rounded-md bg-[#0d0d0d] text-[10px] font-mono uppercase tracking-[0.3em] text-[#999999]">Rank</div>
          <div>
            <div className="h-2 w-20 rounded-full bg-[#252525]" />
            <div className="mt-2 h-2 w-12 rounded-full bg-[#1f1f1f]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StepContent({ step, index, active, visible }: { step: Step; index: number; active: boolean; visible: boolean }) {
  const delay = 0.5 + index * 0.5;
  const illustrationDelay = 1.15 + index * 0.2;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.96 }}
        transition={{ duration: 0.35, delay, ease: "easeOut" }}
        className={`mx-auto grid h-14 w-14 place-items-center rounded-full border ${active ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black" : "border-[color:var(--border)] bg-[color:var(--card)] text-[#999999]"}`}
      >
        <span className="font-mono text-[10px] font-bold tracking-[0.35em]">{step.number}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.35, delay: delay + 0.2, ease: "easeOut" }}
        className="mt-5 space-y-3 text-center"
      >
        <h3 className="text-2xl font-display text-white sm:text-3xl">{step.title}</h3>
        <p className="mx-auto max-w-md font-mono text-[11px] leading-6 text-[#999999]">{step.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.35, delay: illustrationDelay, ease: "easeOut" }}
        className="mx-auto mt-6 max-w-[22rem]"
      >
        {index === 0 ? <InputIllustration /> : null}
        {index === 1 ? <GraphIllustration /> : null}
        {index === 2 ? <StackIllustration /> : null}
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const timeouts = [
      window.setTimeout(() => setActiveStep(1), 500),
      window.setTimeout(() => setActiveStep(2), 1000),
      window.setTimeout(() => setActiveStep(3), 1500),
    ];

    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [inView]);

  return (
    <section ref={ref} className="w-full bg-[color:var(--bg)] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#999999]">How it works</p>
        <h2 className="mt-3 text-[clamp(2.6rem,6vw,5rem)] leading-[0.96] font-display text-white">From prompt to path</h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#999999]">Three steps that keep the system simple and the result usable</p>
      </motion.div>

      <div className="mx-auto mt-14 max-w-[1600px]">
        <div className="lg:hidden">
          <div className="relative pl-9">
            <div className="absolute left-4 top-0 h-full w-px bg-[color:var(--border)]" />
            <motion.div
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="absolute left-4 top-0 w-px bg-[color:var(--accent)]"
            />
            <div className="space-y-12">
              {STEPS.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="absolute -left-7 top-1">
                    <motion.div
                      initial={{ backgroundColor: "#141414", color: "#999999" }}
                      animate={activeStep > index ? { backgroundColor: "#C8FE02", color: "#000000" } : { backgroundColor: "#141414", color: "#999999" }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)]"
                    >
                      <span className="font-mono text-[10px] font-bold tracking-[0.3em]">{step.number}</span>
                    </motion.div>
                  </div>
                  <StepContent step={step} index={index} active={activeStep > index} visible={inView} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute left-[10%] right-[10%] top-8 h-px bg-[color:var(--border)]" />
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: "80%" } : { width: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="absolute left-[10%] top-8 h-px bg-[color:var(--accent)]"
          />

          <div className="grid grid-cols-3 gap-8 xl:gap-12">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative pt-0">
                <div className="relative mx-auto mb-4 h-16 w-16">
                  <motion.div
                    initial={{ backgroundColor: "#141414", color: "#999999" }}
                    animate={activeStep > index ? { backgroundColor: "#C8FE02", color: "#000000" } : { backgroundColor: "#141414", color: "#999999" }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.5 + index * 0.5 }}
                    className="grid h-16 w-16 place-items-center rounded-full border border-[color:var(--border)]"
                  >
                    <span className="font-mono text-[10px] font-bold tracking-[0.35em]">{step.number}</span>
                  </motion.div>
                </div>
                <StepContent step={step} index={index} active={activeStep > index} visible={inView} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
