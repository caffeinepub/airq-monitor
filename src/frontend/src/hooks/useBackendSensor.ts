import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./useActor";
import type { SensorReading } from "./useSensorData";

interface UseBackendSensorResult {
  liveReading: SensorReading | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  flaskUrl: string;
  setFlaskUrl: (url: string) => void;
  saveFlaskUrl: (url: string) => Promise<void>;
}

export function useBackendSensor(): UseBackendSensorResult {
  const { actor, isFetching } = useActor();
  const [flaskUrl, setFlaskUrl] = useState("");
  const [liveReading, setLiveReading] = useState<SensorReading | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastGoodReadingRef = useRef<SensorReading | null>(null);

  // Load saved Flask URL on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getFlaskUrl()
      .then((url) => {
        if (url) setFlaskUrl(url);
      })
      .catch(() => {
        // ignore
      });
  }, [actor, isFetching]);

  const fetchOnce = useCallback(async () => {
    if (!actor || !flaskUrl) return;
    try {
      const raw = await actor.fetchSensorData();
      const parsed = JSON.parse(raw) as {
        co2: number;
        nh3: number;
        co: number;
        temperature: number;
        humidity: number;
      };
      const reading: SensorReading = {
        timestamp: Date.now(),
        co2: parsed.co2,
        nh3: parsed.nh3,
        co: parsed.co,
        temperature: parsed.temperature,
        humidity: parsed.humidity,
      };
      lastGoodReadingRef.current = reading;
      setLiveReading(reading);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setIsConnected(false);
      setError(msg);
      if (lastGoodReadingRef.current) {
        setLiveReading(lastGoodReadingRef.current);
      }
      toast.error(`Flask connection failed: ${msg}`);
    }
  }, [actor, flaskUrl]);

  // Poll every 5s when flaskUrl is set
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!flaskUrl || !actor) return;

    setIsLoading(true);
    fetchOnce().finally(() => setIsLoading(false));

    intervalRef.current = setInterval(fetchOnce, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [flaskUrl, actor, fetchOnce]);

  const saveFlaskUrl = useCallback(
    async (url: string) => {
      if (!actor) return;
      try {
        await actor.setFlaskUrl(url);
        setFlaskUrl(url);
        toast.success("Flask URL saved. Connecting...");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to save URL: ${msg}`);
        throw err;
      }
    },
    [actor],
  );

  return {
    liveReading,
    isConnected,
    isLoading,
    error,
    flaskUrl,
    setFlaskUrl,
    saveFlaskUrl,
  };
}
