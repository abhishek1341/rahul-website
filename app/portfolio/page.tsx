import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandBandStack from '@/components/layout/BrandBandStack';
import PageTheme from '@/components/layout/PageTheme';
import GetStarted from '@/components/home/GetStarted';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import VideoGrid from '@/components/portfolio/VideoGrid';
import StatsStrip from '@/components/portfolio/StatsStrip';
import { CATEGORIES, PORTFOLIO_ITEMS } from '@/data/portfolio';
import { loadPortfolioItems, orderForAllTab } from '@/lib/portfolio-videos';
import { loadClientLogos } from '@/lib/client-logos';
import { readSiteContent } from '@/lib/content/store';
import { OG_IMAGES, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

// Switch portfolio background: 'full' | 'anchored' | 'current'
const BG_VARIANT: 'full' | 'anchored' | 'current' = 'anchored';

// Card frame border: 'white' (existing media-frame) | 'cream' (#F1EFD9 @ 40%)
const CARD_FRAME: 'white' | 'cream' = 'cream';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Watch Suntrix Media work across jewellery, fashion, F&B, fitness, real estate, product and influencer content — short-form video built to stop the scroll and sell.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    url: `${SITE_URL}/portfolio`,
    title: 'Portfolio | Suntrix Media',
    description:
      'Watch Suntrix Media work across jewellery, fashion, F&B, fitness, real estate, product and influencer content — short-form video built to stop the scroll and sell.',
    images: [...OG_IMAGES],
  },
};

export default function PortfolioPage() {
  const theme = BG_VARIANT === 'current' ? 'light' : 'dark';

  // Every video's title and category comes from the admin content store.
  const allItems = orderForAllTab([...PORTFOLIO_ITEMS, ...loadPortfolioItems()]);
  const { stats } = readSiteContent();

  return (
    <PageTheme theme={theme}>
      <div
        className="portfolio-page"
        data-bg-variant={BG_VARIANT}
        data-card-frame={CARD_FRAME}
      >
        <Header />
        <main>
          <PortfolioHero />
          <VideoGrid
            items={allItems}
            categories={CATEGORIES}
            clientLogos={loadClientLogos()}
          />
          <StatsStrip stats={stats.portfolio} />
        </main>
        <BrandBandStack>
          <GetStarted />
          <Footer />
        </BrandBandStack>
      </div>
    </PageTheme>
  );
}
