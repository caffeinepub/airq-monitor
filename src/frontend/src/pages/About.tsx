import {
  Calculator,
  FlaskConical,
  Leaf,
  Target,
  Thermometer,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";

const sensors = [
  {
    id: "MQ-135",
    icon: FlaskConical,
    color: "#2EE6D6",
    title: "MQ-135 Air Quality Sensor",
    targets: ["CO₂", "NH₃", "Benzene", "Alcohol vapor", "NOx"],
    desc: "Electrochemical gas sensor using a heated tin oxide (SnO₂) element. Resistance decreases as target gas concentration increases. Requires a 24-hour burn-in period and periodic recalibration for stable readings.",
  },
  {
    id: "MQ-2",
    icon: Wind,
    color: "#7C5CFF",
    title: "MQ-2 Combustible Gas Sensor",
    targets: ["CO", "LPG", "Smoke", "Propane", "Hydrogen"],
    desc: "Sensitive to combustible gases and smoke. Uses a spiral heating coil and sensing element. Outputs an analog voltage proportional to gas concentration, mapped to PPM via a logarithmic calibration curve.",
  },
  {
    id: "DHT-11",
    icon: Thermometer,
    color: "#FFB020",
    title: "DHT-11 Temp & Humidity Sensor",
    targets: ["Temperature (°C)", "Relative Humidity (%)", "Heat Index"],
    desc: "Capacitive humidity sensing element combined with a NTC thermistor. 1-wire single-bus protocol. Accuracy: ±2°C temperature, ±5% RH. Sampling rate up to 1 Hz. Suitable for indoor HVAC monitoring.",
  },
];

const stats = [
  { value: "5", label: "Active Sensors", icon: Target },
  { value: "RT", label: "Real-time Data", icon: Wind },
  { value: "3", label: "Risk Models", icon: Calculator },
];

export default function About() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-neon/10 border border-cyan-neon/20 mb-5">
          <Leaf className="w-8 h-8 text-cyan-neon" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
          About This Project
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The Air Quality Monitoring &amp; Disease Prediction System is a
          multidisciplinary engineering project combining IoT hardware, embedded
          firmware, data engineering, and machine learning to provide actionable
          indoor health intelligence. Designed to protect vulnerable populations
          from invisible airborne hazards.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ value, label, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center"
          >
            <Icon className="w-5 h-5 text-cyan-neon mx-auto mb-2" />
            <p className="text-2xl font-bold text-gradient-cyan">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Sensor cards */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Sensor Hardware
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sensors.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
              style={{ borderColor: `${s.color}22` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span
                className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.id}
              </span>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {s.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {s.targets.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PPM Conversion */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">
          PPM Conversion Method
        </h2>
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-cyan-neon uppercase tracking-wider mb-3">
                Voltage → Resistance
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                The sensor output voltage is first converted to sensor
                resistance Rs using the load resistor RL:
              </p>
              <div className="font-mono text-xs bg-white/5 rounded-lg px-4 py-3 text-cyan-neon">
                Rs = ((Vc − Vout) / Vout) × RL
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-violet-neon uppercase tracking-wider mb-3">
                Resistance → PPM
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                The ratio Rs/R0 (where R0 is resistance in clean air) maps to
                PPM via a log-linear curve from the datasheet:
              </p>
              <div className="font-mono text-xs bg-white/5 rounded-lg px-4 py-3 text-violet-neon">
                PPM = a × (Rs / R0) ^ b
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Constants <em>a</em> and <em>b</em> are empirically derived per gas
            type from manufacturer sensitivity characteristic curves.
            Temperature and humidity compensation factors are applied using
            DHT-11 readings to improve accuracy across environmental conditions.
          </p>
        </div>
      </section>

      {/* Motivation */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Project Motivation &amp; Impact
        </h2>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Indoor air quality is responsible for millions of premature deaths
            annually, yet most people spend over 90% of their time indoors.
            Conventional monitoring systems are expensive, siloed, and provide
            no personalized health guidance. This project addresses that gap by
            deploying a low-cost, open-source monitoring node that runs AI
            inference at the edge — delivering personalized, real-time health
            risk assessments to anyone with a smartphone.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Potential applications span from residential apartments and school
            classrooms to hospital waiting rooms and industrial settings where
            vulnerable populations are at highest risk from poor ventilation,
            chemical exposure, and pathogen transmission via aerosols.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Air Quality Monitoring &amp; Disease
          Prediction System
        </p>
      </footer>
    </div>
  );
}
