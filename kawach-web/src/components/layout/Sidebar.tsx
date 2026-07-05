import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, FileText, Bell, GitBranch, Sliders, MessageSquare, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Alerts & History', path: '/app/alerts', icon: Bell },
    { name: 'Incident Reports', path: '/app/reports', icon: FileText },
    { name: 'Architecture', path: '/app/architecture', icon: GitBranch },
    { name: 'Safety Copilot', path: '/app/copilot', icon: MessageSquare, isAI: true },
    { name: 'Control Console', path: '/app/console', icon: Sliders },
  ];

  return (
    <div style={{ width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0, backgroundColor: '#FFFFFF', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={28} color="#3B6FF0" />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: 'Sora, sans-serif' }}>Kawach</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Safety Intelligence</div>
        </div>
      </div>
      
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

      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', borderTop: '1px solid #F3F4F6' }}>
        <Sparkles size={14} color="#7C3AED" />
        <span>Powered by Gemini AI</span>
      </div>
    </div>
  );
}
