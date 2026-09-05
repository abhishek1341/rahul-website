import { PORTFOLIO_ITEMS } from '@/data/portfolio';
import Container from '@/components/layout/Container';
import FeaturedHeroVideo from './FeaturedHeroVideo';

export default function PortfolioHero() {
  const featured = PORTFOLIO_ITEMS.find((item) => item.featured);

  // The left/right split (and the left-aligned text that goes with it) only
  // makes sense once there's a featured clip to fill the right column.
  // PORTFOLIO_ITEMS is populated dynamically now and nothing sets `featured`,
  // so today this is always the centered, single-column path.
  if (!featured) {
    return (
      <section className="portfolio-hero pt-12 pb-8 lg:pt-20 lg:pb-12">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <div className="section-label-row">
              <span className="section-label">Portfolio</span>
            </div>

            <h1 className="text-center md:text-[58px] md:leading-[62px] lg:text-[77px] lg:leading-[80px]">
              Work that
              <br />
              <span className="accent">converts</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] leading-[1.5] md:max-w-[440px] md:text-[18px] lg:mt-6">
              Short-form content built to stop the scroll — and sell.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="portfolio-hero portfolio-hero--split pt-12 pb-8 lg:pt-20 lg:pb-12">
      <Container>
        {/* Plain block until lg, so the mobile layout is untouched. 55/45 as `fr`
            rather than percentages, which would overflow by the width of the gap. */}
        <div className="lg:grid lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-12">
          <div>
            <div className="section-label-row">
              <span className="section-label">Portfolio</span>
            </div>

            <h1 className="text-center md:text-[58px] md:leading-[62px] lg:text-left lg:text-[77px] lg:leading-[80px]">
              Work that
              <br />
              <span className="accent">converts</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[320px] text-center text-[16px] leading-[1.5] md:max-w-[440px] md:text-[18px] lg:mx-0 lg:mt-6 lg:text-left">
              Short-form content built to stop the scroll — and sell.
            </p>
          </div>

          <FeaturedHeroVideo item={featured} />
        </div>
      </Container>
    </section>
  );
}
