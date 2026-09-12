import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import { BOOK_A_CALL_HREF } from '@/data/services';

export default function ServicesMidCta() {
  return (
    <section className="services-mid-cta">
      <Container>
        <div className="services-mid-cta-inner">
          <p className="services-mid-cta-eyebrow">Not sure where to start?</p>
          <h2 className="services-mid-cta-title">
            Tell us the goal — we&apos;ll map the right mix of services to it.
          </h2>
          <Button href={BOOK_A_CALL_HREF} variant="primary">
            Book a Free Strategy Call
          </Button>
        </div>
      </Container>
    </section>
  );
}
