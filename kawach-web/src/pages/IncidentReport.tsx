import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import RiskBadge from '../components/ui/RiskBadge';
import { generatePDF } from '../utils/pdfGenerator';
import { AlertTriangle, Shield, Check, X, Thermometer, Gauge, Flame } from 'lucide-react';
import { ZONE_NAMES } from '../types/report';

const RISK_COLOR = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

const RISK_BG = {
  LOW: '#DCFCE7',
  MEDIUM: '#FEF3C7',
  HIGH: '#FFEDD5',
  CRITICAL: '#FEE2E2',
};

export default function IncidentReport() {
  const { report } = useLiveReport();
  const navigate = useNavigate();
  const location = useLocation();

  // Stable report ID and permit reference for the session
  const reportId = useMemo(() => `KW-${Math.floor(100000 + Math.random() * 900000)}`, []);
  const permitRef = useMemo(() => `Ref #KW-${Math.floor(1000 + Math.random() * 9000)}`, []);

  // Determine back navigation route
  const fromAlerts = location.state?.fromAlerts;
  const handleBack = () => {
    if (fromAlerts) {
      navigate('/app/alerts');
    } else {
      navigate(-1);
    }
  };

  // Dynamic timeline generator matching CHANGE 19
  const timeline = useMemo(() => {
    if (!report) return [];
    const events: { time: string; event: string; severity: string }[] = [];
    const z = report.plant.zone;

    // T-8min: Baseline verification
    events.push({ time: 'T-8min', event: `Normal parameters verified in ${z}`, severity: 'LOW' });

    // Maintenance entry
    if (report.plant.maintenance) {
      events.push({ time: 'T-6min', event: `Equipment maintenance flag active in ${z}`, severity: 'MEDIUM' });
    }

    // Workers logged
    if (report.workers.length > 0) {
      const names = report.workers.map(w => w.name).join(', ');
      const workerCount = report.workers.length;
      const countLabel = workerCount === 1 ? '1 worker' : `${workerCount} workers`;
      events.push({ time: 'T-5min', event: `${countLabel} logged in ${z}: ${names}`, severity: 'LOW' });
    }

    // Permit activation
    if (report.plant.permit !== 'None') {
      events.push({ time: 'T-4min', event: `${report.plant.permit} permit ${permitRef} activated in ${z}`, severity: 'MEDIUM' });
    }

    // Gas spikes
    if (report.sensor.gas_ppm > 55) {
      events.push({ time: 'T-2min', event: `Gas concentration spiked to ${report.sensor.gas_ppm.toFixed(1)}ppm, exceeding safety baseline`, severity: 'HIGH' });
    } else if (report.plant.incident === 'Gas Leak' || report.plant.incident === 'Hot Work During Gas Leak') {
      events.push({ time: 'T-2min', event: 'Minor gas line leak detected via ambient sensors', severity: 'MEDIUM' });
    }

    // Critical threshold alert
    if (report.master_ai.risk_level === 'HIGH' || report.master_ai.risk_level === 'CRITICAL') {
      events.push({ time: 'T-1min', event: `Risk score crossed ${report.master_ai.risk_level} threshold — automated monitoring alert issued`, severity: 'HIGH' });
    }

    // Final report entry
    if (report.master_ai.risk_level === 'CRITICAL') {
      events.push({ time: 'T-0', event: 'CRITICAL threshold crossed — compound risk logic triggered emergency workflow', severity: 'CRITICAL' });
    } else {
      events.push({ time: 'T-0', event: `Incident report generated under ${report.master_ai.risk_level} conditions`, severity: report.master_ai.risk_level });
    }

    return events;
  }, [report, permitRef]);

  if (!report) return <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading live safety report...</div>;

  const gas = report.sensor.gas_ppm;
  const temp = report.sensor.temperature_c;
  const pressure = report.sensor.pressure_bar;
  const permit = report.plant.permit;

  // Compound rules evaluated
  const compoundRules = [
    { name: 'Explosion Detection', condition: 'Gas > 45ppm & Hot Work Permit', active: gas > 45 && permit === 'Hot Work', score: 30 },
    { name: 'Fire Hazard Check', condition: 'Gas > 35ppm & Temp > 450°C', active: gas > 35 && temp > 450, score: 20 },
    { name: 'Boiler Failure Monitor', condition: 'Pressure > 8bar & Temp > 470°C', active: pressure > 8 && temp > 470, score: 20 },
    { name: 'Process Instability Detector', condition: 'Pressure > 7bar & Gas > 40ppm', active: pressure > 7 && gas > 40, score: 15 },
    { name: 'Permit Conflict Analyzer', condition: 'Gas Leak Incident & Hot Work Permit', active: report.plant.incident === 'Gas Leak' && permit === 'Hot Work', score: 25 },
    { name: 'Emergency Shutdown Trigger', condition: 'Gas > 60 & Temp > 480 & Pressure > 8', active: gas > 60 && temp > 480 && pressure > 8, score: 35 }
  ];

  // Geosegment propagation lists
  const propagationList = Object.entries(report.geo_map)
    .filter(([zone, risk]) => risk === 'HIGH' && zone !== report.plant.zone)
    .map(([zone]) => zone);

  return (
    <AppShell title="Incident Report" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score} onBack={handleBack}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        {/* LEFT COLUMN: THE DOCUMENT */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '48px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderTop: `6px solid ${RISK_COLOR[report.master_ai.risk_level]}`
        }}>
          
          {/* Formal Document Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="#3B6FF0" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#3B6FF0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                KAWACH SAFETY INTELLIGENCE
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: 'Sora, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
              PRELIMINARY INCIDENT REPORT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>Report: {reportId}</span>
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>DRAFT</span>
            </div>
          </div>
          
          <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '32px' }} />

          {/* Metadata Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'Zone Affected', val: report.plant.zone },
              { label: 'Detection Timestamp', val: report.timestamp },
              { label: 'Risk Severity', val: <RiskBadge level={report.master_ai.risk_level} size="sm" /> },
              { label: 'Permit Reference', val: report.plant.permit !== 'None' ? `${report.plant.permit} (${permitRef})` : 'No Active Permit' },
              { label: 'Maintenance Status', val: report.plant.maintenance ? 'Active Overhaul' : 'No Active Overhauls' },
              { label: 'Workers Present', val: `${report.workers.length} registered personnel` }
            ].map((meta, i) => (
              <div key={i} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>{meta.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{meta.val}</div>
              </div>
            ))}
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3B6FF0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              EXECUTIVE SUMMARY
            </div>
            <p style={{
              fontSize: '14px', lineHeight: 1.8, color: '#374151', margin: 0,
              paddingLeft: '16px', borderLeft: `3px solid #3B6FF0`
            }}>
              {report.executive_summary}
            </p>
          </div>

          {/* Gradient Event Timeline */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3B6FF0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
              EVENT TIMELINE (CHRONOLOGICAL)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '8px' }}>
              {/* Connecting line */}
              <div style={{
                position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px',
                background: `linear-gradient(to bottom, #16A34A, ${RISK_COLOR[report.master_ai.risk_level]})`
              }} />
              
              {timeline.map((node, idx) => {
                const isFinal = idx === timeline.length - 1;
                const nodeColor = RISK_COLOR[node.severity as keyof typeof RISK_COLOR] || '#9CA3AF';
                return (
                  <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', zIndex: 5 }}>
                    <div style={{
                      width: isFinal ? '14px' : '12px',
                      height: isFinal ? '14px' : '12px',
                      borderRadius: '50%',
                      backgroundColor: nodeColor,
                      border: '3px solid #FFFFFF',
                      boxShadow: isFinal ? `0 0 10px ${nodeColor}` : 'none',
                      marginTop: '4px'
                    }} />
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: nodeColor }}>{node.time}</span>
                      <p style={{ fontSize: '13px', color: '#374151', margin: '2px 0 0 0', fontWeight: isFinal ? 600 : 400 }}>{node.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compound Risk Analysis Table */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3B6FF0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              COMPOUND RISK RULES & MITIGATION SCORE
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left' }}>
                  <th style={{ padding: '10px 16px' }}>Safety Rule Triggered</th>
                  <th style={{ padding: '10px 16px' }}>Atmospheric Limits</th>
                  <th style={{ padding: '10px 16px' }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {compoundRules.map((rule, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid #E5E7EB', fontSize: '13px',
                    backgroundColor: rule.active ? '#FFF5F5' : '#FFFFFF'
                  }}>
                    <td style={{ padding: '12px 16px', fontWeight: rule.active ? 600 : 400, color: rule.active ? '#DC2626' : '#374151' }}>
                      {rule.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontFamily: 'Courier New, monospace' }}>
                      {rule.condition}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: rule.active ? '#DC2626' : '#9CA3AF' }}>
                      {rule.active ? `+${rule.score}%` : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Corrective Actions */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3B6FF0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              CORRECTIVE MITIGATION RECOMMENDATIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.master_ai.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={12} color="#3B6FF0" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {rec}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      [Basis: OISD-116 §4.3 — Gas levels exceed 35ppm limit for safe active permits]
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Sign-off Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Kawach AI Platform Generated Report</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Standard Reference: OISD-GDN-116</div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ width: '180px', borderBottom: '1px solid #9CA3AF', marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Safety Officer Signature</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Date: 2026-07-05</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SUPPLEMENTARY PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Static Mini Zone grid */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              Incident Risk Map
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {ZONE_NAMES.map((z) => {
                return (
                  <div key={z} style={{
                    height: '32px', border: '1px solid #E5E7EB', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: z === report.plant.zone ? RISK_BG[report.master_ai.risk_level] : '#F9FAFB'
                  }}>
                    <span style={{ fontSize: '8px', color: z === report.plant.zone ? RISK_COLOR[report.master_ai.risk_level] : '#6B7280', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>
                      {z}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Peak Sensor gauges */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              Peak Sensors (Time of Incident)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Gas Concentration', val: report.sensor.gas_ppm, limit: 35, unit: 'ppm', icon: Flame, color: '#3B6FF0' },
                { label: 'Boiler Temperature', val: report.sensor.temperature_c, limit: 450, unit: '°C', icon: Thermometer, color: '#EA580C' },
                { label: 'System Pressure', val: report.sensor.pressure_bar, limit: 6.0, unit: 'bar', icon: Gauge, color: '#7C3AED' }
              ].map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', gap: '12px', padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={14} color={s.val > s.limit ? '#DC2626' : '#3B6FF0'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{s.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: s.val > s.limit ? '#DC2626' : '#111827' }}>
                      {s.val} {s.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workers affected */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              Personnel in Zone
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.workers.map((worker, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{worker.name}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ fontSize: '8px', backgroundColor: worker.helmet ? '#DCFCE7' : '#FEE2E2', color: worker.helmet ? '#16A34A' : '#DC2626', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                      H
                    </span>
                    <span style={{ fontSize: '8px', backgroundColor: worker.vest ? '#DCFCE7' : '#FEE2E2', color: worker.vest ? '#16A34A' : '#DC2626', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                      V
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elevated Neighboring segments */}
          {propagationList.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                Neighboring Zones Elevated
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {propagationList.map((z, i) => (
                  <span key={i} style={{ fontSize: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                    ⚠️ {z} (HIGH)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <button
              onClick={() => generatePDF(report)}
              style={{
                width: '100%', height: '48px', backgroundColor: '#3B6FF0', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,111,240,0.2)'
              }}
            >
              ⬇ Download PDF Report
            </button>
            <Link to="/app/dashboard" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%', height: '48px', backgroundColor: '#FFFFFF', color: '#3B6FF0',
                  border: '1.5px solid #3B6FF0', borderRadius: '12px', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                ✓ Acknowledge & Return
              </button>
            </Link>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
