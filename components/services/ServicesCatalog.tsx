'use client';

import { useEffect, useId, useState } from 'react';
import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import MutedAutoplayVideo from '@/components/media/MutedAutoplayVideo';
import ServiceChipList from './ServiceChipList';
import SoftReveal from './SoftReveal';
import { ServiceIcon } from './serviceIcons';
import { services, type Service } from '@/data/services';

function ServiceCard({
  service,
  open,
  onToggle,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <article id={service.id} className={`service-card${open ? ' service-card--open' : ''}`}>
      <button
        type="button"
        className="service-card-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="service-card-kicker">
          <span className="service-card-icon">
            <ServiceIcon id={service.id} />
          </span>
          <span className="service-card-number">{service.number}</span>
          <span className="service-card-title">{service.title}</span>
        </span>
        <span className="service-card-hook">{service.hook}</span>
        {service.intro.map((paragraph, index) => (
          <span
            key={paragraph}
            className={`service-card-intro${index === 0 ? ' service-card-intro--first' : ''}`}
          >
            {paragraph}
          </span>
        ))}
        <span className="service-card-chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      <div id={panelId} hidden={!open} className="service-card-panel">
        {service.proofVideo ? (
          <div className="service-proof">
            <MutedAutoplayVideo
              src={service.proofVideo.src}
              className="service-proof-video"
              aria-hidden="true"
              lazy
              preload="none"
            />
            <p className="service-proof-caption">{service.proofVideo.caption}</p>
          </div>
        ) : null}
        {service.proofMetric ? (
          <div className="service-proof service-proof--metric">
            <p className="service-proof-metric-value">{service.proofMetric.value}</p>
            <p className="service-proof-caption">{service.proofMetric.label}</p>
          </div>
        ) : null}
        {service.lists.map((list) => (
          <ServiceChipList key={list.title} title={list.title} items={list.items} />
        ))}
        {service.afterLists?.map((paragraph) => (
          <p key={paragraph} className="service-card-after">
            {paragraph}
          </p>
        ))}
        {service.quote ? <p className="service-card-quote">{service.quote}</p> : null}
        {service.cta ? (
          <div className="service-card-cta">
            <Button href={service.cta.href} variant="primary" size="nav">
              {service.cta.label}
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ServicesCatalog() {
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);
  const [activeId, setActiveId] = useState(services[0]?.id ?? '');

  const openService = (id: string) => {
    setOpenId(id);
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace('#', '');
      if (id && services.some((service) => service.id === id)) {
        setOpenId(id);
        setActiveId(id);
        window.requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    const nodes = services
      .map((service) => document.getElementById(service.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.12, 0.28, 0.5] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pill = document.querySelector<HTMLAnchorElement>(`.services-jump a[href="#${activeId}"]`);
    if (!pill) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pill.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeId]);

  return (
    <Section className="services-catalog">
      <Container>
        <SoftReveal>
          <h2 className="services-section-title">What we do</h2>
        </SoftReveal>

        <div className="services-jump-wrap">
          <div className="portfolio-scroller services-jump" role="navigation" aria-label="Jump to a service">
            {services.map((service) => {
              const active = activeId === service.id;
              return (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className={`portfolio-chip flex shrink-0 items-center rounded-full px-4 py-2 text-[14px] font-semibold uppercase leading-none tracking-[0.06em] whitespace-nowrap ${
                    active ? 'portfolio-chip--active' : 'portfolio-chip--idle'
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    history.replaceState(null, '', `#${service.id}`);
                    openService(service.id);
                  }}
                >
                  {service.title}
                </a>
              );
            })}
          </div>
        </div>

        <div className="service-card-list">
          {services.map((service, index) => (
            <SoftReveal key={service.id} delay={Math.min(index * 0.03, 0.12)}>
              <ServiceCard
                service={service}
                open={openId === service.id}
                onToggle={() => setOpenId((current) => (current === service.id ? null : service.id))}
              />
            </SoftReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
