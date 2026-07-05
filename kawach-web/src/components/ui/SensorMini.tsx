import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface SensorMiniProps {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  decimals?: number;
}

const TREND_CONFIG: Record<'up' | 'down' | 'stable', { arrow: string; color: string }> = {
  up: { arrow: '↑', color: '#16A34A' },
  down: { arrow: '↓', color: '#DC2626' },
  stable: { arrow: '→', color: '#9CA3AF' },
};

export const SensorMini: React.FC<SensorMiniProps> = ({
  label,
  value,
  unit,
  trend,
  decimals = 1,
}) => {
  const trendInfo = TREND_CONFIG[trend];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
    color: '#9CA3AF',
    letterSpacing: '0.04em',
    lineHeight: 1.3,
    margin: 0,
  };

  const valueRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  };

  const valueWrapperStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
  };

  const unitStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 400,
    color: '#9CA3AF',
    lineHeight: 1.3,
  };

  const trendStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: trendInfo.color,
    marginLeft: 4,
    lineHeight: 1,
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={valueRowStyle}>
        <span style={valueWrapperStyle}>
          <AnimatedNumber
            value={value}
            decimals={decimals}
            duration={800}
          />
        </span>
        <span style={unitStyle}>{unit}</span>
        <span style={trendStyle}>{trendInfo.arrow}</span>
      </div>
    </div>
  );
};

export default SensorMini;
