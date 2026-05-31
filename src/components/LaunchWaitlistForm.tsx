"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { trackLaunchEvent } from "@/lib/launch";

export default function LaunchWaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => email.trim().length > 4 && !submitting, [email, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Enter an email address to join the waitlist.");
      return;
    }

    setSubmitting(true);
    void trackLaunchEvent("waitlist_submit_started", { source: "homepage_waitlist" });

    try {
      const formUrl = "https://formhook-backend-rnvw.onrender.com/forms/ee9607f3-98ab-447d-bd0d-90c7da4f89b8/submit";

      const resp = await fetch(formUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: name.trim(),
            email: trimmedEmail,
          },
        }),
        mode: "cors",
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to submit waitlist");
      }

      setSuccessMessage("You’re on the waitlist.");
      setEmail("");
      setName("");
      void trackLaunchEvent("waitlist_submitted", { source: "homepage_waitlist", external: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn’t save your email right now.";
      setErrorMessage(message);
      void trackLaunchEvent("waitlist_submit_failed", { source: "homepage_waitlist", error: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[28px] border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.05)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Launch waitlist</p>
          <h3 className="text-2xl font-display text-primary sm:text-3xl">Get early access updates</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Phase 1 is free. Leave your email and we’ll use it for launch updates, product feedback, and early beta access.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.08)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          <Mail className="h-4 w-4" />
          Free launch
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center">
        <label className="sr-only" htmlFor="waitlist-name">Name</label>
        <input
          id="waitlist-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (optional)"
          className="focus-ring h-12 rounded-full border border-subtle bg-[color:var(--surface)] px-4 text-sm text-primary placeholder:text-muted"
          disabled={submitting}
        />

        <label className="sr-only" htmlFor="waitlist-email">Email</label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="focus-ring h-12 rounded-full border border-subtle bg-[color:var(--surface)] px-4 text-sm text-primary placeholder:text-muted"
          disabled={submitting}
          autoComplete="email"
          inputMode="email"
        />

        <motion.button
          whileHover={canSubmit ? { y: -1 } : undefined}
          whileTap={canSubmit ? { scale: 0.99 } : undefined}
          type="submit"
          disabled={!canSubmit}
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-5 font-mono text-[10px] uppercase tracking-[0.32em] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Joining" : "Join waitlist"}
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </form>

      {successMessage ? (
        <p className="mt-3 rounded-2xl border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.08)] px-4 py-3 text-sm text-primary">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-3 rounded-2xl border border-[color:rgba(255,100,100,0.18)] bg-[color:rgba(255,100,100,0.08)] px-4 py-3 text-sm text-[color:#ffb1b1]">
          {errorMessage}
        </p>
      ) : null}

      <p className="mt-4 text-center text-xs text-muted">
        Form powered by{" "}
        <a
          href="https://formhookapp.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Formhook
        </a>
      </p>
    </motion.div>
  );
}
