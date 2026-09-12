'use client';

import Button from '../ui/Button';
import HeroStoriesPlayer from './HeroStoriesPlayer';
import { heroStories } from '@/data/heroStories';
import { MAILTO_HREF } from '@/lib/site';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-shell">
        <div className="site-container hero-container">
          <div className="hero-grid">
            {/* Hero copy stays in the first paint so LCP is not delayed by
                entrance animations (Lighthouse measures the subtitle text). */}
            <div className="hero">
              <h1 className="mb-6">
                Short form <br />
                done <span className="accent">right</span>
              </h1>
              <p className="mb-8 max-w-xl">
                We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.
              </p>
              <div className="hero-actions">
                <Button href={MAILTO_HREF} variant="primary">
                  Get in touch
                </Button>
              </div>
            </div>

            <div className="hero-media">
              <div className="hero-media-inner media-frame video-frame client-logo-tile bg-bg-surface">
                <HeroStoriesPlayer stories={heroStories} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
