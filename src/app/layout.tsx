import { DM_Mono, Instrument_Serif } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Waypoint",
    template: "%s | Waypoint",
  },
  description: "Waypoint turns any learning goal into a structured, day-by-day curriculum using real YouTube videos.",
  keywords: ["learning", "curriculum", "youtube", "ai", "education"],
  openGraph: {
    title: "Waypoint",
    description: "Waypoint turns any learning goal into a structured, day-by-day curriculum using real YouTube videos.",
    type: "website",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waypoint",
    description: "Waypoint turns any learning goal into a structured, day-by-day curriculum using real YouTube videos.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${dmMono.variable} bg-app text-primary`}>{children}</body>
    </html>
  );
}
