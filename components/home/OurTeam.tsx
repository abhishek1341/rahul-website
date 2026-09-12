'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Button from '../ui/Button';
import Reveal from '../animations/Reveal';
import Image from 'next/image';
import { APPLICATION_HREF } from '@/lib/site';

export default function OurTeam() {
  return (
    <Section id="our-team" className="team-section">
      <Container>
        <div>
          <Reveal preset="fadeUpSpring">
            <div className="section-label-row">
              <span className="section-label">Our team</span>
            </div>
          </Reveal>

          <Reveal preset="fadeUpSpring">
            <h2 className="text-center mb-10 md:mb-12 text-[38px] md:text-[64px] leading-[110%]">
              Meet the team<br />
              behind your <span className="accent">success</span>.
            </h2>
          </Reveal>

          <div className="media-frame mx-auto mb-12 md:mb-16 w-full max-w-xl md:max-w-2xl">
            <Image
              src="/team_photo.png"
              alt="The Suntrix Media team standing together"
              width={1024}
              height={1536}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>

          <Reveal preset="fadeUpSpring">
            <div className="warm-panel rounded-lg p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <h3 className="section-desktop-left text-medium mb-1">Want to be part of the team?</h3>
                  <p className="section-desktop-left">
                    We&apos;re always looking for talented strategists and growth experts to join our mission of helping brands go viral.
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button href={APPLICATION_HREF} variant="primary" size="nav">
                    Apply now
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
