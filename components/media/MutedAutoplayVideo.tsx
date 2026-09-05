'use client';

import { useEffect, useRef, type VideoHTMLAttributes } from 'react';
import { tryPlayMuted } from '@/lib/muted-autoplay';

type MutedAutoplayVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  /** Pause when the clip leaves the viewport — default on to save mobile data. */
  pauseWhenHidden?: boolean;
};

export default function MutedAutoplayVideo({
  pauseWhenHidden = true,
  className,
  src,
  poster,
  children,
  preload = 'auto',
  ...rest
}: MutedAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
  }, [src, pauseWhenHidden]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      data-muted-autoplay=""
      {...rest}
    >
      {children}
    </video>
  );
}
