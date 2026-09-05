'use client';

import { useEffect, useRef } from 'react';
import type { PortfolioItem } from '@/data/portfolio';

const SHOWN_AT = '(min-width: 1024px)';

interface FeaturedHeroVideoProps {
  item: PortfolioItem;
}

export default function FeaturedHeroVideo({ item }: FeaturedHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // The frame is display:none below lg, so the clip (src withheld until the
  // query matches) costs a phone nothing.
  useEffect(() => {
    const shown = window.matchMedia(SHOWN_AT);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const video = videoRef.current;
      if (!video) return;

      if (!shown.matches || reduced.matches) {
        video.pause();
        return;
      }

      if (!video.src) {
        video.src = item.previewSrc;
        video.load();
      }

      void video.play().catch(() => {});
    };

    sync();
    shown.addEventListener('change', sync);
    reduced.addEventListener('change', sync);

    return () => {
      shown.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, [item.previewSrc]);

  return (
    <div className="hidden lg:block">
      <div className="media-frame video-frame relative ml-auto aspect-[9/16] w-full max-w-[300px]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
