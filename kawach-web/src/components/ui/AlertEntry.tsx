import React from 'react';
import { motion } from 'framer-motion';
import type { RiskLevel } from '@/types/report';
import { RiskBadge } from './RiskBadge';

interface AlertEntryProps {
  timestamp: string;
  zone: string;
  description: string;
  riskLevel: RiskLevel;
}

const RISK_BORDER_COLORS: Record<RiskLevel, string> = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

export const AlertEntry: React.FC<AlertEntryProps> = ({
  timestamp,
  zone,
  description,
  riskLevel,
}) => {
  const borderColor = RISK_BORDER_COLORS[riskLevel];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderLeft: `3px solid ${borderColor}`,
    backgroundColor: '#FFFFFF',
    borderRadius: '0 10px 10px 0',
    fontFamily: "'Inter', sans-serif",
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#9CA3AF',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    minWidth: 52,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const zoneStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.3,
    margin: 0,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 400,
    color: '#111827',
    lineHeight: 1.4,
    margin: 0,
  };

  const badgeWrapperStyle: React.CSSProperties = {
    flexShrink: 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={containerStyle}
    >
      <span style={timestampStyle}>{timestamp}</span>
      <div style={contentStyle}>
        <span style={zoneStyle}>{zone}</span>
        <span style={descriptionStyle}>{description}</span>
      </div>
      <div style={badgeWrapperStyle}>
        <RiskBadge level={riskLevel} size="sm" />
      </div>
    </motion.div>
  );
};

export default AlertEntry;
