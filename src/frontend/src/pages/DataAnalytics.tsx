import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSensor } from "../App";
import type { SensorReading } from "../hooks/useSensorData";

const CYAN = "#2EE6D6";
const VIOLET = "#7C5CFF";
const AMBER = "#FFB020";
const RED = "#FF4D4F";
const GREEN = "#2ED47A";

const tooltipStyle = {
  background: "rgba(17,28,46,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#EAF1FF",
  fontSize: "11px",
};

const axisProps = {
  tick: { fill: "#9AA8C7", fontSize: 10 },
  tickLine: false,
  axisLine: false,
};

function ChartWrapper({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-4 lg:p-5">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="h-52">{children}</div>
    </div>
  );
}

export default function DataAnalytics() {
  const { history } = useSensor();
  const [tab, setTab] = useState("1h");

  function getRange(key: string): SensorReading[] {
    if (key === "1h") return history;
    if (key === "6h") {
      const extended: SensorReading[] = [];
      for (let rep = 0; rep < 6; rep++) {
        for (const r of history) {
          extended.push({
            ...r,
            timestamp: r.timestamp - (5 - rep) * 3600000,
            co2: r.co2 * (0.9 + Math.random() * 0.2),
            nh3: r.nh3 * (0.85 + Math.random() * 0.3),
            co: r.co * (0.8 + Math.random() * 0.4),
            temperature: r.temperature * (0.97 + Math.random() * 0.06),
            humidity: r.humidity * (0.95 + Math.random() * 0.1),
          });
        }
      }
      return extended;
    }
    const extended: SensorReading[] = [];
    for (let rep = 0; rep < 24; rep++) {
      for (const r of history) {
        extended.push({
          ...r,
          timestamp: r.timestamp - (23 - rep) * 3600000,
          co2: r.co2 * (0.7 + Math.random() * 0.6),
          nh3: r.nh3 * (0.6 + Math.random() * 0.8),
          co: r.co * (0.5 + Math.random() * 1.0),
          temperature: 20 + Math.random() * 15,
          humidity: 35 + Math.random() * 45,
        });
      }
    }
    return extended;
  }

  const data = getRange(tab).map((r, i) => ({
    i,
    co2: Math.round(r.co2),
    nh3: +r.nh3.toFixed(1),
    co: +r.co.toFixed(1),
    temp: +r.temperature.toFixed(1),
    humidity: Math.round(r.humidity),
  }));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white/5 border border-border">
          <TabsTrigger data-ocid="data.1h.tab" value="1h" className="text-xs">
            Last Hour
          </TabsTrigger>
          <TabsTrigger data-ocid="data.6h.tab" value="6h" className="text-xs">
            Last 6 Hours
          </TabsTrigger>
          <TabsTrigger data-ocid="data.24h.tab" value="24h" className="text-xs">
            Last 24 Hours
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-5">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChartWrapper title="CO₂ (ppm)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="gCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CYAN} stopOpacity={0.3} />
                        <stop
                          offset="95%"
                          stopColor={CYAN}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis dataKey="i" hide />
                    <YAxis {...axisProps} width={40} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      stroke={CYAN}
                      strokeWidth={2}
                      fill="url(#gCo2)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="NH₃ (ppm)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="gNh3" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={VIOLET}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={VIOLET}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis dataKey="i" hide />
                    <YAxis {...axisProps} width={40} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="nh3"
                      stroke={VIOLET}
                      strokeWidth={2}
                      fill="url(#gNh3)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChartWrapper title="CO (ppm)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="gCo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={AMBER} stopOpacity={0.3} />
                        <stop
                          offset="95%"
                          stopColor={AMBER}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis dataKey="i" hide />
                    <YAxis {...axisProps} width={40} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="co"
                      stroke={AMBER}
                      strokeWidth={2}
                      fill="url(#gCo)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Temperature (°C)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={RED} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis dataKey="i" hide />
                    <YAxis {...axisProps} width={40} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke={RED}
                      strokeWidth={2}
                      fill="url(#gTemp)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <ChartWrapper title="Humidity (%)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.filter(
                    (_, i) =>
                      i % Math.max(1, Math.floor(data.length / 40)) === 0,
                  )}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis dataKey="i" hide />
                  <YAxis {...axisProps} width={40} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="humidity"
                    fill={GREEN}
                    fillOpacity={0.7}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
