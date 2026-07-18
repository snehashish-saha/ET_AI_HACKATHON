import React from 'react';
import type { RiskLevel } from '@/types/report';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_COLORS: Record<RiskLevel, { color: string; background: string }> = {
  LOW: { color: '#16A34A', background: '#DCFCE7' },
  MEDIUM: { color: '#D97706', background: '#FEF3C7' },
  HIGH: { color: '#EA580C', background: '#FFEDD5' },
  CRITICAL: { color: '#DC2626', background: '#FEE2E2' },
};

const SIZE_STYLES: Record<'sm' | 'md' | 'lg', React.CSSProperties> = {
  sm: {
    fontSize: 10,
    lineHeight: '20px',
    padding: '2px 8px',
  },
  md: {
    fontSize: 12,
    lineHeight: '24px',
    padding: '3px 10px',
  },
  lg: {
    fontSize: 14,
    lineHeight: '28px',
    padding: '4px 14px',
  },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const colorStyle = RISK_COLORS[level];
  const sizeStyle = SIZE_STYLES[size];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: 9999,
    textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    color: colorStyle.color,
    backgroundColor: colorStyle.background,
    ...sizeStyle,
  };

  return <span style={style}>{level}</span>;
};

export default RiskBadge;
