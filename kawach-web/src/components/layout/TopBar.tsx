import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  onBack?: () => void;
}

export default function TopBar({ title, riskLevel, riskScore, onBack }: TopBarProps) {
  const navigate = useNavigate();
  const emojiMap = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    CRITICAL: '🔴'
  };

  return (
    <div style={{ height: '64px', position: 'fixed', top: 0, left: '240px', right: 0, backgroundColor: '#FFFFFF', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => {
            if (onBack) return onBack();
            try {
              if (window.history && window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/app/dashboard');
              }
            } catch (err) {
              navigate('/app/dashboard');
            }
          }}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '8px',
            fontSize: '18px', color: '#6B7280', transition: 'all 0.2s'
          }}
          className="hover:bg-slate-100"
          aria-label="Go back to dashboard"
        >
          ←
        </button>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', fontFamily: 'Sora, sans-serif' }}>
          {title}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: riskLevel === 'LOW' ? '#DCFCE7' : riskLevel === 'MEDIUM' ? '#FEF3C7' : riskLevel === 'HIGH' ? '#FFEDD5' : '#FEE2E2', borderRadius: '99px' }}>
          <span>{emojiMap[riskLevel]}</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: riskLevel === 'LOW' ? '#16A34A' : riskLevel === 'MEDIUM' ? '#D97706' : riskLevel === 'HIGH' ? '#EA580C' : '#DC2626' }}>
            {riskLevel} — {riskScore}%
          </span>
        </div>
        <Link to="/app/console" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#3B6FF0', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(59,111,240,0.3)', transition: 'all 0.2s ease' }}>
            ⚡ Trigger Scenario
          </button>
        </Link>
      </div>
    </div>
  );
}
