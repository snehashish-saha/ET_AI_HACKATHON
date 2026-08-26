import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    const idClean = officerId.trim();
    const pwClean = password;

    if (idClean === 'admin' && pwClean === 'password') {
      const user = {
        id: 'admin',
        name: 'Amit Sharma',
        role: 'Head Safety Officer',
        email: 'a.sharma@kawach.ai',
        shift: 'Shift A (06:00 - 14:00)',
        badge: 'K-9831',
        department: 'Operations & Process Safety',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
      };
      localStorage.setItem('kawach_officer', JSON.stringify(user));
      toast.success('Welcome back, Officer Sharma!');
      navigate('/app/dashboard');
    } else if (idClean === 'officer-01' && pwClean === 'kawach2026') {
      const user = {
        id: 'officer-01',
        name: 'Rahul Verma',
        role: 'Senior Safety Inspector',
        email: 'r.verma@kawach.ai',
        shift: 'Shift B (14:00 - 22:00)',
        badge: 'K-1054',
        department: 'Field Compliance Inspection',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
      };
      localStorage.setItem('kawach_officer', JSON.stringify(user));
      toast.success('Welcome back, Inspector Verma!');
      navigate('/app/dashboard');
    } else if (
      (idClean.toLowerCase() === 'shivam rai' || idClean.toLowerCase() === 'shivam' || idClean.toLowerCase() === 'shivamrai') &&
      pwClean === '54321'
    ) {
      const user = {
        id: 'shivam-01',
        name: 'Shivam Rai',
        role: 'Chief Safety Controller',
        email: 'shivam.rai@kawach.ai',
        shift: 'Shift A (06:00 - 14:00)',
        badge: 'K-0001',
        department: 'Command & Plant Operations',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
      };
      localStorage.setItem('kawach_officer', JSON.stringify(user));
      toast.success('Welcome back, Officer Shivam Rai!');
      navigate('/app/dashboard');
    } else {
      toast.error('Invalid Officer ID or Password');
    }
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
            required
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
            required
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
          Kawach Plant Security Portal
        </div>
      </div>
    </div>
  );
}
