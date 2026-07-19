import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  style = {}
}) => {
  const getBorderColorClass = () => {
    switch (variant) {
      case 'secondary':
        return 'glow-box--secondary';
      case 'tertiary':
        return ''; // Will be customized if needed
      default:
        return '';
    }
  };

  return (
    <div 
      className={`cyber-card-outer ${getBorderColorClass()} ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </div>
  );
};
