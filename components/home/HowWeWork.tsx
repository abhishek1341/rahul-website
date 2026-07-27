'use client';

import Container from '../layout/Container';
import Section from '../layout/Section';
import Reveal from '../animations/Reveal';
import Stagger from '../animations/Stagger';

const FLOW_PATH_ID = 'how-we-work-flow-path';
const FLOW_PATH = 'M 150 40 C 270 14, 330 66, 450 40 S 630 14, 750 40';
const FLOW_NODE_POSITIONS = [150, 450, 750];

function HowWeWorkFlow() {
  return (
    <div className="how-we-work-flow" aria-hidden="true">
      <svg
        className="how-we-work-flow-svg"
        viewBox="0 0 900 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id={FLOW_PATH_ID} d={FLOW_PATH} />
          <linearGradient id="how-we-work-beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="30%" stopColor="rgba(0, 0, 0, 0.55)" />
            <stop offset="70%" stopColor="rgba(0, 0, 0, 0.55)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
          <filter id="how-we-work-pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <use
          href={`#${FLOW_PATH_ID}`}
          className="how-we-work-flow-track"
          fill="none"
          stroke="rgba(0, 0, 0, 0.07)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {FLOW_NODE_POSITIONS.map((cx, index) => (
          <circle
            key={cx}
            cx={cx}
            cy={40}
            r="5"
            className="how-we-work-flow-node"
            fill="#EFEBE5"
            stroke="rgba(0, 0, 0, 0.12)"
            strokeWidth="1.5"
            style={{ animationDelay: `${index * 1.5}s` }}
          />
        ))}

        <use
          href={`#${FLOW_PATH_ID}`}
          className="how-we-work-flow-beam"
          fill="none"
          stroke="url(#how-we-work-beam-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <g className="how-we-work-flow-pulse" filter="url(#how-we-work-pulse-glow)">
          <circle r="4.5" fill="#000000" />
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
          >
            <mpath href={`#${FLOW_PATH_ID}`} />
          </animateMotion>
        </g>

        <g className="how-we-work-flow-pulse how-we-work-flow-pulse--trail">
          <circle r="2.5" fill="#000000" opacity="0.18" />
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            begin="-0.35s"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
          >
            <mpath href={`#${FLOW_PATH_ID}`} />
          </animateMotion>
        </g>
      </svg>
    </div>
  );
}

const steps = [
  {
    title: 'Strategy First',
    description: 'We align on goals, audience, and content direction before it goes live.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 18h16M6 14l3-8 3 5 3-7 4 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Create & Manage',
    description: 'We handle the production, scheduling, and posting across all key platforms.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M9 3v4M15 3v4M4 10h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Review & Refine',
    description: "We track performance, learn what's working, and adjust as needed.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
        <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowWeWork() {
  return (
    <Section>
      <Container>
        <div>
          <Reveal preset="fadeUpSpring">
            <div className="section-label-row">
              <span className="section-label">How we work</span>
            </div>
          </Reveal>

          <Reveal preset="fadeUpSpring">
            <h2 className="mb-16 text-center text-[38px] leading-[110%] md:text-[64px]">
              We like to keep<br />
              things <span className="accent">nice</span> and simple
            </h2>
          </Reveal>

          <div className="how-we-work-steps-wrap">
            <HowWeWorkFlow />

            <Stagger delayChildren={0.2} stagger={0.15}>
              <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                  <Reveal key={index} preset="fadeUpSpring" useAnimate>
                    <div className="how-we-work-step-card">
                      <div className="how-we-work-step-icon">{step.icon}</div>
                      <h3 className="how-we-work-step-title">{step.title}</h3>
                      <p className="how-we-work-step-description">{step.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Stagger>
          </div>
        </div>
      </Container>
    </Section>
  );
}
