import { Button } from "@/components/ui/button";
import {
  CloudFog,
  Droplets,
  FlaskConical,
  ShieldCheck,
  Thermometer,
  Trash2,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSensor } from "../App";
import type { SensorAlert } from "../hooks/useSensorData";

const SENSOR_ICONS: Record<string, React.ElementType> = {
  "Carbon Dioxide": CloudFog,
  Ammonia: FlaskConical,
  "Carbon Monoxide": Wind,
  Temperature: Thermometer,
  Humidity: Droplets,
};

const SENSOR_COLORS: Record<string, string> = {
  "Carbon Dioxide": "#2EE6D6",
  Ammonia: "#7C5CFF",
  "Carbon Monoxide": "#FFB020",
  Temperature: "#FF4D4F",
  Humidity: "#2ED47A",
};

function useRelativeTime(timestamp: number, refreshInterval = 30000) {
  const [rel, setRel] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - timestamp) / 1000);
      if (diff < 5) setRel("just now");
      else if (diff < 60) setRel(`${diff}s ago`);
      else if (diff < 3600) setRel(`${Math.floor(diff / 60)} min ago`);
      else setRel(`${Math.floor(diff / 3600)}h ago`);
    };
    update();
    const id = setInterval(update, refreshInterval);
    return () => clearInterval(id);
  }, [timestamp, refreshInterval]);
  return rel;
}

function AlertItem({ alert, index }: { alert: SensorAlert; index: number }) {
  const Icon = SENSOR_ICONS[alert.sensor] ?? Wind;
  const color = SENSOR_COLORS[alert.sensor] ?? "#9AA8C7";
  const rel = useRelativeTime(alert.timestamp);
  const isDanger = alert.status === "danger";

  return (
    <motion.div
      data-ocid={`alerts.item.${index + 1}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className={`relative flex items-start gap-3 p-4 rounded-xl bg-white/3 border ${
        isDanger ? "border-danger/30" : "border-warning/30"
      } overflow-hidden`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
          isDanger ? "bg-danger" : "bg-warning"
        }`}
      />

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ml-1"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDanger
                ? "bg-danger/20 text-danger border border-danger/40"
                : "bg-warning/20 text-warning border border-warning/40"
            }`}
          >
            {isDanger ? "DANGER" : "WARNING"}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {alert.sensor}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Measured{" "}
          <span className="text-foreground font-mono font-semibold">
            {alert.value.toFixed(alert.unit === "ppm" ? 1 : 0)}
            {alert.unit}
          </span>{" "}
          — threshold is{" "}
          <span className="text-warning font-mono">
            {alert.threshold}
            {alert.unit}
          </span>
        </p>
      </div>

      <div className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
        {rel}
      </div>
    </motion.div>
  );
}

export default function Alerts() {
  const { alerts, clearAlerts } = useSensor();

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Session Alert Log
          </h2>
          {alerts.length > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30">
              {alerts.length}
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <Button
            data-ocid="alerts.clear.delete_button"
            size="sm"
            variant="outline"
            onClick={clearAlerts}
            className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-danger border-border hover:border-danger/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {alerts.length === 0 ? (
          <motion.div
            data-ocid="alerts.empty_state"
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              All Systems Normal
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              No threshold breaches have been detected in this session. Air
              quality is within safe parameters.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-success">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Monitoring active
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-xs text-muted-foreground mb-1">
              Showing {alerts.length} alert{alerts.length !== 1 ? "s" : ""} from
              this session. Alerts are cleared on page refresh.
            </p>
            <AnimatePresence>
              {alerts.map((alert, i) => (
                <AlertItem key={alert.id} alert={alert} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
