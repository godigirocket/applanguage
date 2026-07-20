import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { tokens } from '@/design/tokens';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: keyof typeof tokens.spacing;
  hoverable?: boolean;
  animated?: boolean;
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
  elevated: {
    background: 'var(--card-bg)',
    border: 'none',
    boxShadow: tokens.shadows.md,
  },
  bordered: {
    background: 'var(--card-bg)',
    border: '2px solid var(--border)',
    boxShadow: 'none',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: tokens.shadows.sm,
    backdropFilter: 'blur(10px)',
  },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, variant = 'default', padding = '6', hoverable = false, animated = false, style, className = '', ...props },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      borderRadius: tokens.radius['2xl'],
      transition: `all ${tokens.transitions.base}`,
      padding: tokens.spacing[padding],
      ...variantStyles[variant],
      ...style,
    };

    const hoverStyles: React.CSSProperties = hoverable
      ? {
          transform: 'translateY(-4px)',
          boxShadow: tokens.shadows.lg,
        }
      : {};

    if (animated) {
      return (
        <motion.div
          ref={ref}
          style={baseStyles as any}
          whileHover={hoverable ? (hoverStyles as any) : undefined}
          className={className}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} style={baseStyles} className={className} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, children, style, ...props }: CardHeaderProps) {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing['4'],
    ...style,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: tokens.typography.fontWeight.bold,
    color: 'var(--text-primary)',
    marginBottom: subtitle ? tokens.spacing['1'] : '0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.sm,
    color: 'var(--text-secondary)',
  };

  return (
    <div style={headerStyles} {...props}>
      <div>
        {title && <h3 style={titleStyles}>{title}</h3>}
        {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        {children}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ children, style, ...props }: CardContentProps) {
  const contentStyles: React.CSSProperties = {
    fontSize: tokens.typography.fontSize.base,
    color: 'var(--text-primary)',
    lineHeight: tokens.typography.lineHeight.normal,
    ...style,
  };

  return (
    <div style={contentStyles} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

export function CardFooter({ children, justify = 'end', style, ...props }: CardFooterProps) {
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
  }[justify];

  const footerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent,
    gap: tokens.spacing['2'],
    marginTop: tokens.spacing['4'],
    paddingTop: tokens.spacing['4'],
    borderTop: '1px solid var(--border)',
    ...style,
  };

  return (
    <div style={footerStyles} {...props}>
      {children}
    </div>
  );
}
