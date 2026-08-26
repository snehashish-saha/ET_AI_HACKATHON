import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, LogOut, ShieldAlert, Award, Calendar, Phone, Mail, Building, MapPin, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';

export default function Profile() {
  const navigate = useNavigate();
  const { report } = useLiveReport();

  // Retrieve current logged-in officer
  const officerData = localStorage.getItem('kawach_officer');
  const officer = officerData
    ? JSON.parse(officerData)
    : {
        id: 'admin',
        name: 'Amit Sharma',
        role: 'Head Safety Officer',
        email: 'a.sharma@kawach.ai',
        shift: 'Shift A (06:00 - 14:00)',
        badge: 'K-9831',
        department: 'Operations & Process Safety',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
      };

  const handleLogout = () => {
    localStorage.removeItem('kawach_officer');
    toast.success('Successfully logged out.');
    navigate('/');
  };

  if (!report) return <div>Loading...</div>;

  return (
    <AppShell
      title="User Profile"
      riskLevel={report.master_ai.risk_level}
      riskScore={report.master_ai.risk_score}
      onBack={() => navigate('/app/dashboard')}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
            Officer Account Details
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: '4px 0 0 0' }}>
            Verify credentials, security clearances, and active shift information.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Profile Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E5E7EB',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Avatar container with live-pulse border */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B6FF0 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '44px',
                  fontWeight: 700,
                  fontFamily: 'Sora, sans-serif',
                  boxShadow: '0 8px 24px rgba(59, 111, 240, 0.25)',
                  border: '3px solid #3B6FF0',
                }}
              >
                {(officer.name || 'S').charAt(0).toUpperCase()}
              </div>
              <span style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '18px',
                height: '18px',
                backgroundColor: '#10B981',
                border: '3px solid #FFFFFF',
                borderRadius: '50%',
                display: 'block'
              }} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0', fontFamily: 'Sora, sans-serif' }}>
              {officer.name}
            </h2>
            <span style={{
              fontSize: '13px',
              color: '#3B6FF0',
              fontWeight: 600,
              backgroundColor: '#EEF2FF',
              padding: '4px 12px',
              borderRadius: '99px',
              marginBottom: '20px',
              display: 'inline-block'
            }}>
              {officer.role}
            </span>

            {/* Micro Details Divider */}
            <div style={{ width: '100%', height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }} />

            {/* Quick Details Table */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building size={16} color="#9CA3AF" />
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>DEPARTMENT</div>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{officer.department}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={16} color="#9CA3AF" />
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>ACTIVE SHIFT</div>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{officer.shift}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={16} color="#9CA3AF" />
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>EMERGENCY CONTACT</div>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>+91 98765 43210</div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220,38,38,0.2)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
              }}
            >
              <LogOut size={16} />
              <span>Sign Out Account</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Clearance & Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Card 1: Official Credentials */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              padding: '28px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Sora, sans-serif' }}>
                <Award size={18} color="#3B6FF0" />
                Security Clearances & Permits
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px', backgroundColor: '#F9FAFB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Permit Sign-off Authority</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                    Authorized to sign and cancel Class A/B Hot Work permits plant-wide.
                  </p>
                </div>
                <div style={{ border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px', backgroundColor: '#F9FAFB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Zone Overriding Clearance</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                    Bypass authorization during emergency evacuation override commands.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Contact Information */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              padding: '28px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Sora, sans-serif' }}>
                <User size={18} color="#3B6FF0" />
                Contact Profile Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Officer ID Badge</span>
                  <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600, fontFamily: 'monospace' }}>{officer.badge}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Email Address</span>
                  <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>{officer.email}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Authority Level</span>
                  <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>Level 3 Safety Administrator</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Assigned Control</span>
                  <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>CCTV Station-04 & Safety Console</span>
                </div>
              </div>
            </div>

            {/* Card 3: System Logs Check */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              padding: '28px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Sora, sans-serif' }}>
                <ShieldAlert size={18} color="#EA580C" />
                Security Audit Log
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                Recent console access authorizations logged on this device.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#4B5563', fontWeight: 500 }}>Console Scenario Triggered</span>
                  <span style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>Today, 23:55</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#4B5563', fontWeight: 500 }}>Safety Officer Session Authenticated</span>
                  <span style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>Today, 23:40</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppShell>
  );
}
