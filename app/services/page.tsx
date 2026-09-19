import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandBandStack from '@/components/layout/BrandBandStack';
import PageTheme from '@/components/layout/PageTheme';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesCatalog from '@/components/services/ServicesCatalog';
import ServicesMidCta from '@/components/services/ServicesMidCta';
import ServicesProcess from '@/components/services/ServicesProcess';
import ServicesBand from '@/components/services/ServicesBand';
import { loadClientLogos } from '@/lib/client-logos';
import { OG_IMAGES, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore Suntrix Media services: content creation, video production, social media management, Meta ads, lead generation, influencer marketing, personal branding, websites and AI video.',
  alternates: { canonical: '/services' },
  openGraph: {
    url: `${SITE_URL}/services`,
    title: 'Services | Suntrix Media',
    description:
      'Explore Suntrix Media services: content creation, video production, social media management, Meta ads, lead generation, influencer marketing, personal branding, websites and AI video.',
    images: [...OG_IMAGES],
  },
};

export default function ServicesPage() {
  const clientLogos = loadClientLogos();

  return (
    <PageTheme theme="dark">
      <Header />
      <main className="services-page">
        <ServicesHero />
        <ServicesCatalog />
        <ServicesMidCta />
        <ServicesProcess />
        <ServicesBand clientLogos={clientLogos} />
      </main>
      <BrandBandStack>
        <Footer />
      </BrandBandStack>
    </PageTheme>
  );
}
