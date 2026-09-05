import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="brand-band-footer">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-12">
          <div>
            <h3 className="mb-4 text-2xl font-medium">Suntrix Media</h3>
            <p>
              Social media that drives <br />
              real results
            </p>
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
                <Link href="/portfolio" className="footer-link">
                  Portfolio
                </Link>
              </li>
              <li>
                <a href="tel:+919909844455" className="footer-link">
                  Book a call
                </a>
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
