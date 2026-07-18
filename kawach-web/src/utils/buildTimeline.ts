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
