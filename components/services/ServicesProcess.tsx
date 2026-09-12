import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import SoftReveal from './SoftReveal';
import { processSteps } from '@/data/services';

export default function ServicesProcess() {
  return (
    <Section className="services-process">
      <Container>
        <SoftReveal>
          <h2 className="services-section-title">How we work</h2>
        </SoftReveal>

        <ol className="services-stepper">
          {processSteps.map((step, index) => (
            <li key={step.number} className="services-step">
              <span className="services-step-index" aria-hidden="true">
                {step.number}
              </span>
              <SoftReveal className="services-step-body" delay={Math.min(index * 0.04, 0.16)}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </SoftReveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
