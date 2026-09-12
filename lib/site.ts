export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://suntrixmedia.com';

export const PHONE_E164 = '+919909844455';
export const PHONE_DISPLAY = '+91 99098 44455';
export const BOOK_A_CALL_HREF = `tel:${PHONE_E164}`;
export const WHATSAPP_HREF = 'https://wa.me/919909844455';

export const EMAIL = 'suntrixmedia@gmail.com';
export const MAILTO_HREF = `mailto:${EMAIL}`;
export const APPLICATION_HREF = `${MAILTO_HREF}?subject=Application`;

export const INSTAGRAM_HREF = 'https://www.instagram.com/suntrixmedia/';

/** Absolute OG image — page-level openGraph replaces the root object, so every
 *  page that sets openGraph must include this or og:image disappears from HTML. */
export const OG_IMAGE_URL = `${SITE_URL}/og.jpg`;
export const OG_IMAGES = [
  {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: 'Suntrix Media — short-form content, ads and websites',
  },
] as const;
