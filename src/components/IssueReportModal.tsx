"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { trackLaunchEvent } from "@/lib/launch";

interface IssueReportModalProps {
  open: boolean;
  onClose: () => void;
}

const REPORT_FORM_URL = "https://formhook-backend-rnvw.onrender.com/forms/b3984d70-ea4f-4445-9e49-df58aa8545df/submit";

export default function IssueReportModal({ open, onClose }: IssueReportModalProps) {
  const [report, setReport] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    void trackLaunchEvent("issue_modal_opened", { surface: "curriculum_page" });
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedReport = report.trim();
    const trimmedMessage = message.trim();
    if (!trimmedReport || !trimmedMessage) {
      setError("Add a short title and description.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(REPORT_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            report: trimmedReport,
            message: trimmedMessage,
          },
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to submit report");
      }

      setSubmitted(true);
      setReport("");
      setMessage("");
      void trackLaunchEvent("issue_report_submitted", { surface: "curriculum_page" });
      window.setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (submissionError) {
      const text = submissionError instanceof Error ? submissionError.message : "We couldn't submit the report right now.";
      setError(text);
      void trackLaunchEvent("issue_report_failed", { surface: "curriculum_page", error: text });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-end justify-center bg-black/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[42rem] rounded-[30px] border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(12,12,12,0.98)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.58)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Report issue</p>
                <h3 className="mt-2 text-2xl font-display text-primary sm:text-3xl">Bug or feature request</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] text-muted transition-colors hover:text-primary"
                aria-label="Close report modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Use this to report bugs, suggest features, or call out anything that feels off.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label className="block">
                <span className="sr-only">Report title</span>
                <textarea
                  value={report}
                  onChange={(event) => setReport(event.target.value)}
                  placeholder="Report"
                  rows={2}
                  disabled={submitting}
                  className="focus-ring w-full resize-none rounded-[22px] border border-subtle bg-[color:var(--surface)] px-4 py-3 text-sm text-primary placeholder:text-muted"
                />
              </label>

              <label className="block">
                <span className="sr-only">Description</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Description"
                  rows={5}
                  disabled={submitting}
                  className="focus-ring w-full resize-none rounded-[22px] border border-subtle bg-[color:var(--surface)] px-4 py-3 text-sm text-primary placeholder:text-muted"
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-[color:rgba(255,100,100,0.18)] bg-[color:rgba(255,100,100,0.08)] px-4 py-3 text-sm text-[color:#ffb1b1]">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-black transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <Send className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                  {submitting ? "Sending" : "Submit report"}
                </button>

                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                  Submission via Formhook
                </p>
              </div>

              {submitted ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.08)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-accent">
                  <Check className="h-4 w-4" />
                  Report sent
                </div>
              ) : null}
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
