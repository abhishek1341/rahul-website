'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { categoryLabel, type PortfolioItem } from '@/data/portfolio';
import StageControls from './StageControls';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

const SWIPE_DISTANCE = 56;
const SWIPE_DOMINANCE = 1.2;
// Native controls sit in the bottom strip of the video on mobile; swipes that
// start there belong to the scrubber, not to navigation.
const NATIVE_CONTROLS_ZONE = 56;
const DRAG_LIMIT = 90;

interface VideoLightboxProps {
  items: PortfolioItem[];
  index: number;
  reducedMotion: boolean;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

function ChevronIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export default function VideoLightbox({
  items,
  index,
  reducedMotion,
  onNavigate,
  onClose,
}: VideoLightboxProps) {
  const item = items[index];
  const nextItem = items[index + 1];

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; navigable: boolean } | null>(null);

  const titleId = useId();
  const [mutedFallback, setMutedFallback] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );

  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(query.matches);

    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const goPrev = useCallback(() => {
    if (index > 0) onNavigate(index - 1);
  }, [index, onNavigate]);

  const goNext = useCallback(() => {
    if (index < items.length - 1) onNavigate(index + 1);
  }, [index, items.length, onNavigate]);

  // Lock the page without shifting it: the scrollbar only exists on desktop,
  // so its width has to be handed back as padding.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const existing = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${existing + scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // `src` is owned by this effect rather than by JSX: teardown has to strip the
  // attribute to abort the fetch and release the decoder, and React would never
  // restore a prop it believes is already applied.
  //
  // Unmuted autoplay is only allowed while the opening tap still counts as user
  // activation. If the browser refuses, fall back to muted and surface an unmute
  // control rather than leaving a silently dead player.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    video.src = item.fullSrc;
    video.load();
    video.muted = false;

    video
      .play()
      .then(() => {
        if (!cancelled) setMutedFallback(false);
      })
      .catch(() => {
        if (cancelled || !videoRef.current) return;

        videoRef.current.muted = true;
        void videoRef.current.play().then(
          () => {
            if (!cancelled) setMutedFallback(true);
          },
          () => {}
        );
      });

    // Runs on every item change and on close, so audio can never leak.
    return () => {
      cancelled = true;
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [item.fullSrc]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      // Left/right belong to the scrubber whenever it holds focus.
      const target = event.target as HTMLElement | null;
      const isScrubber = target?.tagName === 'INPUT';

      if (event.key === 'ArrowUp' || (event.key === 'ArrowLeft' && !isScrubber)) {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowDown' || (event.key === 'ArrowRight' && !isScrubber)) {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, onClose]);

  // Focus can escape a portal through browser UI or stray clicks; pull it back.
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (dialog.contains(event.target as Node)) return;

      closeRef.current?.focus();
    };

    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const setDragOffset = (offset: number, animate: boolean) => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return;

    stage.style.transition = animate ? '' : 'none';
    stage.style.transform = offset === 0 ? '' : `translateY(${offset}px)`;
  };

  const onTouchStart = (event: React.TouchEvent) => {
    if (isDesktop) return;

    const touch = event.touches[0];
    const bounds = videoRef.current?.getBoundingClientRect();
    const inControls = bounds
      ? touch.clientY > bounds.bottom - NATIVE_CONTROLS_ZONE && touch.clientY <= bounds.bottom
      : false;

    touchRef.current = { x: touch.clientX, y: touch.clientY, navigable: !inControls };
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const start = touchRef.current;
    if (!start?.navigable) return;

    const touch = event.touches[0];
    const dy = touch.clientY - start.y;
    if (Math.abs(dy) < Math.abs(touch.clientX - start.x)) return;

    const resisted = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, dy * 0.45));
    const atEdge = (dy > 0 && !hasPrev) || (dy < 0 && !hasNext);
    setDragOffset(atEdge ? resisted * 0.3 : resisted, false);
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    setDragOffset(0, true);

    if (!start?.navigable) return;

    const touch = event.changedTouches[0];
    const dy = touch.clientY - start.y;
    const dx = touch.clientX - start.x;

    if (Math.abs(dy) < SWIPE_DISTANCE) return;
    if (Math.abs(dy) < Math.abs(dx) * SWIPE_DOMINANCE) return;

    if (dy < 0) goNext();
    else goPrev();
  };

  const unmute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setMutedFallback(false);
    void video.play().catch(() => {});
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="portfolio-lightbox-enter absolute inset-0 bg-cover bg-center"
        style={{
          // Brand gradient artwork, darkened so the work and the white metadata
          // stay the focus rather than competing with the background.
          backgroundImage:
            'linear-gradient(rgba(8,8,11,0.74), rgba(8,8,11,0.74)), url(/portfolio/lightbox-bg.jpg)',
          backgroundColor: '#08080B',
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pointer-events-none relative flex h-full w-full items-center justify-center gap-6 px-4 md:gap-10 md:px-20"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous video"
          className="pointer-events-auto hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-text-inverse/10 text-text-inverse transition-colors duration-150 hover:bg-text-inverse/20 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse md:flex"
        >
          <ChevronIcon direction="prev" />
        </button>

        <div className="portfolio-stage-enter pointer-events-auto flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:items-center md:gap-8">
          <div className="flex w-full flex-col md:w-auto">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-[12px] font-medium tracking-[-0.01em] text-text-inverse/50">
                {index + 1} / {items.length}
              </span>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-text-inverse transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div
              ref={stageRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
              className="portfolio-stage relative mx-auto overflow-hidden rounded-2xl bg-text-primary"
              style={{
                aspectRatio: '9 / 16',
                height: 'min(64vh, calc((100vw - 32px) * 16 / 9))',
                maxWidth: '100%',
                transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <video
                ref={videoRef}
                controls={!isDesktop}
                loop
                playsInline
                preload="metadata"
              />

              {isDesktop && <StageControls key={item.id} videoRef={videoRef} />}

              {mutedFallback && (
                <button
                  type="button"
                  onClick={unmute}
                  className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-text-inverse/90 px-3 py-1.5 text-[12px] font-medium leading-none text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse"
                >
                  Tap to unmute
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-[240px] md:shrink-0">
            <span className="inline-flex items-center rounded-full bg-text-inverse/12 px-3 py-1.5 text-[10px] font-medium uppercase leading-none tracking-[0.08em] text-text-inverse/80">
              {categoryLabel(item.category)}
            </span>

            <h2
              id={titleId}
              className="mt-3 text-[20px] font-medium leading-[1.2] tracking-[-0.03em] text-text-inverse"
            >
              {item.title}
            </h2>

            <p className="mt-1 text-[14px] leading-[1.4] tracking-[-0.02em] text-text-inverse/60">
              {item.client}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
          aria-label="Next video"
          className="pointer-events-auto hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-text-inverse/10 text-text-inverse transition-colors duration-150 hover:bg-text-inverse/20 disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse md:flex"
        >
          <ChevronIcon direction="next" />
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {`${item.title} by ${item.client}, ${index + 1} of ${items.length}`}
      </p>

      {nextItem && (
        <video
          key={`preload-${nextItem.id}`}
          src={nextItem.fullSrc}
          preload="metadata"
          muted
          loop
          playsInline
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-px opacity-0"
          style={{ border: 0, borderRadius: 0, boxShadow: 'none' }}
        />
      )}
    </div>,
    document.body
  );
}
