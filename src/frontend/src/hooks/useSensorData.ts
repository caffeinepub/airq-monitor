import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SensorReading {
  timestamp: number;
  co2: number;
  nh3: number;
  co: number;
  temperature: number;
  humidity: number;
}

export interface SensorStatus {
  co2: "safe" | "danger";
  nh3: "safe" | "danger";
  co: "safe" | "danger";
  temperature: "safe" | "danger";
  humidity: "safe" | "danger";
}

export interface SensorThresholds {
  co2: number;
  nh3: number;
  co: number;
  temperature: number;
  humidity: number;
}

export interface SensorAlert {
  id: string;
  timestamp: number;
  sensor: string;
  value: number;
  unit: string;
  threshold: number;
  status: "danger" | "warning";
}

export const THRESHOLDS: SensorThresholds = {
  co2: 1000,
  nh3: 25,
  co: 15,
  temperature: 35,
  humidity: 70,
};

const SENSOR_UNITS: Record<string, string> = {
  co2: "ppm",
  nh3: "ppm",
  co: "ppm",
  temperature: "°C",
  humidity: "%",
};

const BASELINES = { co2: 650, nh3: 12, co: 8, temperature: 26, humidity: 55 };
const RANGES = {
  co2: [400, 1500],
  nh3: [5, 50],
  co: [2, 35],
  temperature: [18, 40],
  humidity: [30, 80],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fluctuate(
  current: number,
  baseline: number,
  range: number[],
  factor = 0.05,
) {
  const delta = (Math.random() - 0.5) * (range[1] - range[0]) * factor;
  const drift = (baseline - current) * 0.03;
  return clamp(current + delta + drift, range[0], range[1]);
}

function generateReading(prev: SensorReading): SensorReading {
  return {
    timestamp: Date.now(),
    co2: fluctuate(prev.co2, BASELINES.co2, RANGES.co2),
    nh3: fluctuate(prev.nh3, BASELINES.nh3, RANGES.nh3),
    co: fluctuate(prev.co, BASELINES.co, RANGES.co),
    temperature: fluctuate(
      prev.temperature,
      BASELINES.temperature,
      RANGES.temperature,
      0.02,
    ),
    humidity: fluctuate(
      prev.humidity,
      BASELINES.humidity,
      RANGES.humidity,
      0.03,
    ),
  };
}

function initialReading(): SensorReading {
  return {
    timestamp: Date.now(),
    co2: BASELINES.co2 + (Math.random() - 0.5) * 100,
    nh3: BASELINES.nh3 + (Math.random() - 0.5) * 5,
    co: BASELINES.co + (Math.random() - 0.5) * 3,
    temperature: BASELINES.temperature + (Math.random() - 0.5) * 2,
    humidity: BASELINES.humidity + (Math.random() - 0.5) * 8,
  };
}

export function useSensorData(historySize = 50) {
  const [history, setHistory] = useState<SensorReading[]>(() => [
    initialReading(),
  ]);
  const [cumulativeRisk, setCumulativeRisk] = useState(0);
  const [riskHistory, setRiskHistory] = useState<
    { timestamp: number; score: number }[]
  >([]);
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cumulativeRiskRef = useRef(0);
  const prevStatusRef = useRef<SensorStatus | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const next = generateReading(last);
        return [...prev.slice(-historySize + 1), next];
      });
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [historySize]);

  const current = history[history.length - 1];

  const status: SensorStatus = useMemo(
    () => ({
      co2: current.co2 > THRESHOLDS.co2 ? "danger" : "safe",
      nh3: current.nh3 > THRESHOLDS.nh3 ? "danger" : "safe",
      co: current.co > THRESHOLDS.co ? "danger" : "safe",
      temperature:
        current.temperature > THRESHOLDS.temperature ? "danger" : "safe",
      humidity: current.humidity > THRESHOLDS.humidity ? "danger" : "safe",
    }),
    [current],
  );

  const isAnyDanger = Object.values(status).some((s) => s === "danger");

  const co2Norm = clamp((current.co2 - 400) / (1500 - 400), 0, 1);
  const nh3Norm = clamp((current.nh3 - 5) / (50 - 5), 0, 1);
  const diseaseProb = clamp(co2Norm * 0.6 + nh3Norm * 0.4, 0, 1);

  const coNorm = clamp((current.co - 2) / (35 - 2), 0, 1);
  const tempNorm = clamp((current.temperature - 18) / (40 - 18), 0, 1);
  const humidDev = Math.abs(current.humidity - 50) / 30;
  const cardioScore = Math.round(
    (coNorm * 0.5 + tempNorm * 0.3 + humidDev * 0.2) * 100,
  );

  const baseAQI = Math.round(
    co2Norm * 40 + nh3Norm * 30 + coNorm * 20 + tempNorm * 5 + humidDev * 5,
  );

  // Alert tracking: detect safe -> danger transitions
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    if (prevStatus) {
      const sensorKeys: Array<keyof SensorStatus> = [
        "co2",
        "nh3",
        "co",
        "temperature",
        "humidity",
      ];
      const sensorValues: Record<keyof SensorStatus, number> = {
        co2: current.co2,
        nh3: current.nh3,
        co: current.co,
        temperature: current.temperature,
        humidity: current.humidity,
      };
      const sensorNames: Record<keyof SensorStatus, string> = {
        co2: "Carbon Dioxide",
        nh3: "Ammonia",
        co: "Carbon Monoxide",
        temperature: "Temperature",
        humidity: "Humidity",
      };
      const newAlerts: SensorAlert[] = [];
      for (const key of sensorKeys) {
        if (prevStatus[key] === "safe" && status[key] === "danger") {
          newAlerts.push({
            id: `${key}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now(),
            sensor: sensorNames[key],
            value: sensorValues[key],
            unit: SENSOR_UNITS[key],
            threshold: THRESHOLDS[key],
            status: "danger",
          });
        }
      }
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 100));
      }
    }
    prevStatusRef.current = status;
  }, [status, current]);

  useEffect(() => {
    const riskIncrement = diseaseProb * 0.5 + (cardioScore / 100) * 0.5;
    const newScore = cumulativeRiskRef.current + riskIncrement;
    cumulativeRiskRef.current = newScore;
    setCumulativeRisk(newScore);
    setRiskHistory((prev) => [
      ...prev.slice(-29),
      { timestamp: Date.now(), score: newScore },
    ]);
  }, [diseaseProb, cardioScore]);

  const resetCumulativeRisk = useCallback(() => {
    cumulativeRiskRef.current = 0;
    setCumulativeRisk(0);
    setRiskHistory([]);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    history,
    current,
    status,
    isAnyDanger,
    diseaseProb,
    cardioScore,
    baseAQI,
    cumulativeRisk,
    riskHistory,
    resetCumulativeRisk,
    alerts,
    clearAlerts,
  };
}
