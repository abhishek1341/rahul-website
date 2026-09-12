'use client';

import { useEffect } from 'react';
import { tryPlayMuted } from '@/lib/muted-autoplay';

/**
 * iOS Safari (and Low Power Mode) often blocks the HTML autoplay attribute
 * until there has been a user gesture. The first tap anywhere retries every
 * muted preview on the page so the hero / service clips start without
 * needing a dedicated play button.
 */
export default function UnlockAutoplay() {
  useEffect(() => {
    const unlock = () => {
      document.querySelectorAll<HTMLVideoElement>('video[data-muted-autoplay]').forEach((video) => {
        const rect = video.getBoundingClientRect();
        const inView =
          rect.bottom > 0 &&
          rect.top < (window.innerHeight || 0) &&
          rect.right > 0 &&
          rect.left < (window.innerWidth || 0);
        if (inView && video.paused) void tryPlayMuted(video);
      });
    };

    const once: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener('pointerdown', unlock, once);
    window.addEventListener('touchstart', unlock, once);
    window.addEventListener('click', unlock, once);

    const onVisible = () => {
      if (!document.hidden) unlock();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
