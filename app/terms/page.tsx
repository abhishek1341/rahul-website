import type { Metadata } from 'next';
import LegalDoc from '@/components/legal/LegalDoc';
import { EMAIL, MAILTO_HREF, PHONE_DISPLAY, BOOK_A_CALL_HREF, OG_IMAGES, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms that apply when you use the Suntrix Media website and when you work with us on a project.',
  alternates: { canonical: '/terms' },
  openGraph: {
    url: `${SITE_URL}/terms`,
    title: 'Terms of Service | Suntrix Media',
    description:
      'Terms that apply when you use the Suntrix Media website and when you work with us on a project.',
    images: [...OG_IMAGES],
  },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" updated="12 September 2026">
      <p>
        These terms apply to your use of <a href="https://suntrixmedia.com">suntrixmedia.com</a> and to conversations you start with
        Suntrix Media through this site.
      </p>

      <h2>The website</h2>
      <p>
        The site is provided for information about our work and services. We aim to keep it accurate, but project examples, metrics,
        and availability can change. A call or email is not a binding contract until we agree scope, fees, and timing in writing.
      </p>

      <h2>Projects</h2>
      <p>
        Creative, production, media, and website work is delivered under a separate proposal, statement of work, or invoice. Those
        documents control the commercial terms if they differ from this page.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Site design, copy, and our showcased work remain ours or our clients&apos;, as applicable. Do not copy our materials for your
        own commercial use without permission. Finished client work is owned as set out in that project&apos;s agreement.
      </p>

      <h2>Acceptable use</h2>
      <p>Do not misuse the site, attempt to access the admin area without authorisation, or use our contact details to send spam.</p>

      <h2>Limitation of liability</h2>
      <p>
        The website is provided as-is. To the extent permitted by law, we are not liable for losses arising only from your use of
        the public website. Project liability is defined in the relevant project agreement.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={MAILTO_HREF}>{EMAIL}</a> or <a href={BOOK_A_CALL_HREF}>{PHONE_DISPLAY}</a>.
      </p>
    </LegalDoc>
  );
}
