import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import { SCENARIOS } from '../mock/mockEngine';
import type { ScenarioKey } from '../types/report';
import { Flame, Thermometer, Gauge, AlertTriangle, Shield, CheckCircle, RotateCw } from 'lucide-react';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import RiskBadge from '../components/ui/RiskBadge';
import { toast } from 'react-hot-toast';

const RISK_COLOR = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

export default function LiveControlConsole() {
  const { report, setScenario, currentScenario: currentKey } = useLiveReport();
  const navigate = useNavigate();

  // Ramping states
  const [rampingScenario, setRampingScenario] = useState<ScenarioKey | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Stopwatch for scenario elapsed time
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentKey]);

  // Countdown timer for Ramping state
  useEffect(() => {
    if (countdown <= 0) {
      setRampingScenario(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!report) return <div>Loading...</div>;

  const pad = (n: number) => String(n).padStart(2, '0');
  const elapsedStr = `${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}s`;

  const activeScenario = SCENARIOS[currentKey];

  // Helper to calculate progress toward target from a baseline
  const calculateRampProgress = (curr: number, target: number, base: number) => {
    if (Math.abs(curr - target) < 0.5) return 100;
    const total = Math.abs(target - base);
    if (total === 0) return 100;
    const progress = Math.abs(curr - base);
    return Math.min(100, Math.round((progress / total) * 100));
  };

  const gasProgress = calculateRampProgress(report.sensor.gas_ppm, activeScenario.gas_target, 18);
  const tempProgress = calculateRampProgress(report.sensor.temperature_c, activeScenario.temp_target, 425);
  const pressureProgress = calculateRampProgress(report.sensor.pressure_bar, activeScenario.pressure_target, 5.2);
  const humidityProgress = calculateRampProgress(report.sensor.humidity_percent, activeScenario.humidity_target, 48);

  const averageProgress = Math.round((gasProgress + tempProgress + pressureProgress + humidityProgress) / 4);

  // Active compound rules count
  const gas = report.sensor.gas_ppm;
  const temp = report.sensor.temperature_c;
  const pressure = report.sensor.pressure_bar;
  const permit = report.plant.permit;

  const rulesTriggered = [
    gas > 45 && permit === 'Hot Work',
    gas > 35 && temp > 450,
    pressure > 8 && temp > 470,
    pressure > 7 && gas > 40,
    report.plant.incident === 'Gas Leak' && permit === 'Hot Work',
    gas > 60 && temp > 480 && pressure > 8
  ].filter(Boolean).length;

  // Trigger scenario wrapper
  const handleTriggerScenario = (sKey: ScenarioKey, title: string) => {
    if (rampingScenario !== null) {
      toast('🔄 Switching scenario...', { duration: 1500 });
    }
    
    if (sKey === 'NORMAL_OPERATION') {
      toast('🔄 Resetting all zones to normal...', { duration: 2000 });
    } else {
      toast(`⚡ Triggering ${title}...`, { duration: 3000 });
    }

    setScenario(sKey);
    setRampingScenario(sKey);
    setCountdown(18); // 18s ramp countdown
  };

  return (
    <AppShell 
      title="Live Control Console" 
      riskLevel={report.master_ai.risk_level} 
      riskScore={report.master_ai.risk_score}
      onBack={() => navigate('/app/dashboard')}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        {/* LEFT COLUMN: SCENARIOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
              Scenario Orchestration
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
              Simulate real-time sensor drifts and hazardous conditions for live judging.
            </p>
          </div>

          {/* Warning Banner */}
          <div style={{
            backgroundColor: '#FEF3C7', color: '#92400E', padding: '14px 18px', borderRadius: '12px',
            fontSize: '12.5px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '16px' }}>⚡</span>
            <span>Demonstration Tool — Sensor values will smoothly ramp to target values over 15-20 seconds.</span>
          </div>

          {/* Scenario Cards list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                sKey: 'NORMAL_OPERATION' as ScenarioKey,
                title: 'Normal Operation',
                zone: 'Boiler Room',
                desc: 'All parameters operating within safe baseline tolerances.',
                targets: 'Gas: 18ppm | Temp: 425°C | Press: 5.2b',
                color: '#16A34A',
                icon: CheckCircle,
                outcome: 'Expected: LOW (8%) · Triggers: Normal process conditions'
              },
              {
                sKey: 'GAS_LEAK' as ScenarioKey,
                title: 'Gas Leak',
                zone: 'Gas Pipeline',
                desc: 'Drifting combustible gas concentration, no active thermal issues.',
                targets: 'Gas: 55ppm | Temp: 435°C | Press: 6.3b',
                color: '#D97706',
                icon: Flame,
                outcome: 'Expected: MEDIUM (44%) · Triggers: Gas Leak alarm'
              },
              {
                sKey: 'BOILER_OVERHEATING' as ScenarioKey,
                title: 'Boiler Overheating',
                zone: 'Boiler Room',
                desc: 'High operating temperature and pressure — boiler rupture hazard.',
                targets: 'Gas: 22ppm | Temp: 475°C | Press: 8.1b',
                color: '#EA580C',
                icon: Thermometer,
                outcome: 'Expected: HIGH (72%) · Triggers: Boiler Overheating + Process Instability'
              },
              {
                sKey: 'HOT_WORK_GAS_LEAK' as ScenarioKey,
                title: 'HOT WORK + GAS LEAK',
                zone: 'Coke Oven Battery',
                desc: 'Gas: 82ppm + Hot Work permit + 5 workers = CRITICAL compound risk — the Vizag incident pattern.',
                targets: 'Gas: 82ppm | Temp: 500°C | Press: 9.6b',
                color: '#DC2626',
                icon: AlertTriangle,
                isDemo: true,
                outcome: 'Expected: CRITICAL (96%) · Triggers: Explosion + Fire Hazard + Emergency rules'
              },
              {
                sKey: 'VALVE_FAILURE' as ScenarioKey,
                title: 'Valve Failure',
                zone: 'Valve Station',
                desc: 'Mechanical block causing pressure fluctuations in pipeline.',
                targets: 'Gas: 35ppm | Temp: 450°C | Press: 8.8b',
                color: '#EA580C',
                icon: Gauge,
                outcome: 'Expected: HIGH (72%) · Triggers: Valve Failure + Process Instability'
              },
              {
                sKey: 'CONFINED_SPACE' as ScenarioKey,
                title: 'Confined Space Entry',
                zone: 'Storage Tank',
                desc: 'Active permit with workers in tank under climbing gas readings.',
                targets: 'Gas: 42ppm | Temp: 438°C | Press: 6.8b',
                color: '#EA580C',
                icon: Shield,
                outcome: 'Expected: HIGH (70%) · Triggers: Confined Space Entry + Process instability'
              }
            ].map((scen) => {
              const active = currentKey === scen.sKey;
              const isRamping = rampingScenario === scen.sKey;
              const Icon = scen.icon;
              
              return (
                <div
                  key={scen.sKey}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: scen.isDemo ? '20px 24px' : '16px 20px',
                    border: active ? `2px solid ${scen.color}` : '1px solid #E5E7EB',
                    boxShadow: active ? `0 4px 20px rgba(59,111,240,0.1)` : '0 2px 4px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative'
                  }}
                >
                  {scen.isDemo && (
                    <div style={{
                      position: 'absolute', top: '-10px', left: '20px',
                      backgroundColor: '#DC2626', color: 'white', padding: '2px 10px',
                      borderRadius: '99px', fontSize: '10px', fontWeight: 800,
                      letterSpacing: '0.5px', textTransform: 'uppercase', zIndex: 10
                    }}>
                      ⭐ MAIN DEMO SCENARIO
                    </div>
                  )}

                  {/* CHANGE 27: RAMPING / ACTIVE badges */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '100px', zIndex: 10
                  }}>
                    {isRamping ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        backgroundColor: '#FEF3C7', color: '#D97706', padding: '3px 8px',
                        borderRadius: '99px', fontSize: '10px', fontWeight: 700
                      }}>
                        <RotateCw size={10} style={{ animation: 'spin 1.5s linear infinite' }} />
                        Ramping...
                      </span>
                    ) : active ? (
                      <span style={{
                        backgroundColor: scen.sKey === 'NORMAL_OPERATION' ? '#DCFCE7' : scen.sKey === 'GAS_LEAK' ? '#FEF3C7' : '#FEE2E2',
                        color: scen.sKey === 'NORMAL_OPERATION' ? '#16A34A' : scen.sKey === 'GAS_LEAK' ? '#D97706' : '#DC2626',
                        padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700
                      }}>
                        Active
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: '#F3F4F6', color: '#6B7280',
                        padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 600
                      }}>
                        Ready
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: `${scen.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} color={scen.color} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          {scen.title}
                        </h3>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>Zone Affected: {scen.zone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTriggerScenario(scen.sKey, scen.title)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: active ? scen.color : '#FFFFFF',
                        color: active ? '#FFFFFF' : scen.color,
                        border: `1.5px solid ${scen.color}`,
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      className="hover:scale-105"
                    >
                      {active ? 'Active' : 'Trigger'}
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>{scen.desc}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '10px', color: '#4B5563', backgroundColor: '#F9FAFB', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                      <span>Targets:</span>
                      <span style={{ fontWeight: 600 }}>{scen.targets}</span>
                    </div>
                    {/* CHANGE 27: Expected Outcome Section */}
                    <div style={{ fontSize: '10.5px', color: '#8A95A5', fontWeight: 500, paddingLeft: '4px', marginTop: '2px' }}>
                      {scen.outcome}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE STATE MONITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                Real-Time Plant State
              </h2>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                Simulated sensor outputs ramping towards active scenario target.
              </div>
            </div>

            {/* CHANGE 28: Scenario Countdown Bar or Active badge */}
            {rampingScenario ? (
              <div style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                  <span>Scenario reaching target in...</span>
                  <span style={{ fontFamily: 'monospace' }}>{countdown}s</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((18 - countdown) / 18) * 100}%`, backgroundColor: '#D97706', transition: 'width 1s linear' }} />
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color="#16A34A" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>
                  ✅ Scenario Active — Dashboard reflects live conditions
                </span>
              </div>
            )}

            {/* Current Scenario Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>Active Scenario</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{activeScenario.incident}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>Elapsed Time</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#3B6FF0', marginTop: '2px', fontFamily: 'monospace' }}>{elapsedStr}</div>
              </div>
            </div>

            {/* Sensor targets & progress bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sensor Target Lock Ramps
              </div>
              
              {[
                { label: 'Gas Concentration', curr: report.sensor.gas_ppm, target: activeScenario.gas_target, unit: 'ppm', pct: gasProgress },
                { label: 'Boiler Temperature', curr: report.sensor.temperature_c, target: activeScenario.temp_target, unit: '°C', pct: tempProgress },
                { label: 'Mechanical Pressure', curr: report.sensor.pressure_bar, target: activeScenario.pressure_target, unit: 'bar', pct: pressureProgress },
                { label: 'Relative Humidity', curr: report.sensor.humidity_percent, target: activeScenario.humidity_target, unit: '%', pct: humidityProgress }
              ].map((sensor, i) => {
                // Change current color: green if within 10% of target, amber if >10% away
                const diffPct = Math.abs(sensor.curr - sensor.target) / sensor.target;
                const isAligned = diffPct <= 0.10;
                
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: '#374151' }}>{sensor.label}</span>
                      <span style={{ color: '#6B7280' }}>
                        <span style={{ fontWeight: 700, color: isAligned ? '#16A34A' : '#D97706', transition: 'color 0.3s' }}>
                          {sensor.curr.toFixed(1)}
                        </span> → <span style={{ fontWeight: 700, color: '#111827' }}>{sensor.target} {sensor.unit}</span>
                      </span>
                    </div>
                    {/* Progress bar container */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${sensor.pct}%`, backgroundColor: '#3B6FF0', transition: 'width 1s ease' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', width: '32px', textAlign: 'right' }}>
                        {sensor.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Scenario Lock status */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                <span style={{ color: '#6B7280', fontWeight: 500 }}>Overall Scenario Target Alignment</span>
                <span style={{ fontWeight: 700, color: averageProgress === 100 ? '#16A34A' : '#3B6FF0' }}>
                  {averageProgress}% aligned
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ height: '100%', width: `${averageProgress}%`, backgroundColor: averageProgress === 100 ? '#16A34A' : '#3B6FF0', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* Stats readout */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>Current Risk Score</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: RISK_COLOR[report.master_ai.risk_level], marginTop: '2px' }}>
                  <AnimatedNumber value={report.master_ai.risk_score} />%
                </div>
              </div>
              <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>Rules Fired</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: rulesTriggered > 0 ? '#DC2626' : '#16A34A', marginTop: '2px' }}>
                  {rulesTriggered} of 6 active
                </div>
              </div>
            </div>

            {/* AI reasons panel */}
            {report.master_ai.reasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active Reasoning Anomalies
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {report.master_ai.reasons.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#DC2626', backgroundColor: '#FFF5F5', padding: '6px 12px', borderRadius: '6px' }}>
                      <AlertTriangle size={12} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Reset button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleTriggerScenario('NORMAL_OPERATION', 'Normal Operation')}
              style={{
                height: '48px', backgroundColor: '#FFFFFF', color: '#6B7280',
                border: '1.5px solid #E5E7EB', borderRadius: '12px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
              }}
              className="hover:bg-slate-50"
            >
              🔄 Reset All Sensors to Baseline Normal
            </button>
            {/* CHANGE 29: Keyboard shortcut hint */}
            <span style={{ fontSize: '10.5px', color: '#9CA3AF', textAlign: 'center', lineHeight: 1.4 }}>
              Tip: Use this console before your demo to pre-load a scenario. Trigger 'Normal Operation' to reset between demo runs.
            </span>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
