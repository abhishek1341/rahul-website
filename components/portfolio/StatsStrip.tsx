import Container from '@/components/layout/Container';
import Counter from '@/components/ui/Counter';

const STATS = [
  { value: 500, suffix: '+', label: 'Videos Delivered' },
  { value: 120, suffix: 'M+', label: 'Total Views' },
  { value: 60, suffix: '+', label: 'Brands Served' },
];

export default function StatsStrip() {
  return (
    <section className="portfolio-stats pt-12 pb-4 lg:pt-16">
      <Container>
        <div className="warm-panel grid grid-cols-3 gap-2 rounded-2xl px-4 py-7 md:gap-6 md:py-10 lg:py-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="portfolio-stat-value text-[30px] font-medium leading-none tracking-[-0.06em] text-brand-ember md:text-[40px] lg:text-[56px] lg:tracking-[-0.07em]">
                <Counter value={stat.value} suffix={stat.suffix} duration={1800} />
              </div>
              <div className="portfolio-stat-label mt-2 text-[12px] leading-[1.3] tracking-[-0.02em] text-secondary md:mt-3 md:text-[14px] lg:text-[15px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
