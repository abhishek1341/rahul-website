'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Reveal from '../animations/Reveal';
import Stagger from '../animations/Stagger';

export default function Services() {
  const services = [
    {
      title: 'Content Creation',
      description: 'Short-form video, UGC, reels, and visuals designed to stop the scroll and spark engagement.',
    },
    {
      title: 'Social Management',
      description: 'We handle your content calendar, posting, and day-to-day management of your socials.',
    },
    {
      title: 'Paid Media',
      description: 'We build and manage targeted ad campaigns that turn attention into results and help you scale.',
    },
  ];

  return (
    <Section>
      <Container>
        <div className="max-w-[67rem] mx-auto">
          <div className="section-label-row">
            <span className="section-label">Services</span>
          </div>
          <Reveal preset="fadeUpSpring">
            <h2 className="text-center mb-16 text-[38px] md:text-[70px] leading-[100%]">
              How we can<br />help you <span className="accent">grooow</span>
            </h2>
          </Reveal>
          <Stagger delayChildren={0.2} stagger={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Reveal key={index} preset="fadeUpSpring" useAnimate>
                  <div className="service-card p-6 rounded-lg">
                    <div className="media-frame mb-4 flex aspect-square w-full items-center justify-center overflow-hidden bg-[#E8E3DC]">
                      <span className="text-secondary text-sm">Animation placeholder</span>
                    </div>
                    <h3 className="mb-4">{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}

