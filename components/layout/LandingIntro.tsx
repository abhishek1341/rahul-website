'use client';

import dynamic from 'next/dynamic';
import UnlockAutoplay from '@/components/media/UnlockAutoplay';

// Client-only on purpose. Whether the intro runs depends on sessionStorage, the
// entry route and the reduced-motion preference, none of which exist on the
// server — so the overlay stays out of the HTML entirely and the 6 MB clip is
// never in the markup on a refresh or on any route other than the home page.
const IntroOverlay = dynamic(() => import('./IntroOverlay'), { ssr: false });

export default function LandingIntro({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UnlockAutoplay />
      <IntroOverlay />
      <div className="site-content">{children}</div>
    </>
  );
}
