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
import { engine, setScenario as engineSetScenario } from '../mock/mockEngine';

interface UseLiveReportReturn {
  report: LiveReport | null;
  setScenario: (key: ScenarioKey) => void;
  alertHistory: Array<{
    id: string;
    timestamp: string;
    zone: string;
    description: string;
    riskLevel: string;
  }>;
}

export function useLiveReport(): UseLiveReportReturn {
  const [report, setReport] = useState<LiveReport | null>(null);
  const [alertHistory, setAlertHistory] = useState<Array<{
    id: string;
    timestamp: string;
    zone: string;
    description: string;
    riskLevel: string;
  }>>([]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newReport) => {
      setReport(newReport);
      setAlertHistory([...engine.getAlertHistory()]);
    });

    engine.start();

    return () => {
      unsubscribe();
      engine.stop();
    };
  }, []);

  const setScenario = useCallback((key: ScenarioKey) => {
    engineSetScenario(key);
  }, []);

  return { report, setScenario, alertHistory };
}
