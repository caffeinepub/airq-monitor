import { ArrowRight, Brain, Code2, Cpu, Database, Wind } from "lucide-react";
import { motion } from "motion/react";

const nodes = [
  {
    icon: Wind,
    title: "Sensors",
    color: "#2EE6D6",
    bullets: [
      "MQ-135: CO₂, NH₃, benzene",
      "MQ-2: CO, smoke, LPG",
      "DHT-11: temperature & humidity",
    ],
  },
  {
    icon: Cpu,
    title: "ESP32",
    color: "#18C7FF",
    bullets: [
      "Analog-to-digital conversion",
      "Sensor calibration routines",
      "Wi-Fi data transmission",
    ],
  },
  {
    icon: Code2,
    title: "Python",
    color: "#7C5CFF",
    bullets: [
      "PySerial for serial I/O",
      "Voltage → PPM conversion",
      "Feature engineering pipeline",
    ],
  },
  {
    icon: Brain,
    title: "AI Models",
    color: "#FFB020",
    bullets: [
      "Disease spread probability",
      "Cardiovascular stress model",
      "Long-term risk accumulation",
    ],
  },
  {
    icon: Database,
    title: "Database",
    color: "#2ED47A",
    bullets: [
      "Time-series storage (InfluxDB)",
      "REST API for frontend",
      "30-day data retention",
    ],
  },
];

export default function Architecture() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">
          System Architecture
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          The pipeline flows from physical sensors through firmware, to Python
          processing, machine learning inference, and finally persistent storage
          — enabling real-time and historical health analytics.
        </p>
      </div>

      {/* Desktop horizontal flow */}
      <div className="hidden lg:flex items-start gap-0 mb-10">
        {nodes.map((node, i) => (
          <div key={node.title} className="flex items-start flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex-1 glass-card p-5 relative"
              style={{ borderColor: `${node.color}22` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: `${node.color}18`,
                  border: `1px solid ${node.color}30`,
                }}
              >
                <node.icon className="w-5 h-5" style={{ color: node.color }} />
              </div>
              <h3
                className="text-sm font-bold text-foreground mb-3"
                style={{ color: node.color }}
              >
                {node.title}
              </h3>
              <ul className="space-y-1.5 mb-3">
                {node.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span
                      className="mt-1 w-1 h-1 rounded-full shrink-0"
                      style={{ background: node.color }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: node.color, color: "#0B1220" }}
              >
                {i + 1}
              </div>
            </motion.div>
            {i < nodes.length - 1 && (
              <div className="flex items-start pt-7 px-1 shrink-0">
                <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile vertical flow */}
      <div className="flex lg:hidden flex-col gap-4 mb-8">
        {nodes.map((node, i) => (
          <motion.div
            key={node.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 flex items-start gap-4"
            style={{ borderColor: `${node.color}22` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `${node.color}18`,
                border: `1px solid ${node.color}30`,
              }}
            >
              <node.icon className="w-5 h-5" style={{ color: node.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${node.color}20`, color: node.color }}
                >
                  Step {i + 1}
                </span>
                <h3 className="text-sm font-bold" style={{ color: node.color }}>
                  {node.title}
                </h3>
              </div>
              <ul className="space-y-1">
                {node.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span
                      className="mt-1 w-1 h-1 rounded-full shrink-0"
                      style={{ background: node.color }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full description */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Pipeline Overview
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The <span className="text-cyan-neon">sensor array</span> (MQ-135,
          MQ-2, DHT-11) continuously samples the indoor environment and feeds
          analog voltages to the{" "}
          <span className="text-cyan-neon">ESP32 microcontroller</span>, which
          converts raw ADC readings and transmits structured packets over Wi-Fi.
          The <span className="text-violet-neon">Python layer</span> receives
          these packets, applies per-sensor calibration curves to convert
          voltages into physical units (PPM, °C, %RH), then routes the feature
          vector through trained{" "}
          <span className="text-warning">AI/ML models</span> that score disease
          spread probability, cardiovascular stress, and cumulative long-term
          risk. All readings and scores are written to a time-series{" "}
          <span className="text-success">database</span>, which serves both the
          real-time dashboard and the historical analytics endpoints.
        </p>
      </div>
    </div>
  );
}
