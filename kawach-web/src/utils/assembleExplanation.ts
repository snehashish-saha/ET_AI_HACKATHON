import { RiskLevel, PermitType } from '../types/report';

export function assembleExplanation(
  zone: string,
  gas: number,
  temp: number,
  pressure: number,
  riskLevel: RiskLevel,
  permit: PermitType,
  workerCount: number,
  reasons: string[],
  recommendations: string[]
): string {
  const cleanReason = (r: string) => r.endsWith('.') ? r : `${r}.`;
  const reasonsStr = reasons.map(cleanReason).join(' ');
  const recsStr = recommendations.map(cleanReason).join(' ');
  const workerText = workerCount === 1 ? '1 worker' : `${workerCount} workers`;

  if (riskLevel === 'CRITICAL') {
    const gasDesc = gas > 60 ? 'above' : 'approaching';
    return `CRITICAL RISK DETECTED in ${zone}. Gas concentration is at ${gas.toFixed(1)}ppm — ${gasDesc} explosive threshold — while a ${permit} permit is active with ${workerText} present in a confined space. ${reasonsStr} Immediate action required: ${recsStr} This combination of conditions matches patterns that have preceded real industrial incidents.`;
  }
  
  if (riskLevel === 'HIGH') {
    return `ELEVATED RISK in ${zone}. ${reasonsStr} Current readings: gas at ${gas.toFixed(1)}ppm, temperature at ${temp.toFixed(0)}°C, pressure at ${pressure.toFixed(1)} bar. Recommended: ${recsStr}`;
  }
  
  if (riskLevel === 'MEDIUM') {
    const r = reasonsStr ? ` ${reasonsStr}` : '';
    return `CAUTION — ${zone} showing developing risk conditions.${r} Sensor readings are trending toward concerning ranges. Enhanced monitoring recommended.`;
  }
  
  return `Zone ${zone} is operating within normal parameters. Gas at ${gas.toFixed(1)}ppm, Temperature at ${temp.toFixed(0)}°C, Pressure at ${pressure.toFixed(1)} bar. No active permits. Continuous monitoring active.`;
}
