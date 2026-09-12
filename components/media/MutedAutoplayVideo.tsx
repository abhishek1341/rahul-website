'use client';

import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react';
import { tryPlayMuted } from '@/lib/muted-autoplay';

type MutedAutoplayVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  /** Pause when the clip leaves the viewport — default on to save mobile data. */
  pauseWhenHidden?: boolean;
  /**
   * Defer attaching src / <source> until the element is near the viewport.
   * Use for below-the-fold clips so they don't count toward initial transfer.
   */
  lazy?: boolean;
};

export default function MutedAutoplayVideo({
  pauseWhenHidden = true,
  lazy = false,
  className,
  src,
  poster,
  children,
  preload,
  ...rest
}: MutedAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const effectivePreload = preload ?? (lazy ? 'none' : 'metadata');

  useEffect(() => {
    if (!lazy || shouldLoad) return;
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px', threshold: 0.01 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [lazy, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const play = () => {
      void tryPlayMuted(video);
    };

    play();
    video.addEventListener('canplay', play);
    video.addEventListener('loadeddata', play);

    let observer: IntersectionObserver | null = null;
    if (pauseWhenHidden && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) play();
            else video.pause();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(video);
    }

    return () => {
      video.removeEventListener('canplay', play);
      video.removeEventListener('loadeddata', play);
      observer?.disconnect();
    };
  }, [src, pauseWhenHidden, shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      className={className}
      autoPlay={shouldLoad}
      muted
      loop
      playsInline
      preload={shouldLoad ? effectivePreload : 'none'}
      data-muted-autoplay=""
      {...rest}
    >
      {shouldLoad ? children : null}
    </video>
  );
}
