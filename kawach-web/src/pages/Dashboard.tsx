import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Users, Wrench, AlertTriangle, Sparkles, Thermometer, Gauge, Flame, Eye } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import RiskBadge from '../components/ui/RiskBadge';
import ZoneDetailDrawer from '../drawers/ZoneDetailDrawer';
import FormattedText from '../components/ui/FormattedText';
import type { ZoneName, RiskLevel } from '../types/report';
import { CAMERA_MAP, HAZARD_MAP, ZONE_NAMES } from '../types/report';
import { LineChart, Line, ResponsiveContainer, Area } from 'recharts';
import { toast } from 'react-hot-toast';

const ZONE_GRID_ORDER: ZoneName[] = [
  'Boiler Room', 'Gas Pipeline', 'Coke Oven Battery',
  'Valve Station', 'Storage Tank', 'Control Room',
];

const RISK_COLOR: Record<RiskLevel, string> = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

const RISK_BG: Record<RiskLevel, string> = {
  LOW: '#DCFCE7',
  MEDIUM: '#FEF3C7',
  HIGH: '#FFEDD5',
  CRITICAL: '#FEE2E2',
};

export default function Dashboard() {
  const { report, alertHistory } = useLiveReport();
  const [selectedZone, setSelectedZone] = useState<ZoneName | null>(null);


  // Keep last 30 seconds of sensor values for sparkline
  const [sensorHistory, setSensorHistory] = useState<any[]>([]);
  useEffect(() => {
    if (report) {
      setSensorHistory((prev) => {
        const next = [
          ...prev,
          {
            time: report.sensor.timestamp,
            gas: report.sensor.gas_ppm,
            temp: report.sensor.temperature_c,
            pressure: report.sensor.pressure_bar,
            humidity: report.sensor.humidity_percent
          },
        ];
        if (next.length > 30) return next.slice(next.length - 30);
        return next;
      });
    }
  }, [report?.sensor.timestamp]);

  const normalizedHistory = useMemo(() => {
    return sensorHistory.map(h => ({
      time: h.time,
      gas: (h.gas / 100) * 100,
      temp: ((h.temp - 350) / 200) * 100,
      pressure: ((h.pressure - 4) / 8) * 100,
      humidity: ((h.humidity - 30) / 50) * 100
    }));
  }, [sensorHistory]);

  // Toast notification for Critical Risk crossing
  const prevRiskLevel = useRef<RiskLevel>('LOW');
  useEffect(() => {
    if (report) {
      const currentRisk = report.master_ai.risk_level;
      if (prevRiskLevel.current !== 'CRITICAL' && currentRisk === 'CRITICAL') {
        toast.error(`🚨 CRITICAL RISK DETECTED in ${report.plant.zone}`, {
          duration: 5000,
          className: 'shake-toast',
          style: {
            border: '2px solid #DC2626',
            padding: '16px',
            color: '#DC2626',
            fontWeight: 700,
            background: '#FEE2E2'
          }
        });
      }
      prevRiskLevel.current = currentRisk;
    }
  }, [report?.master_ai.risk_level]);

  // Derived stats
  const activePermitsCount = report?.plant.permit !== 'None' ? 1 : 0;
  const activePermitType = report?.plant.permit || 'None';
  const activeWorkersCount = report?.workers.length || 0;
  const activePredictions = report?.prediction.filter(p => p.prediction !== 'Plant expected to remain stable.').length || 0;

  if (!report) {
    return (
      <AppShell title="Dashboard" riskLevel="LOW" riskScore={0}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: 'Inter, sans-serif', color: '#9CA3AF', fontSize: 16 }}>
          Initializing safety systems...
        </div>
      </AppShell>
    );
  }

  const overallRiskLevel = report.master_ai.risk_level;
  const overallRiskScore = report.master_ai.risk_score;

  // Gauge colors based on thresholds
  const getGasColor = (v: number) => v > 55 ? '#DC2626' : v > 35 ? '#D97706' : '#16A34A';
  const getTempColor = (v: number) => v > 470 ? '#DC2626' : v > 450 ? '#D97706' : '#16A34A';
  const getPressColor = (v: number) => v > 8.0 ? '#DC2626' : v > 6.0 ? '#D97706' : '#16A34A';

  return (
    <AppShell 
      title="Dashboard" 
      riskLevel={overallRiskLevel} 
      riskScore={overallRiskScore}
      onBack={selectedZone ? () => setSelectedZone(null) : undefined}
    >
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '1480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Style tag for keyframes, ripple, shake, and glow banner */}
        <style>{`
          @keyframes borderRotate {
            100% { transform: rotate(360deg); }
          }
          @keyframes pulseRed {
            0% { box-shadow: 0 0 12px rgba(220, 38, 38, 0.2); }
            50% { box-shadow: 0 0 24px rgba(220, 38, 38, 0.6); }
            100% { box-shadow: 0 0 12px rgba(220, 38, 38, 0.2); }
          }
          @keyframes pulseRedText {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .shake-toast {
            animation: shake 0.5s ease-in-out;
          }
          .ripple-card {
            position: relative;
            overflow: hidden;
          }
          .ripple-card:active::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            background: rgba(59, 111, 240, 0.15);
            opacity: 0;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.4s ease-out;
          }
          @keyframes ripple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
          }
          @keyframes pulseBanner {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1.0; }
          }
          .pulse-banner-critical {
            animation: pulseBanner 1.5s infinite ease-in-out;
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
          }
          .critical-zone {
            position: relative;
            z-index: 1;
            overflow: hidden;
            animation: pulseRed 3s infinite ease-in-out;
          }
          .critical-zone::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-color: #FEE2E2;
            background-repeat: no-repeat;
            background-size: 50% 50%, 50% 50%;
            background-position: 0 0, 100% 0, 100% 100%, 0 100%;
            background-image: linear-gradient(#DC2626, #DC2626);
            animation: borderRotate 4s linear infinite;
          }
          .critical-zone::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 3px;
            top: 3px;
            width: calc(100% - 6px);
            height: calc(100% - 6px);
            background: #FFFFFF;
            border-radius: 17px;
          }
          @keyframes livePulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 1; }
          }
        `}</style>

        {/* ═══ TOP STAT BAR (compact 90px height) ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* Card 1: Overall Risk Score */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px 18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.03)', borderLeft: `4px solid ${RISK_COLOR[overallRiskLevel]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '90px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Overall Risk Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: RISK_COLOR[overallRiskLevel] }}>{overallRiskLevel}</span>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: RISK_COLOR[overallRiskLevel],
                  animation: overallRiskLevel === 'CRITICAL' ? 'pulseRed 1.5s infinite' : 'pulseBlue 2s infinite'
                }} />
              </div>
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, color: RISK_COLOR[overallRiskLevel] }}>
              <AnimatedNumber value={overallRiskScore} />%
            </div>
          </div>

          {/* Card 2: Active Permits */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px 18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.03)', borderLeft: '4px solid #D97706',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '90px'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Active Permits</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{activePermitsCount}</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '9px', backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                {activePermitType}
              </span>
            </div>
          </div>

          {/* Card 3: Workers On-Site */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px 18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.03)', borderLeft: '4px solid #7C3AED',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '90px'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Workers On-Site</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{activeWorkersCount}</div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              {activeWorkersCount > 0 ? `Occupied zone: ${report.plant.zone}` : 'All zones clear'}
            </div>
          </div>

          {/* Card 4: AI Predictions */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px 18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.03)', borderLeft: '4px solid #0EA5E9',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '90px'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>AI Predictions Active</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{activePredictions}</div>
            <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
              {activePredictions > 0 ? 'Parameter drift detected' : 'System state stable'}
            </div>
          </div>
        </div>

        {/* CHANGE 13: Plant Status Banner */}
        <div style={{
          height: '48px', borderRadius: '12px', width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600,
          transition: 'all 0.5s ease',
          backgroundColor: overallRiskLevel === 'CRITICAL' ? '#FEE2E2' : overallRiskLevel === 'HIGH' || overallRiskLevel === 'MEDIUM' ? '#FEF3C7' : '#DCFCE7',
          color: overallRiskLevel === 'CRITICAL' ? '#DC2626' : overallRiskLevel === 'HIGH' || overallRiskLevel === 'MEDIUM' ? '#92400E' : '#16A34A',
          border: `1.5px solid ${overallRiskLevel === 'CRITICAL' ? '#FCA5A5' : overallRiskLevel === 'HIGH' || overallRiskLevel === 'MEDIUM' ? '#FCD34D' : '#86EFAC'}`
        }} className={overallRiskLevel === 'CRITICAL' ? 'pulse-banner-critical' : ''}>
          {overallRiskLevel === 'LOW' && (
            <span>✅ Plant operating normally — All 6 zones within safe parameters</span>
          )}
          {(overallRiskLevel === 'HIGH' || overallRiskLevel === 'MEDIUM') && (
            <span>⚠️ Elevated risk detected in {report.plant.zone} — Enhanced monitoring active</span>
          )}
          {overallRiskLevel === 'CRITICAL' && (
            <span>🚨 CRITICAL RISK — {report.plant.zone} — Compound risk event in progress — Immediate action required</span>
          )}
        </div>

        {/* ═══ MAIN CONTENT GRID ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          
          {/* LEFT PANELS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* CELL A: Live Plant Overview */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                  Live Plant Overview
                </h2>
                <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '2px 0 0 0' }}>
                  Real-time compound risk monitoring — click any zone for deep inspection
                </p>
              </div>

              {/* CHANGE 6: 3x2 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {ZONE_GRID_ORDER.map((z) => {
                  const zr = report.risk_map[z];
                  const workers = report.workers.filter(w => w.zone === z).length;
                  const hasPermit = report.plant.zone === z && report.plant.permit !== 'None';
                  const hasMaint = report.plant.zone === z && report.plant.maintenance;
                  const isCritical = zr.risk === 'CRITICAL';
                  
                  const zoneScore = zr.risk === 'CRITICAL' ? overallRiskScore : zr.risk === 'HIGH' ? 72 : zr.risk === 'MEDIUM' ? 44 : 8;
                  const isMed = zr.risk === 'MEDIUM';
                  const isHigh = zr.risk === 'HIGH';

                  // Circular Progress Arc helpers
                  const r = 22;
                  const circ = 2 * Math.PI * r;
                  const offset = circ - (zoneScore / 100) * circ;

                  return (
                    <div
                      key={z}
                      onClick={() => setSelectedZone(z)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '16px 16px 20px 16px',
                        minHeight: '165px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderLeft: isCritical ? 'none' : (isHigh ? '4px solid #EA580C' : isMed ? '4px solid #D97706' : '1px solid #E5E7EB'),
                        boxShadow: isCritical ? 'none' : (isHigh ? '0 8px 16px rgba(234,88,12,0.1)' : '0 4px 6px rgba(0,0,0,0.02)'),
                        transform: 'translateY(0px)',
                      }}
                      className={`${isCritical ? 'critical-zone' : ''} ripple-card hover:scale-[1.02] hover:-translate-y-[3px] hover:shadow-lg`}
                    >
                      {/* Top section */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{z}</div>
                          <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{HAZARD_MAP[z]}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#9CA3AF', backgroundColor: '#F9FAFB', padding: '2px 6px', borderRadius: '4px' }}>
                          <Eye size={10} />
                          {CAMERA_MAP[z]}
                        </div>
                      </div>

                      {/* Middle gauge section */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '8px 0', zIndex: 5 }}>
                        <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="25" cy="25" r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" />
                          <circle
                            cx="25" cy="25" r={r} fill="none"
                            stroke={RISK_COLOR[zr.risk]}
                            strokeWidth="4"
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                          />
                        </svg>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '20px', fontWeight: 800, color: RISK_COLOR[zr.risk], lineHeight: 1 }}>{zoneScore}%</span>
                          <span style={{ fontSize: '9px', color: '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>{zr.risk}</span>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', zIndex: 5 }}>
                        {workers > 0 && (
                          <span style={{ fontSize: '9px', backgroundColor: '#EEF2FF', color: '#3B6FF0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            👷 {workers} workers
                          </span>
                        )}
                        {hasPermit && (
                          <span style={{ fontSize: '9px', backgroundColor: '#FFEDD5', color: '#EA580C', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            🔥 {activePermitType}
                          </span>
                        )}
                        {hasMaint && (
                          <span style={{ fontSize: '9px', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            🔧 Maintenance
                          </span>
                        )}
                      </div>

                      {/* CHANGE 8: Mini risk timeline bar */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                        backgroundColor: '#F3F4F6', borderRadius: '0 0 16px 16px', overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%', width: `${zoneScore}%`,
                          backgroundColor: RISK_COLOR[zr.risk], transition: 'width 0.5s ease-in-out'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CELL C: Live Sensor Telemetry */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                    Sensor Telemetry — Live Feed
                  </h2>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Updating every 1s</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr', gap: '20px' }}>
                {/* 1. GAS GAUGE (Threshold marker + color transitions) */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '165px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gas Concentration</span>
                  
                  <div style={{ width: '130px', height: '65px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="130" height="65" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" fill="none" 
                        stroke={getGasColor(report.sensor.gas_ppm)} strokeWidth="8"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (Math.min(report.sensor.gas_ppm, 100) / 100) * 125.6}
                        strokeLinecap="round"
                        style={{ transition: 'stroke 300ms, stroke-dashoffset 0.6s' }}
                      />
                      <line x1="50" y1="50" x2="45" y2="15" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="2 2" />
                      {(() => {
                        const pct = Math.min(report.sensor.gas_ppm / 100, 1.0);
                        const angle = 180 - pct * 180;
                        const rad = angle * Math.PI / 180;
                        return (
                          <line x1="50" y1="50" x2={50 + 35 * Math.cos(rad)} y2={50 - 35 * Math.sin(rad)} stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
                        );
                      })()}
                      <circle cx="50" cy="50" r="4" fill="#111827" />
                    </svg>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: getGasColor(report.sensor.gas_ppm), transition: 'color 300ms', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span>{report.sensor.gas_ppm.toFixed(1)}</span>
                      <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 500 }}>ppm</span>
                    </div>
                    <div style={{ fontSize: '9px', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      LEL Limit: 35ppm
                    </div>
                  </div>
                </div>

                {/* 2. TEMPERATURE GAUGE */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '165px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Temperature</span>
                  
                  <div style={{ width: '100px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="100" height="50" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" fill="none" 
                        stroke={getTempColor(report.sensor.temperature_c)} strokeWidth="8"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (Math.min(report.sensor.temperature_c - 200, 400) / 400) * 125.6}
                        strokeLinecap="round"
                        style={{ transition: 'stroke 300ms, stroke-dashoffset 0.6s' }}
                      />
                      <line x1="50" y1="50" x2="35" y2="18" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
                      {(() => {
                        const pct = Math.min((report.sensor.temperature_c - 200) / 400, 1.0);
                        const angle = 180 - pct * 180;
                        const rad = angle * Math.PI / 180;
                        return <line x1="50" y1="50" x2={50 + 35 * Math.cos(rad)} y2={50 - 35 * Math.sin(rad)} stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />;
                      })()}
                      <circle cx="50" cy="50" r="4" fill="#111827" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: getTempColor(report.sensor.temperature_c), transition: 'color 300ms' }}>
                      {Math.round(report.sensor.temperature_c)}°C
                    </div>
                    <div style={{ fontSize: '9px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      Caution: 450°C
                    </div>
                  </div>
                </div>

                {/* 3. PRESSURE GAUGE */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '165px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pressure</span>
                  
                  <div style={{ width: '100px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="100" height="50" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" fill="none" 
                        stroke={getPressColor(report.sensor.pressure_bar)} strokeWidth="8"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (Math.min(report.sensor.pressure_bar, 15) / 15) * 125.6}
                        strokeLinecap="round"
                        style={{ transition: 'stroke 300ms, stroke-dashoffset 0.6s' }}
                      />
                      <line x1="50" y1="50" x2="35" y2="18" stroke="#D97706" strokeWidth="1.2" strokeDasharray="2 2" />
                      <line x1="50" y1="50" x2="65" y2="15" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="2 2" />
                      {(() => {
                        const pct = Math.min(report.sensor.pressure_bar / 15, 1.0);
                        const angle = 180 - pct * 180;
                        const rad = angle * Math.PI / 180;
                        return <line x1="50" y1="50" x2={50 + 35 * Math.cos(rad)} y2={50 - 35 * Math.sin(rad)} stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />;
                      })()}
                      <circle cx="50" cy="50" r="4" fill="#111827" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', width: '100%' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: getPressColor(report.sensor.pressure_bar), transition: 'color 300ms' }}>
                      {report.sensor.pressure_bar.toFixed(1)} bar
                    </div>
                    <div style={{ fontSize: '9px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'center' }}>
                      Elev: 6b | Crit: 8b
                    </div>
                  </div>
                </div>

                {/* 4. HUMIDITY GAUGE */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minHeight: '165px', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Humidity</span>
                  <div style={{ width: '20px', height: '42px', border: '2px solid #E5E7EB', borderRadius: '4px', position: 'relative', padding: '2px' }}>
                    <div style={{
                      backgroundColor: '#0EA5E9', width: '100%',
                      height: `${report.sensor.humidity_percent}%`,
                      position: 'absolute', bottom: '2px', left: '2px', right: '2px',
                      borderRadius: '2px', transition: 'height 0.6s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0EA5E9' }}>
                      {Math.round(report.sensor.humidity_percent)}%
                    </div>
                    <div style={{ fontSize: '9px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      Atmosphere
                    </div>
                  </div>
                </div>
              </div>

              {/* CHANGE 11: Recharts sparklines chart with subtle area color fill */}
              {sensorHistory.length > 1 && (
                <div style={{ width: '100%', height: '80px', marginTop: '20px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={normalizedHistory}>
                      <Line type="monotone" dataKey="gas" stroke="#DC2626" strokeWidth={1.8} dot={false} />
                      <Line type="monotone" dataKey="temp" stroke="#EA580C" strokeWidth={1.2} dot={false} />
                      <Line type="monotone" dataKey="pressure" stroke="#D97706" strokeWidth={1.2} dot={false} />
                      <Line type="monotone" dataKey="humidity" stroke="#0EA5E9" strokeWidth={1.0} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANELS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* CELL B: TOP HALF - AI Executive Summary */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)', borderLeft: '4px solid #7C3AED',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute', top: '16px', right: '16px',
                fontSize: '10px', fontWeight: 700, backgroundColor: '#F5F3FF',
                color: '#7C3AED', padding: '2px 8px', borderRadius: '99px'
              }}>
                🧠 AI Analysis
              </span>

              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>
                Executive Summary
              </h2>

              <div style={{
                fontSize: '13px', lineHeight: 1.6, color: '#374151', margin: 0,
                minHeight: '80px', borderLeft: '3px solid #7C3AED',
                paddingLeft: '12px'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <FormattedText text={report.executive_summary} isDark={true} />
                </motion.div>
              </div>

              {report.master_ai.reasons.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                  {report.master_ai.reasons.map((r, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '10px', backgroundColor: '#FEE2E2', color: '#DC2626',
                      padding: '4px 8px', borderRadius: '6px', fontWeight: 600
                    }}>
                      ⚠️ {r}
                    </span>
                  ))}
                </div>
              )}

              {/* CHANGE 9: Last Analyzed timestamp */}
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic', marginTop: '16px', textAlign: 'right' }}>
                Last analyzed: {report.timestamp}
              </div>
            </div>

            {/* CELL B: BOTTOM HALF - System Predictions */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0' }}>
                System Predictions
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {report.prediction.map((pred, i) => {
                  const Icon = pred.parameter === 'Gas' ? Flame : pred.parameter === 'Temperature' ? Thermometer : pred.parameter === 'Pressure' ? Gauge : Sparkles;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={14} color="#3B6FF0" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                            {pred.parameter} Forecast
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', lineHeight: 1.4 }}>
                            {pred.prediction}
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#3B6FF0' }}>
                          {pred.confidence}%
                        </span>
                      </div>
                      
                      <div style={{ width: '100%', height: '4px', backgroundColor: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pred.confidence}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', backgroundColor: '#3B6FF0' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CELL D: Live Alert Feed */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}>
              
              {/* CHANGE 10: Critical Zones mini-map at top showing 6 zones */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Critical Zones Map
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                  {ZONE_GRID_ORDER.map((z) => {
                    const zr = report.risk_map[z];
                    let circleColor = '#E5E7EB';
                    let isCrit = zr.risk === 'CRITICAL';
                    let isHigh = zr.risk === 'HIGH';
                    if (isCrit) circleColor = '#DC2626';
                    else if (isHigh) circleColor = '#EA580C';
                    else if (zr.risk === 'MEDIUM') circleColor = '#D97706';
                    
                    return (
                      <div 
                        key={z} 
                        style={{
                          height: '24px', backgroundColor: '#F9FAFB', borderRadius: '4px',
                          border: isCrit ? '1.5px solid #DC2626' : '1px solid #E5E7EB', 
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '4px', padding: '0 4px',
                          animation: isCrit ? 'pulseRedText 1s infinite alternate' : 'none'
                        }}
                      >
                        <div style={{ 
                          width: '6px', height: '6px', borderRadius: '50%', 
                          backgroundColor: circleColor,
                          boxShadow: isCrit ? '0 0 6px #DC2626' : 'none'
                        }} />
                        <span style={{ fontSize: '7.5px', color: isCrit ? '#DC2626' : '#6B7280', fontWeight: isCrit ? 800 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                {/* CHANGE 10: Pulser LIVE badge next to alerts title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Live Alerts Feed
                  </h2>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626',
                    animation: 'livePulse 1.2s infinite'
                  }} />
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#DC2626', letterSpacing: '0.5px' }}>LIVE</span>
                </div>
                <RiskBadge level={overallRiskLevel} size="sm" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                {alertHistory.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>
                    No alerts triggered in this shift
                  </div>
                ) : (
                  alertHistory.map((alert) => {
                    const borderLeftColor = RISK_COLOR[alert.riskLevel as RiskLevel] || '#E5E7EB';
                    return (
                      <div
                        key={alert.id}
                        style={{
                          borderLeft: `4px solid ${borderLeftColor}`,
                          backgroundColor: '#F9FAFB',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                        className="hover:bg-blue-50/30 hover:translate-x-[2px]"
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                            {alert.zone}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {alert.description}
                          </div>
                          <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>
                            {alert.timestamp}
                          </div>
                        </div>
                        <RiskBadge level={alert.riskLevel as any} size="sm" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selectedZone && (
          <ZoneDetailDrawer
            zoneName={selectedZone}
            report={report}
            onClose={() => setSelectedZone(null)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
