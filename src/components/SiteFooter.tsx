"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BrainCircuit, Sparkles, Youtube } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SupportModal from "@/components/SupportModal";

const SIGNALS = [
  {
    icon: Youtube,
    label: "Source",
    value: "Real YouTube videos",
  },
  {
    icon: BrainCircuit,
    label: "System",
    value: "Dependency-aware sequencing",
  },
  {
    icon: Sparkles,
    label: "Tempo",
    value: "Paced to your level",
  },
] as const;

const LINKS = [
  { label: "Start a path", href: "#top" },
  { label: "See the demo", href: "#demo" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Changelog", href: "/changelog" },
] as const;

export default function SiteFooter() {
  const [supportOpen, setSupportOpen] = useState(false);

  const footerSteps = [
    {
      number: "01",
      title: "Goal in",
      bars: ["w-24", "w-16"],
      tone: "bg-[color:rgba(200,254,2,0.08)]",
    },
    {
      number: "02",
      title: "Path mapped",
      bars: ["w-20", "w-14"],
      tone: "bg-[color:rgba(255,255,255,0.04)]",
    },
    {
      number: "03",
      title: "Keep going",
      bars: ["w-18", "w-12"],
      tone: "bg-[color:rgba(200,254,2,0.06)]",
    },
  ] as const;

  return (
    <footer className="relative isolate mt-24 overflow-visible bg-[radial-gradient(circle_at_top,rgba(200,254,2,0.14),transparent_34%),linear-gradient(180deg,#0c0c0c_0%,#090909_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="noise-layer absolute inset-0" />
        <motion.div
          animate={{ x: [0, 20, -8, 0], y: [0, -10, 6, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-6rem] top-[-10rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.18),transparent_68%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -16, 12, 0], y: [0, 12, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-7rem] bottom-[-6rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.06)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(200,254,2,0.55)]" />
              Closing signal
            </div>

            <div className="max-w-4xl space-y-5">
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] font-display text-primary">
                The internet gives you content.
                <span className="block text-accent">Waypoint gives you a path.</span>
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
                A curriculum engine for people who want signal over noise, sequence over chaos, and a learning system that behaves like a product instead of a playlist.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.32em] transition-transform duration-200 hover:-translate-y-0.5 ${
                    link.label === "Start a path"
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black"
                      : "border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(255,255,255,0.03)] text-primary hover:border-[color:rgba(200,254,2,0.3)]"
                  }`}
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {SIGNALS.map((signal, index) => {
                const Icon = signal.icon;

                return (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    className="rounded-[24px] border border-line bg-[color:rgba(255,255,255,0.03)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.08)] text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">{signal.label}</p>
                          <p className="mt-1 max-w-[11rem] text-lg font-display leading-tight text-primary">{signal.value}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-[34px] border border-[color:rgba(200,254,2,0.2)] bg-[color:rgba(200,254,2,0.05)] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[color:rgba(255,255,255,0.08)] pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Terminal status</p>
                <p className="mt-2 text-2xl font-display text-primary">Shipping the signal</p>
              </div>
              <div className="rounded-full border border-[color:rgba(200,254,2,0.2)] bg-[color:rgba(200,254,2,0.08)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                live
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {footerSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                  className="rounded-[24px] border border-[color:rgba(255,255,255,0.07)] bg-[color:rgba(255,255,255,0.03)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1], rotate: [0, 2, 0, -2, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.08)] font-mono text-[10px] font-bold tracking-[0.35em] text-accent"
                    >
                      {step.number}
                    </motion.div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">{step.title}</p>
                      <motion.div
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-1 h-px w-10 bg-[color:var(--accent)]/70"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className={`relative h-10 overflow-hidden rounded-[16px] border border-[color:rgba(255,255,255,0.06)] ${step.tone} px-3 py-2`}>
                      <motion.div
                        animate={{ x: ["-18%", "95%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                        className="absolute left-3 top-1/2 h-1.5 w-16 -translate-y-1/2 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(200,254,2,0.45)]"
                      />
                      <motion.div
                        animate={{ opacity: [0.28, 0.68, 0.28] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(200,254,2,0.08),rgba(200,254,2,0.2),rgba(200,254,2,0.08))]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {step.bars.map((bar, barIndex) => (
                        <motion.div
                          key={`${step.number}-${barIndex}`}
                          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
                          transition={{ duration: 1.5 + barIndex * 0.25, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 + barIndex * 0.2 }}
                          className={`h-2 rounded-full bg-[color:rgba(255,255,255,0.14)] ${bar}`}
                        />
                      ))}
                    </div>
                    <motion.div
                      animate={{ opacity: [0.15, 0.55, 0.15] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.14 }}
                      className="h-1 rounded-full bg-[color:rgba(255,255,255,0.08)]"
                    />
                  </div>
                  

                </motion.div>
              ))}
              <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
            </div>

            {/* <div className="mt-5 rounded-[24px] border border-[color:rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(200,254,2,0.08))] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted"></p>
              <p className="mt-2 text-base leading-7 text-primary">
                
              </p>
            </div> */}
            
            <div className="rounded-[24px] border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.06)] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Phase 1 launch</p>
                  <p className="text-lg font-display text-primary">100% free while we collect emails, usage data, and feedback.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSupportOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-black transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-95"
                >
                  Support the mission
                </button>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                If Waypoint resonates with you, here's a way to help sustain development.
              </p>
            </div>

            {/* <div className="flex flex-col gap-2 rounded-[24px] border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(255,255,255,0.03)] p-4 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                Want the product history? Check the <Link href="/changelog" className="text-accent hover:underline">changelog</Link>.
              </p>
              <p>
                Powered by <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Waypoint on GitHub</Link>
              </p>
            </div> */}
          </motion.div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.08)] text-accent">
              <span className="font-display text-xl">W</span>
            </div> */}
            <div>
              <p className="font-display text-xl text-primary">Waypoint</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">AI learning paths with real videos</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            <span>© 2026 Waypoint</span>
            <Link href="/privacy" className="text-muted hover:underline">Privacy policy</Link>
          </div>
        </div>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </footer>
  );
}
