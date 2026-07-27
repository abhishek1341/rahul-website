interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`site-section py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}



