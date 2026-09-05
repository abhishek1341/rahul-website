import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ClientLogo } from '@/lib/client-logos';

// No 'use client' on purpose: the scroll is pure CSS, so this renders happily
// inside both the server tree (app/page.tsx) and a client tree (VideoGrid).

// A single copy has to out-measure the widest viewport or the -50% loop
// exposes a gap, so short lists repeat until they clear this many tiles.
const MIN_TILES_PER_COPY = 16;

interface LogoMarqueeProps {
  logos: ClientLogo[];
  /** Seconds for one full cycle. Higher = slower. */
  speedSeconds?: number;
  label?: string;
  className?: string;
}

export default function LogoMarquee({
  logos,
  speedSeconds = 36,
  label = 'Brands we have worked with',
  className = '',
}: LogoMarqueeProps) {
  if (logos.length === 0) return null;

  const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_COPY / logos.length));
  const copy = Array.from({ length: repeats }, () => logos).flat();

  return (
    <div
      className={`logo-marquee ${className}`.trim()}
      style={{ '--logo-marquee-duration': `${speedSeconds}s` } as CSSProperties}
      role="region"
      aria-label={label}
    >
      <div className="logo-marquee-track">
        {/* Exactly two copies, so the keyframe's -50% lands on the start of the
            second copy — pixel-identical to frame zero, hence no visible reset. */}
        {[0, 1].map((copyIndex) => (
          <ul
            key={copyIndex}
            className="logo-marquee-set"
            data-clone={copyIndex === 1 || undefined}
            aria-hidden={copyIndex === 1 || undefined}
          >
            {copy.map((logo, index) => (
              <li key={`${copyIndex}-${index}-${logo.src}`} className="logo-marquee-tile">
                {/* `fill` positions against the padding box, so the tile's
                    breathing room needs its own element to measure against. */}
                <span className="logo-marquee-thumb">
                  {/* Eager, but deprioritised: tiles scroll into view on a
                      timer rather than on scroll position, so lazy loading
                      slides blank plates past the viewer. The whole strip is
                      ~170KB at display size and the clone reuses the cache. */}
                  <Image
                    src={logo.src}
                    alt={copyIndex === 0 ? logo.alt : ''}
                    fill
                    sizes="180px"
                    loading="eager"
                    fetchPriority="low"
                    className="logo-marquee-img"
                  />
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
