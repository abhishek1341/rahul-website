'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '../ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="site-header-inner">
        <Link href="/" className="site-header-logo">
          Suntrix Media
        </Link>

        <nav className="site-header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-header-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/book-a-call" variant="primary" size="nav">
            Book a call
          </Button>
        </div>

        <button
          type="button"
          className="text-[#000000] lg:hidden"
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
        <div className="mobile-menu-panel border-t border-[rgba(0,0,0,0.08)] lg:hidden">
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
              href="/book-a-call"
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
