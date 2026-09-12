import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import MutedAutoplayVideo from '@/components/media/MutedAutoplayVideo';
import SoftReveal from './SoftReveal';
import { BOOK_A_CALL_HREF } from '@/data/services';

export default function ServicesHero() {
  return (
    <section className="services-hero">
      <Container>
        <div className="services-hero-grid">
          <div className="services-hero-copy-col">
            <SoftReveal>
              <div className="section-label-row services-hero-label">
                <span className="section-label">Services</span>
              </div>
            </SoftReveal>

            <SoftReveal delay={0.04}>
              <h1 className="services-hero-title">
                Creative, marketing and digital solutions built to move brands{' '}
                <span className="accent">forward</span>.
              </h1>
            </SoftReveal>

            <SoftReveal delay={0.08}>
              <div className="services-hero-copy">
                <p>
                  At Suntrix Media, we bring strategy, content, performance marketing, technology and
                  execution together under one roof.
                </p>
                <p>
                  From building your brand presence and producing content to running campaigns,
                  developing websites and creating AI-powered visuals, every service is designed around
                  one goal:
                </p>
                <p className="services-hero-goal">Turning attention into growth.</p>
              </div>
            </SoftReveal>

            <SoftReveal delay={0.1}>
              <ul className="services-hero-rules">
                <li>No random posting.</li>
                <li>No copy-paste strategies.</li>
                <li>No unnecessary marketing jargon.</li>
              </ul>
            </SoftReveal>

            <SoftReveal delay={0.12}>
              <p className="services-hero-pillars">Strategy. Creative. Technology. Performance.</p>
            </SoftReveal>

            <SoftReveal delay={0.14}>
              <div className="services-hero-actions">
                <Button href={BOOK_A_CALL_HREF} variant="primary">
                  Book a Strategy Call
                </Button>
              </div>
            </SoftReveal>
          </div>

          <SoftReveal delay={0.1} className="services-hero-media">
            <div className="services-hero-media-inner media-frame video-frame">
              <MutedAutoplayVideo
                src="/Low%20mb%20videos/Jewelery/EK%20NOOR.mp4"
                className="services-hero-media-video"
                aria-hidden="true"
                preload="metadata"
              />
            </div>
          </SoftReveal>
        </div>
      </Container>
    </section>
  );
}
