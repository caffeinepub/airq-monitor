import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CloudFog,
  Download,
  Droplets,
  FlaskConical,
  Loader2,
  Radio,
  Thermometer,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSensor } from "../App";
import { useBackendSensor } from "../hooks/useBackendSensor";
import type { SensorReading, SensorStatus } from "../hooks/useSensorData";
import { THRESHOLDS } from "../hooks/useSensorData";

const CYAN = "#2EE6D6";
const VIOLET = "#7C5CFF";
const GREEN = "#2ED47A";
const AMBER = "#FFB020";
const RED = "#FF4D4F";

function useRelativeTime(timestamp: number) {
  const [rel, setRel] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - timestamp) / 1000);
      if (diff < 5) setRel("just now");
      else if (diff < 60) setRel(`${diff}s ago`);
      else setRel(`${Math.floor(diff / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timestamp]);
  return rel;
}

function getThresholdPct(key: keyof typeof THRESHOLDS, value: number) {
  const maxMap: Record<string, number> = {
    co2: 1500,
    nh3: 50,
    co: 35,
    temperature: 45,
    humidity: 100,
  };
  return Math.min((value / maxMap[key]) * 100, 100);
}

function getProgressColor(pct: number) {
  if (pct < 50) return GREEN;
  if (pct < 75) return AMBER;
  return RED;
}

interface SensorCardProps {
  sensorKey: keyof typeof THRESHOLDS;
  label: string;
  unit: string;
  value: number;
  status: "safe" | "danger";
  data: number[];
  icon: React.ElementType;
  color: string;
  decimals?: number;
  updatedAt: number;
}

function SensorCard({
  sensorKey,
  label,
  unit,
  value,
  status,
  data,
  icon: Icon,
  color,
  decimals = 0,
  updatedAt,
}: SensorCardProps) {
  const sparkData = data.map((v, i) => ({ i, v }));
  const isDanger = status === "danger";
  const pct = getThresholdPct(sensorKey, value);
  const progressColor = getProgressColor(pct);
  const relTime = useRelativeTime(updatedAt);

  return (
    <div
      data-ocid="dashboard.sensor.card"
      className={`glass-card p-4 border ${
        isDanger
          ? "border-danger/50 shadow-[0_0_12px_-3px_rgba(255,77,79,0.35)]"
          : "border-success/30"
      } transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">
            {value.toFixed(decimals)}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
          <span>Threshold usage</span>
          <span>{pct.toFixed(0)}% of max</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ background: progressColor }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isDanger
              ? "bg-danger/15 text-danger border border-danger/30"
              : "bg-success/15 text-success border border-success/30"
          }`}
        >
          {isDanger ? "DANGER" : "SAFE"}
        </span>
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isDanger ? RED : color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/50 mt-1 text-right">
        Updated {relTime}
      </p>
    </div>
  );
}

function AQIGauge({ aqi }: { aqi: number }) {
  const clamped = Math.min(aqi, 100);
  let color = GREEN;
  let label = "Good";
  if (clamped >= 60) {
    color = RED;
    label = "Hazardous";
  } else if (clamped >= 40) {
    color = AMBER;
    label = "Unhealthy";
  } else if (clamped >= 20) {
    color = "#FFB020";
    label = "Moderate";
  }

  const gaugeData = [
    { name: "AQI", value: clamped, fill: color },
    { name: "Remaining", value: 100 - clamped, fill: "rgba(255,255,255,0.05)" },
  ];

  return (
    <div className="glass-card p-5 flex flex-col items-center">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Air Quality Index
      </h3>
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="85%"
            startAngle={225}
            endAngle={-45}
            data={gaugeData}
            barSize={12}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              isAnimationActive={true}
            >
              {gaugeData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {clamped}
          </span>
          <span className="text-[10px] font-semibold" style={{ color }}>
            {label}
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        {[
          [0, 20, GREEN, "Good"],
          [20, 40, AMBER, "Mod"],
          [40, 60, "#FF7A20", "Unhealthy"],
          [60, 100, RED, "Hazard"],
        ].map(([, , c, l]) => (
          <div key={String(l)} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: String(c) }}
            />
            <span className="text-[9px] text-muted-foreground">
              {String(l)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatus(reading: SensorReading): SensorStatus {
  return {
    co2: reading.co2 > THRESHOLDS.co2 ? "danger" : "safe",
    nh3: reading.nh3 > THRESHOLDS.nh3 ? "danger" : "safe",
    co: reading.co > THRESHOLDS.co ? "danger" : "safe",
    temperature:
      reading.temperature > THRESHOLDS.temperature ? "danger" : "safe",
    humidity: reading.humidity > THRESHOLDS.humidity ? "danger" : "safe",
  };
}

interface ConnectionPanelProps {
  isConnected: boolean;
  isLoading: boolean;
  flaskUrl: string;
  saveFlaskUrl: (url: string) => Promise<void>;
}

function ConnectionPanel({
  isConnected,
  isLoading,
  flaskUrl,
  saveFlaskUrl,
}: ConnectionPanelProps) {
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const displayUrl = inputUrl || flaskUrl;

  const handleConnect = async () => {
    const url = inputUrl.trim() || flaskUrl.trim();
    if (!url) return;
    setSaving(true);
    try {
      await saveFlaskUrl(url);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card border border-white/8 overflow-hidden">
      <button
        data-ocid="dashboard.connection.toggle"
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Radio className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Data Source
          </span>
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
          ) : isConnected ? (
            <Badge
              data-ocid="dashboard.connection.success_state"
              className="text-[10px] h-4 px-1.5 bg-success/15 text-success border border-success/30 font-bold tracking-wider"
            >
              ● LIVE
            </Badge>
          ) : (
            <Badge
              data-ocid="dashboard.connection.loading_state"
              className="text-[10px] h-4 px-1.5 bg-white/8 text-muted-foreground border border-white/10 font-bold tracking-wider"
            >
              ○ SIMULATED
            </Badge>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/6">
              <p className="text-xs text-muted-foreground mb-3">
                Enter your Python/Flask server URL to switch from simulated to
                live sensor data.
              </p>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label
                    htmlFor="flask-url"
                    className="text-[11px] text-muted-foreground mb-1.5 block"
                  >
                    Flask API URL
                  </Label>
                  <Input
                    data-ocid="dashboard.connection.input"
                    id="flask-url"
                    value={displayUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="http://192.168.1.10:5000"
                    className="h-8 text-xs bg-white/5 border-white/12 focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <Button
                  data-ocid="dashboard.connection.submit_button"
                  size="sm"
                  onClick={handleConnect}
                  disabled={saving || !displayUrl.trim()}
                  className="h-8 px-4 text-xs bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30"
                >
                  {saving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function exportCSV(history: SensorReading[]) {
  const headers = [
    "timestamp",
    "co2_ppm",
    "nh3_ppm",
    "co_ppm",
    "temperature_c",
    "humidity_pct",
  ];
  const rows = history.map((r) => [
    new Date(r.timestamp).toISOString(),
    r.co2.toFixed(1),
    r.nh3.toFixed(2),
    r.co.toFixed(2),
    r.temperature.toFixed(1),
    r.humidity.toFixed(1),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `airq-data-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const simulated = useSensor();
  const { liveReading, isConnected, isLoading, flaskUrl, saveFlaskUrl } =
    useBackendSensor();

  const current: SensorReading =
    isConnected && liveReading ? liveReading : simulated.current;
  const status: SensorStatus =
    isConnected && liveReading ? getStatus(liveReading) : simulated.status;
  const isAnyDanger = Object.values(status).some((s) => s === "danger");
  const { diseaseProb, cardioScore, cumulativeRisk, baseAQI, history } =
    simulated;

  const chartData = simulated.history.map((r, i) => ({
    t: i,
    CO2: Math.round(r.co2),
    NH3: +r.nh3.toFixed(1),
    CO: +r.co.toFixed(1),
    Temp: +r.temperature.toFixed(1),
    Humidity: Math.round(r.humidity),
  }));

  const last20 = simulated.history.slice(-20);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <ConnectionPanel
        isConnected={isConnected}
        isLoading={isLoading}
        flaskUrl={flaskUrl}
        saveFlaskUrl={saveFlaskUrl}
      />

      <AnimatePresence>
        {isAnyDanger && (
          <motion.div
            data-ocid="dashboard.danger.error_state"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-danger/15 border border-danger/40 text-danger"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="text-sm font-semibold">
              ⚠ Dangerous air quality detected — immediate ventilation
              recommended
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AQI Gauge + Health Index */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AQIGauge aqi={baseAQI} />
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Disease Risk</p>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  diseaseProb > 0.6 ? RED : diseaseProb > 0.4 ? AMBER : GREEN,
              }}
            >
              {(diseaseProb * 100).toFixed(0)}%
            </p>
            <Progress value={diseaseProb * 100} className="h-1.5 mt-2" />
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Cardio Score</p>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  cardioScore > 75 ? RED : cardioScore > 50 ? AMBER : GREEN,
              }}
            >
              {cardioScore}
            </p>
            <Progress value={cardioScore} className="h-1.5 mt-2" />
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Cumulative Risk
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  cumulativeRisk > 100
                    ? RED
                    : cumulativeRisk > 50
                      ? AMBER
                      : GREEN,
              }}
            >
              {cumulativeRisk.toFixed(1)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              session total
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <SensorCard
          sensorKey="co2"
          label="Carbon Dioxide"
          unit="ppm"
          value={current.co2}
          status={status.co2}
          data={last20.map((r) => r.co2)}
          icon={CloudFog}
          color={CYAN}
          updatedAt={current.timestamp}
        />
        <SensorCard
          sensorKey="nh3"
          label="Ammonia"
          unit="ppm"
          value={current.nh3}
          status={status.nh3}
          data={last20.map((r) => r.nh3)}
          icon={FlaskConical}
          color={VIOLET}
          decimals={1}
          updatedAt={current.timestamp}
        />
        <SensorCard
          sensorKey="co"
          label="Carbon Monoxide"
          unit="ppm"
          value={current.co}
          status={status.co}
          data={last20.map((r) => r.co)}
          icon={Wind}
          color={AMBER}
          decimals={1}
          updatedAt={current.timestamp}
        />
        <SensorCard
          sensorKey="temperature"
          label="Temperature"
          unit="°C"
          value={current.temperature}
          status={status.temperature}
          data={last20.map((r) => r.temperature)}
          icon={Thermometer}
          color={RED}
          decimals={1}
          updatedAt={current.timestamp}
        />
        <SensorCard
          sensorKey="humidity"
          label="Humidity"
          unit="%"
          value={current.humidity}
          status={status.humidity}
          data={last20.map((r) => r.humidity)}
          icon={Droplets}
          color={GREEN}
          updatedAt={current.timestamp}
        />
      </div>

      {/* Chart */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Live Sensor Readings — Last 50 Updates
          </h2>
          <Button
            data-ocid="dashboard.export.button"
            size="sm"
            variant="outline"
            onClick={() => exportCSV(history)}
            className="h-7 px-3 text-xs gap-1.5 border-border text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </Button>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis dataKey="t" hide />
              <YAxis
                tick={{ fill: "#9AA8C7", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(17,28,46,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: "#EAF1FF",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#9AA8C7" }} />
              <Line
                type="monotone"
                dataKey="CO2"
                stroke={CYAN}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="NH3"
                stroke={VIOLET}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="CO"
                stroke={AMBER}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="Temp"
                stroke={RED}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="Humidity"
                stroke="#2ED47A"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Safety Thresholds
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "CO₂", threshold: "1000 ppm" },
            { label: "NH₃", threshold: "25 ppm" },
            { label: "CO", threshold: "15 ppm" },
            { label: "Temp", threshold: "35°C" },
            { label: "Humidity", threshold: "70%" },
          ].map(({ label, threshold }) => (
            <div
              key={label}
              className="text-center px-3 py-2 rounded-lg bg-white/3"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xs font-semibold text-warning">
                ≤ {threshold}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
