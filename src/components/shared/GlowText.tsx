import React from 'react';

interface GlowTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  color = 'primary',
  className = '',
  as = 'span',
  style,
  ...props
}) => {
  const getGlowClass = () => {
    switch (color) {
      case 'secondary':
        return 'glow-text--secondary';
      case 'tertiary':
        return ''; 
      default:
        return 'glow-text';
    }
  };

  const Component = as;

  return (
    <Component 
      className={`${getGlowClass()} ${className}`} 
      style={style} 
      {...props}
    >
      {children}
    </Component>
  );
};
export default GlowText;
