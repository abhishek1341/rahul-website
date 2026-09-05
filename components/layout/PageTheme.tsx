import type { ReactNode } from 'react';

export type PageThemeName = 'dark' | 'light';

/**
 * Page wrapper kept for call-site compatibility.
 * Site background is now a single global layer in app/layout.tsx —
 * this component no longer paints washes, veils, or page fills.
 */
export default function PageTheme({
  children,
  className = '',
}: {
  theme?: PageThemeName;
  showWash?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <div className={`page-theme ${className}`.trim()}>{children}</div>;
}
