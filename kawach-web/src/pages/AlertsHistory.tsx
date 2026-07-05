import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useLiveReport } from '../hooks/useLiveReport';
import RiskBadge from '../components/ui/RiskBadge';
import { Eye, ChevronDown, ChevronUp, AlertCircle, TrendingUp, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SCENARIOS } from '../mock/mockEngine';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandedRowState {
  [key: string]: boolean;
}

const RISK_COLOR = {
  LOW: '#16A34A',
  MEDIUM: '#D97706',
  HIGH: '#EA580C',
  CRITICAL: '#DC2626',
};

const RULE_NAME_MAP: Record<string, string> = {
  HOT_WORK_GAS_LEAK: 'Explosion Hazard (R1)',
  BOILER_OVERHEATING: 'Thermal Overrun (R2)',
  VALVE_FAILURE: 'Overpressure Vent (R3)',
  CONFINED_SPACE: 'Confined Air Sentry (R4)',
  GAS_LEAK: 'Gas Leak Incident (R5)',
  NORMAL_OPERATION: 'None',
};

export default function AlertsHistory() {
  const { report, setScenario, alertHistory } = useLiveReport();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
  
  // Filters state
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewReport = (scenarioKey: string) => {
    if (scenarioKey) {
      setScenario(scenarioKey as any);
      navigate('/app/reports', { state: { fromAlerts: true } });
    }
  };

  // Generate 25 mock historical entries
  const history = useMemo(() => {
    const mock: any[] = [];
    const types = [
      { t: 'HOT_WORK_GAS_LEAK', s: 'CRITICAL', min: 85, max: 96, c: 3, ruleCount: '4/6', duration: '45m' },
      { t: 'BOILER_OVERHEATING', s: 'HIGH', min: 62, max: 78, c: 4, ruleCount: '3/6', duration: '28m' },
      { t: 'VALVE_FAILURE', s: 'HIGH', min: 62, max: 74, c: 4, ruleCount: '2/6', duration: '20m' },
      { t: 'CONFINED_SPACE', s: 'HIGH', min: 60, max: 70, c: 4, ruleCount: '3/6', duration: '35m' },
      { t: 'GAS_LEAK', s: 'MEDIUM', min: 32, max: 55, c: 5, ruleCount: '2/6', duration: '18m' },
      { t: 'NORMAL_OPERATION', s: 'LOW', min: 5, max: 25, c: 5, ruleCount: '0/6', duration: '-' }
    ];
    
    let id = 1000;
    types.forEach(type => {
      for(let i=0; i<type.c; i++) {
        const sc = SCENARIOS[type.t as keyof typeof SCENARIOS];
        mock.push({
          id: `ALT-${id++}`,
          scenarioKey: type.t,
          timestamp: `2026-07-04 ${String(Math.floor(Math.random()*24)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:00`,
          zone: sc.zone,
          incidentType: sc.incident,
          riskScore: Math.floor(Math.random() * (type.max - type.min) + type.min),
          riskLevel: type.s as any,
          status: type.s === 'CRITICAL' ? 'Active' : (Math.random() > 0.5 ? 'Resolved' : 'Acknowledged'),
          duration: type.duration,
          rulesTriggered: type.ruleCount,
          reasons: type.s !== 'LOW' ? ['Gas concentration exceeded tolerance limits.', 'Permit authorization conflicts detected in active zones.'] : [],
          recommendations: type.s !== 'LOW' ? ['Suspend active hot work permit.', 'Notify safety officer and verify local ventilation systems.'] : [],
          topPrediction: type.s !== 'LOW' ? 'Cascade pressure hazard expected if temp rises.' : 'System operation normal.',
          sensorVals: {
            gas: sc.gas_target + Math.floor(Math.random() * 5),
            temp: sc.temp_target + Math.floor(Math.random() * 10),
            pressure: sc.pressure_target + (Math.random() * 0.5)
          }
        });
      }
    });
    return mock.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  }, []);

  // Merge live and mock alerts
  const allAlerts = useMemo(() => {
    const liveMapped = alertHistory.map(a => {
      // Find matching scenario key based on description
      let scenarioKey = 'NORMAL_OPERATION';
      if (a.description.includes('Hot Work')) scenarioKey = 'HOT_WORK_GAS_LEAK';
      else if (a.description.includes('Overheating')) scenarioKey = 'BOILER_OVERHEATING';
      else if (a.description.includes('Failure')) scenarioKey = 'VALVE_FAILURE';
      else if (a.description.includes('Confined')) scenarioKey = 'CONFINED_SPACE';
      else if (a.description.includes('Leak')) scenarioKey = 'GAS_LEAK';

      return {
        id: a.id,
        scenarioKey,
        timestamp: a.timestamp,
        zone: a.zone as any,
        incidentType: a.description as any,
        riskScore: a.riskLevel === 'CRITICAL' ? 96 : a.riskLevel === 'HIGH' ? 76 : a.riskLevel === 'MEDIUM' ? 44 : 12,
        riskLevel: a.riskLevel as any,
        status: 'Active' as const,
        duration: 'Just now',
        rulesTriggered: a.riskLevel === 'CRITICAL' ? '4/6' : '2/6',
        reasons: [a.description],
        recommendations: ['Check sensors and issue supervisor alerts immediately.'],
        topPrediction: 'Immediate containment protocol requested.',
        sensorVals: {
          gas: report?.sensor?.gas_ppm || 18,
          temp: report?.sensor?.temperature_c || 425,
          pressure: report?.sensor?.pressure_bar || 5.2
        }
      };
    });

    return [...liveMapped, ...history];
  }, [alertHistory, history, report]);

  // Apply filters
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(a => {
      if (zoneFilter !== 'all' && a.zone !== zoneFilter) return false;
      if (riskFilter !== 'all' && a.riskLevel !== riskFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    });
  }, [allAlerts, zoneFilter, riskFilter, statusFilter]);

  // Analytics Chart Data
  const shiftChartData = [
    { time: '08:00', score: 12 }, { time: '09:00', score: 15 },
    { time: '10:00', score: 48 }, { time: '11:00', score: 18 },
    { time: '12:00', score: 20 }, { time: '13:00', score: 76 },
    { time: '14:00', score: 96 }, { time: '15:00', score: 32 },
    { time: '16:00', score: 15 }, { time: '17:00', score: 12 }
  ];

  const pieData = [
    { name: 'LOW', value: 65, color: '#16A34A' },
    { name: 'MEDIUM', value: 20, color: '#D97706' },
    { name: 'HIGH', value: 10, color: '#EA580C' },
    { name: 'CRITICAL', value: 5, color: '#DC2626' }
  ];

  // CHANGE 14: Rule frequency data for Leaderboard
  const ruleLeaderboardData = [
    { name: 'Explosion Check', count: 8 },
    { name: 'Thermal Overrun', count: 12 },
    { name: 'Overpressure Vent', count: 4 },
    { name: 'Confined Air Sentry', count: 6 },
    { name: 'Gas Leak Rule', count: 9 },
    { name: 'Tri-Parameter Exceed', count: 3 }
  ].sort((a, b) => b.count - a.count);

  // CHANGE 14: Safety ranking table
  const zoneSafetyRankings = [
    { name: 'Control Room', score: 100, trend: 'up', status: 'LOW' },
    { name: 'Storage Tank', score: 85, trend: 'stable', status: 'LOW' },
    { name: 'Valve Station', score: 72, trend: 'down', status: 'MEDIUM' },
    { name: 'Gas Pipeline', score: 68, trend: 'up', status: 'MEDIUM' },
    { name: 'Boiler Room', score: 54, trend: 'down', status: 'HIGH' },
    { name: 'Coke Oven Battery', score: 38, trend: 'down', status: 'CRITICAL' }
  ];

  if (!report) {
    return (
      <AppShell title="Alerts & History" riskLevel="LOW" riskScore={0}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading safety alerts...</div>
      </AppShell>
    );
  }

  const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', backgroundColor: active ? '#EEF2FF' : '#FFFFFF',
        color: active ? '#3B6FF0' : '#6B7280', border: active ? '1.5px solid #3B6FF0' : '1.5px solid #E5E7EB',
        borderRadius: '99px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease'
      }}
      className="hover:border-blue-500/40"
    >
      {label}
    </button>
  );

  return (
    <AppShell title="Alerts & History" riskLevel={report.master_ai.risk_level} riskScore={report.master_ai.risk_score}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        
        {/* LEFT PANEL: ALERTS TABLE */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
              Alert History
            </h2>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
              Last 24 hours across all 6 plant zones
            </div>
          </div>

          {/* Filter Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', width: '60px' }}>Risk</span>
              <FilterPill label="All" active={riskFilter === 'all'} onClick={() => setRiskFilter('all')} />
              <FilterPill label="LOW" active={riskFilter === 'LOW'} onClick={() => setRiskFilter('LOW')} />
              <FilterPill label="MEDIUM" active={riskFilter === 'MEDIUM'} onClick={() => setRiskFilter('MEDIUM')} />
              <FilterPill label="HIGH" active={riskFilter === 'HIGH'} onClick={() => setRiskFilter('HIGH')} />
              <FilterPill label="CRITICAL" active={riskFilter === 'CRITICAL'} onClick={() => setRiskFilter('CRITICAL')} />
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', width: '60px' }}>Status</span>
              <FilterPill label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
              <FilterPill label="Active" active={statusFilter === 'Active'} onClick={() => setStatusFilter('Active')} />
              <FilterPill label="Acknowledged" active={statusFilter === 'Acknowledged'} onClick={() => setStatusFilter('Acknowledged')} />
              <FilterPill label="Resolved" active={statusFilter === 'Resolved'} onClick={() => setStatusFilter('Resolved')} />
            </div>
          </div>

          {/* Alerts Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Zone</th>
                  <th style={{ padding: '12px 16px' }}>Incident / Alert</th>
                  <th style={{ padding: '12px 16px' }}>Rules</th>
                  <th style={{ padding: '12px 16px' }}>Risk</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Duration</th>
                  <th style={{ padding: '12px 16px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.slice(0, 10).map((row) => {
                  const isExpanded = !!expandedRows[row.id];
                  const isCritical = row.riskLevel === 'CRITICAL';
                  const isActive = row.status === 'Active';
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => toggleRow(row.id)}
                        style={{
                          borderBottom: '1px solid #E5E7EB',
                          backgroundColor: isCritical ? '#FFF5F5' : '#FFFFFF',
                          borderLeft: isActive ? '4px solid #DC2626' : (isCritical ? '4px solid #FCA5A5' : '4px solid transparent'),
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        className="hover:bg-blue-50/20"
                      >
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                          {row.timestamp.split(' ')[1]}
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                          {row.zone}
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#374151', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.incidentType}
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>
                          {row.rulesTriggered}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <RiskBadge level={row.riskLevel} size="sm" />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px',
                            backgroundColor: row.status === 'Active' ? '#FEE2E2' : (row.status === 'Resolved' ? '#DCFCE7' : '#F3F4F6'),
                            color: row.status === 'Active' ? '#DC2626' : (row.status === 'Resolved' ? '#16A34A' : '#6B7280')
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>
                          {row.duration}
                        </td>
                        <td style={{ padding: '16px', color: '#9CA3AF' }} onClick={(e) => { e.stopPropagation(); handleViewReport(row.scenarioKey); }}>
                          <Eye size={16} className="hover:text-blue-500" />
                        </td>
                      </tr>

                      {/* CHANGE 15: Expanded section with height transitions */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                            <td colSpan={8} style={{ padding: 0 }}>
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  
                                  {/* Sensor telemetry at time of alert */}
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                                    <div style={{ textAlign: 'center' }}>
                                      <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>Gas Level</div>
                                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>{row.sensorVals?.gas} ppm</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                      <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>Temperature</div>
                                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#EA580C', marginTop: '2px' }}>{row.sensorVals?.temp}°C</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                      <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>Pressure</div>
                                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>{row.sensorVals?.pressure.toFixed(1)} bar</div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
                                    <div>
                                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Compound Rules Fired</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {row.reasons.length > 0 ? (
                                          row.reasons.map((r: string, i: number) => (
                                            <div key={i} style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                              <AlertCircle size={12} color="#D97706" />
                                              <span>{r}</span>
                                            </div>
                                          ))
                                        ) : (
                                          <span style={{ fontSize: '12px', color: '#6B7280' }}>No anomaly reasons recorded.</span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>AI Safety Recommendation</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {row.recommendations.map((rec: string, i: number) => (
                                          <div key={i} style={{ fontSize: '12px', color: '#111827', fontWeight: 600 }}>
                                            ✓ {rec}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                                    <button 
                                      onClick={() => handleViewReport(row.scenarioKey)}
                                      style={{
                                        backgroundColor: '#3B6FF0', color: 'white', border: 'none',
                                        borderRadius: '6px', padding: '6px 14px', fontSize: '12px',
                                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                                      }}
                                    >
                                      Open Full Report →
                                    </button>
                                  </div>

                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL: SHIFT ANALYTICS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. Area Chart: Risk Score Over Time */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Sora, sans-serif' }}>
                Shift Risk Analytics
              </h3>
              <div style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={12} />
                Live Shift Feed
              </div>
            </div>

            <div style={{ width: '100%', height: '140px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={shiftChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3B6FF0" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#3B6FF0" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Donut Chart: Risk Distribution */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', fontFamily: 'Sora, sans-serif' }}>
              Shift Risk Distribution
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '100px', height: '100px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={28} outerRadius={42} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />
                      <span style={{ fontWeight: 600, color: '#4B5563' }}>{d.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHANGE 14: Compound Rules Leaderboard */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
              Most Triggered Rules (Last 24h)
            </h3>
            <div style={{ width: '100%', height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ruleLeaderboardData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={10}>
                    {ruleLeaderboardData.map((entry, idx) => {
                      const fill = entry.count > 9 ? '#DC2626' : entry.count > 5 ? '#EA580C' : '#D97706';
                      return <Cell key={`cell-${idx}`} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHANGE 14: Zone Safety rankings leaderboard */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
              Zone Safety Rankings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {zoneSafetyRankings.map((zone, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: '10px', fontSize: '12px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#9CA3AF' }}>#{i+1}</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{zone.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {zone.trend === 'up' ? <ArrowUpRight size={12} color="#16A34A" /> : zone.trend === 'down' ? <ArrowDownRight size={12} color="#DC2626" /> : <span style={{ color: '#9CA3AF' }}>→</span>}
                      {zone.score}%
                    </span>
                    <RiskBadge level={zone.status as any} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics indicators */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#6B7280' }}>Most Affected Zone</span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>Coke Oven Battery</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#6B7280' }}>Average Lead Time Gain</span>
              <span style={{ fontWeight: 700, color: '#16A34A' }}>8.2 minutes</span>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
