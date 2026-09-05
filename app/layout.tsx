import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import LandingIntro from "@/components/layout/LandingIntro";
import "./globals.css";

// Runs before hydration (and before the page paints) so the decision of
// whether the intro should play — which depends on sessionStorage, the
// current path and prefers-reduced-motion, none of which exist on the
// server — is made synchronously, before the browser ever paints the full
// landing page underneath. Mirrors `resolveShouldPlay()` in IntroOverlay.tsx;
// keep the two in sync if this logic ever changes.
const INTRO_GATE_SCRIPT = `(function () {
  try {
    var KEY = 'suntrix:intro-seen';
    var seen = window.sessionStorage.getItem(KEY) === '1';
    window.sessionStorage.setItem(KEY, '1');

    var isHome = window.location.pathname === '/';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var shouldPlay = !seen && isHome && !reducedMotion;

    window.__introShouldPlay = shouldPlay;
    if (shouldPlay) {
      document.documentElement.classList.add('intro-active');
    }
  } catch (e) {
    window.__introShouldPlay = false;
  }
})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://suntrixmedia.com";
const OG_IMAGE = "/og.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Suntrix Media - Short form done right",
    template: "%s | Suntrix Media",
  },
  description:
    "We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Suntrix Media",
    title: "Suntrix Media - Short form done right",
    description:
      "We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Suntrix Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suntrix Media - Short form done right",
    description:
      "We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#2A0C06",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/background/site-gradient-v3.webp"
          type="image/webp"
        />
      </head>
      <body className="relative min-h-screen text-text-primary antialiased">
        {/* strategy="beforeInteractive" scripts must be a child of <body> —
            Next.js hoists them into <head> itself and runs them before
            hydration; placing one inside a custom <head> breaks SSR. */}
        <Script id="intro-gate" strategy="beforeInteractive">
          {INTRO_GATE_SCRIPT}
        </Script>
        {/* Always server-rendered — unlike IntroOverlay (client-only, since it
            depends on sessionStorage/pathname) this covers the page from the
            very first paint, gated purely by the `intro-active` class the
            blocking script above sets before hydration. IntroOverlay hides
            this itself once it mounts and takes over. */}
        <div id="intro-placeholder" aria-hidden="true">
          <span className="landing-intro-brand">Suntrix Media</span>
        </div>
        <LandingIntro>{children}</LandingIntro>
      </body>
    </html>
  );
}
