'use client';

import Container from '../layout/Container';
import Reveal from '../animations/Reveal';
import Button from '../ui/Button';
import { BOOK_A_CALL_HREF } from '@/lib/site';

export default function GetStarted() {
  return (
    <section className="brand-band-cta">
      <Container>
        <Reveal preset="fadeUpSpring">
          <div className="get-started-cta">
            <div className="section-label-row">
              <span className="section-label">Get started</span>
            </div>

            <h2 className="get-started-cta-heading">
              Your growth journey
              <br />
              starts <span className="accent">right here</span>.
            </h2>

            <p className="get-started-cta-description">
              Book a free 30 min strategy call and we&apos;ll show you how to turn
              followers into customers.
            </p>

            {/* Same Button + .btn-nav as the header "Book a call". */}
            <Button href={BOOK_A_CALL_HREF} variant="primary" size="nav">
              Book a call
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
