// ============================================================
// WEBSOCKET INTEGRATION POINT
// Replace the setInterval mock below with:
// const ws = new WebSocket('ws://<backend-host>/ws/live');
// ws.onmessage = (e) => setReport(JSON.parse(e.data));
// Remove the setInterval and tick() calls entirely.
// The hook's return shape does not change — zero component rewrites.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { LiveReport, ScenarioKey } from '../types/report';

interface UseLiveReportReturn {
  report: LiveReport | null;
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

let alertIdCounter = 0;

export function useLiveReport(): UseLiveReportReturn {
  const [report, setReport] = useState<LiveReport | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>('NORMAL_OPERATION');
  const [alertHistory, setAlertHistory] = useState<Array<{
    id: string;
    timestamp: string;
    zone: string;
    description: string;
    riskLevel: string;
  }>>([]);

  useEffect(() => {
    let active = true;

    const fetchReport = async () => {
      try {
        const res = await fetch('http://localhost:8000/report');
        if (!res.ok) throw new Error('Network response not ok');
        const data: LiveReport = await res.json();

        if (!active) return;
        setReport(data);
      } catch (err) {
        console.error("Error fetching live report from backend:", err);
      }

      try {
        const alertsRes = await fetch('http://localhost:8000/alerts');
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          if (active) {
            setAlertHistory(alertsData);
          }
        }
      } catch (err) {
        console.error("Error fetching alert history from backend:", err);
      }

      try {
        const scenRes = await fetch('http://localhost:8000/scenario');
        if (scenRes.ok) {
          const scenData = await scenRes.json();
          if (active) {
            setCurrentScenario(scenData.scenario as ScenarioKey);
          }
        }
      } catch (err) {
        console.error("Error fetching scenario from backend:", err);
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
    fetch('http://localhost:8000/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: key })
    }).catch((err) => console.error("Error setting scenario:", err));
  }, []);

  const updateAlertStatus = useCallback(async (id: string, status: 'Active' | 'Acknowledged' | 'Resolved') => {
    try {
      const res = await fetch(`http://localhost:8000/alerts/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAlertHistory((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } catch (err) {
      console.error("Error updating alert status:", err);
    }
  }, []);

  return { report, setScenario, currentScenario, alertHistory, updateAlertStatus };
}
