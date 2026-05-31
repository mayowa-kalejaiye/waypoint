"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { trackLaunchEvent } from "@/lib/launch";

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

const SUPPORT_DETAILS = [
  { label: "Name", value: "Oluwamayowa Samuel Kalejaiye" },
  { label: "Phone", value: "8074944583" },
  { label: "Bank", value: "Moniepoint MFB" },
] as const;

export default function SupportModal({ open, onClose }: SupportModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    void trackLaunchEvent("support_modal_opened", { surface: "footer" });
  }, [open]);

  async function handleCopy() {
    const supportDetails = SUPPORT_DETAILS.map((item) => `${item.label}: ${item.value}`).join("\n");

    try {
      await navigator.clipboard.writeText(supportDetails);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = supportDetails;
      fallback.setAttribute("readonly", "true");
      fallback.style.position = "absolute";
      fallback.style.left = "-9999px";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }

    setCopied(true);
    void trackLaunchEvent("support_details_copied", { surface: "footer" });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8"
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
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Support Waypoint</p>
                <h3 className="mt-2 text-2xl font-display text-primary sm:text-3xl">Help sustain the build</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] text-muted transition-colors hover:text-primary"
                aria-label="Close support modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Phase 1 stays free. If you find value in Waypoint and want to help sustain development, copy the details below and send a transfer.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {SUPPORT_DETAILS.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">{item.label}</p>
                  <p className="mt-2 break-words text-base font-display leading-tight text-primary">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-black transition-transform duration-200 hover:-translate-y-0.5"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied to clipboard" : "Copy support details"}
              </button>

              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                After copying, paste it into your transfer note or payment app.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
