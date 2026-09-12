'use client';

import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import LogoMarquee from '@/components/ui/LogoMarquee';
import SoftReveal from './SoftReveal';
import Counter from '@/components/ui/Counter';
import type { ClientLogo } from '@/lib/client-logos';
import { BOOK_A_CALL_HREF, serviceStats, whyPoints } from '@/data/services';

export default function ServicesBand({ clientLogos = [] }: { clientLogos?: ClientLogo[] }) {
  return (
    <>
      {clientLogos.length > 0 ? (
        <div className="services-trusted">
          <p className="services-trusted-label">Brands we&apos;ve worked with</p>
          <LogoMarquee logos={clientLogos} speedSeconds={32} />
        </div>
      ) : null}

      <Section className="services-why">
        <Container>
          <SoftReveal>
            <h2 className="services-section-title">Why Suntrix Media</h2>
          </SoftReveal>
          <div className="services-why-grid">
            {whyPoints.map((point, index) => (
              <SoftReveal key={point.title} delay={Math.min(index * 0.04, 0.16)}>
                <article className="services-why-card">
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              </SoftReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="services-numbers">
        <Container>
          <SoftReveal>
            <h2 className="services-section-title">Numbers that matter</h2>
          </SoftReveal>
          <div className="services-stats">
            {serviceStats.map((stat, index) => (
              <SoftReveal key={stat.label} delay={Math.min(index * 0.04, 0.12)}>
                <div className="services-stat">
                  <p className="services-stat-value">
                    {stat.prefix}
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      format={stat.format === 'locale' ? (count) => count.toLocaleString('en-IN') : undefined}
                    />
                  </p>
                  <p className="services-stat-label">{stat.label}</p>
                </div>
              </SoftReveal>
            ))}
            <SoftReveal delay={0.12}>
              <div className="services-stat">
                <p className="services-stat-value">Multiple</p>
                <p className="services-stat-label">
                  Industries — F&amp;B • Jewellery • Real Estate • Recruitment • Fashion • Events •
                  E-commerce • Personal Brands
                </p>
              </div>
            </SoftReveal>
          </div>
        </Container>
      </Section>

      <section className="services-final-cta">
        <Container>
          <SoftReveal className="services-final-inner">
            <h2 className="services-section-title">Need One Service or the Full System?</h2>
            <div className="services-final-copy">
              <p>Some brands need content.</p>
              <p>Some need better advertising.</p>
              <p>Some need a complete digital presence.</p>
              <p>
                We build the right combination of strategy, creative, production, advertising and
                technology around what your business actually needs.
              </p>
              <p className="services-final-lead">Let&apos;s Build Something That Performs.</p>
            </div>
            <Button href={BOOK_A_CALL_HREF} variant="primary">
              Book a Free Strategy Call
            </Button>
            <p className="services-final-tagline">Building Brands That Shine.</p>
          </SoftReveal>
        </Container>
      </section>
    </>
  );
}
