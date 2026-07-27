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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Mission />
        <ClientResults />
        <HowWeWork />
        {/* <Testimonial /> */}
        <TheDifference />
        <OurTeam />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
