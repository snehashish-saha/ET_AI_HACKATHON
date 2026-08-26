import { useState, useEffect, useCallback } from 'react';
import type { LiveReport, ScenarioKey } from '../types/report';
import { API_BASE } from '../config';
import { engine } from '../mock/mockEngine';

interface UseLiveReportReturn {
  report: LiveReport;
  setScenario: (key: ScenarioKey) => void;
  currentScenario: ScenarioKey;
  alertHistory: Array<{
    id: string;
    timestamp: string;
    zone: string;
    description: string;
    riskLevel: string;
    status?: string;
    scenarioKey?: string;
    riskScore?: number;
    sensorVals?: { gas: number; temp: number; pressure: number };
    reasons?: string[];
    recommendations?: string[];
  }>;
  updateAlertStatus: (id: string, status: 'Active' | 'Acknowledged' | 'Resolved') => Promise<void>;
}

export function useLiveReport(): UseLiveReportReturn {
  const [report, setReport] = useState<LiveReport>(() => engine.tick());
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>('NORMAL_OPERATION');
  const [alertHistory, setAlertHistory] = useState<Array<any>>(() => engine.getAlertHistory() || []);

  useEffect(() => {
    let active = true;

    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE}/report`, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error('Network response not ok');
        const data: LiveReport = await res.json();

        if (!active) return;
        setReport(data);
      } catch (err) {
        // Fallback to local simulation engine when backend is offline/cold starting
        if (active) {
          setReport(engine.tick());
        }
      }

      try {
        const alertsRes = await fetch(`${API_BASE}/alerts`, { signal: AbortSignal.timeout(3000) });
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          if (active && Array.isArray(alertsData) && alertsData.length > 0) {
            setAlertHistory(alertsData);
          }
        }
      } catch (err) {
        if (active) {
          setAlertHistory(engine.getAlertHistory() || []);
        }
      }

      try {
        const scenRes = await fetch(`${API_BASE}/scenario`, { signal: AbortSignal.timeout(3000) });
        if (scenRes.ok) {
          const scenData = await scenRes.json();
          if (active && scenData.scenario) {
            setCurrentScenario(scenData.scenario as ScenarioKey);
          }
        }
      } catch (err) {
        if (active) {
          setCurrentScenario(engine.getScenarioKey());
        }
      }
    };

    fetchReport();
    const interval = setInterval(fetchReport, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const setScenario = useCallback((key: ScenarioKey) => {
    engine.setScenario(key);
    setCurrentScenario(key);
    fetch(`${API_BASE}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: key })
    }).catch(() => {});
  }, []);

  const updateAlertStatus = useCallback(async (id: string, status: 'Active' | 'Acknowledged' | 'Resolved') => {
    setAlertHistory((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    try {
      await fetch(`${API_BASE}/alerts/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      // Handled locally
    }
  }, []);

  return { report, setScenario, currentScenario, alertHistory, updateAlertStatus };
}
