'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { tryPlayMuted } from '@/lib/muted-autoplay';

type IntroPhase = 'playing' | 'leaving' | 'done';

const SEEN_KEY = 'suntrix:intro-seen';
const EXIT_MS = 700;
const FALLBACK_MS = 15_000;

declare global {
  interface Window {
    // Set synchronously by the blocking `intro-gate` script in app/layout.tsx,
    // before hydration — see resolveShouldPlay() below.
    __introShouldPlay?: boolean;
  }
}

// Resolved once per page load and cached at module scope. The flag write has to
// happen exactly once, and React invokes state initialisers twice in StrictMode,
// which would otherwise make the second call believe the intro had been seen.
let shouldPlay: boolean | null = null;

function resolveShouldPlay() {
  if (shouldPlay !== null) return shouldPlay;

  // The blocking head script already made this exact decision (and wrote the
  // sessionStorage flag) before this component's chunk even finished loading,
  // so the static #intro-placeholder and this component never disagree.
  if (typeof window.__introShouldPlay === 'boolean') {
    shouldPlay = window.__introShouldPlay;
    return shouldPlay;
  }

  // Fallback for the (unexpected) case where the head script didn't run.
  let seen = true;
  try {
    seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode, hardened settings). Skip the intro rather
    // than replay it on every single navigation.
  }

  const isHome = window.location.pathname === '/';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The flag is written above whatever the route, so entering the site on
  // /portfolio and then navigating home cannot start the intro mid-session.
  shouldPlay = !seen && isHome && !reducedMotion;
  return shouldPlay;
}

export default function IntroOverlay() {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    resolveShouldPlay() ? 'playing' : 'done'
  );
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishStarted = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = phase !== 'done';

  // The static placeholder (app/layout.tsx) only exists to bridge the gap
  // between first paint and this chunk loading — the instant this component
  // mounts, it (or nothing, if the intro shouldn't play) takes over instead,
  // so the placeholder is no longer needed regardless of `active`.
  useEffect(() => {
    document.getElementById('intro-placeholder')?.remove();
  }, []);

  const finishIntro = useCallback(() => {
    if (finishStarted.current) return;

    finishStarted.current = true;
    setPhase('leaving');
    exitTimer.current = setTimeout(() => setPhase('done'), EXIT_MS);
  }, []);

  // The page content is server-rendered markup owned by the layout, so it is
  // held back imperatively rather than through props.
  useEffect(() => {
    if (!active) return;

    const content = document.querySelector('.site-content');
    const { body } = document;
    const root = document.documentElement;
    const previousOverflow = body.style.overflow;

    // Also (re-)adds the class the blocking head script may have already set —
    // harmless no-op in that case — and, importantly, is what removes it once
    // the intro finishes, so scroll never stays locked past that point.
    root.classList.add('intro-active');
    body.style.overflow = 'hidden';
    content?.setAttribute('inert', '');
    content?.setAttribute('aria-hidden', 'true');

    return () => {
      root.classList.remove('intro-active');
      body.style.overflow = previousOverflow;
      content?.removeAttribute('inert');
      content?.removeAttribute('aria-hidden');
    };
  }, [active]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const fallbackTimer = setTimeout(finishIntro, FALLBACK_MS);
    return () => clearTimeout(fallbackTimer);
  }, [phase, finishIntro]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void tryPlayMuted(video);
    };

    // iOS Safari often rejects the first play() (file not buffered yet, or
    // Low Power Mode). That is not a reason to skip the intro — keep the
    // overlay up and retry as soon as the file can play, or on the first tap.
    play();
    video.addEventListener('canplay', play);
    video.addEventListener('loadeddata', play);
    video.addEventListener('loadedmetadata', play);

    return () => {
      video.removeEventListener('canplay', play);
      video.removeEventListener('loadeddata', play);
      video.removeEventListener('loadedmetadata', play);
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      className={`landing-intro${phase === 'leaving' ? ' landing-intro--leaving' : ''}`}
      role="dialog"
      aria-label="Suntrix Media introduction"
      aria-modal="true"
    >
      <div
        className={`landing-intro-brand${isReady ? ' landing-intro-brand--hidden' : ''}`}
        aria-hidden="true"
      >
        Suntrix Media
      </div>

      <video
        ref={videoRef}
        className={`landing-intro-video${isReady ? ' landing-intro-video--ready' : ''}`}
        src="/Landing_video/img-8344.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        data-muted-autoplay=""
        onPlaying={() => setIsReady(true)}
        onEnded={finishIntro}
        onError={finishIntro}
        onClick={() => {
          const video = videoRef.current;
          if (video) void tryPlayMuted(video);
        }}
      />

      <button
        type="button"
        className="landing-intro-skip"
        onClick={finishIntro}
        aria-label="Skip introduction video"
      >
        Skip intro
      </button>
    </div>
  );
}
