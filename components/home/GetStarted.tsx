'use client';

import Link from 'next/link';
import Container from '../layout/Container';
import Section from '../layout/Section';
import Reveal from '../animations/Reveal';

export default function GetStarted() {
  return (
    <Section>
      <Container>
        <Reveal preset="fadeUpSpring">
          <div className="get-started-wrap">
            <div className="get-started-cta">
              <div className="section-label-row">
                <span className="section-label">Get started</span>
              </div>

              <h2 className="get-started-cta-heading">
                Your viral journey<br />
                starts <span className="accent">right here</span>.
              </h2>

              <p className="get-started-cta-description">
                Book a free 30 min strategy call and we&apos;ll show you how to turn followers into customers.
              </p>

              <Link href="/book-a-call" className="get-started-cta-button">
                Book a call
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
