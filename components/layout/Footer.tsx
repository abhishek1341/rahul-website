import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="py-16 bg-[#EFEBE5]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-medium mb-4 text-[#000000]">Suntrix Media</h3>
            <p>
              Social media that drives <br />
              real results
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/case-studies" className="footer-link">Case Studies</Link></li>
              <li><Link href="/portfolio" className="footer-link">Portfolio</Link></li>
              <li><Link href="/book-a-call" className="footer-link">Book a call</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="footer-link">Instagram</a></li>
              <li><a href="#" className="footer-link">LinkedIn</a></li>
              <li><a href="#" className="footer-link">Twitter</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
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



