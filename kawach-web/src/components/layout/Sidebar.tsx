import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, FileText, Bell, GitBranch, Sliders, MessageSquare, Sparkles, User, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Alerts & History', path: '/app/alerts', icon: Bell },
    { name: 'Incident Reports', path: '/app/reports', icon: FileText },
    { name: 'Architecture', path: '/app/architecture', icon: GitBranch },
    { name: 'Safety Copilot', path: '/app/copilot', icon: MessageSquare, isAI: true },
    { name: 'Control Console', path: '/app/console', icon: Sliders },
    { name: 'User Profile', path: '/app/profile', icon: User },
  ];

  // Retrieve current safety officer from local storage
  const officerData = localStorage.getItem('kawach_officer');
  const officer = officerData
    ? JSON.parse(officerData)
    : {
        name: 'Amit Sharma',
        role: 'Head Safety Officer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
      };

  const handleLogout = () => {
    localStorage.removeItem('kawach_officer');
    toast.success('Successfully logged out.');
    navigate('/');
  };

  return (
    <div style={{ width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0, backgroundColor: '#FFFFFF', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <ShieldCheck size={28} color="#3B6FF0" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: 'Sora, sans-serif' }}>Kawach</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>AI Safety Intelligence</div>
          </div>
        </div>
      </Link>
      
      <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          let activeColor = '#3B6FF0';
          let activeBg = '#EEF2FF';
          
          if (item.isAI) {
            activeColor = '#7C3AED';
            activeBg = '#F5F3FF';
          }
          
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '10px',
                color: isActive ? activeColor : '#6B7280',
                backgroundColor: isActive ? activeBg : 'transparent',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                borderLeft: isActive ? `3px solid ${activeColor}` : '3px solid transparent',
                margin: '0 8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <item.icon size={18} color={isActive ? activeColor : (item.isAI ? '#7C3AED' : '#6B7280')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Officer profile card block */}
      <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <Link to="/app/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}>
          <img src={officer.avatar} alt={officer.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{officer.name}</div>
            <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{officer.role}</div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', color: '#DC2626' }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', borderTop: '1px solid #F3F4F6' }}>
        <Sparkles size={14} color="#7C3AED" />
        <span>Powered by Gemini AI</span>
      </div>
    </div>
  );
}
