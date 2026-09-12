'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

export default function Counter({
  value,
  suffix = '',
  duration = 2000,
  className = '',
  format,
}: CounterProps) {
  // Final value in the delivered HTML so a missed intersection never shows "0K".
  const [count, setCount] = useState(value);
  const elementRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Keep the final number; defer so we don't setState synchronously in the effect body.
    if (reduced) {
      const frame = requestAnimationFrame(() => setCount(value));
      return () => cancelAnimationFrame(frame);
    }

    const run = () => {
      if (started.current) return;
      started.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        // First frame jumps from SSR final → 0, then counts up.
        setCount(Math.floor(value * easeOutQuart));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCount(value);
          rafRef.current = null;
        }
      };

      // Reset to 0 only inside the animation loop so a cancelled observer
      // never leaves the DOM stuck on zero.
      setCount(0);
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      // If we unmounted mid-animation, leave the last painted value; on remount
      // SSR/state re-inits to `value`.
    };
  }, [value, duration]);

  // Suffix only appears once the count-up has actually reached its final
  // value — during the animation itself only the bare number is shown.
  return (
    <span ref={elementRef} className={className}>
      {format ? format(count) : count}
      {count >= value && suffix}
    </span>
  );
}
