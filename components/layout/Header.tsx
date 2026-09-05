'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '../ui/Button';

const BOOK_A_CALL_HREF = 'tel:+919909844455';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#our-team', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header site-shell sticky top-0 z-50">
      <div className="site-container site-header-inner">
        <Link href="/" className="site-header-logo" aria-label="Suntrix Media — home">
          {/* Intrinsic art is 773x400; height is driven by CSS so the ratio is
              taken from the image itself and never distorts. */}
          <Image
            src="/brand/suntrix-logo.png"
            alt="Suntrix Media"
            width={70}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="site-header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-header-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={BOOK_A_CALL_HREF} variant="primary" size="nav">
            Book a call
          </Button>
        </div>

        <button
          type="button"
          className="text-text-primary lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="site-container mobile-menu-panel lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-menu-cta">
            <Button
              href={BOOK_A_CALL_HREF}
              variant="primary"
              size="nav"
              className="w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Book a call
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
