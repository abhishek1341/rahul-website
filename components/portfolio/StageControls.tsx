'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface StageControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export default function StageControls({ videoRef }: StageControlsProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const scrubbing = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncFromVideo = () => {
      setPlaying(!video.paused);
      setMuted(video.muted);
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      if (!scrubbing.current) setCurrentTime(video.currentTime);
    };

    syncFromVideo();

    video.addEventListener('play', syncFromVideo);
    video.addEventListener('pause', syncFromVideo);
    video.addEventListener('timeupdate', syncFromVideo);
    video.addEventListener('durationchange', syncFromVideo);
    video.addEventListener('loadedmetadata', syncFromVideo);
    video.addEventListener('volumechange', syncFromVideo);

    return () => {
      video.removeEventListener('play', syncFromVideo);
      video.removeEventListener('pause', syncFromVideo);
      video.removeEventListener('timeupdate', syncFromVideo);
      video.removeEventListener('durationchange', syncFromVideo);
      video.removeEventListener('loadedmetadata', syncFromVideo);
      video.removeEventListener('volumechange', syncFromVideo);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(value);
    video.currentTime = value;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-text-primary/70 to-transparent px-3 pb-3 pt-8">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => seek(Number(event.target.value))}
        onPointerDown={() => {
          scrubbing.current = true;
        }}
        onPointerUp={() => {
          scrubbing.current = false;
        }}
        aria-label="Seek"
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        className="portfolio-scrubber w-full"
        style={{
          background: `linear-gradient(to right, var(--accent) ${progress}%, color-mix(in srgb, var(--text-inverse) 25%, transparent) ${progress}%)`,
        }}
      />

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-text-inverse/15 text-text-inverse transition-colors duration-150 hover:bg-text-inverse/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 translate-x-[1px]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          )}
        </button>

        <span className="text-[11px] font-medium tabular-nums leading-none text-text-inverse/70">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-text-inverse/15 text-text-inverse transition-colors duration-150 hover:bg-text-inverse/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverse"
        >
          {muted ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M11 5L6.5 9H3v6h3.5L11 19zM16 9l5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M11 5L6.5 9H3v6h3.5L11 19zM15.5 9.5a3.5 3.5 0 010 5M18 7a7 7 0 010 10" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
