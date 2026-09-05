'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import CategoryFilter, { type FilterValue } from './CategoryFilter';
import VideoCard from './VideoCard';
import type { Category, PortfolioItem } from '@/data/portfolio';
import Container from '@/components/layout/Container';
import LogoMarquee from '@/components/ui/LogoMarquee';
import type { ClientLogo } from '@/lib/client-logos';

const VideoLightbox = dynamic(() => import('./VideoLightbox'), { ssr: false });

// Every card autoplays as soon as it's 60%+ in view, on every device —
// desktop and mobile behave identically, with no hover step in between.
const VISIBILITY_THRESHOLD = 0.6;
const PAGE_SIZE = 4;

interface VideoGridProps {
  items: PortfolioItem[];
  categories: Category[];
  /** Read server-side in app/portfolio/page.tsx; omit to hide the strip. */
  clientLogos?: ClientLogo[];
}

export default function VideoGrid({ items, categories, clientLogos = [] }: VideoGridProps) {
  const [active, setActive] = useState<FilterValue>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Bookkeeping only (no concurrency cap) — every card that's visible enough
  // plays, full stop. This just lets the lightbox pause everything on open.
  // A letterboxed card owns two <video> elements (backdrop + foreground); both
  // get added/removed together as one unit.
  const playingRef = useRef<Set<HTMLVideoElement>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbacksRef = useRef(new Map<Element, (active: boolean) => void>());
  // Lets focus return to whichever card matches the item last viewed, which is
  // not necessarily the card that opened the lightbox.
  const cardsRef = useRef(new Map<string, HTMLButtonElement>());
  const reducedMotionQuery = useRef<MediaQueryList | null>(null);

  // Playback decisions read the query live rather than through React state,
  // which lags a render behind and can let the first IntersectionObserver
  // callback fetch a video the user never wanted loaded.
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;

    if (!reducedMotionQuery.current) {
      reducedMotionQuery.current = window.matchMedia('(prefers-reduced-motion: reduce)');
    }

    return reducedMotionQuery.current.matches;
  }, []);

  const claimPlayback = useCallback((videos: HTMLVideoElement[]) => {
    for (const video of videos) playingRef.current.add(video);
  }, []);

  const releasePlayback = useCallback((videos: HTMLVideoElement[]) => {
    for (const video of videos) playingRef.current.delete(video);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.current = query;

    const sync = () => setReducedMotion(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const register = useCallback(
    (element: Element, onVisible: (active: boolean) => void) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const callback = callbacksRef.current.get(entry.target);
              if (!callback) continue;

              callback(
                entry.isIntersecting &&
                  entry.intersectionRatio >= VISIBILITY_THRESHOLD - 0.01
              );
            }
          },
          { threshold: [0, VISIBILITY_THRESHOLD, 1] }
        );
      }

      const observer = observerRef.current;

      // Cards already on screen at mount (above the fold, or revealed by a
      // filter click) autoplay immediately too — visibility is the only
      // trigger, with no special-casing for how a card became visible.
      callbacksRef.current.set(element, onVisible);
      observer.observe(element);

      return () => {
        callbacksRef.current.delete(element);
        observer.unobserve(element);
      };
    },
    []
  );

  useEffect(() => {
    const callbacks = callbacksRef.current;

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      callbacks.clear();
    };
  }, []);

  const populatedCategories = useMemo(
    () => categories.filter((category) => items.some((item) => item.category === category.slug)),
    [categories, items]
  );

  const visibleItems = useMemo(
    () => (active === 'all' ? items : items.filter((item) => item.category === active)),
    [active, items]
  );

  // Reset to first page whenever the selected category changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [active]);

  const paginatedItems = useMemo(
    () => visibleItems.slice(0, visibleCount),
    [visibleItems, visibleCount]
  );

  const hasMore = visibleCount < visibleItems.length;

  const registerCard = useCallback((id: string, element: HTMLButtonElement | null) => {
    if (element) cardsRef.current.set(id, element);
    else cardsRef.current.delete(id);
  }, []);

  const openLightbox = useCallback(
    (item: PortfolioItem) => {
      const playing = Array.from(playingRef.current);
      playingRef.current.clear();

      for (const video of playing) {
        video.pause();
        video.currentTime = 0;
      }

      setOpenIndex(visibleItems.findIndex((candidate) => candidate.id === item.id));
    },
    [visibleItems]
  );

  const closeLightbox = useCallback(() => {
    const id = openIndex === null ? undefined : visibleItems[openIndex]?.id;

    setOpenIndex(null);

    // Wait for the dialog to unmount before handing focus back to the card.
    requestAnimationFrame(() => {
      if (id) cardsRef.current.get(id)?.focus();
    });
  }, [openIndex, visibleItems]);

  return (
    <section
      className="portfolio-grid-section"
      aria-label="Portfolio work"
    >
      <LogoMarquee
        logos={clientLogos}
        speedSeconds={40}
        className="pt-2 pb-4 lg:pt-4 lg:pb-6"
      />

      <CategoryFilter
        categories={populatedCategories}
        active={active}
        onChange={setActive}
      />

      {visibleItems.length === 0 ? (
        <Container>
          <p className="py-20 text-center text-[15px] leading-[1.5] text-secondary">
            More coming soon
          </p>
        </Container>
      ) : (
        <Container>
          <div
            key={active}
            className="portfolio-tile-enter portfolio-grid grid grid-cols-2 gap-2.5 pt-4 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 lg:pt-6"
          >
            {paginatedItems.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                reducedMotion={reducedMotion}
                prefersReducedMotion={prefersReducedMotion}
                claimPlayback={claimPlayback}
                releasePlayback={releasePlayback}
                register={register}
                registerCard={registerCard}
                onOpen={openLightbox}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pb-10 pt-6 lg:pb-12">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="btn btn-nav"
              >
                Show more
              </button>
            </div>
          )}

          {!hasMore && visibleItems.length > PAGE_SIZE && (
            <div className="pb-10 lg:pb-12" />
          )}
        </Container>
      )}

      {openIndex !== null && visibleItems[openIndex] && (
        <VideoLightbox
          items={visibleItems}
          index={openIndex}
          reducedMotion={reducedMotion}
          onNavigate={setOpenIndex}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}
