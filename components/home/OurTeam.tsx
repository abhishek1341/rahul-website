'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Button from '../ui/Button';
import Reveal from '../animations/Reveal';
import Image from 'next/image';

export default function OurTeam() {
  const team = [
    {
      name: 'Krish Shah',
      role: 'Video Editor',
      image: '/Krish.jpg',
    },
    {
      name: 'Rahul Rajgor',
      role: 'Founder & CEO',
      image: '/Rahul.jpg',
    },
    {
      name: 'Hara Raval',
      role: 'Graphic Designer',
      image: '/Hara.jpg',
    },
    {
      name: 'Nisarg Panchal',
      role: 'Video editor',
      image: '/Nisarg.jpg',
    },
  ];

  return (
    <Section>
      <Container>
        <div>
          <Reveal preset="fadeUpSpring">
            {/* Label */}
            <div className="section-label-row">
              <span className="section-label">Our team</span>
            </div>
          </Reveal>

          <Reveal preset="fadeUpSpring">
            {/* Main Heading */}
            <h2 className="text-center mb-16 text-[38px] md:text-[64px] leading-[110%]">
              Meet the team<br />
              behind your <span className="accent">success</span>.
            </h2>
          </Reveal>

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-9xl mx-auto mb-16">
            {team.map((member, index) => (
              <div key={index}>
                <div className="media-frame mb-2 aspect-square w-full bg-[#E8E3DC]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-0 text-center">{member.name}</h3>
                <p className="text-center">{member.role}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <Reveal preset="fadeUpSpring">
            <div className="warm-panel rounded-lg p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <h3 className="section-desktop-left text-medium mb-1">Want to be part of the team?</h3>
                  <p className="section-desktop-left">
                    We're always looking for talented strategists and growth experts to join our mission of helping brands go viral.
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button href="/apply" variant="primary">
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

