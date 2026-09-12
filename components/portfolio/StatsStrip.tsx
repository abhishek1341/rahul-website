import Container from '@/components/layout/Container';
import Counter from '@/components/ui/Counter';
import type { SiteStat } from '@/lib/content/types';

export default function StatsStrip({ stats }: { stats: SiteStat[] }) {
  const visible = stats.filter((stat) => stat.visible);
  if (visible.length === 0) return null;

  const columns =
    visible.length === 1 ? 'grid-cols-1' : visible.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <section className="portfolio-stats pt-12 pb-4 lg:pt-16">
      <Container>
        <div className={`warm-panel grid ${columns} gap-2 rounded-2xl px-4 py-7 md:gap-6 md:py-10 lg:py-14`}>
          {visible.map((stat) => (
            <div key={stat.id} className="text-center">
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
