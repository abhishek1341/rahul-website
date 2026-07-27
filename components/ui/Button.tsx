import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'nav';
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'default',
  className = '',
  onClick,
}: ButtonProps) {
  const sizeClass = size === 'nav' ? 'btn-nav' : 'btn-primary';
  const variants = {
    primary: sizeClass,
    secondary: 'inline-block rounded-full border border-subtle px-7 py-3.5 text-[16px] font-medium hover:bg-[#EFEBE5]',
  };

  const classes = `${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
