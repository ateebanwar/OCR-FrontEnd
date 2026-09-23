import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border shadow-subtle dark:shadow-subtle-dark',
    elevated: 'bg-surface-elevated border border-border shadow-card dark:shadow-card-dark',
    outline: 'bg-transparent border border-border',
  };

  return (
    <div
      className={`rounded-xl p-5 ${variantStyles[variant]} ${
        hoverEffect ? 'transition-all duration-200 hover:border-border-strong' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
