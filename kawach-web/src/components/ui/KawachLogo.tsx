import React from 'react';

interface KawachLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
  subtitle?: boolean;
}

export default function KawachLogo({
  size = 36,
  showText = true,
  textSize = 20,
  subtitle = false,
}: KawachLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Custom Vector Armor Shield Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(59, 111, 240, 0.35))' }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B6FF0" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="innerShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="coreLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Hex-Shield Armour */}
        <path
          d="M24 3L6 10.5V22.5C6 33.2 13.8 42.8 24 45C34.2 42.8 42 33.2 42 22.5V10.5L24 3Z"
          fill="url(#shieldGrad)"
        />

        {/* Inner Safety Shield */}
        <path
          d="M24 8L11 14V22.5C11 30.8 16.6 38.3 24 40.2C31.4 38.3 37 30.8 37 22.5V14L24 8Z"
          fill="#1E293B"
          opacity="0.95"
        />

        {/* Emerald Core Verification Checkmark / Pulse */}
        <path
          d="M24 13L15 17.5V23C15 28.5 18.8 33.6 24 35C29.2 33.6 33 28.5 33 23V17.5L24 13Z"
          fill="url(#innerShieldGrad)"
          opacity="0.3"
        />

        {/* Modern Radar / AI Safety Crosshair Pulse */}
        <path
          d="M20 23.5L23 26.5L28.5 20.5"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sparkle Radar Dot */}
        <circle cx="24" cy="11" r="2" fill="#60A5FA" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: `${textSize}px`,
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif',
              letterSpacing: '-0.5px',
              color: '#111827',
              lineHeight: 1.1,
            }}
          >
            Kawach
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Safety Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
