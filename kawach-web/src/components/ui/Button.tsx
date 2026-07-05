import React, { useState } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

const SIZE_STYLES: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
  sm: {
    padding: '6px 14px',
    fontSize: 13,
  },
  md: {
    padding: '10px 20px',
    fontSize: 14,
  },
  lg: {
    padding: '14px 28px',
    fontSize: 16,
  },
};

interface VariantConfig {
  base: React.CSSProperties;
  hover: React.CSSProperties;
}

const VARIANT_STYLES: Record<'primary' | 'secondary' | 'danger', VariantConfig> = {
  primary: {
    base: {
      backgroundColor: '#3B6FF0',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 2px 8px rgba(59,111,240,0.3)',
    },
    hover: {
      backgroundColor: '#2D5CE0',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59,111,240,0.4)',
    },
  },
  secondary: {
    base: {
      backgroundColor: '#FFFFFF',
      color: '#3B6FF0',
      border: '1.5px solid #3B6FF0',
      boxShadow: 'none',
    },
    hover: {
      backgroundColor: '#EEF2FF',
    },
  },
  danger: {
    base: {
      backgroundColor: '#FFFFFF',
      color: '#DC2626',
      border: '1.5px solid #DC2626',
      boxShadow: 'none',
    },
    hover: {
      backgroundColor: '#FEE2E2',
    },
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantConfig = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 180ms ease',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    lineHeight: 1.4,
    ...sizeStyle,
    ...variantConfig.base,
    ...(isHovered && !disabled ? variantConfig.hover : {}),
  };

  return (
    <button
      type={type}
      style={baseStyle}
      className={className}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
