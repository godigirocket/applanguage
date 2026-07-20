import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { tokens } from '@/design/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
  style?: React.CSSProperties;
}

// Exported for compatibility with shadcn/ui pattern consumers
export const buttonVariants = (props?: { variant?: ButtonVariant; size?: ButtonSize }) => {
  return `btn-${props?.variant || 'primary'} btn-${props?.size || 'md'}`;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #2D4A3E 0%, #1B3A4B 100%)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 8px rgba(45, 74, 62, 0.2)',
  },
  secondary: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1.5px solid var(--border)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1.5px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.2)',
  },
  success: {
    background: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: '6px 12px',
    fontSize: tokens.typography.fontSize.sm,
    borderRadius: tokens.radius.md,
    height: '32px',
  },
  md: {
    padding: '10px 20px',
    fontSize: tokens.typography.fontSize.base,
    borderRadius: tokens.radius.lg,
    height: '40px',
  },
  lg: {
    padding: '14px 28px',
    fontSize: tokens.typography.fontSize.lg,
    borderRadius: tokens.radius.xl,
    height: '48px',
  },
  icon: {
    padding: '8px',
    fontSize: tokens.typography.fontSize.base,
    borderRadius: tokens.radius.lg,
    height: '36px',
    width: '36px',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      animated = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing['2'],
      fontFamily: tokens.typography.fontFamily.sans,
      fontWeight: tokens.typography.fontWeight.bold,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: `all ${tokens.transitions.base}`,
      opacity: disabled || loading ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    const hoverStyles: React.CSSProperties = {
      transform: disabled || loading ? 'none' : 'translateY(-1px)',
      boxShadow:
        variant === 'primary'
          ? '0 4px 12px rgba(45, 74, 62, 0.3)'
          : variant === 'danger'
            ? '0 4px 12px rgba(231, 76, 60, 0.3)'
            : variant === 'success'
              ? '0 4px 12px rgba(39, 174, 96, 0.3)'
              : undefined,
    };

    const content = (
      <>
        {loading && (
          <div
            style={{
              width: '14px',
              height: '14px',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        )}
        {!loading && leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
      </>
    );

    if (animated && !disabled && !loading) {
      return (
        <motion.button
          ref={ref}
          style={baseStyles as any}
          whileHover={hoverStyles as any}
          whileTap={{ scale: 0.98 }}
          disabled={disabled || loading}
          className={className}
          {...(props as any)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button ref={ref} style={baseStyles} disabled={disabled || loading} className={className} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
