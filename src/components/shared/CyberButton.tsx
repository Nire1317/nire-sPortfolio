import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  className?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'primary',
  href,
  className = '',
  onClick,
  ...props
}) => {
  const btnClass = `btn-cyber ${variant === 'secondary' ? 'btn-cyber--secondary' : ''} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={btnClass}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...(props as any)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={btnClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
