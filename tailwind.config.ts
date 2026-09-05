import type { Config } from 'tailwindcss';

/**
 * Colour architecture mirror for tooling / IDE autocomplete.
 * Tailwind v4 resolves utilities from `@theme` in `app/globals.css`;
 * keep these values in sync with that file.
 */
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            DEFAULT: 'var(--brand-orange)',
            50: 'var(--brand-orange-50)',
            100: 'var(--brand-orange-100)',
            200: 'var(--brand-orange-200)',
            400: 'var(--brand-orange-400)',
            600: 'var(--brand-orange-600)',
            800: 'var(--brand-orange-800)',
          },
          ember: {
            DEFAULT: 'var(--brand-ember)',
            deep: 'var(--brand-ember-deep)',
          },
          cream: {
            DEFAULT: 'var(--brand-cream)',
            50: 'var(--brand-cream-50)',
            100: 'var(--brand-cream-100)',
            200: 'var(--brand-cream-200)',
            400: 'var(--brand-cream-400)',
            600: 'var(--brand-cream-600)',
            800: 'var(--brand-cream-800)',
          },
          amber: 'var(--brand-amber)',
          ink: 'var(--brand-ink)',
        },
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          contrast: 'var(--accent-contrast)',
        },
        border: {
          subtle: 'var(--border-subtle)',
        },
        chip: {
          bg: 'var(--chip-bg)',
          'bg-active': 'var(--chip-bg-active)',
          'text-active': 'var(--chip-text-active)',
        },
      },
    },
  },
} satisfies Config;

export default config;
