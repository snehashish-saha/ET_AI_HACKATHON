import React, { useState } from 'react';
import type { RiskLevel } from '@/types/report';
import { RiskBadge } from './RiskBadge';

interface ZoneCardProps {
  zoneName: string;
  riskLevel: RiskLevel;
  camera: string;
  hazard: string;
  workerCount: number;
  permitActive: boolean;
  isActive: boolean;
  onClick: () => void;
}

const RISK_ACCENT_COLORS: Record<RiskLevel, string> = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({
  zoneName,
  riskLevel,
  camera,
  hazard,
  workerCount,
  permitActive,
  isActive,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const accentColor = RISK_ACCENT_COLORS[riskLevel];
  const tintBg = hexToRgba(accentColor, 0.08);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: 130,
    borderRadius: 16,
    backgroundColor: tintBg,
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 500ms ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 8px 24px rgba(0,0,0,0.12)'
      : '0 2px 8px rgba(0,0,0,0.04)',
    borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const zoneNameStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    lineHeight: 1.3,
  };

  const cameraStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 400,
    flexShrink: 0,
  };

  const centerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const bottomStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  };

  const hazardStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#9CA3AF',
    margin: 0,
    lineHeight: 1.3,
  };

  const chipStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: '2px 7px',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  };

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <span style={zoneNameStyle}>{zoneName}</span>
        <span style={cameraStyle}>{camera}</span>
      </div>

      <div style={centerStyle}>
        <RiskBadge level={riskLevel} size="sm" />
      </div>

      <div style={bottomStyle}>
        <span style={hazardStyle}>{hazard}</span>
        {workerCount > 0 && (
          <span style={chipStyle}>👷 {workerCount} worker{workerCount !== 1 ? 's' : ''}</span>
        )}
        {permitActive && <span style={chipStyle}>🔥 Hot Work</span>}
      </div>
    </div>
  );
};

export default ZoneCard;
