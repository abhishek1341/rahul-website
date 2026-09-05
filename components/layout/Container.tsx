interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared page gutters — same max-width + horizontal padding model as the
 * site header (logo / Book a call edges).
 */
export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`site-shell ${className}`.trim()}>
      <div className="site-container">{children}</div>
    </div>
  );
}
