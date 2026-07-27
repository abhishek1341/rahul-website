'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

const ICON_FILL = 'rgb(0, 0, 0)';

const socialIcons = [
  {
    label: 'Facebook',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={ICON_FILL}
          d="M14 8.5V6.75c0-.69.56-1.25 1.25-1.25H17V3h-2.5C12.57 3 11 4.57 11 6.25V8.5H9v2.75h2V21h3v-9.75h2.5L17 8.5h-3z"
        />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={ICON_FILL}
          d="M16.5 3c.4 2.1 1.7 3.9 3.5 5v3.2c-1.4 0-2.7-.4-3.9-1.1v6.8c0 3.4-2.8 6.2-6.2 6.2S3.7 20.3 3.7 16.9s2.8-6.2 6.2-6.2c.3 0 .7 0 1 .1v3.3a2.9 2.9 0 00-1-.2c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3h3.8z"
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={ICON_FILL}
          d="M12 2.2c2.7 0 3 0 4.1.1 1 0 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.2.4.4 1 .4 2 .1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.6-.4 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.2-1 .4-2 .4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.6-.2-2-.4-.5-.2-.9-.4-1.3-.8-.4-.4-.6-.8-.8-1.3-.2-.4-.4-1-.4-2-.1-1.1-.1-1.4-.1-4.1s0-3 .1-4.1c0-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.2 1-.4 2-.4 1.1-.1 1.4-.1 4.1-.1zm0 1.8c-2.6 0-2.9 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.3-.1 4s0 2.9.1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.3.1 4 .1s2.9 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.3.1-4s0-2.9-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.3-.1-4-.1zm0 3.2a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm5.1-3.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
        />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={ICON_FILL}
          d="M17.3 3h3.2l-7 8.1L21.5 21h-6.1l-4.8-6.3L4.8 21H1.6l7.5-8.6L2.5 3h6.3l4.3 5.7L17.3 3zm-1.1 16.2h1.8L7.9 4.8H6l10.2 14.4z"
        />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill={ICON_FILL}
          d="M12 2C6.48 2 2 6.48 2 12c0 4.18 2.55 7.76 6.18 9.26-.09-.79-.17-2.01.03-2.87.18-.78 1.16-4.97 1.16-4.97s-.29-.58-.29-1.43c0-1.34.78-2.34 1.74-2.34.82 0 1.22.62 1.22 1.36 0 .83-.53 2.07-.8 3.22-.23.96.48 1.74 1.43 1.74 1.72 0 3.04-1.81 3.04-4.42 0-2.31-1.66-3.93-4.03-3.93-2.74 0-4.35 2.06-4.35 4.19 0 .83.32 1.72.72 2.2a.3.3 0 01.07.28l-.27 1.08c-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.15 2.29-6.04 6.61-6.04 3.47 0 6.17 2.47 6.17 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.3-1.15l-.63 2.39c-.23.89-.85 2.01-1.27 2.69A10 10 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
        />
      </svg>
    ),
  },
];

// Original: 1px every 16ms. Reduced by 30% → 0.7px/ms effective rate.
const SCROLL_SPEED_PX_PER_MS = (1 / 16) * 0.7;

const outerStyle: CSSProperties = {
  width: 180,
  height: 32,
  background: 'rgba(0,0,0,0.04)',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  placeItems: 'center',
  margin: 0,
  padding: 0,
  listStyleType: 'none',
  opacity: 1,
  maskImage:
    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 12.5%, rgb(0,0,0) 87.5%, rgba(0,0,0,0) 100%)',
  WebkitMaskImage:
    'linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 12.5%, rgb(0,0,0) 87.5%, rgba(0,0,0,0) 100%)',
  overflow: 'hidden',
};

const listStyle: CSSProperties = {
  display: 'flex',
  gap: 20,
  flexDirection: 'row',
  flexWrap: 'nowrap',
  willChange: 'transform',
  transform: 'translate3d(0px, 0, 0)',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  placeItems: 'center',
  width: 'max-content',
  height: '100%',
};

const iconItemStyle: CSSProperties = {
  flexShrink: 0,
};

const duplicateItemStyle: CSSProperties = {
  flexShrink: 0,
  willChange: 'transform',
};

export default function SocialMarquee() {
  const listRef = useRef<HTMLUListElement>(null);
  const translateXRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const segmentWidthRef = useRef(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measureSegmentWidth = () => {
      const setSize = socialIcons.length;
      const items = list.children;

      if (items.length < setSize * 2) return;

      const first = items[0] as HTMLElement;
      const secondSetFirst = items[setSize] as HTMLElement;
      segmentWidthRef.current = secondSetFirst.offsetLeft - first.offsetLeft;
    };

    measureSegmentWidth();

    const resizeObserver = new ResizeObserver(measureSegmentWidth);
    resizeObserver.observe(list);
    window.addEventListener('resize', measureSegmentWidth);

    let animationFrameId = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      translateXRef.current -= delta * SCROLL_SPEED_PX_PER_MS;

      const segmentWidth = segmentWidthRef.current;
      if (segmentWidth > 0) {
        while (translateXRef.current <= -segmentWidth) {
          translateXRef.current += segmentWidth;
        }
      }

      list.style.transform = `translate3d(${translateXRef.current}px, 0, 0)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureSegmentWidth);
    };
  }, []);

  const renderIconSet = (setIndex: number) =>
    socialIcons.map((item) => (
      <li
        key={`${setIndex}-${item.label}`}
        aria-hidden={setIndex > 0 ? true : undefined}
        aria-label={setIndex === 0 ? item.label : undefined}
        style={setIndex > 0 ? duplicateItemStyle : iconItemStyle}
      >
        {item.icon}
      </li>
    ));

  return (
    <div className="social-marquee-outer" style={outerStyle}>
      <section style={sectionStyle}>
        <ul ref={listRef} style={listStyle}>
          {renderIconSet(0)}
          {renderIconSet(1)}
          {renderIconSet(2)}
        </ul>
      </section>
    </div>
  );
}
