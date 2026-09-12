import type { Metadata } from 'next';
import LegalDoc from '@/components/legal/LegalDoc';
import { EMAIL, MAILTO_HREF, PHONE_DISPLAY, BOOK_A_CALL_HREF, OG_IMAGES, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Suntrix Media collects, uses and protects personal information when you visit suntrixmedia.com or contact us.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    url: `${SITE_URL}/privacy`,
    title: 'Privacy Policy | Suntrix Media',
    description:
      'How Suntrix Media collects, uses and protects personal information when you visit suntrixmedia.com or contact us.',
    images: [...OG_IMAGES],
  },
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated="12 September 2026">
      <p>
        This policy explains how Suntrix Media (&quot;we&quot;, &quot;us&quot;) handles information when you use{' '}
        <a href="https://suntrixmedia.com">suntrixmedia.com</a> or contact us.
      </p>

      <h2>Information we collect</h2>
      <p>The public website does not have user accounts or an online checkout. We may receive:</p>
      <ul>
        <li>Contact details you send us by phone, email, or a booking conversation — such as your name, business name, phone number, and email address.</li>
        <li>Technical data that web servers typically log, such as IP address, browser type, and pages requested.</li>
        <li>Job-application details if you email us about joining the team.</li>
      </ul>

      <h2>How we use it</h2>
      <p>We use this information to respond to enquiries, discuss projects, improve the site, and consider applications. We do not sell personal information.</p>

      <h2>Cookies</h2>
      <p>
        We do not currently run a third-party analytics or advertising pixel on this site. Your browser may still store
        cookies that the hosting platform or the site needs to function (for example, an admin session cookie if you sign in to the CMS).
      </p>

      <h2>Sharing</h2>
      <p>
        We may share information with service providers who host the website or email, and when the law requires it. We do not share
        your details with unrelated third parties for their marketing.
      </p>

      <h2>Retention</h2>
      <p>We keep enquiry and application emails for as long as we need them to manage the conversation and our records, then delete them when they are no longer required.</p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of the personal information we hold about you, or ask us to correct or delete it, by emailing{' '}
        <a href={MAILTO_HREF}>{EMAIL}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={MAILTO_HREF}>{EMAIL}</a> or call <a href={BOOK_A_CALL_HREF}>{PHONE_DISPLAY}</a>.
      </p>
    </LegalDoc>
  );
}
