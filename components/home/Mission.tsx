'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Reveal from '../animations/Reveal';

export default function Mission() {
  return (
    <Section className="mission-section">
      <Container>
        <Reveal preset="fadeUpSpring">
          <div className="mission-panel">
            <div className="section-label-row">
              <span className="section-label">Our mission</span>
            </div>

            <h2 className="mission-panel-heading">
              Turning content chaos into <span className="accent">consistent growth</span>
            </h2>

            <div className="mission-panel-body">
              <p>
                We work with brands who are ready to take their social media presence seriously.
              </p>
              <p>
                Not just to fill a feed or chase trends, but to show up with purpose and build something that actually grows.
              </p>
              <p>
                For us, content is just the starting point.
              </p>
              <p>
                Our approach combines strategy, execution, and consistency. We handle the planning, posting, and platform management so you can focus on running the business.
              </p>
              <p>
                If you&apos;re ready to grow with intention, we&apos;d love to help.
              </p>
            </div>

            <div className="mission-panel-footer">
              <span className="mission-panel-footer-name">Suntrix Media</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
