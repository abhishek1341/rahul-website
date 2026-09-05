'use client';

import Button from '../ui/Button';
import Stagger from '../animations/Stagger';
import Reveal from '../animations/Reveal';
import MutedAutoplayVideo from '@/components/media/MutedAutoplayVideo';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-shell">
        <div className="site-container hero-container">
          <div className="hero-grid">
            <Stagger delayChildren={2.0} stagger={0.1} className="hero">
              <Reveal preset="fadeUpSpring" useAnimate>
                <h1 className="mb-6">
                  <span className="inline-block" style={{ willChange: 'transform' }}>Short</span>{' '}
                  <span className="inline-block" style={{ willChange: 'transform' }}>form</span>{' '}<br />
                  <span className="inline-block" style={{ willChange: 'transform' }}>done</span>{' '}
                  <span className="accent inline-block" style={{ willChange: 'transform' }}>right</span>
                </h1>
              </Reveal>
              <Reveal preset="fadeUpSpring" useAnimate>
                <p className="mb-8 max-w-xl">
                  We combine content, management, and paid media to help brands grow and convert on the social platforms that matter most to you.
                </p>
              </Reveal>
              <Reveal preset="fadeUpSpring" useAnimate>
                <div className="hero-actions">
                  <Button href="mailto:suntrixmedia@gmail.com" variant="primary">
                    Get in touch
                  </Button>
                </div>
              </Reveal>
            </Stagger>

            <Reveal preset="fadeUpSpring" className="hero-media">
              <div className="hero-media-inner media-frame video-frame client-logo-tile bg-bg-surface">
                <MutedAutoplayVideo className="bg-bg-surface">
                  <source
                    src="/Low%20mb%20videos/Website%20video/video-02-website.mp4"
                    type="video/mp4"
                  />
                </MutedAutoplayVideo>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
