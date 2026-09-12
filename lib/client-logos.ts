/**
 * Server-only utility — runs at build / request time in Server Components.
 * Brand logos come from the admin content store (`data/site-content.json`).
 */
import { readSiteContent } from '@/lib/content/store';

export const CLIENT_LOGO_FOLDER = 'client-logos';

export interface ClientLogo {
  src: string;
  alt: string;
}

export function loadClientLogos(): ClientLogo[] {
  return readSiteContent().logos.map((logo) => ({
    src: logo.src,
    alt: logo.alt || `${logo.name} logo`,
  }));
}
