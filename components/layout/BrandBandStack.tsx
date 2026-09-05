interface BrandBandStackProps {
  children: React.ReactNode;
}

/** CTA + footer stack — transparent so the global site gradient shows through. */
export default function BrandBandStack({ children }: BrandBandStackProps) {
  return <div className="brand-band-stack">{children}</div>;
}
