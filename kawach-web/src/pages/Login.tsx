import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, KeyRound, Lock, User, BadgeAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'register'>(() => {
    return searchParams.get('mode') === 'register' ? 'register' : 'signin';
  });

  // Sign In state
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regOfficerId, setRegOfficerId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOfficialKey, setRegOfficialKey] = useState('');
  const [regRole, setRegRole] = useState('Chief Safety Controller');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    const idClean = officerId.trim();
    const pwClean = password;

    // Check custom registered officers in localStorage
    const savedOfficersJson = localStorage.getItem('kawach_registered_officers');
    let registeredOfficers: any[] = [];
    if (savedOfficersJson) {
      try {
        registeredOfficers = JSON.parse(savedOfficersJson);
      } catch (err) {
        registeredOfficers = [];
      }
    }

    const matchedCustom = registeredOfficers.find(
      (o: any) =>
        (o.id.toLowerCase() === idClean.toLowerCase() ||
          o.name.toLowerCase() === idClean.toLowerCase()) &&
        o.password === pwClean
    );

    if (matchedCustom) {
      localStorage.setItem('kawach_officer', JSON.stringify(matchedCustom));
      toast.success(`Welcome back, Officer ${matchedCustom.name}!`);
      navigate('/app/dashboard');
      return;
    }

    // Built-in credential checks
    if (
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
        department: 'Command & Plant Operations'
      };
      localStorage.setItem('kawach_officer', JSON.stringify(user));
      toast.success('Welcome back, Officer Shivam Rai!');
      navigate('/app/dashboard');
    } else if (idClean === 'admin' && pwClean === 'password') {
      const user = {
        id: 'admin',
        name: 'Amit Sharma',
        role: 'Head Safety Officer',
        email: 'a.sharma@kawach.ai',
        shift: 'Shift A (06:00 - 14:00)',
        badge: 'K-9831',
        department: 'Operations & Process Safety'
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
        department: 'Field Compliance Inspection'
      };
      localStorage.setItem('kawach_officer', JSON.stringify(user));
      toast.success('Welcome back, Inspector Verma!');
      navigate('/app/dashboard');
    } else {
      toast.error('Invalid Officer ID or Password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (regOfficialKey.trim() !== '54321') {
      toast.error('Invalid Official Verification Key! (Plant Security Key is 54321)');
      return;
    }

    if (!regName.trim() || !regOfficerId.trim() || !regPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    const badgeNum = `K-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOfficer = {
      id: regOfficerId.trim(),
      name: regName.trim(),
      role: regRole,
      password: regPassword,
      email: `${regOfficerId.trim().toLowerCase()}@kawach.ai`,
      shift: 'Shift A (06:00 - 14:00)',
      badge: badgeNum,
      department: 'Operations & Process Safety'
    };

    // Save to registered list
    const savedOfficersJson = localStorage.getItem('kawach_registered_officers');
    let registeredOfficers: any[] = [];
    if (savedOfficersJson) {
      try {
        registeredOfficers = JSON.parse(savedOfficersJson);
      } catch (err) {
        registeredOfficers = [];
      }
    }
    registeredOfficers.push(newOfficer);
    localStorage.setItem('kawach_registered_officers', JSON.stringify(registeredOfficers));

    // Sign in immediately
    localStorage.setItem('kawach_officer', JSON.stringify(newOfficer));
    toast.success(`Account Created Successfully! Welcome Officer ${newOfficer.name}`);
    navigate('/app/dashboard');
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
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.07)',
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: '#EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={32} color="#3B6FF0" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 26,
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
            color: '#6B7280',
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          AI Industrial Safety Intelligence
        </div>

        {/* Toggle Mode Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F3F4F6',
          borderRadius: 12,
          padding: 4,
          marginTop: 24,
          marginBottom: 24,
          gap: 4
        }}>
          <button
            type="button"
            onClick={() => setMode('signin')}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 8,
              border: 'none',
              backgroundColor: mode === 'signin' ? '#FFFFFF' : 'transparent',
              color: mode === 'signin' ? '#111827' : '#6B7280',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <LogIn size={15} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 8,
              border: 'none',
              backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? '#111827' : '#6B7280',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <UserPlus size={15} />
            Create Account
          </button>
        </div>

        {/* SIGN IN FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn}>
            {/* Officer ID */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Officer ID or Name
            </label>
            <input
              type="text"
              placeholder="e.g. Shivam Rai or admin"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              onFocus={() => setFocusedField('officerId')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('officerId')}
              autoComplete="username"
              required
            />

            <div style={{ height: 16 }} />

            {/* Password */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('password')}
              autoComplete="current-password"
              required
            />

            <div style={{ height: 24 }} />

            {/* Sign In Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: 46,
                borderRadius: 10,
                backgroundColor: '#3B6FF0',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background-color 0.15s',
                boxShadow: '0 2px 8px rgba(59, 111, 240, 0.25)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2D5CE0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3B6FF0';
              }}
            >
              Sign In to Console
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleRegister}>
            {/* Officer Name */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Officer Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Shivam Rai"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              onFocus={() => setFocusedField('regName')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('regName')}
              required
            />

            <div style={{ height: 14 }} />

            {/* Officer ID */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Desired Officer ID
            </label>
            <input
              type="text"
              placeholder="e.g. shivam-01"
              value={regOfficerId}
              onChange={(e) => setRegOfficerId(e.target.value)}
              onFocus={() => setFocusedField('regOfficerId')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('regOfficerId')}
              required
            />

            <div style={{ height: 14 }} />

            {/* Role */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Designation / Role
            </label>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              style={{
                ...inputStyle('regRole'),
                cursor: 'pointer'
              }}
            >
              <option value="Chief Safety Controller">Chief Safety Controller</option>
              <option value="Senior Safety Inspector">Senior Safety Inspector</option>
              <option value="Head Safety Officer">Head Safety Officer</option>
              <option value="Process Safety Engineer">Process Safety Engineer</option>
            </select>

            <div style={{ height: 14 }} />

            {/* Create Password */}
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#4B5563',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Create Password
            </label>
            <input
              type="password"
              placeholder="Choose a secure password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              onFocus={() => setFocusedField('regPassword')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('regPassword')}
              required
            />

            <div style={{ height: 14 }} />

            {/* Official Verification Key (54321) */}
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 6
            }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1E40AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                }}
              >
                <KeyRound size={14} color="#2563EB" />
                Official Plant Security Key
              </label>
              <input
                type="password"
                placeholder="Enter Official Key (54321)"
                value={regOfficialKey}
                onChange={(e) => setRegOfficialKey(e.target.value)}
                onFocus={() => setFocusedField('regOfficialKey')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle('regOfficialKey'),
                  backgroundColor: '#FFFFFF'
                }}
                required
              />
              <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 4 }}>
                Plant verification authorization code required (54321).
              </div>
            </div>

            <div style={{ height: 20 }} />

            {/* Create Account Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: 46,
                borderRadius: 10,
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background-color 0.15s',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#10B981';
              }}
            >
              Authorize & Create Account
            </button>
          </form>
        )}

        {/* Footer info */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
          Kawach Official Safety Access Protocol
        </div>
      </div>
    </div>
  );
}
