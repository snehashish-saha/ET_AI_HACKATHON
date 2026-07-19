import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Flame, Wrench, User, Sparkles, Check, AlertTriangle, Shield, Thermometer, Gauge, ChevronRight, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { ZoneName, LiveReport, RiskLevel, PermitType } from '../types/report';
import { CAMERA_MAP, HAZARD_MAP } from '../types/report';
import RiskBadge from '../components/ui/RiskBadge';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import GlassCard from '../components/ui/GlassCard';
import { assembleExplanation } from '../utils/assembleExplanation';

interface ZoneDetailDrawerProps {
  zoneName: ZoneName;
  report: LiveReport;
  onClose: () => void;
}

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

export default function ZoneDetailDrawer({ zoneName, report, onClose }: ZoneDetailDrawerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'ai'>('overview');
  const [typedExplanation, setTypedExplanation] = useState('');

  const zoneRisk = report.risk_map[zoneName];
  const riskLevel = zoneRisk.risk;
  const riskColor = RISK_COLOR[riskLevel];
  const cameraId = CAMERA_MAP[zoneName];

  // Zone specific score helper
  const zoneScore = riskLevel === 'CRITICAL' ? report.master_ai.risk_score : riskLevel === 'HIGH' ? 72 : riskLevel === 'MEDIUM' ? 44 : 8;

  // Active permit coordination
  const hasActivePermit = report.plant.zone === zoneName && report.plant.permit !== 'None';
  const activePermit = hasActivePermit ? report.plant.permit : 'None';
  const hasMaint = report.plant.zone === zoneName && report.plant.maintenance;

  // AI Explanation assembly
  const explanation = assembleExplanation(
    zoneName,
    report.sensor.gas_ppm,
    report.sensor.temperature_c,
    report.sensor.pressure_bar,
    riskLevel,
    activePermit,
    report.workers.length,
    report.master_ai.reasons,
    report.master_ai.recommendations
  );

  // Typewriter effect for AI Analysis Tab
  useEffect(() => {
    if (activeTab !== 'ai') return;
    setTypedExplanation('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedExplanation((prev) => prev + explanation.charAt(i));
      i++;
      if (i >= explanation.length) {
        clearInterval(interval);
      }
    }, 15);
  }, [activeTab, explanation]);

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Determine triggered compound rules
  const gas = report.sensor.gas_ppm;
  const temp = report.sensor.temperature_c;
  const pressure = report.sensor.pressure_bar;
  const permit = activePermit;

  const compoundRules = [
    {
      name: 'Explosion Detection',
      condition: 'Gas > 45ppm & Hot Work Permit',
      active: gas > 45 && permit === 'Hot Work',
      score: 30
    },
    {
      name: 'Fire Hazard Check',
      condition: 'Gas > 35ppm & Temp > 450°C',
      active: gas > 35 && temp > 450,
      score: 20
    },
    {
      name: 'Boiler Failure Monitor',
      condition: 'Pressure > 8bar & Temp > 470°C',
      active: pressure > 8 && temp > 470,
      score: 20
    },
    {
      name: 'Process Instability Detector',
      condition: 'Pressure > 7bar & Gas > 40ppm',
      active: pressure > 7 && gas > 40,
      score: 15
    },
    {
      name: 'Permit Conflict Analyzer',
      condition: 'Gas Leak Incident & Hot Work Permit',
      active: report.plant.incident === 'Gas Leak' && permit === 'Hot Work',
      score: 25
    },
    {
      name: 'Emergency Shutdown Trigger',
      condition: 'Gas > 60 & Temp > 480 & Pressure > 8',
      active: gas > 60 && temp > 480 && pressure > 8,
      score: 35
    }
  ];

  const triggerIcon = (permitType: PermitType) => {
    switch (permitType) {
      case 'Hot Work': return <Flame size={16} color="#EA580C" />;
      case 'Mechanical': return <Wrench size={16} color="#D97706" />;
      case 'Confined Space': return <User size={16} color="#3B6FF0" />;
      default: return null;
    }
  };

  return (
    <>
      {/* Dimmed Overlay */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
          zIndex: 900
        }}
        onClick={onClose}
      />

      {/* Drawer Body */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        style={{
          position: 'fixed', right: 0, top: 0, bottom: 0, width: '560px',
          backgroundColor: '#FFFFFF', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        {/* Sticky Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid #F3F4F6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
              {zoneName} Detail
            </h2>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Camera ID: {cameraId}</span>
              <span>·</span>
              <span>Hazard: {HAZARD_MAP[zoneName]}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F3F4F6', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#6B7280'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #F3F4F6', padding: '0 24px',
          backgroundColor: '#F9FAFB', gap: '24px'
        }}>
          {['overview', 'sensors', 'ai'].map((tab) => {
            const labelMap = { overview: 'Overview', sensors: 'Sensors', ai: 'AI Analysis' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  padding: '14px 0', fontSize: '14px', fontWeight: 600,
                  color: isActive ? '#3B6FF0' : '#6B7280', background: 'none',
                  border: 'none', borderBottom: isActive ? '3px solid #3B6FF0' : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {labelMap[tab as keyof typeof labelMap]}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Risk Gauge Header */}
              <div style={{
                backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '24px',
                display: 'flex', alignItems: 'center', gap: '32px', border: '1px solid #E5E7EB'
              }}>
                <div style={{ position: 'relative', width: '140px', height: '75px' }}>
                  <svg width="140" height="80" viewBox="0 0 100 50">
                    <defs>
                      <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16A34A" />
                        <stop offset="50%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                    {zoneScore > 0 && (
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
                        stroke="url(#riskGrad)"
                        strokeWidth="8"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (zoneScore / 100) * 125.6}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                      />
                    )}
                  </svg>
                  <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>
                      <AnimatedNumber value={zoneScore} />%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Zone Status</div>
                  <RiskBadge level={riskLevel} size="md" />
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    Parameters are computed by Kawach AI inference rules.
                  </div>
                </div>
              </div>

              {/* Permit & Maintenance details */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Operational Context</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>Active Permit</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      {triggerIcon(permit)}
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{permit}</span>
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>Maintenance Flags</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: hasMaint ? '#DC2626' : '#16A34A'
                      }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {hasMaint ? 'Active Overhaul' : 'No Active Flags'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker table list */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Active Workers</h3>
                {report.workers.filter(w => w.zone === zoneName).length === 0 ? (
                  <div style={{ padding: '24px', backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB', borderRadius: '12px', textAlign: 'center', fontSize: '13px', color: '#9CA3AF' }}>
                    No workers registered in this zone.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', textAlign: 'left' }}>
                        <th style={{ padding: '10px 16px' }}>Name</th>
                        <th style={{ padding: '10px 16px' }}>Helmet</th>
                        <th style={{ padding: '10px 16px' }}>Vest</th>
                        <th style={{ padding: '10px 16px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.workers.filter(w => w.zone === zoneName).map((worker, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E5E7EB', fontSize: '13px', color: '#374151' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>{worker.name}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: worker.helmet ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                              {worker.helmet ? '✓ Active' : '✗ Violating'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: worker.vest ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                              {worker.vest ? '✓ Active' : '✗ Violating'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>{worker.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* CCTV Live AI Stream Section */}
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={16} color="#3B6FF0" />
                  CCTV Live AI Stream Analytics
                </h3>
                
                {(() => {
                  const ZONE_TO_CAMERA_KEY: Record<string, string> = {
                    'Boiler Room': 'camera_1',
                    'Gas Pipeline': 'camera_2',
                    'Coke Oven Battery': 'camera_3',
                    'Valve Station': 'camera_4',
                    'Storage Tank': 'camera_5',
                  };
                  const cameraKey = ZONE_TO_CAMERA_KEY[zoneName];
                  const cameraData = cameraKey ? report.vision?.[cameraKey] : undefined;

                  if (cameraData) {
                    return (
                      <div style={{
                        backgroundColor: '#0F172A',
                        borderRadius: '16px',
                        padding: '20px',
                        color: '#F8FAFC',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid #1E293B',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                      }}>
                        {/* Simulated Camera Overlay Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', animation: 'pulseRedText 1s infinite alternate' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em' }}>LIVE FEED | {cameraId}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>YOLOv8n-PPE active</span>
                        </div>

                        {/* Camera Feed Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Detected Persons</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: '#38BDF8' }}>{cameraData.person_count}</div>
                          </div>
                          <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Helmet Wearers</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: cameraData.helmet_count === cameraData.person_count ? '#34D399' : '#F87171' }}>
                              {cameraData.helmet_count} / {cameraData.person_count}
                            </div>
                          </div>
                          <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Safety Vests</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', color: cameraData.vest_count === cameraData.person_count ? '#34D399' : '#F87171' }}>
                              {cameraData.vest_count} / {cameraData.person_count}
                            </div>
                          </div>
                        </div>

                        {/* Compliance Progress Bars */}
                        {cameraData.person_count > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', backgroundColor: '#1E293B', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ color: '#94A3B8' }}>Helmet Compliance</span>
                              <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{Math.round((cameraData.helmet_count / cameraData.person_count) * 100)}%</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(cameraData.helmet_count / cameraData.person_count) * 100}%`, backgroundColor: cameraData.helmet_count === cameraData.person_count ? '#10B981' : '#F59E0B', transition: 'width 0.5s ease' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px' }}>
                              <span style={{ color: '#94A3B8' }}>Vest Compliance</span>
                              <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{Math.round((cameraData.vest_count / cameraData.person_count) * 100)}%</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(cameraData.vest_count / cameraData.person_count) * 100}%`, backgroundColor: cameraData.vest_count === cameraData.person_count ? '#10B981' : '#F59E0B', transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        )}

                        {/* Hazard Detection Alarms */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px',
                            backgroundColor: cameraData.fire_detected ? '#450A0A' : '#064E3B',
                            border: `1px solid ${cameraData.fire_detected ? '#EF4444' : '#10B981'}`
                          }}>
                            <Flame size={14} color={cameraData.fire_detected ? '#EF4444' : '#10B981'} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: cameraData.fire_detected ? '#FCA5A5' : '#A7F3D0' }}>
                              {cameraData.fire_detected ? 'FIRE DETECTED' : 'No Fire Detected'}
                            </span>
                          </div>
                          
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px',
                            backgroundColor: cameraData.smoke_detected ? '#451A03' : '#064E3B',
                            border: `1px solid ${cameraData.smoke_detected ? '#F59E0B' : '#10B981'}`,
                          }}>
                            <Flame size={14} color={cameraData.smoke_detected ? '#F59E0B' : '#10B981'} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: cameraData.smoke_detected ? '#FCD34D' : '#A7F3D0' }}>
                              {cameraData.smoke_detected ? 'SMOKE DETECTED' : 'No Smoke Detected'}
                            </span>
                          </div>
                        </div>

                        {/* YOLO Detections list */}
                        {cameraData.detections && cameraData.detections.length > 0 && (
                          <div style={{ marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>YOLO Vision Model Objects</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {cameraData.detections.map((det: any, i: number) => (
                                <span key={i} style={{ fontSize: '10px', backgroundColor: '#1E293B', color: '#38BDF8', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, border: '1px solid #334155' }}>
                                  🔍 {det.label} ({(det.confidence * 100).toFixed(0)}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div style={{ padding: '24px', backgroundColor: '#F9FAFB', border: '1px dashed #E5E7EB', borderRadius: '12px', textAlign: 'center', fontSize: '13px', color: '#9CA3AF' }}>
                      No active CCTV feed in this zone. Indoor room monitored by entry permit logging.
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* TAB: SENSORS */}
          {activeTab === 'sensors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Gas Concentration', val: report.sensor.gas_ppm, max: 100, unit: 'ppm', limit: 35, icon: Flame, color: '#3B6FF0' },
                { title: 'Temperature', val: report.sensor.temperature_c - 200, max: 400, actualVal: report.sensor.temperature_c, unit: '°C', limit: 450, icon: Thermometer, color: '#EA580C' },
                { title: 'Pressure', val: report.sensor.pressure_bar, max: 15, unit: 'bar', limit: 6, icon: Gauge, color: '#7C3AED' }
              ].map((s, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '20px',
                  border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={20} color="#3B6FF0" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{s.title}</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', color: s.val > s.limit ? '#DC2626' : '#111827' }}>
                        {s.actualVal || s.val.toFixed(1)} {s.unit}
                      </div>
                    </div>
                  </div>

                  {/* Semicircular indicator dial inside tab */}
                  <div style={{ width: '90px', height: '45px', position: 'relative' }}>
                    <svg width="90" height="50" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                      {(() => {
                        const pct = Math.min(s.val / s.max, 1.0);
                        const angle = 180 - pct * 180;
                        const rad = angle * Math.PI / 180;
                        return (
                          <>
                            <path d={`M 10 50 A 40 40 0 0 1 ${50 + 40 * Math.cos(rad)} ${50 - 40 * Math.sin(rad)}`} fill="none" stroke={s.color} strokeWidth="6" />
                            <line x1="50" y1="50" x2={50 + 35 * Math.cos(rad)} y2={50 - 35 * Math.sin(rad)} stroke="#111827" strokeWidth="2.5" />
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: AI ANALYSIS */}
          {activeTab === 'ai' && (
            <>
              {/* AI Explanation Glass Signature Card */}
              <GlassCard glass={true} className="border-purple-500/20 bg-purple-500/5">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={16} color="#7C3AED" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Interactive AI Reasoning
                  </span>
                </div>
                <p style={{
                  fontSize: '13px', lineHeight: 1.6, color: '#374151', margin: 0,
                  minHeight: '80px', borderLeft: '3px solid #7C3AED', paddingLeft: '12px'
                }}>
                  {typedExplanation}
                </p>
              </GlassCard>

              {/* Compound Risk Breakdown */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                  Compound Risk Rules
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {compoundRules.map((rule, idx) => (
                    <div key={idx} style={{
                      backgroundColor: rule.active ? '#FFF5F5' : '#F9FAFB',
                      border: rule.active ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
                      borderRadius: '12px', padding: '12px 16px', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: rule.active ? '#DC2626' : '#374151' }}>
                          {rule.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {rule.condition}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {rule.active ? (
                          <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>
                            +{rule.score}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>✗</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Citations */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                  Regulatory Citations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {gas > 35 && (
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px 16px', borderLeft: '4px solid #EA580C' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>OISD-116</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginTop: '6px' }}>Section 4.3 — Hot Work Restrictions</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', lineHeight: 1.4 }}>
                        Hot work is prohibited when gas concentrations exceed 35ppm. Current reading of {gas.toFixed(1)}ppm violates safety thresholds.
                      </div>
                    </div>
                  )}
                  {permit === 'Confined Space' && (
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px 16px', borderLeft: '4px solid #3B6FF0' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#EEF2FF', color: '#3B6FF0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>OSHA 1910.146</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginTop: '6px' }}>Permit Required Confined Spaces</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', lineHeight: 1.4 }}>
                        Continuous atmospheric monitoring required. Re-entry requires certified safety check and permit coordinator review.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Bottom Actions Panel */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {riskLevel === 'CRITICAL' && (
            <div style={{
              backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '12px',
              fontWeight: 700, padding: '8px 12px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px'
            }}>
              <AlertTriangle size={14} />
              CRITICAL RISK — IMMEDIATE ACTION REQUIRED
            </div>
          )}

          {riskLevel === 'CRITICAL' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => toast.success('✅ Permit #KW-1049 suspended. Safety officer alerted.', { duration: 4000 })}
                style={{
                  height: '44px', borderRadius: '10px', backgroundColor: '#DC2626',
                  color: 'white', border: 'none', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', transition: 'background-color 0.15s'
                }}
              >
                ⏸ Suspend Permit #KW-XXXX
              </button>
              <button
                onClick={() => toast('📢 Alert sent to Safety Officer.', {
                  duration: 3000,
                  style: {
                    border: '1px solid #3B6FF0',
                    padding: '12px',
                    color: '#3B6FF0',
                    backgroundColor: '#EEF2FF',
                    fontWeight: 600
                  }
                })}
                style={{
                  height: '44px', borderRadius: '10px', backgroundColor: '#FEF3C7',
                  color: '#D97706', border: '1.5px solid #FCD34D', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                📢 Alert Safety Officer
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/app/reports');
                }}
                style={{
                  height: '44px', borderRadius: '10px', backgroundColor: '#FFFFFF',
                  color: '#3B6FF0', border: '1.5px solid #3B6FF0', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                📄 Generate Incident Report
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                navigate('/app/reports');
              }}
              style={{
                height: '44px', borderRadius: '10px', backgroundColor: '#3B6FF0',
                color: 'white', border: 'none', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,111,240,0.15)'
              }}
            >
              📄 Generate Incident Report
            </button>
          )}
        </div>

      </motion.div>
    </>
  );
}
