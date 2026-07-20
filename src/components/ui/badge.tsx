import { tokens } from '@/design/tokens';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  success: {
    background: 'rgba(39, 174, 96, 0.1)',
    color: '#27AE60',
    border: '1px solid rgba(39, 174, 96, 0.2)',
  },
  warning: {
    background: 'rgba(243, 156, 18, 0.1)',
    color: '#F39C12',
    border: '1px solid rgba(243, 156, 18, 0.2)',
  },
  danger: {
    background: 'rgba(231, 76, 60, 0.1)',
    color: '#E74C3C',
    border: '1px solid rgba(231, 76, 60, 0.2)',
  },
  info: {
    background: 'rgba(52, 152, 219, 0.1)',
    color: '#3498DB',
    border: '1px solid rgba(52, 152, 219, 0.2)',
  },
  primary: {
    background: 'rgba(45, 74, 62, 0.1)',
    color: '#2D4A3E',
    border: '1px solid rgba(45, 74, 62, 0.2)',
  },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: {
    padding: '2px 8px',
    fontSize: tokens.typography.fontSize['2xs'],
    borderRadius: tokens.radius.sm,
  },
  md: {
    padding: '4px 10px',
    fontSize: tokens.typography.fontSize.xs,
    borderRadius: tokens.radius.md,
  },
  lg: {
    padding: '6px 14px',
    fontSize: tokens.typography.fontSize.sm,
    borderRadius: tokens.radius.lg,
  },
};

export function Badge({ children, variant = 'default', size = 'md', icon }: BadgeProps) {
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: icon ? tokens.spacing['1'] : '0',
    fontWeight: tokens.typography.fontWeight.bold,
    letterSpacing: tokens.typography.letterSpacing.wide,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <span style={styles}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
}
