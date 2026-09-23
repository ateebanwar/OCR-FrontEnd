import React from 'react';

export type BadgeVariant =
  | 'verified'
  | 'correction'
  | 'review'
  | 'rejected'
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
    verified: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/15 dark:border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    },
    correction: {
      bg: 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/15 dark:border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    review: {
      bg: 'bg-orange-500/10 border-orange-500/30 dark:bg-orange-500/15 dark:border-orange-500/30',
      text: 'text-orange-700 dark:text-orange-400',
      dot: 'bg-orange-500',
    },
    rejected: {
      bg: 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-500/15 dark:border-rose-500/30',
      text: 'text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500',
    },
    neutral: {
      bg: 'bg-surface-elevated border-border',
      text: 'text-foreground-muted',
      dot: 'bg-foreground-muted',
    },
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border ${current.bg} ${current.text} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span className="tracking-wide uppercase">{children}</span>
    </span>
  );
};
