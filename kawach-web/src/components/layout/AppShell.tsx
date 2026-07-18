import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  onBack?: () => void;
}

export default function AppShell({ title, children, riskLevel, riskScore, onBack }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F2F5', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <TopBar title={title} riskLevel={riskLevel} riskScore={riskScore} onBack={onBack} />
        <main style={{ marginTop: '64px', padding: '24px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
