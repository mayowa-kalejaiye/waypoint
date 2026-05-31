import Link from "next/link";

const entries = [
  {
    date: "May 24, 2026",
    title: "Leaderboard removed",
    bullets: ["Top learning paths feature taken down", "Homepage focus narrowed to the main learning path flow", "Changelog updated to reflect the cleanup"],
  },
  {
    date: "May 23, 2026",
    title: "Public launch prep",
    bullets: ["Homepage refreshed for mobile", "Waitlist connected to Formhook", "Mission-based support flow added"],
  },
  {
    date: "May 22, 2026",
    title: "Usage tracking",
    bullets: ["Anonymous launch events stored in backend", "Homepage and generation milestones instrumented", "Support and waitlist actions tracked"],
  },
  {
    date: "May 21, 2026",
    title: "Curriculum UX polish",
    bullets: ["Demo section made responsive", "Motion added to core landing page components", "Leaderboard polling removed"],
  },
  {
    date: "May 20, 2026",
    title: "Learning flow improvements",
    bullets: ["Better curriculum generation state", "Day progress and sharing surfaces refined", "Footer mission copy updated"],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-app px-4 py-10 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[32px] border border-subtle bg-[color:var(--surface)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">Waypoint changelog</p>
          <h1 className="mt-3 text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95] font-display text-primary">
            What changed, in public...
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            A running log of launch milestones, product updates, and fixes that shape the Waypoint experience.
          </p>

          <div className="mt-8 space-y-4">
            {entries.map((entry) => (
              <section key={entry.date} className="rounded-[28px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">{entry.date}</p>
                <h2 className="mt-2 text-2xl font-display text-primary">{entry.title}</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-black"
            >
              Back home
            </Link>
            <Link
              href="#top"
              className="inline-flex items-center justify-center rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary"
            >
              Review the latest changes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
