'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Counter from '../ui/Counter';
import Reveal from '../animations/Reveal';
import Stagger from '../animations/Stagger';

export default function ClientResults() {
  const results = [
    {
      title: 'Scaling a beauty brand with',
      titleAccent: 'reels',
      description: 'Beauty brand Glowhaus came to us with great products but low engagement. We developed a UGC-driven content strategy focused on short-form video, optimized for Reels.',
      metrics: [
        { value: 128, suffix: 'K', label: 'Reel Views', subtext: 'In the first 30 days' },
        { value: 245, suffix: '%', label: 'Engagement', subtext: 'Compared to previous month' },
      ],
      imageLeft: false,
      videoSrc: '/Ds reel 02.mp4',
    },
    {
      title: 'Growing a clothing brand with',
      titleAccent: 'video',
      description: 'Theo came to us ahead of a new collection launch, looking to grow their reach and build anticipation. We combined UGC with light influencer seeding and short-form video.',
      metrics: [
        { value: 18, suffix: 'K', label: 'Followers', subtext: 'In six weeks' },
        { value: 156, suffix: '%', label: 'Engagement', subtext: 'Compared to previous month' },
      ],
      imageLeft: true,
      videoSrc: '/Bag reel-.mp4',
    },
  ];

  return (
    <Section>
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
                  <Reveal preset="fadeUpSpring" useAnimate>
                    <div className="grid grid-cols-2 gap-8">
                      {result.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex}>
                          <div className="text-[56px] font-medium mb-2 tracking-[-0.07em] text-near-black">
                            <Counter 
                              value={metric.value} 
                              suffix={metric.suffix}
                            />
                          </div>
                          <div className="client-results-metric-label">{metric.label}</div>
                          <div className="text-secondary">{metric.subtext}</div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </Stagger>
              </div>

              {/* Image/Video Section */}
              <div className={result.imageLeft ? 'lg:order-1' : 'lg:order-2'}>
                <Reveal preset={result.imageLeft ? 'slideInLeft' : 'slideInRight'} delay={0.2}>
                  <div className="media-frame video-frame w-full aspect-[4/4] bg-[#E8E3DC]">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={result.videoSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
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
