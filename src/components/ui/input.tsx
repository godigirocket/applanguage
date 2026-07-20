import { forwardRef, InputHTMLAttributes } from 'react';
import { tokens } from '@/design/tokens';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const wrapperStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing['1'],
    };

    const labelStyles: React.CSSProperties = {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: error ? tokens.colors.danger.DEFAULT : 'var(--text-primary)',
      marginBottom: tokens.spacing['1'],
    };

    const inputContainerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    };

    const inputStyles: React.CSSProperties = {
      width: '100%',
      padding: leftIcon ? `10px 16px 10px 40px` : rightIcon ? `10px 40px 10px 16px` : '10px 16px',
      fontSize: tokens.typography.fontSize.base,
      fontFamily: tokens.typography.fontFamily.sans,
      color: 'var(--text-primary)',
      background: disabled ? 'var(--bg-tertiary)' : 'var(--bg)',
      border: `1.5px solid ${error ? tokens.colors.danger.DEFAULT : 'var(--border)'}`,
      borderRadius: tokens.radius.lg,
      outline: 'none',
      transition: `all ${tokens.transitions.fast}`,
      cursor: disabled ? 'not-allowed' : 'text',
      opacity: disabled ? 0.6 : 1,
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      color: error ? tokens.colors.danger.DEFAULT : 'var(--text-secondary)',
      pointerEvents: 'none',
    };

    const leftIconStyles = {
      ...iconStyles,
      left: '14px',
    };

    const rightIconStyles = {
      ...iconStyles,
      right: '14px',
    };

    const helperStyles: React.CSSProperties = {
      fontSize: tokens.typography.fontSize.sm,
      color: error ? tokens.colors.danger.DEFAULT : 'var(--text-secondary)',
      marginTop: tokens.spacing['1'],
    };

    return (
      <div style={wrapperStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
          </label>
        )}
        <div style={inputContainerStyles}>
          {leftIcon && <span style={leftIconStyles}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            style={inputStyles}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? `${inputId}-helper` : undefined}
            className={className}
            onFocus={(e) => {
              e.target.style.borderColor = error ? tokens.colors.danger.DEFAULT : tokens.colors.brand['500'];
              e.target.style.boxShadow = error
                ? `0 0 0 3px rgba(231, 76, 60, 0.1)`
                : `0 0 0 3px rgba(45, 74, 62, 0.1)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? tokens.colors.danger.DEFAULT : 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
            {...props}
          />
          {rightIcon && <span style={rightIconStyles}>{rightIcon}</span>}
        </div>
        {(error || helperText) && (
          <span id={`${inputId}-helper`} style={helperStyles} role={error ? 'alert' : undefined}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
