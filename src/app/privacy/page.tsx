import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Waypoint",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-display text-primary">Privacy Policy</h1>

      <p className="mt-6 text-base leading-7 text-muted">
        Waypoint is a curriculum engine that helps users discover and follow learning paths
        constructed from public video content. This Privacy Policy explains what information
        we collect, how we use it, and the choices you have.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Information We Collect</h2>
      <ul className="mt-3 list-inside list-disc text-muted">
        <li>Contact information you provide (email) when signing up or giving feedback.</li>
        <li>Usage data such as pages visited, features used, and interactions to improve the product.</li>
        <li>Analytics and crash logs from third-party services we use to understand and improve reliability.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">How We Use Information</h2>
      <p className="mt-3 text-muted">
        We use collected information to operate and improve Waypoint, send occasional
        product updates or emails you opt into, and to analyze usage trends. We do not sell
        personal data to third parties.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Third-Party Services</h2>
      <p className="mt-3 text-muted">
        We may use third-party analytics, hosting, and email providers. These providers
        have their own privacy policies and may collect information as described above.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Cookies and Local Storage</h2>
      <p className="mt-3 text-muted">
        We use cookies and local storage for session management, analytics, and feature
        preferences. You can control cookies via your browser settings.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Data Retention & Choices</h2>
      <p className="mt-3 text-muted">
        We retain personal data only as long as necessary. You can request access, correction,
        or deletion of your data by contacting us at <Link href="/">support</Link> or replying to
        emails you receive from Waypoint.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Contact</h2>
      <p className="mt-3 text-muted">If you have questions about this policy, contact us at kalejaiyemayowa14@gmail.com</p>

      <p className="mt-10 text-sm text-muted">Effective date: May 28, 2026</p>
    </main>
  );
}
