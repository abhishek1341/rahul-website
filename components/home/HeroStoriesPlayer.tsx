'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { tryPlayMuted } from '@/lib/muted-autoplay';
import type { HeroStory } from '@/data/heroStories';

type HeroStoriesPlayerProps = {
  stories: HeroStory[];
};

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export default function HeroStoriesPlayer({ stories }: HeroStoriesPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const pointerStart = useRef<{ x: number; y: number; type: string } | null>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const story = stories[index];
  const count = stories.length;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      const wrapped = wrapIndex(nextIndex, count);
      indexRef.current = wrapped;
      setIndex(wrapped);
      if (fillRef.current) fillRef.current.style.transform = 'scaleX(0)';
    },
    [count]
  );

  const advance = useCallback(() => {
    goTo(indexRef.current + 1);
  }, [goTo]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !story) return;

    void tryPlayMuted(video);

    const syncFill = () => {
      const duration = video.duration;
      if (!fillRef.current || !Number.isFinite(duration) || duration <= 0) return;
      fillRef.current.style.transform = `scaleX(${Math.min(1, video.currentTime / duration)})`;
    };

    let frame = 0;
    const tick = () => {
      syncFill();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const play = () => {
      void tryPlayMuted(video);
    };

    video.addEventListener('canplay', play);
    video.addEventListener('loadeddata', play);
    video.addEventListener('timeupdate', syncFill);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
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

    const nextStory = stories[wrapIndex(index + 1, count)];
    const preload = preloadRef.current;
    // Warm the next clip only after the current one is underway so initial
    // page transfer stays limited to the first hero video.
    const warmNext = () => {
      if (preload && nextStory && nextStory.src !== story.src) {
        preload.src = nextStory.src;
      }
    };
    const onProgress = () => {
      if (video.currentTime >= 1.5) {
        warmNext();
        video.removeEventListener('timeupdate', onProgress);
      }
    };
    video.addEventListener('timeupdate', onProgress);

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('canplay', play);
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('timeupdate', syncFill);
      video.removeEventListener('timeupdate', onProgress);
      observer?.disconnect();
    };
  }, [count, index, stories, story]);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, type: event.pointerType };
  };

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (start?.type === 'touch') {
      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      if (dx > 12 || dy > 12) return;
    }
    advance();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advance();
    }
  };

  if (!story) return null;

  return (
    <button
      type="button"
      className="hero-stories"
      aria-label="Play next story"
      onPointerDown={onPointerDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="hero-stories-bars" aria-hidden="true">
        {stories.map((item, itemIndex) => (
          <span key={`${item.src}-${itemIndex}`} className="hero-stories-bar">
            <span
              ref={itemIndex === index ? fillRef : undefined}
              className="hero-stories-bar-fill"
              style={{
                transform: `scaleX(${itemIndex < index ? 1 : 0})`,
              }}
            />
          </span>
        ))}
      </div>

      <video
        key={`${index}-${story.src}`}
        ref={videoRef}
        className="hero-stories-video bg-bg-surface"
        src={story.src}
        poster="/posters/hero-story.jpg"
        muted
        playsInline
        preload="metadata"
        data-muted-autoplay=""
        onEnded={advance}
      />
      <video
        ref={preloadRef}
        className="hero-stories-preload"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />

      {story.overlayLines?.length ? (
        <p className="hero-stories-caption">
          {story.overlayLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      ) : null}
    </button>
  );
}
