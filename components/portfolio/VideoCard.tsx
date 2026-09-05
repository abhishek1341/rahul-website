'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { categoryLabel, type PortfolioItem } from '@/data/portfolio';

// The grid tile itself, fixed regardless of source footage.
const CARD_ASPECT = 9 / 16;

// Above this fraction of the frame lost to a plain `cover` crop, burned-in
// captions and framing start getting clipped — square (1:1) and landscape
// (16:9) source clips land well past it (~44% and ~68% lost respectively);
// clips already shot close to 9:16 land near 0% and keep the full-bleed crop.
const MAX_ACCEPTABLE_CROP_LOSS = 0.12;

// The grid preview is a short looping teaser, not the full clip — it plays
// from 0:00 up to this mark, then jumps back to 0:00 and repeats.
const PREVIEW_LOOP_SECONDS = 3;

/** Fraction of the source frame a 9:16 `object-fit: cover` would crop away. */
function coverCropLoss(sourceAspect: number): number {
  return 1 - Math.min(CARD_ASPECT / sourceAspect, sourceAspect / CARD_ASPECT);
}

interface VideoCardProps {
  item: PortfolioItem;
  reducedMotion: boolean;
  prefersReducedMotion: () => boolean;
  claimPlayback: (videos: HTMLVideoElement[]) => void;
  releasePlayback: (videos: HTMLVideoElement[]) => void;
  register: (element: Element, onVisible: (active: boolean) => void) => () => void;
  registerCard: (id: string, element: HTMLButtonElement | null) => void;
  onOpen: (item: PortfolioItem) => void;
}

function formatDuration(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoCard({
  item,
  reducedMotion,
  prefersReducedMotion,
  claimPlayback,
  releasePlayback,
  register,
  registerCard,
  onOpen,
}: VideoCardProps) {
  const hostRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Clips shot square or landscape lose too much width/height to a plain 9:16
  // cover crop (captions and framing get clipped) — those get a second,
  // heavily blurred copy of the same clip as a full-bleed backdrop behind the
  // contain-fit foreground. Clips already close to 9:16 render only one
  // <video> and use the simpler full-bleed cover crop.
  const backdropVideoRef = useRef<HTMLVideoElement>(null);
  const srcAssigned = useRef(false);

  const needsLetterbox =
    typeof item.sourceAspect === 'number' && coverCropLoss(item.sourceAspect) > MAX_ACCEPTABLE_CROP_LOSS;
  const fitStyle: CSSProperties = { objectFit: needsLetterbox ? 'contain' : 'cover' };

  const getVideos = useCallback((): HTMLVideoElement[] => {
    const videos: HTMLVideoElement[] = [];
    if (videoRef.current) videos.push(videoRef.current);
    if (needsLetterbox && backdropVideoRef.current) videos.push(backdropVideoRef.current);
    return videos;
  }, [needsLetterbox]);

  const ensureSrc = useCallback(() => {
    if (srcAssigned.current) return;
    srcAssigned.current = true;

    for (const video of getVideos()) {
      video.src = item.previewSrc;
      video.load();
    }
  }, [getVideos, item.previewSrc]);

  const stopPlayback = useCallback(() => {
    const videos = getVideos();
    if (videos.length === 0) return;

    releasePlayback(videos);
    for (const video of videos) {
      video.pause();
      if (srcAssigned.current) video.currentTime = 0;
    }
  }, [getVideos, releasePlayback]);

  const startPlayback = useCallback(() => {
    const videos = getVideos();
    if (videos.length === 0) return;

    ensureSrc();
    claimPlayback(videos);
    for (const video of videos) void video.play().catch(() => {});
  }, [claimPlayback, ensureSrc, getVideos]);

  // No poster asset exists anymore, so reduced-motion users would otherwise
  // see a blank box — seeking a loaded-but-paused video to a representative
  // frame gets the same effect natively, with no separate image involved.
  const showStaticFrame = useCallback(() => {
    const videos = getVideos();
    if (videos.length === 0) return;

    ensureSrc();
    for (const video of videos) {
      video.pause();
      const seekToRepresentativeFrame = () => {
        try {
          video.currentTime = Math.min(1, video.duration || 1);
        } catch {
          // Ignore — some browsers throw if called before metadata settles.
        }
      };
      if (video.readyState >= 1) seekToRepresentativeFrame();
      else video.addEventListener('loadedmetadata', seekToRepresentativeFrame, { once: true });
    }
  }, [ensureSrc, getVideos]);

  const handleVisibility = useCallback(
    (active: boolean) => {
      if (prefersReducedMotion()) {
        if (active) showStaticFrame();
        else stopPlayback();
        return;
      }

      if (!active) {
        stopPlayback();
        return;
      }

      startPlayback();
    },
    [prefersReducedMotion, showStaticFrame, startPlayback, stopPlayback]
  );

  // Kept in a ref so the observer subscription never has to be torn down and
  // rebuilt when the callback identity changes.
  const handlerRef = useRef(handleVisibility);
  useEffect(() => {
    handlerRef.current = handleVisibility;
  }, [handleVisibility]);

  useEffect(() => {
    if (reducedMotion) stopPlayback();
  }, [reducedMotion, stopPlayback]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    return register(host, (active) => handlerRef.current(active));
  }, [register]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    registerCard(item.id, host);
    return () => registerCard(item.id, null);
  }, [item.id, registerCard]);

  useEffect(() => {
    return () => {
      const videos = getVideos();
      if (videos.length) releasePlayback(videos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only runs on unmount
  }, []);

  // Caps every card's grid preview to a fixed few-second loop instead of
  // playing the full clip — jumping back to 0:00 well before the video's
  // native end means the `loop` attribute (kept as a safety net for clips
  // shorter than the cap) never actually has to fire in practice.
  const onPreviewTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.currentTime >= PREVIEW_LOOP_SECONDS) video.currentTime = 0;
  };

  return (
    <button
      ref={hostRef}
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Play ${item.title} for ${item.client}`}
      className="portfolio-tile media-frame video-frame relative aspect-[9/16] w-full bg-bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
    >
      {needsLetterbox && (
        <video
          ref={backdropVideoRef}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          onTimeUpdate={onPreviewTimeUpdate}
          className="portfolio-tile-backdrop absolute inset-0 h-full w-full object-cover"
        />
      )}

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        onTimeUpdate={onPreviewTimeUpdate}
        className="absolute inset-0 h-full w-full"
        style={fitStyle}
      />

      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-text-primary/55 to-transparent" />

      <span className="pointer-events-none absolute bottom-2 left-3 right-14 z-[2] truncate text-left text-[10px] font-medium uppercase tracking-[0.08em] text-brand-cream sm:text-[11px]">
        {categoryLabel(item.category)}
      </span>

      <span className="portfolio-duration pointer-events-none absolute bottom-2 right-2 z-[2] rounded px-1.5 py-0.5 text-[11px] font-medium leading-none text-brand-cream">
        {formatDuration(item.durationSec)}
      </span>
    </button>
  );
}
