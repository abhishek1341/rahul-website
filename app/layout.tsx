import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import LandingIntro from "@/components/layout/LandingIntro";
import { OG_IMAGE_URL, OG_IMAGES, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Suntrix Media | Short-form content, ads and websites that convert",
    template: "%s | Suntrix Media",
  },
  description:
    "Suntrix Media is a creative and performance studio. We make short-form video, run social and Meta ads, generate leads, and build websites that turn attention into growth.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Suntrix Media",
    title: "Suntrix Media | Short-form content, ads and websites that convert",
    description:
      "Suntrix Media is a creative and performance studio. We make short-form video, run social and Meta ads, generate leads, and build websites that turn attention into growth.",
    images: [...OG_IMAGES],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suntrix Media | Short-form content, ads and websites that convert",
    description:
      "Suntrix Media is a creative and performance studio. We make short-form video, run social and Meta ads, generate leads, and build websites that turn attention into growth.",
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2A0C06",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <LandingIntro>{children}</LandingIntro>
      </body>
    </html>
  );
}
