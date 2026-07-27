import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Suntrix Media - Short form done right",
  description: "We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#EFEBE5]`}>
      <body className="bg-[#EFEBE5] antialiased">
        {children}
      </body>
    </html>
  );
}
