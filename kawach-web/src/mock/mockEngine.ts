// ============================================================
// KAWACH — Mock Data Simulation Engine
// Mirrors the Python backend's IncidentEngine, CompoundRiskEngine,
// PredictionEngine, and GeospatialEngine field-for-field.
// ============================================================

import type {
  LiveReport,
  ScenarioKey,
  ScenarioConfig,
  RiskLevel,
  ZoneName,
  ZoneRisk,
  Prediction,
  Worker,
  MasterAI,
  SensorData,
  PlantInfo,
  WorkerStatus,
  PermitType,
  IncidentType,
} from '../types/report';
import { ZONE_NAMES, CAMERA_MAP, HAZARD_MAP } from '../types/report';

// ─── Scenario Definitions ───────────────────────────────────

const SCENARIOS: Record<ScenarioKey, ScenarioConfig> = {
  NORMAL_OPERATION: {
    gas_target: 18, temp_target: 425, pressure_target: 5.2, humidity_target: 48,
    zone: 'Boiler Room', permit: 'None', maintenance: false, workers: 3,
    risk_level: 'LOW', incident: 'Normal Operation',
  },
  GAS_LEAK: {
    gas_target: 55, temp_target: 435, pressure_target: 6.3, humidity_target: 50,
    zone: 'Gas Pipeline', permit: 'None', maintenance: false, workers: 4,
    risk_level: 'MEDIUM', incident: 'Gas Leak',
  },
  BOILER_OVERHEATING: {
    gas_target: 22, temp_target: 475, pressure_target: 8.1, humidity_target: 52,
    zone: 'Boiler Room', permit: 'None', maintenance: false, workers: 3,
    risk_level: 'HIGH', incident: 'Boiler Overheating',
  },
  HOT_WORK_GAS_LEAK: {
    gas_target: 82, temp_target: 500, pressure_target: 9.6, humidity_target: 65,
    zone: 'Coke Oven Battery', permit: 'Hot Work', maintenance: true, workers: 5,
    risk_level: 'CRITICAL', incident: 'Hot Work During Gas Leak',
  },
  VALVE_FAILURE: {
    gas_target: 35, temp_target: 450, pressure_target: 8.8, humidity_target: 53,
    zone: 'Valve Station', permit: 'Mechanical', maintenance: true, workers: 4,
    risk_level: 'HIGH', incident: 'Valve Failure',
  },
  CONFINED_SPACE: {
    gas_target: 42, temp_target: 438, pressure_target: 6.8, humidity_target: 58,
    zone: 'Storage Tank', permit: 'Confined Space', maintenance: true, workers: 2,
    risk_level: 'HIGH', incident: 'Confined Space Entry',
  },
};

// ─── Zone Adjacency Graph (exact from backend) ─────────────

const ZONE_NEIGHBORS: Record<ZoneName, ZoneName[]> = {
  'Boiler Room': ['Valve Station', 'Control Room'],
  'Valve Station': ['Boiler Room', 'Gas Pipeline'],
  'Gas Pipeline': ['Valve Station', 'Storage Tank'],
  'Storage Tank': ['Gas Pipeline'],
  'Control Room': ['Boiler Room', 'Coke Oven Battery'],
  'Coke Oven Battery': ['Control Room'],
};

// ─── Worker Names ───────────────────────────────────────────

const WORKER_NAMES = ['Amit', 'Rahul', 'Rohan', 'Vikram', 'Suresh', 'Karan', 'Ajay', 'Deepak'];
const WORKER_STATUSES: WorkerStatus[] = ['Working', 'Inspecting', 'Walking'];

// ─── Helpers ────────────────────────────────────────────────

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function formatTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ─── Engine State ───────────────────────────────────────────

interface EngineState {
  currentScenario: ScenarioKey;
  gas_ppm: number;
  temperature_c: number;
  pressure_bar: number;
  humidity_percent: number;
  workers: Worker[];
  alertHistory: Array<{
    id: string;
    timestamp: string;
    zone: ZoneName;
    description: string;
    riskLevel: RiskLevel;
  }>;
}

let alertIdCounter = 0;

function createInitialState(): EngineState {
  return {
    currentScenario: 'NORMAL_OPERATION',
    gas_ppm: 18,
    temperature_c: 425,
    pressure_bar: 5.2,
    humidity_percent: 48,
    workers: [],
    alertHistory: [],
  };
}

// ─── Sensor Smoothing (exact formula from backend) ──────────

function smoothSensor(current: number, target: number, variation: number): number {
  const newValue = current + (target - current) * 0.12 + randomInRange(-variation, variation);
  return newValue;
}

// ─── Compound Risk Engine (exact from backend) ──────────────

function computeRisk(
  gas: number,
  temp: number,
  pressure: number,
  maintenance: boolean,
  permit: PermitType,
  incident: IncidentType,
): MasterAI {
  let score = 0;
  const reasons: string[] = [];
  const recommendations: string[] = [];

  // Base scoring
  if (gas > 60) score += 20;
  else if (gas > 35) score += 10;

  if (temp > 480) score += 15;
  else if (temp > 450) score += 8;

  if (pressure > 8) score += 15;
  else if (pressure > 6) score += 8;

  if (maintenance) score += 5;
  if (permit === 'Hot Work') score += 8;

  // Compound rules
  if (gas > 45 && permit === 'Hot Work') {
    score += 30;
    reasons.push('Explosion risk: hazardous gas with active hot work.');
    recommendations.push('Cancel Hot Work Permit immediately.');
  }
  if (gas > 35 && temp > 450) {
    score += 20;
    reasons.push('Fire hazard due to high gas and temperature.');
    recommendations.push('Inspect ignition sources immediately.');
  }
  if (pressure > 8 && temp > 470) {
    score += 20;
    reasons.push('Possible boiler failure.');
    recommendations.push('Reduce boiler load immediately.');
  }
  if (pressure > 7 && gas > 40) {
    score += 15;
    reasons.push('Process becoming unstable.');
    recommendations.push('Increase monitoring frequency.');
  }
  if (incident === 'Gas Leak' && permit === 'Hot Work') {
    score += 25;
    reasons.push('Unsafe permit issued during gas leak.');
    recommendations.push('Suspend work permit immediately.');
  }
  if (gas > 60 && temp > 480 && pressure > 8) {
    score += 35;
    reasons.push('Multiple critical process parameters exceeded.');
    recommendations.push('Initiate emergency shutdown.');
  }

  score = Math.min(score, 100);

  let risk_level: RiskLevel;
  if (score >= 80) risk_level = 'CRITICAL';
  else if (score >= 60) risk_level = 'HIGH';
  else if (score >= 30) risk_level = 'MEDIUM';
  else risk_level = 'LOW';

  return { risk_score: Math.round(score), risk_level, reasons, recommendations };
}

// ─── Prediction Engine (exact from backend) ─────────────────

function computePredictions(gas: number, temp: number, pressure: number): Prediction[] {
  const predictions: Prediction[] = [];

  if (gas >= 55) {
    predictions.push({ parameter: 'Gas', prediction: 'Critical gas concentration expected within 1 minute.', confidence: 96 });
  } else if (gas >= 40) {
    predictions.push({ parameter: 'Gas', prediction: 'Gas concentration increasing. Critical level expected within 3 minutes.', confidence: 89 });
  }

  if (temp >= 470) {
    predictions.push({ parameter: 'Temperature', prediction: 'Boiler overheating likely within 2 minutes.', confidence: 93 });
  } else if (temp >= 445) {
    predictions.push({ parameter: 'Temperature', prediction: 'Temperature rising steadily.', confidence: 82 });
  }

  if (pressure >= 8) {
    predictions.push({ parameter: 'Pressure', prediction: 'Pressure may exceed safe operating limit soon.', confidence: 94 });
  } else if (pressure >= 6) {
    predictions.push({ parameter: 'Pressure', prediction: 'Pressure increasing continuously.', confidence: 83 });
  }

  if (predictions.length === 0) {
    predictions.push({ parameter: 'System', prediction: 'Plant expected to remain stable.', confidence: 98 });
  }

  return predictions;
}

// ─── Geospatial Risk Propagation (exact from backend) ───────

function computeGeoMap(incidentZone: ZoneName): Record<ZoneName, RiskLevel> {
  const geoMap: Record<string, RiskLevel> = {};

  // Initialize all as LOW
  for (const zone of ZONE_NAMES) {
    geoMap[zone] = 'LOW';
  }

  // Incident zone = CRITICAL
  geoMap[incidentZone] = 'CRITICAL';

  // Immediate neighbors = HIGH
  const immediateNeighbors = ZONE_NEIGHBORS[incidentZone] || [];
  for (const neighbor of immediateNeighbors) {
    geoMap[neighbor] = 'HIGH';
  }

  // Second-degree neighbors = MEDIUM
  for (const neighbor of immediateNeighbors) {
    const secondDegree = ZONE_NEIGHBORS[neighbor] || [];
    for (const secondNeighbor of secondDegree) {
      if (secondNeighbor !== incidentZone && geoMap[secondNeighbor] === 'LOW') {
        geoMap[secondNeighbor] = 'MEDIUM';
      }
    }
  }

  return geoMap as Record<ZoneName, RiskLevel>;
}

// ─── Risk Map Builder ───────────────────────────────────────

function buildRiskMap(incidentZone: ZoneName, scenarioRiskLevel: RiskLevel): Record<ZoneName, ZoneRisk> {
  const riskMap: Record<string, ZoneRisk> = {};
  for (const zone of ZONE_NAMES) {
    riskMap[zone] = {
      risk: zone === incidentZone ? scenarioRiskLevel : 'LOW',
      camera: CAMERA_MAP[zone],
      hazard: HAZARD_MAP[zone],
    };
  }
  return riskMap as Record<ZoneName, ZoneRisk>;
}

// ─── Worker Generator ───────────────────────────────────────

function generateWorkers(count: number, zone: ZoneName): Worker[] {
  const workers: Worker[] = [];
  for (let i = 0; i < count; i++) {
    workers.push({
      id: `W${String(i + 1).padStart(3, '0')}`,
      name: WORKER_NAMES[i % WORKER_NAMES.length],
      zone,
      helmet: Math.random() < 0.75,
      vest: Math.random() < 0.75,
      status: WORKER_STATUSES[Math.floor(Math.random() * WORKER_STATUSES.length)],
    });
  }
  return workers;
}

function generateWorkersFromVision(
  vision: Record<string, any>,
  scenarioZone: ZoneName,
  scenarioWorkers: number,
): Worker[] {
  const ZONE_TO_CAMERA_KEY: Record<string, string> = {
    'Boiler Room': 'camera_1',
    'Gas Pipeline': 'camera_2',
    'Coke Oven Battery': 'camera_3',
    'Valve Station': 'camera_4',
    'Storage Tank': 'camera_5',
  };

  const workers: Worker[] = [];
  let workerIdCounter = 1;

  const allZones: ZoneName[] = [
    'Boiler Room',
    'Gas Pipeline',
    'Coke Oven Battery',
    'Valve Station',
    'Storage Tank',
    'Control Room',
  ];

  for (const zone of allZones) {
    const cameraKey = ZONE_TO_CAMERA_KEY[zone];
    const cameraData = cameraKey ? vision[cameraKey] : null;

    let personCount = 0;
    let helmetCount = 0;
    let vestCount = 0;

    if (cameraData) {
      personCount = cameraData.person_count;
      helmetCount = cameraData.helmet_count;
      vestCount = cameraData.vest_count;
    } else {
      if (zone === scenarioZone) {
        personCount = scenarioWorkers;
      } else {
        personCount = 0;
      }
      helmetCount = personCount;
      vestCount = personCount;
    }

    for (let i = 0; i < personCount; i++) {
      const hasHelmet = i < helmetCount;
      const hasVest = i < vestCount;

      workers.push({
        id: `W${String(workerIdCounter).padStart(3, '0')}`,
        name: WORKER_NAMES[(workerIdCounter - 1) % WORKER_NAMES.length],
        zone,
        helmet: hasHelmet,
        vest: hasVest,
        status: WORKER_STATUSES[Math.floor(Math.random() * WORKER_STATUSES.length)],
      });
      workerIdCounter++;
    }
  }

  return workers;
}

// ─── Executive Summary Generator ────────────────────────────

function generateExecutiveSummary(
  incident: IncidentType,
  zone: ZoneName,
  riskLevel: RiskLevel,
  riskScore: number,
  gas: number,
  temp: number,
  pressure: number,
  reasons: string[],
  recommendations: string[],
): string {
  if (riskLevel === 'LOW' && incident === 'Normal Operation') {
    return `All plant parameters are within normal operating ranges. Gas concentration is at ${gas.toFixed(1)}ppm, temperature is at ${temp.toFixed(0)}°C, and pressure is at ${pressure.toFixed(1)} bar — all well within safe limits. Continuous monitoring is active across all 6 zones. No immediate intervention required. Safety systems are fully operational and all permits are clear.`;
  }

  const neighbors = ZONE_NEIGHBORS[zone] || [];
  const neighborList = neighbors.length > 0 ? neighbors.join(' and ') : 'no adjacent zones';
  const cleanReason = (r: string) => r.endsWith('.') ? r : `${r}.`;
  const primaryReason = reasons.length > 0 ? cleanReason(reasons[0]) : '';
  const primaryRec = recommendations.length > 0 ? cleanReason(recommendations[0]) : 'Continue monitoring all parameters.';
  const reasonSpaced = primaryReason ? `${primaryReason} ` : '';

  return `${incident} has been detected in ${zone}. Risk level is ${riskLevel} with a score of ${riskScore}%. ${reasonSpaced}Current sensor readings show gas at ${gas.toFixed(1)}ppm, temperature at ${temp.toFixed(0)}°C, and pressure at ${pressure.toFixed(1)} bar. ${primaryRec} Immediate supervisor notification has been triggered. All personnel in ${zone} and neighboring zones ${neighborList} should be on standby for evacuation.`;
}

// ─── Sensor State ───────────────────────────────────────────

function computeSensorState(gas: number, temp: number, pressure: number): 'NORMAL' | 'WARNING' | 'CRITICAL' {
  if (gas > 60 || temp > 480 || pressure > 8.5) return 'CRITICAL';
  if (gas > 35 || temp > 450 || pressure > 7) return 'WARNING';
  return 'NORMAL';
}

// ─── Plant State ────────────────────────────────────────────

function computePlantState(riskLevel: RiskLevel): 'NORMAL' | 'WARNING' | 'CRITICAL' {
  if (riskLevel === 'CRITICAL') return 'CRITICAL';
  if (riskLevel === 'HIGH' || riskLevel === 'MEDIUM') return 'WARNING';
  return 'NORMAL';
}

// ─── The Engine ─────────────────────────────────────────────

class MockEngine {
  private state: EngineState;
  private listeners: Set<(report: LiveReport) => void> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.state = createInitialState();
    this.state.workers = generateWorkers(
      SCENARIOS.NORMAL_OPERATION.workers,
      SCENARIOS.NORMAL_OPERATION.zone,
    );
  }

  setScenario(scenarioKey: ScenarioKey): void {
    this.state.currentScenario = scenarioKey;
    const scenario = SCENARIOS[scenarioKey];
    // Generate new workers for the new scenario
    this.state.workers = generateWorkers(scenario.workers, scenario.zone);
  }

  getScenarioKey(): ScenarioKey {
    return this.state.currentScenario;
  }

  tick(): LiveReport {
    const scenario = SCENARIOS[this.state.currentScenario];

    // Smooth sensor values toward targets
    this.state.gas_ppm = clamp(
      smoothSensor(this.state.gas_ppm, scenario.gas_target, 0.8), 0, 200,
    );
    this.state.temperature_c = clamp(
      smoothSensor(this.state.temperature_c, scenario.temp_target, 1.0), 200, 600,
    );
    this.state.pressure_bar = clamp(
      smoothSensor(this.state.pressure_bar, scenario.pressure_target, 0.05), 1, 15,
    );
    this.state.humidity_percent = clamp(
      smoothSensor(this.state.humidity_percent, scenario.humidity_target, 0.3), 20, 100,
    );

    const gas = this.state.gas_ppm;
    const temp = this.state.temperature_c;
    const pressure = this.state.pressure_bar;

    // Compute risk
    const masterAI = computeRisk(
      gas, temp, pressure,
      scenario.maintenance, scenario.permit, scenario.incident,
    );

    // Compute predictions
    const predictions = computePredictions(gas, temp, pressure);

    // Compute geo map
    const geoMap = computeGeoMap(scenario.zone);

    // Build risk map — use computed risk_level not scenario static level
    const riskMap = buildRiskMap(scenario.zone, masterAI.risk_level);

    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(
      scenario.incident, scenario.zone, masterAI.risk_level, masterAI.risk_score,
      gas, temp, pressure, masterAI.reasons, masterAI.recommendations,
    );

    // Build sensor data
    const sensor: SensorData = {
      timestamp: formatTimestamp(),
      gas_ppm: Math.round(gas * 10) / 10,
      temperature_c: Math.round(temp * 10) / 10,
      pressure_bar: Math.round(pressure * 100) / 100,
      humidity_percent: Math.round(this.state.humidity_percent * 10) / 10,
      sensor_state: computeSensorState(gas, temp, pressure),
    };

    // Build plant info
    const plant: PlantInfo = {
      incident: scenario.incident,
      state: computePlantState(masterAI.risk_level),
      zone: scenario.zone,
      permit: scenario.permit,
      maintenance: scenario.maintenance,
    };

    // Generate alert if risk is not LOW
    if (masterAI.risk_level !== 'LOW') {
      const desc = masterAI.reasons.length > 0 ? masterAI.reasons[0] : `${scenario.incident} detected`;
      const lastAlert = this.state.alertHistory[0];
      // Only add if different from last alert
      if (!lastAlert || lastAlert.zone !== scenario.zone || lastAlert.riskLevel !== masterAI.risk_level) {
        alertIdCounter++;
        this.state.alertHistory.unshift({
          id: `ALT-${String(alertIdCounter).padStart(4, '0')}`,
          timestamp: formatTimestamp(),
          zone: scenario.zone,
          description: desc,
          riskLevel: masterAI.risk_level,
        });
        // Keep only 20 most recent
        if (this.state.alertHistory.length > 20) {
          this.state.alertHistory = this.state.alertHistory.slice(0, 20);
        }
      }
    }

    const vision: Record<string, any> = {
      camera_1: { person_count: 2, helmet_count: 2, vest_count: 2, fire_detected: false, smoke_detected: false, detections: [{ label: 'person', confidence: 0.94 }] },
      camera_2: { person_count: 1, helmet_count: 1, vest_count: 1, fire_detected: false, smoke_detected: false, detections: [{ label: 'person', confidence: 0.88 }] },
      camera_3: { person_count: 3, helmet_count: 2, vest_count: 3, fire_detected: false, smoke_detected: false, detections: [{ label: 'person', confidence: 0.95 }] },
      camera_4: { person_count: 0, helmet_count: 0, vest_count: 0, fire_detected: false, smoke_detected: false, detections: [] },
      camera_5: { person_count: 1, helmet_count: 1, vest_count: 0, fire_detected: false, smoke_detected: false, detections: [{ label: 'person', confidence: 0.91 }] },
    };

    if (scenario.zone === 'Coke Oven Battery' && masterAI.risk_level === 'CRITICAL') {
      vision.camera_3.fire_detected = true;
      vision.camera_3.smoke_detected = true;
      vision.camera_3.detections.push({ label: 'fire', confidence: 0.98 });
    }

    const report: LiveReport = {
      timestamp: formatTimestamp(),
      plant,
      sensor,
      master_ai: masterAI,
      risk_map: riskMap,
      geo_map: geoMap,
      prediction: predictions,
      executive_summary: executiveSummary,
      workers: generateWorkersFromVision(vision, scenario.zone, scenario.workers),
      vision,
    };

    return report;
  }

  getAlertHistory() {
    return this.state.alertHistory;
  }

  start(): void {
    if (this.intervalId) return;
    // Initial tick
    const report = this.tick();
    this.listeners.forEach((cb) => cb(report));

    this.intervalId = setInterval(() => {
      const r = this.tick();
      this.listeners.forEach((cb) => cb(r));
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(cb: (report: LiveReport) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

// ─── Singleton ──────────────────────────────────────────────

export const engine = new MockEngine();

export function setScenario(key: ScenarioKey): void {
  engine.setScenario(key);
}

export function getScenarioKey(): ScenarioKey {
  return engine.getScenarioKey();
}

export { SCENARIOS, ZONE_NEIGHBORS };
