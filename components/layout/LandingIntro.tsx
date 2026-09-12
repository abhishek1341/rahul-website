'use client';

import UnlockAutoplay from '@/components/media/UnlockAutoplay';
import HashScroll from './HashScroll';

export default function LandingIntro({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UnlockAutoplay />
      <HashScroll />
      <div className="site-content">{children}</div>
    </>
  );
}
