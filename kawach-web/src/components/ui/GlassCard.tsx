import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glass = false,
}) => {
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.07)',
    padding: 24,
    overflow: 'hidden',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    pointerEvents: 'none',
    borderRadius: 18,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={wrapperStyle} className={className}>
      {glass && <div style={overlayStyle} />}
      {glass ? <div style={contentStyle}>{children}</div> : children}
    </div>
  );
};

export default GlassCard;
