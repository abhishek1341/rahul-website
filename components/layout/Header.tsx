'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Button from '../ui/Button';
import { BOOK_A_CALL_HREF } from '@/lib/site';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#our-team', label: 'About', hash: true },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const onAboutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    event.preventDefault();
    document.getElementById('our-team')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '/#our-team');
    setMenuOpen(false);
  };

  return (
    <header
      className={`site-header site-shell sticky top-0 z-50${menuOpen ? ' site-header--menu-open' : ''}`}
    >
      <div className="site-container site-header-inner">
        <Link href="/" className="site-header-logo" aria-label="Suntrix Media — home">
          {/* Intrinsic art is 773x400; height is driven by CSS so the ratio is
              taken from the image itself and never distorts. */}
          <Image
            src="/brand/suntrix-logo.png"
            alt="Suntrix Media logo"
            width={70}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="site-header-nav" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.hash ? (
              <a
                key={link.href}
                href={link.href}
                className="site-header-link"
                onClick={onAboutClick}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="site-header-link">
                {link.label}
              </Link>
            )
          )}
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
          {navLinks.map((link) =>
            link.hash ? (
              <a
                key={link.href}
                href={link.href}
                className="mobile-menu-link"
                onClick={(event) => {
                  onAboutClick(event);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
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
