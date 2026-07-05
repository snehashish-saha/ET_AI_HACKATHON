import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import { Activity, Camera, FileText, Wrench, Users, Brain, Bell, AlertOctagon, Shield, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

const RISK_COLOR = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

export default function Architecture() {
  const { report } = useLiveReport();
  const navigate = useNavigate();
  const [watchLive, setWatchLive] = useState(true);

  if (!report) return <div>Loading...</div>;

  const gas = report.sensor.gas_ppm;
  const temp = report.sensor.temperature_c;
  const pressure = report.sensor.pressure_bar;
  const permit = report.plant.permit;
  const workers = report.workers.length;
  const maintenance = report.plant.maintenance;

  // Active status matching rules
  const ruleActive = (idx: number) => {
    switch (idx) {
      case 0: return gas > 45 && permit === 'Hot Work';
      case 1: return gas > 35 && temp > 450;
      case 2: return pressure > 8 && temp > 470;
      case 3: return pressure > 7 && gas > 40;
      case 4: return report.plant.incident === 'Gas Leak' && permit === 'Hot Work';
      case 5: return gas > 60 && temp > 480 && pressure > 8;
      default: return false;
    }
  };

  // Speed multiplier based on risk level
  const isCritical = report.master_ai.risk_level === 'CRITICAL';
  const duration = watchLive && isCritical ? '0.6s' : '1.8s';

  return (
    <AppShell 
      title="Architecture" 
      riskLevel={report.master_ai.risk_level} 
      riskScore={report.master_ai.risk_score}
      onBack={() => navigate('/app/dashboard')}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Style for animation keyframes */}
        <style>{`
          @keyframes pulseScale {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .pulse-active {
            animation: pulseScale 2s infinite ease-in-out;
          }
        `}</style>

        {/* Hero title & watch live toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
              How Kawach Thinks
            </h1>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '4px 0 0 0' }}>
              Five inputs. One safety brain. Zero lag.
            </p>
          </div>
          <button
            onClick={() => setWatchLive(!watchLive)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
              backgroundColor: watchLive ? '#EEF2FF' : '#F3F4F6', color: watchLive ? '#3B6FF0' : '#6B7280',
              border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {watchLive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            <span>{watchLive ? 'Watch Live: ON' : 'Watch Live: OFF'}</span>
          </button>
        </div>

        {/* ═══ THE DIAGRAM CONTAINER ═══ */}
        <div style={{ position: 'relative', width: '800px', height: '530px', margin: '0 auto' }}>
          
          {/* Animated Connecting SVG Paths in Background */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {/* Base lines */}
            <path d="M 80 110 Q 150 160, 400 210" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 245 110 Q 280 160, 400 210" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 410 110 Q 410 160, 400 210" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 575 110 Q 520 160, 400 210" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 740 110 Q 650 160, 400 210" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 400 390 L 400 440" fill="none" stroke="#E2E8F0" strokeWidth="2" />

            {watchLive && (
              <>
                {/* CHANGE 20: Dots travel down paths from each agent using SVG animateMotion */}
                <circle r="6" fill="#3B6FF0">
                  <animateMotion dur={duration} repeatCount="indefinite" path="M 80 110 Q 150 160, 400 210" />
                </circle>

                <circle r="6" fill="#0EA5E9">
                  <animateMotion dur={duration} repeatCount="indefinite" path="M 245 110 Q 280 160, 400 210" />
                </circle>

                <circle r="6" fill="#D97706">
                  <animateMotion dur={duration} repeatCount="indefinite" path="M 410 110 Q 410 160, 400 210" />
                </circle>

                <circle r="6" fill="#EA580C">
                  <animateMotion dur={duration} repeatCount="indefinite" path="M 575 110 Q 520 160, 400 210" />
                </circle>

                <circle r="6" fill="#7C3AED">
                  <animateMotion dur={duration} repeatCount="indefinite" path="M 740 110 Q 650 160, 400 210" />
                </circle>
                
                {/* Center connection down to emergency tier */}
                <circle r="7" fill="#DC2626">
                  <animateMotion dur={isCritical ? '0.3s' : '0.9s'} repeatCount="indefinite" path="M 400 390 L 400 440" />
                </circle>
              </>
            )}
          </svg>

          {/* TIER 1: THE INPUTS */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
            {[
              { icon: Activity, title: 'Sensor Agent', color: '#3B6FF0', desc: 'Gas, Temp, Pressure', liveVal: watchLive ? `${gas.toFixed(0)}ppm | ${temp.toFixed(0)}°C` : 'Telemetry logs' },
              { icon: Camera, title: 'Vision Agent', color: '#0EA5E9', desc: 'PPE & smoke watch', liveVal: watchLive ? `CAM-03 | ${report.plant.zone === 'Coke Oven Battery' ? 'WARNING' : 'NORMAL'}` : 'Feed scanning' },
              { icon: FileText, title: 'Permit Agent', color: '#D97706', desc: 'Hot work & mechanical', liveVal: watchLive ? `Active: ${permit}` : 'Permits database' },
              { icon: Wrench, title: 'Maint. Agent', color: '#EA580C', desc: 'Overhaul checklist', liveVal: watchLive ? `Overhaul: ${maintenance ? 'YES' : 'NO'}` : 'Health stats' },
              { icon: Users, title: 'Worker Agent', color: '#7C3AED', desc: 'Worker headcounts', liveVal: watchLive ? `${workers} in ${report.plant.zone}` : 'Location tracking' }
            ].map((node, idx) => (
              <div key={idx} style={{
                width: '142px', height: '110px', backgroundColor: '#FFFFFF', borderRadius: '16px',
                padding: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                transition: 'all 0.3s ease'
              }} className={watchLive ? 'pulse-active' : ''}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${node.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <node.icon size={14} color={node.color} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#111827' }}>{node.title}</span>
                <span style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>{node.desc}</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: node.color, backgroundColor: `${node.color}08`, padding: '2px 6px', borderRadius: '4px', marginTop: '6px' }}>
                  {node.liveVal}
                </span>
              </div>
            ))}
          </div>

          {/* TIER 2: RISK REASONING ENGINE */}
          <div style={{
            position: 'absolute', top: '210px', left: '30px', right: '30px', height: '180px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '24px',
            padding: '20px 32px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', zIndex: 10,
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '20px', alignItems: 'center'
          }}>
            {/* Left: Rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>6 Compound Rules</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Explosion risk', 'Fire check', 'Boiler limit', 'Pipeline pressure', 'Permit overlap', 'Emergency stop'].map((rule, idx) => {
                  const isActive = watchLive && ruleActive(idx);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: isActive ? '#DC2626' : '#475569',
                        boxShadow: isActive ? '0 0 6px #DC2626' : 'none'
                      }} />
                      <span style={{ color: isActive ? '#FCA5A5' : '#94A3B8', fontWeight: isActive ? 600 : 400 }}>{rule}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center: Live Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={RISK_COLOR[report.master_ai.risk_level]}
                    strokeWidth="6"
                    strokeDasharray="263.8"
                    strokeDashoffset={263.8 - (report.master_ai.risk_score / 100) * 263.8}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s' }}
                  />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
                    {report.master_ai.risk_score}%
                  </span>
                  <span style={{ fontSize: '8px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '2px' }}>
                    {report.master_ai.risk_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Output info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Master Decision</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{report.plant.incident}</span>
                {report.master_ai.reasons.length > 0 && (
                  <span style={{ fontSize: '11px', color: '#FCA5A5', lineHeight: 1.3 }}>
                    ⚠️ {report.master_ai.reasons[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TIER 3: ACTION BRANCHES */}
          <div style={{ position: 'absolute', top: '440px', left: '120px', right: '120px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', zIndex: 10 }}>
            {[
              { label: '📢 Officer Alert', desc: 'Mock SMS dispatched', active: report.master_ai.risk_level !== 'LOW' },
              { label: '📄 Incident Report', desc: 'PDF formatted live', active: report.master_ai.risk_level !== 'LOW' },
              { label: '🚨 Evacuation Act', desc: 'Neighbor grids alerted', active: report.master_ai.risk_level === 'CRITICAL' }
            ].map((act, i) => (
              <div key={i} style={{
                border: act.active ? '1.5px solid #FCA5A5' : '1px solid #E5E7EB',
                borderRadius: '14px', padding: '10px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                backgroundColor: act.active ? '#FFF5F5' : '#FFFFFF'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: act.active ? '#DC2626' : '#4B5563' }}>{act.label}</div>
                <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>{act.desc}</div>
              </div>
            ))}
          </div>

        </div>

        {/* ═══ FOOTER EXPLAINER & RAG KNOWLEDGE BASE ═══ */}
        
        {/* Pull quote card */}
        <div style={{
          backgroundColor: '#EEF2FF', borderLeft: '4px solid #3B6FF0', borderRadius: '16px',
          padding: '24px', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, fontStyle: 'italic', color: '#3B6FF0', margin: '0 0 12px 0', fontFamily: 'Sora, sans-serif' }}>
            "Data existed. Intelligence didn't."
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151', margin: 0 }}>
            In the Visakhapatnam Steel Plant explosion (January 2025), every sensor worked correctly. Gas detectors, SCADA systems, and permit controls all functioned — yet 8 workers lost their lives. The missing piece was a unified intelligence layer that could read the combination of rising gas + active hot work + worker presence simultaneously and act. That is what Kawach is.
          </p>
        </div>

        {/* CHANGE 22: Indexed PDFs RAG segment with 4 exact documents and sizes */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px', fontFamily: 'Sora, sans-serif' }}>
            Regulatory Intelligence
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
            Kawach's vector database has indexed the following industrial regulations:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { doc: 'OISD DOC 1.pdf', title: 'OISD Standard 116', size: '5.1MB', desc: 'Petroleum facilities safety guide' },
              { doc: 'OISD DOC 2.pdf', title: 'OISD Standard 117', size: '820KB', desc: 'Fire protection standards' },
              { doc: 'OSHA3122.pdf', title: 'OSHA 29 CFR 1910', size: '720KB', desc: 'Confined space entry policies' },
              { doc: 'PNGRB DOC.pdf', title: 'PNGRB Pipeline Safety', size: '1.7MB', desc: 'Gas pipeline safety code' }
            ].map((kb, idx) => (
              <div key={idx} style={{
                backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
                padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '9px', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '99px', alignSelf: 'flex-start', fontWeight: 600 }}>
                  PDF Indexed
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{kb.title}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{kb.desc}</div>
                </div>
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '8px', marginTop: '4px' }}>
                  <div style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace' }}>
                    File: {kb.doc}
                  </div>
                  <div style={{ fontSize: '9px', color: '#6B7280', fontWeight: 600, marginTop: '2px' }}>
                    Size: {kb.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
