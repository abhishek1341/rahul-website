import Link from 'next/link';
import Container from './Container';
import {
  BOOK_A_CALL_HREF,
  EMAIL,
  INSTAGRAM_HREF,
  MAILTO_HREF,
  PHONE_DISPLAY,
  WHATSAPP_HREF,
} from '@/lib/site';

export default function Footer() {
  return (
    <footer className="brand-band-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <h3 className="mb-4 text-2xl font-medium">Suntrix Media</h3>
            <p className="mb-6">
              Social media that drives <br />
              real results
            </p>
            <ul className="footer-contact">
              <li>
                <a
                  href={WHATSAPP_HREF}
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={MAILTO_HREF} className="footer-link">
                  {EMAIL}
                </a>
              </li>
            </ul>
            <div className="footer-social">
              <a
                href={WHATSAPP_HREF}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={INSTAGRAM_HREF}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suntrix Media on Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#our-team" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  Portfolio
                </Link>
              </li>
              <li>
                <a href={BOOK_A_CALL_HREF} className="footer-link">
                  Book a call
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p>© 2026 Suntrix Media. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.41 2.15 11.85c0 1.99.59 3.84 1.61 5.4L2 22l4.9-1.61a9.86 9.86 0 0 0 5.14 1.42h.01c5.46 0 9.89-4.41 9.89-9.85S17.5 2 12.04 2zm5.76 14.02c-.24.68-1.4 1.25-1.93 1.33-.49.07-1.12.1-1.8-.11-.42-.13-.95-.27-1.64-.53-2.88-1.09-4.76-3.75-4.9-3.93-.15-.17-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.2-.15.32-.3.49-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.06 1.14 1.02 2.09 1.34 2.39 1.49.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.15.26.1 1.67.79 1.96.93.29.15.48.22.55.34.07.12.07.7-.17 1.38z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
