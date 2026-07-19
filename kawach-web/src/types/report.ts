// ============================================================
// KAWACH — Report Data Contract Types
// These interfaces match the backend's generate_report() output
// field-for-field. Do not rename or omit any field.
// ============================================================

export type IncidentType =
  | 'Normal Operation'
  | 'Gas Leak'
  | 'Boiler Overheating'
  | 'Hot Work During Gas Leak'
  | 'Valve Failure'
  | 'Confined Space Entry';

export type PlantState = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PermitType = 'None' | 'Hot Work' | 'Mechanical' | 'Confined Space';

export type SensorState = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type WorkerStatus = 'Working' | 'Inspecting' | 'Walking';

export type PredictionParameter = 'Gas' | 'Temperature' | 'Pressure' | 'System';

export const ZONE_NAMES = [
  'Boiler Room',
  'Gas Pipeline',
  'Coke Oven Battery',
  'Valve Station',
  'Storage Tank',
  'Control Room',
] as const;

export type ZoneName = (typeof ZONE_NAMES)[number];

export const CAMERA_MAP: Record<ZoneName, string> = {
  'Boiler Room': 'CAM-01',
  'Gas Pipeline': 'CAM-02',
  'Coke Oven Battery': 'CAM-03',
  'Valve Station': 'CAM-04',
  'Storage Tank': 'CAM-05',
  'Control Room': 'CAM-06',
};

export const HAZARD_MAP: Record<ZoneName, string> = {
  'Boiler Room': 'High Temperature',
  'Gas Pipeline': 'Flammable Gas',
  'Coke Oven Battery': 'Explosion',
  'Valve Station': 'Pressure Build-up',
  'Storage Tank': 'Confined Space',
  'Control Room': 'Low',
};

export interface PlantInfo {
  incident: IncidentType;
  state: PlantState;
  zone: ZoneName;
  permit: PermitType;
  maintenance: boolean;
}

export interface SensorData {
  timestamp: string;
  gas_ppm: number;
  temperature_c: number;
  pressure_bar: number;
  humidity_percent: number;
  sensor_state: SensorState;
}

export interface MasterAI {
  risk_score: number;
  risk_level: RiskLevel;
  reasons: string[];
  recommendations: string[];
}

export interface ZoneRisk {
  risk: RiskLevel;
  camera: string;
  hazard: string;
}

export interface Prediction {
  parameter: PredictionParameter;
  prediction: string;
  confidence: number;
}

export interface Worker {
  id: string;
  name: string;
  zone: string;
  helmet: boolean;
  vest: boolean;
  status: WorkerStatus;
}

export interface CameraData {
  person_count: number;
  helmet_count: number;
  vest_count: number;
  fire_detected: boolean;
  smoke_detected: boolean;
  detections: Array<{ label: string; confidence: number }>;
}

export interface LiveReport {
  timestamp: string;
  plant: PlantInfo;
  sensor: SensorData;
  master_ai: MasterAI;
  risk_map: Record<ZoneName, ZoneRisk>;
  geo_map: Record<ZoneName, RiskLevel>;
  prediction: Prediction[];
  executive_summary: string;
  workers: Worker[];
  vision?: Record<string, CameraData>;
}

export type ScenarioKey =
  | 'NORMAL_OPERATION'
  | 'GAS_LEAK'
  | 'BOILER_OVERHEATING'
  | 'HOT_WORK_GAS_LEAK'
  | 'VALVE_FAILURE'
  | 'CONFINED_SPACE';

export interface ScenarioConfig {
  gas_target: number;
  temp_target: number;
  pressure_target: number;
  humidity_target: number;
  zone: ZoneName;
  permit: PermitType;
  maintenance: boolean;
  workers: number;
  risk_level: RiskLevel;
  incident: IncidentType;
}

export interface AlertHistoryEntry {
  id: string;
  timestamp: string;
  zone: ZoneName;
  incidentType: IncidentType;
  riskScore: number;
  riskLevel: RiskLevel;
  status: 'Resolved' | 'Active' | 'Acknowledged';
  duration: string;
}
