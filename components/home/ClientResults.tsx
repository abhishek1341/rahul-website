'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Counter from '../ui/Counter';
import Reveal from '../animations/Reveal';
import Stagger from '../animations/Stagger';
import MutedAutoplayVideo from '@/components/media/MutedAutoplayVideo';
import type { SiteResultCase } from '@/lib/content/types';

const CASE_COPY = {
  glowhaus: {
    title: 'Scaling a beauty brand with',
    titleAccent: 'reels',
    description: 'Beauty brand Glowhaus came to us with great products but low engagement. We developed a UGC-driven content strategy focused on short-form video, optimized for Reels.',
    imageLeft: false,
    videoSrc: '/ds-reel-02.mp4',
    poster: '/posters/ds-reel-02.jpg',
  },
  theo: {
    title: 'Growing a clothing brand with',
    titleAccent: 'video',
    description: 'They came to us ahead of a new collection launch, looking to grow their reach and build anticipation. We combined UGC with light influencer seeding and short-form video.',
    imageLeft: true,
    videoSrc: '/bag-reel.mp4',
    poster: '/posters/bag-reel.jpg',
  },
} as const;

export default function ClientResults({ cases }: { cases: SiteResultCase[] }) {
  const results = cases.flatMap((entry) => {
    const copy = CASE_COPY[entry.id as keyof typeof CASE_COPY];
    if (!copy) return [];
    return [{
      ...copy,
      metrics: entry.metrics.filter((metric) => metric.visible),
    }];
  });

  return (
    <Section className="client-results-section">
      <Container>
        <div className="space-y-24">
          {results.map((result, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className={`client-results-block ${result.imageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                <Stagger delayChildren={0} stagger={0.15}>
                  <Reveal preset="fadeUpSpring" useAnimate>
                    <div className="section-label-row">
                      <span className="section-label">Client results</span>
                    </div>
                  </Reveal>
                  <Reveal preset="fadeUpSpring" useAnimate>
                    <h2 className="section-desktop-left mb-6 text-[38px] md:text-[64px] leading-[110%]">
                      {result.title} <span className="accent">{result.titleAccent}</span>
                    </h2>
                  </Reveal>
                  <Reveal preset="fadeUpSpring" useAnimate>
                    <p className="section-desktop-left mb-8">{result.description}</p>
                  </Reveal>
                  {result.metrics.length > 0 ? (
                    <Reveal preset="fadeUpSpring" useAnimate>
                      <div className={`grid gap-8 ${result.metrics.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {result.metrics.map((metric) => (
                          <div key={metric.id}>
                            <div className="text-[56px] font-medium mb-2 tracking-[-0.07em] text-near-black">
                              <Counter
                                value={metric.value}
                                suffix={metric.suffix}
                              />
                            </div>
                            <div className="client-results-metric-label">{metric.label}</div>
                            {metric.subtext ? <div className="text-secondary">{metric.subtext}</div> : null}
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  ) : null}
                </Stagger>
              </div>

              {/* Image/Video Section */}
              <div className={result.imageLeft ? 'lg:order-1' : 'lg:order-2'}>
                <Reveal preset={result.imageLeft ? 'slideInLeft' : 'slideInRight'} delay={0.2}>
                  <div className="media-frame video-frame w-full aspect-[4/4] bg-bg-surface">
                    <MutedAutoplayVideo
                      poster={result.poster}
                      className="bg-bg-surface"
                      lazy
                      preload="none"
                    >
                      <source src={result.videoSrc} type="video/mp4" />
                    </MutedAutoplayVideo>
                  </div>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
