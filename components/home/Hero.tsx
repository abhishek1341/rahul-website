'use client';

import Button from '../ui/Button';
import Stagger from '../animations/Stagger';
import Reveal from '../animations/Reveal';
import SocialMarquee from './SocialMarquee';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          <Stagger delayChildren={2.0} stagger={0.1} className="hero">
            <Reveal preset="fadeUpSpring" useAnimate>
              <div className="mb-8">
                <SocialMarquee />
              </div>
            </Reveal>
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
                <Button href="/book-a-call" variant="primary">
                  Get in touch
                </Button>
              </div>
            </Reveal>
          </Stagger>

          <Reveal preset="fadeUpSpring" className="hero-media">
            <div className="hero-media-inner media-frame video-frame">
              <video autoPlay loop muted playsInline>
                <source src="/areey bro prayag.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
