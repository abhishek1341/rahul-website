import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandBandStack from '@/components/layout/BrandBandStack';
import PageTheme from '@/components/layout/PageTheme';
import Container from '@/components/layout/Container';

export default function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <PageTheme theme="dark">
      <Header />
      <main className="legal-page">
        <Container>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-updated">Last updated {updated}</p>
          <div className="legal-prose">{children}</div>
        </Container>
      </main>
      <BrandBandStack>
        <Footer />
      </BrandBandStack>
    </PageTheme>
  );
}
