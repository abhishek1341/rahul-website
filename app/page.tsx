import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Mission from '@/components/home/Mission';
import ClientResults from '@/components/home/ClientResults';
import HowWeWork from '@/components/home/HowWeWork';
// import Testimonial from '@/components/home/Testimonial';
import TheDifference from '@/components/home/TheDifference';
import OurTeam from '@/components/home/OurTeam';
import GetStarted from '@/components/home/GetStarted';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandBandStack from '@/components/layout/BrandBandStack';
import PageTheme from '@/components/layout/PageTheme';
import LogoMarquee from '@/components/ui/LogoMarquee';
import { loadClientLogos } from '@/lib/client-logos';

export default function Home() {
  const clientLogos = loadClientLogos();

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
        <ClientResults />
        <HowWeWork />
        {/* <Testimonial /> */}
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
