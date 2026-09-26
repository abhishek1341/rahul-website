'use client';

import { useEffect, useRef } from 'react';

/**
 * Touch stand-in for the desktop hover pause. A finger down freezes the
 * strip; lifting or sliding off starts it again. Mouse hover stays in CSS.
 * Also swallows the mobile image callout (open / preview / copy).
 */
export default function LogoMarqueeTouch() {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchorRef.current?.closest('.logo-marquee');
    if (!(root instanceof HTMLElement)) return;

    const pause = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      root.classList.add('is-paused');
    };

    const resume = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      root.classList.remove('is-paused');
    };

    const blockCallout = (event: Event) => {
      event.preventDefault();
    };

    root.addEventListener('pointerdown', pause);
    root.addEventListener('pointerup', resume);
    root.addEventListener('pointercancel', resume);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('contextmenu', blockCallout);

    return () => {
      root.classList.remove('is-paused');
      root.removeEventListener('pointerdown', pause);
      root.removeEventListener('pointerup', resume);
      root.removeEventListener('pointercancel', resume);
      root.removeEventListener('pointerleave', resume);
      root.removeEventListener('contextmenu', blockCallout);
    };
  }, []);

  return <span ref={anchorRef} hidden />;
}
