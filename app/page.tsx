import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Mission from '@/components/home/Mission';
import ClientResults from '@/components/home/ClientResults';
import HowWeWork from '@/components/home/HowWeWork';
import TheDifference from '@/components/home/TheDifference';
import OurTeam from '@/components/home/OurTeam';
import GetStarted from '@/components/home/GetStarted';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandBandStack from '@/components/layout/BrandBandStack';
import PageTheme from '@/components/layout/PageTheme';
import LogoMarquee from '@/components/ui/LogoMarquee';
import { loadClientLogos } from '@/lib/client-logos';
import { readSiteContent } from '@/lib/content/store';
import { OG_IMAGES, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute: 'Suntrix Media | Short-form content, ads and websites that convert',
  },
  description:
    'Suntrix Media is a creative and performance studio. We make short-form video, run social and Meta ads, generate leads, and build websites that turn attention into growth.',
  alternates: { canonical: '/' },
  openGraph: {
    url: SITE_URL,
    title: 'Suntrix Media | Short-form content, ads and websites that convert',
    description:
      'Suntrix Media is a creative and performance studio. We make short-form video, run social and Meta ads, generate leads, and build websites that turn attention into growth.',
    images: [...OG_IMAGES],
  },
};

export default function Home() {
  const clientLogos = loadClientLogos();
  const { stats } = readSiteContent();

  return (
    <PageTheme theme="dark">
      <Header />
      <main>
        <Hero />
        <LogoMarquee
          logos={clientLogos}
          speedSeconds={40}
          className="py-10 md:py-14"
        />
        <Services />
        <Mission />
        <ClientResults cases={stats.cases} />
        <HowWeWork />
        <TheDifference />
        <OurTeam />
      </main>
      <BrandBandStack>
        <GetStarted />
        <Footer />
      </BrandBandStack>
    </PageTheme>
  );
}
