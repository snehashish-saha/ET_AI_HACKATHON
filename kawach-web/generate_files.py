import os

base_dir = "./kawach-web"

def write_file(filepath, content):
    full_path = os.path.join(base_dir, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content.strip() + "\n")

# Layout Components
write_file("src/components/layout/Sidebar.tsx", """
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, FileText, Bell, GitBranch, Sliders, Users, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incident Report', path: '/report', icon: FileText },
    { name: 'Alerts & History', path: '/alerts', icon: Bell },
    { name: 'Architecture', path: '/architecture', icon: GitBranch },
    { name: 'Control Console', path: '/console', icon: Sliders },
    { name: 'Team', path: '/team', icon: Users },
  ];

  return (
    <div style={{ width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0, backgroundColor: '#FFFFFF', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={28} color="#3B6FF0" />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Kawach</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Safety Intelligence</div>
        </div>
      </div>
      
      <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
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
                color: isActive ? '#3B6FF0' : '#6B7280',
                backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                borderLeft: isActive ? '3px solid #3B6FF0' : '3px solid transparent',
                margin: '0 8px',
                transition: 'all 0.2s ease'
              }}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', borderTop: '1px solid #F3F4F6' }}>
        <Sparkles size={14} />
        Safety Intelligence System
      </div>
    </div>
  );
}
""")

write_file("src/components/layout/TopBar.tsx", """
import React from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from '../ui/RiskBadge';

interface TopBarProps {
  title: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
}

export default function TopBar({ title, riskLevel, riskScore }: TopBarProps) {
  const emojiMap = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    CRITICAL: '🔴'
  };

  return (
    <div style={{ height: '64px', position: 'fixed', top: 0, left: '240px', right: 0, backgroundColor: '#FFFFFF', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 50 }}>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: riskLevel === 'LOW' ? '#DCFCE7' : riskLevel === 'MEDIUM' ? '#FEF3C7' : riskLevel === 'HIGH' ? '#FFEDD5' : '#FEE2E2', borderRadius: '99px' }}>
          <span>{emojiMap[riskLevel]}</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: riskLevel === 'LOW' ? '#16A34A' : riskLevel === 'MEDIUM' ? '#D97706' : riskLevel === 'HIGH' ? '#EA580C' : '#DC2626' }}>
            {riskLevel} — {riskScore}%
          </span>
        </div>
        <Link to="/console" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#3B6FF0', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(59,111,240,0.3)' }}>
            ⚡ Trigger Scenario
          </button>
        </Link>
      </div>
    </div>
  );
}
""")

write_file("src/components/layout/AppShell.tsx", """
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
}

export default function AppShell({ title, children, riskLevel, riskScore }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F2F5', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <TopBar title={title} riskLevel={riskLevel} riskScore={riskScore} />
        <main style={{ marginTop: '64px', padding: '24px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
""")

# Utils
write_file("src/utils/assembleExplanation.ts", """
import { RiskLevel, PermitType } from '../types/report';

export function assembleExplanation(zone: string, gas: number, temp: number, pressure: number, riskLevel: RiskLevel, permit: PermitType, workerCount: number, reasons: string[], recommendations: string[]): string {
  const reasonsStr = reasons.join(' ');
  const recsStr = recommendations.join(' ');

  if (riskLevel === 'CRITICAL') {
    const gasDesc = gas > 60 ? 'above' : 'approaching';
    return `CRITICAL RISK DETECTED in ${zone}. Gas concentration is at ${gas}ppm — ${gasDesc} explosive threshold — while a ${permit} permit is active with ${workerCount} worker(s) present in a confined space. ${reasonsStr}. Immediate action required: ${recsStr}. This combination of conditions matches patterns that have preceded real industrial incidents.`;
  }
  
  if (riskLevel === 'HIGH') {
    return `ELEVATED RISK in ${zone}. ${reasonsStr}. Current readings: gas ${gas}ppm, temperature ${temp}°C, pressure ${pressure}bar. Recommended: ${recsStr}.`;
  }
  
  if (riskLevel === 'MEDIUM') {
    const r = reasonsStr ? ` ${reasonsStr}.` : '';
    return `CAUTION — ${zone} showing developing risk conditions.${r} Sensor readings are trending toward concerning ranges. Enhanced monitoring recommended.`;
  }
  
  return `Zone ${zone} is operating within normal parameters. Gas: ${gas}ppm, Temperature: ${temp}°C, Pressure: ${pressure}bar. No active permits. Continuous monitoring active.`;
}
""")

write_file("src/utils/buildTimeline.ts", """
import { RiskLevel, PermitType, IncidentType } from '../types/report';

export function buildTimeline(incident: IncidentType, zone: string, permit: PermitType, workerCount: number, riskLevel: RiskLevel) {
  const events = [];
  
  events.push({ time: 'T-8min', event: `Normal readings across zone ${zone}`, severity: 'LOW' as RiskLevel });
  
  if (incident === 'Gas Leak' || incident === 'Hot Work During Gas Leak') {
    events.push({ time: 'T-5min', event: 'Gas concentration began rising above baseline', severity: 'MEDIUM' as RiskLevel });
  } else if (incident === 'Boiler Overheating') {
    events.push({ time: 'T-5min', event: 'Temperature began rising sharply', severity: 'MEDIUM' as RiskLevel });
  } else if (incident === 'Valve Failure') {
     events.push({ time: 'T-5min', event: 'Pressure fluctuations detected in pipeline', severity: 'MEDIUM' as RiskLevel });
  }

  if (workerCount > 0) {
    events.push({ time: 'T-3min', event: `Worker entry logged — personnel entered zone`, severity: 'LOW' as RiskLevel });
  }
  
  if (permit !== 'None') {
    events.push({ time: 'T-2min', event: `${permit} permit #KW-${Math.floor(1000 + Math.random() * 9000)} activated`, severity: 'MEDIUM' as RiskLevel });
  }
  
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    events.push({ time: 'T-1min', event: `Risk score crossed ${riskLevel} threshold — automated monitoring alert issued`, severity: 'HIGH' as RiskLevel });
  }
  
  if (riskLevel === 'CRITICAL') {
    events.push({ time: 'T-0', event: 'CRITICAL threshold crossed — incident report initiated', severity: 'CRITICAL' as RiskLevel });
  }

  return events.reverse();
}
""")

write_file("src/utils/pdfGenerator.ts", """
import jsPDF from 'jspdf';
import type { LiveReport } from '../types/report';

export function generatePDF(report: LiveReport) {
  const doc = new jsPDF();
  let y = 20;
  
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PRELIMINARY INCIDENT REPORT", 20, y);
  
  y += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Zone: ${report.plant.zone}`, 20, y);
  doc.text(`Timestamp: ${report.timestamp}`, 100, y);
  
  y += 10;
  doc.text(`Risk Level: ${report.master_ai.risk_level} (${report.master_ai.risk_score}%)`, 20, y);
  doc.text(`Permit: ${report.plant.permit}`, 100, y);
  
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.text("INCIDENT SUMMARY", 20, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  const splitTitle = doc.splitTextToSize(report.executive_summary, 170);
  doc.text(splitTitle, 20, y);
  
  y += splitTitle.length * 7 + 10;
  
  if (report.master_ai.reasons.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("ROOT CAUSE ANALYSIS", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    report.master_ai.reasons.forEach(r => {
      doc.text(`• ${r}`, 25, y);
      y += 7;
    });
    y += 10;
  }
  
  if (report.master_ai.recommendations.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("RECOMMENDED ACTIONS", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    report.master_ai.recommendations.forEach((r, i) => {
      doc.text(`${i + 1}. ${r}`, 25, y);
      y += 7;
    });
  }

  doc.save(`kawach-incident-report-${Date.now()}.pdf`);
}
""")

# Pages
write_file("src/pages/IncidentReport.tsx", """
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import RiskBadge from '../components/ui/RiskBadge';
import Button from '../components/ui/Button';
import { generatePDF } from '../utils/pdfGenerator';
import { buildTimeline } from '../utils/buildTimeline';
import { AlertTriangle, CheckSquare } from 'lucide-react';

export default function IncidentReport() {
  const { report } = useLiveReport();

  const permitRef = useMemo(() => `#KW-${Math.floor(1000 + Math.random() * 9000)}`, []);

  if (!report) return <div>Loading...</div>;

  const timeline = buildTimeline(report.plant.incident, report.plant.zone, report.plant.permit, report.workers.length, report.master_ai.risk_level);

  return (
    <AppShell title="Incident Report" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>PRELIMINARY INCIDENT REPORT</div>
          <div style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>DRAFT</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Zone</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{report.plant.zone}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Timestamp</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{report.timestamp}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Risk Level</div>
            <RiskBadge level={report.master_ai.risk_level} size="md" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Permit Reference</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{report.plant.permit !== 'None' ? `${report.plant.permit} ${permitRef}` : 'None'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Maintenance Active</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{report.plant.maintenance ? 'Yes' : 'No'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Workers in Zone</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{report.workers.length}</div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 600 }}>INCIDENT SUMMARY</div>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', margin: 0 }}>{report.executive_summary}</p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', fontWeight: 600 }}>EVENT TIMELINE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#F3F4F6' }}></div>
            {timeline.map((item, i) => {
              const color = item.severity === 'LOW' ? '#16A34A' : item.severity === 'MEDIUM' ? '#D97706' : item.severity === 'HIGH' ? '#EA580C' : '#DC2626';
              return (
                <div key={i} style={{ display: 'flex', gap: '16px', zIndex: 1 }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color, border: '3px solid #FFFFFF', marginTop: '2px' }}></div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{item.time}</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>{item.event}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {report.master_ai.reasons.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', fontWeight: 600 }}>ROOT CAUSE ANALYSIS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.master_ai.reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.master_ai.recommendations.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', fontWeight: 600 }}>RECOMMENDED ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.master_ai.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckSquare size={18} color="#3B6FF0" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="md">← Back to Dashboard</Button>
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" size="md">✓ Acknowledge & Close</Button>
            <Button variant="primary" size="md" onClick={() => generatePDF(report)}>⬇ Download PDF</Button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
""")

write_file("src/pages/AlertsHistory.tsx", """
import React, { useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import RiskBadge from '../components/ui/RiskBadge';
import { Eye } from 'lucide-react';
import { SCENARIOS } from '../mock/mockEngine';

export default function AlertsHistory() {
  const { report, alertHistory } = useLiveReport();

  // Generate 25 mock historical entries just for display
  const history = useMemo(() => {
    const mock = [];
    const types = [
      { t: 'HOT_WORK_GAS_LEAK', s: 'CRITICAL', min: 85, max: 96, c: 3 },
      { t: 'BOILER_OVERHEATING', s: 'HIGH', min: 62, max: 78, c: 4 },
      { t: 'GAS_LEAK', s: 'MEDIUM', min: 32, max: 55, c: 5 },
      { t: 'NORMAL_OPERATION', s: 'LOW', min: 5, max: 25, c: 13 }
    ];
    
    let id = 1000;
    types.forEach(type => {
      for(let i=0; i<type.c; i++) {
        const sc = SCENARIOS[type.t as keyof typeof SCENARIOS];
        mock.push({
          id: `ALT-${id++}`,
          timestamp: `2026-07-04 ${String(Math.floor(Math.random()*24)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:00`,
          zone: sc.zone,
          incidentType: sc.incident,
          riskScore: Math.floor(Math.random() * (type.max - type.min) + type.min),
          riskLevel: type.s as 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL',
          status: type.s === 'CRITICAL' ? 'Active' : (Math.random() > 0.5 ? 'Resolved' : 'Acknowledged'),
          duration: `${Math.floor(Math.random() * 45) + 5}m`
        });
      }
    });
    return mock.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  }, []);

  // Merge real live alerts with mock history
  const allAlerts = [...alertHistory.map(a => ({...a, incidentType: a.description, riskScore: a.riskLevel==='CRITICAL'?92:a.riskLevel==='HIGH'?75:a.riskLevel==='MEDIUM'?45:15, status: 'Active', duration: 'Just now'})), ...history];

  if (!report) return <div>Loading...</div>;

  const FilterPill = ({ label, active }: { label: string, active?: boolean }) => (
    <div style={{ padding: '6px 16px', backgroundColor: active ? '#EEF2FF' : '#FFFFFF', color: active ? '#3B6FF0' : '#6B7280', border: active ? '1.5px solid #3B6FF0' : '1.5px solid #E5E7EB', borderRadius: '99px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
      {label}
    </div>
  );

  return (
    <AppShell title="Alerts & History" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Alert History</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <FilterPill label="Today" active />
              <FilterPill label="This Week" />
              <FilterPill label="All Time" />
            </div>
            <div style={{ width: '1px', backgroundColor: '#F3F4F6' }}></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <FilterPill label="All Zones" active />
              <FilterPill label="All Risks" active />
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #F3F4F6', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Timestamp</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Zone</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Incident Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Score</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Risk Level</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Duration</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAlerts.slice(0, 15).map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA', transition: 'all 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>{row.timestamp}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{row.zone}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#374151', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.incidentType}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{row.riskScore}</td>
                <td style={{ padding: '16px' }}><RiskBadge level={row.riskLevel as 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} size="sm" /></td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 500, backgroundColor: row.status === 'Resolved' ? '#DCFCE7' : row.status === 'Active' ? '#FEE2E2' : '#F3F4F6', color: row.status === 'Resolved' ? '#16A34A' : row.status === 'Active' ? '#DC2626' : '#6B7280' }}>
                    {row.status === 'Active' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626', animation: 'pulse 2s infinite' }}></div>}
                    {row.status}
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>{row.duration}</td>
                <td style={{ padding: '16px' }}><Eye size={18} color="#9CA3AF" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: '#3B6FF0', color: '#FFF', fontSize: '14px', fontWeight: 600 }}>1</div>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }}>2</div>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }}>3</div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
    </AppShell>
  );
}
""")

write_file("src/pages/LiveControlConsole.tsx", """
import React from 'react';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import Button from '../components/ui/Button';
import { getScenarioKey, SCENARIOS } from '../mock/mockEngine';
import type { ScenarioKey } from '../types/report';

export default function LiveControlConsole() {
  const { report, setScenario } = useLiveReport();

  if (!report) return <div>Loading...</div>;
  const currentKey = getScenarioKey();

  const TriggerBtn = ({ sKey, label, color, isDemo = false }: { sKey: ScenarioKey, label: string, color: string, isDemo?: boolean }) => {
    const active = currentKey === sKey;
    return (
      <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: active ? `2px solid ${color}` : '2px solid transparent', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
        {isDemo && <div style={{ position: 'absolute', top: '-12px', backgroundColor: '#DC2626', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⭐ Main Demo Scenario</div>}
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', textAlign: 'center' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>Zone: {SCENARIOS[sKey].zone}</div>
        <button 
          onClick={() => setScenario(sKey)}
          style={{ width: '100%', padding: isDemo ? '16px' : '10px', backgroundColor: active ? color : '#FFFFFF', color: active ? '#FFF' : color, border: `1.5px solid ${color}`, borderRadius: '10px', fontSize: isDemo ? '16px' : '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {active ? 'Active' : 'Trigger'}
        </button>
      </div>
    );
  };

  return (
    <AppShell title="Live Control Console" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '16px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        Live Control Console — For demonstration use only. Use during judging to trigger scenarios on demand.
      </div>

      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Trigger Incident Scenario</div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Sensors will smoothly ramp to target values over 15-20 seconds — realistic drift, not instant jump.</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <TriggerBtn sKey="NORMAL_OPERATION" label="Normal Operation" color="#16A34A" />
          <TriggerBtn sKey="GAS_LEAK" label="Gas Leak" color="#D97706" />
          <TriggerBtn sKey="BOILER_OVERHEATING" label="Boiler Overheating" color="#EA580C" />
          <TriggerBtn sKey="VALVE_FAILURE" label="Valve Failure" color="#EA580C" />
          <TriggerBtn sKey="CONFINED_SPACE" label="Confined Space Entry" color="#EA580C" />
          <TriggerBtn sKey="HOT_WORK_GAS_LEAK" label="HOT WORK + GAS LEAK" color="#DC2626" isDemo />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <Button variant="secondary" size="lg" onClick={() => setScenario('NORMAL_OPERATION')} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
          Reset All Zones to Normal
        </Button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px dashed #D1D5DB' }}>
        <div style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', fontWeight: 600 }}>Raw Data (Readout Panel)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Gas (ppm)</div><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>{report.sensor.gas_ppm.toFixed(1)}</div></div>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Temp (°C)</div><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>{report.sensor.temperature_c.toFixed(1)}</div></div>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Pressure (bar)</div><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>{report.sensor.pressure_bar.toFixed(2)}</div></div>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Humidity (%)</div><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>{report.sensor.humidity_percent.toFixed(1)}</div></div>
        </div>
        <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Active Scenario Target</div><div style={{ fontSize: '14px', fontWeight: 600 }}>{SCENARIOS[currentKey].incident}</div></div>
          <div><div style={{ fontSize: '12px', color: '#6B7280' }}>Live Risk Score</div><div style={{ fontSize: '14px', fontWeight: 600 }}>{report.master_ai.risk_score}</div></div>
        </div>
      </div>
    </AppShell>
  );
}
""")

write_file("src/pages/Architecture.tsx", """
import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import { Activity, Camera, FileText, Wrench, Users, Brain, Bell, AlertOctagon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Architecture() {
  const { report } = useLiveReport();
  if (!report) return null;

  const AgentCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div style={{ width: '140px', backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
        <Icon size={20} color="#3B6FF0" />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.4 }}>{desc}</div>
    </div>
  );

  return (
    <AppShell title="Architecture" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>How Kawach Thinks</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>Six AI systems working in parallel, fused into one real-time risk picture</p>
        </div>

        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
            <AgentCard icon={Activity} title="Sensor Agent" desc="Gas, temp, pressure, humidity — 1s intervals" />
            <AgentCard icon={Camera} title="Vision Agent" desc="CCTV feeds — PPE detection, smoke, fire" />
            <AgentCard icon={FileText} title="Permit Agent" desc="Hot work, confined space, mechanical permits" />
            <AgentCard icon={Wrench} title="Maintenance Agent" desc="Equipment health, overdue maintenance flags" />
            <AgentCard icon={Users} title="Worker Agent" desc="Zone presence, PPE compliance, headcount" />
          </div>

          <div style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '32px', boxShadow: '0 12px 32px rgba(0,0,0,0.07)', borderLeft: '4px solid #3B6FF0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Brain size={28} color="#3B6FF0" />
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Risk Reasoning Engine</div>
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Rules detect the score. AI explains the why.</div>
            
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px' }}>6 Compound Rules</div>
                <ul style={{ fontSize: '13px', color: '#374151', margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Explosion Detection</li>
                  <li>Fire Hazard Check</li>
                  <li>Boiler Failure Monitor</li>
                  <li>Process Instability Detector</li>
                  <li>Permit Conflict Analyzer</li>
                  <li>Emergency Shutdown Trigger</li>
                </ul>
              </div>
              <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '8px solid #F3F4F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#111827' }}>{report.master_ai.risk_score}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>Live Score</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px' }}>4 Risk Levels</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}>LOW (&lt;30)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#D97706' }}>MEDIUM (30-59)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#EA580C' }}>HIGH (60-79)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>CRITICAL (80+)</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertOctagon size={18} color="#DC2626" />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Emergency Response Agent</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ padding: '6px 16px', backgroundColor: '#F9FAFB', borderRadius: '99px', fontSize: '13px', fontWeight: 500, border: '1px solid #E5E7EB' }}>📢 Officer Alert</div>
              <div style={{ padding: '6px 16px', backgroundColor: '#F9FAFB', borderRadius: '99px', fontSize: '13px', fontWeight: 500, border: '1px solid #E5E7EB' }}>📄 Incident Report</div>
              <div style={{ padding: '6px 16px', backgroundColor: '#F9FAFB', borderRadius: '99px', fontSize: '13px', fontWeight: 500, border: '1px solid #E5E7EB' }}>🚨 Evacuation Protocol</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#EEF2FF', borderRadius: '16px', padding: '32px', maxWidth: '700px', marginTop: '64px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#374151', margin: 0, fontStyle: 'italic' }}>
            "In the Visakhapatnam Steel Plant explosion (January 2025), every sensor worked correctly. Gas detectors, SCADA systems, and permit controls all functioned — yet 8 workers lost their lives. The missing piece was not data. It was a unified intelligence layer that could read the combination of rising gas + active hot work + worker presence simultaneously and act before the threshold was crossed. That is what Kawach is."
          </p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">Watch it in action →</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
""")

write_file("src/pages/TeamCredits.tsx", """
import React from 'react';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';

export default function TeamCredits() {
  const { report } = useLiveReport();
  if (!report) return null;

  const team = [
    { name: 'Shivam Rai', role: 'Sensor & Risk Engine' },
    { name: 'Yash', role: 'Vision & AI Layer' },
    { name: 'Rohan', role: 'Frontend & Dashboard' },
    { name: 'Aryan', role: 'Backend & Integration' },
  ];

  return (
    <AppShell title="Team" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '64px' }}>
        <div style={{ fontSize: '14px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Built by</div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '24px' }}>iTERNITY</div>
        
        <div style={{ width: '64px', height: '2px', backgroundColor: '#F3F4F6', marginBottom: '24px' }}></div>
        
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#3B6FF0', marginBottom: '8px' }}>ET AI Hackathon 2026</div>
        <div style={{ fontSize: '15px', color: '#6B7280', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6, marginBottom: '64px' }}>
          Problem Statement 1: AI-Powered Industrial Safety Intelligence for Zero-Harm Operations
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '80px' }}>
          {team.map((member, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', width: '200px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#3B6FF0', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
                {member.name.charAt(0)}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{member.name}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>{member.role}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          FastAPI · React · Vite · OISD Standards
        </div>
      </div>
    </AppShell>
  );
}
""")

# App and Entry
write_file("src/App.tsx", """
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncidentReport from './pages/IncidentReport';
import AlertsHistory from './pages/AlertsHistory';
import Architecture from './pages/Architecture';
import LiveControlConsole from './pages/LiveControlConsole';
import TeamCredits from './pages/TeamCredits';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<IncidentReport />} />
          <Route path="/alerts" element={<AlertsHistory />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/console" element={<LiveControlConsole />} />
          <Route path="/team" element={<TeamCredits />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
""")

write_file("src/main.tsx", """
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
""")

write_file("src/index.css", """
@import "tailwindcss";

@theme {
  --color-kawach-bg: #F0F2F5;
  --color-primary: #3B6FF0;
  --color-primary-hover: #2D5CE0;
  --color-primary-light: #EEF2FF;
  --color-risk-green: #16A34A;
  --color-risk-green-bg: #DCFCE7;
  --color-risk-amber: #D97706;
  --color-risk-amber-bg: #FEF3C7;
  --color-risk-orange: #EA580C;
  --color-risk-orange-bg: #FFEDD5;
  --color-risk-red: #DC2626;
  --color-risk-red-bg: #FEE2E2;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-sidebar-border: #F3F4F6;
  --color-divider: #F3F4F6;
  --color-input-bg: #F9FAFB;
  --color-input-border: #E5E7EB;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  background-color: var(--color-kawach-bg);
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
""")

write_file("vite.config.ts", """
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
""")

write_file("tsconfig.json", """
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
""")

write_file("tsconfig.app.json", """
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
""")

print("Files created successfully.")
