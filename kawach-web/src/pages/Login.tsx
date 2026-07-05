import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    height: 44,
    borderRadius: 10,
    border: focusedField === field ? '1.5px solid #3B6FF0' : '1.5px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: '0 14px',
    fontSize: 14,
    color: '#111827',
    outline: 'none',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(59, 111, 240, 0.12)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box' as const,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F0F2F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 48,
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.07)',
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <ShieldCheck size={40} color="#3B6FF0" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Kawach
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 13,
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: 6,
          }}
        >
          AI Industrial Safety Intelligence
        </div>

        {/* Gap */}
        <div style={{ height: 32 }} />

        {/* Form */}
        <form onSubmit={handleSignIn}>
          {/* Officer ID */}
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 6,
            }}
          >
            Officer ID
          </label>
          <input
            type="text"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            onFocus={() => setFocusedField('officerId')}
            onBlur={() => setFocusedField(null)}
            style={inputStyle('officerId')}
            autoComplete="username"
          />

          {/* 16px gap */}
          <div style={{ height: 16 }} />

          {/* Password */}
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            style={inputStyle('password')}
            autoComplete="current-password"
          />

          {/* 24px gap */}
          <div style={{ height: 24 }} />

          {/* Sign In Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: 48,
              borderRadius: 10,
              backgroundColor: '#3B6FF0',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2D5CE0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B6FF0';
            }}
          >
            Sign In
          </button>
        </form>

        {/* 20px gap */}
        <div style={{ height: 20 }} />

        {/* Skip to Demo */}
        <div style={{ textAlign: 'center' }}>
          <span
            onClick={() => navigate('/dashboard')}
            style={{
              fontSize: 14,
              color: '#3B6FF0',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/dashboard');
            }}
          >
            Skip to Live Demo →
          </span>
        </div>

        {/* 32px gap */}
        <div style={{ height: 32 }} />

        {/* Disclaimer */}
        <div
          style={{
            fontSize: 12,
            color: '#9CA3AF',
            textAlign: 'center',
          }}
        >
          For demonstration purposes only
        </div>
      </div>
    </div>
  );
}
