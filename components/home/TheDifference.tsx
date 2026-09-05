'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Reveal from '../animations/Reveal';

export default function TheDifference() {
  const features = [
    { other: 'Generic content templates', suntrix: 'Custom content for your brand' },
    { other: 'Monthly reporting only', suntrix: 'Real-time performance tracking' },
    { other: 'Separate teams for different platforms', suntrix: 'Integrated cross-platform strategy' },
    { other: 'Long-term contracts required', suntrix: 'Flexible month-to-month options' },
    { other: 'One-size-fits-all approach', suntrix: 'Tailored to your specific goals' },
  ];

  return (
    <Section className="difference-section">
      <Container>
        <div>
          <Reveal preset="fadeUpSpring">
            <div className="section-label-row">
              <span className="section-label">The difference</span>
            </div>
          </Reveal>

          <Reveal preset="fadeUpSpring">
            <h2 className="mb-16 text-center text-[36px] leading-[110%] md:text-[64px]">
              Why choose Suntrix Media<br />
              over <span className="accent">everyone</span> else?
            </h2>
          </Reveal>

          <Reveal preset="fadeUpSpring">
            <div className="comparison-grid">
              <div className="comparison-column">
                <h3 className="comparison-card-header">Other Agencies</h3>
                <div className="comparison-card comparison-card--other">
                  <ul className="comparison-list">
                    {features.map((feature, index) => (
                      <li key={index} className="comparison-list-item">
                        <span className="comparison-icon-x" aria-hidden="true">✕</span>
                        <span>{feature.other}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="comparison-column">
                <h3 className="comparison-card-brand">Suntrix Media</h3>
                <div className="comparison-card comparison-card--suntrix">
                  <ul className="comparison-list">
                    {features.map((feature, index) => (
                      <li key={index} className="comparison-list-item">
                        <span className="comparison-icon-check" aria-hidden="true">✓</span>
                        <span>{feature.suntrix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
