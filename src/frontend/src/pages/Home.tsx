import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  CloudFog,
  Cpu,
  Database,
  Droplets,
  FlaskConical,
  Shield,
  Thermometer,
  Wind,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSensor } from "../App";
import { THRESHOLDS } from "../hooks/useSensorData";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  left: Math.random() * 100,
  top: 20 + Math.random() * 60,
  duration: 5 + Math.random() * 8,
  delay: Math.random() * 6,
  tx: (Math.random() - 0.5) * 60,
}));

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    desc: "Continuous tracking of CO₂, NH₃, CO, temperature, and humidity with 3-second refresh intervals.",
    color: "from-cyan-neon/20 to-cyan-soft/10",
    border: "border-cyan-neon/20",
    iconColor: "text-cyan-neon",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    desc: "Machine learning models analyze sensor data to predict disease spread probability and cardiovascular stress.",
    color: "from-violet-neon/20 to-violet-neon/5",
    border: "border-violet-neon/20",
    iconColor: "text-violet-neon",
  },
  {
    icon: Shield,
    title: "Health Risk Assessment",
    desc: "Personalized AQI calculations factor in age, asthma, cardiovascular conditions, and smoking status.",
    color: "from-success/20 to-success/5",
    border: "border-success/20",
    iconColor: "text-success",
  },
];

const stats = [
  { value: "5", label: "Sensor Types" },
  { value: "3s", label: "Refresh Rate" },
  { value: "4", label: "AI Modules" },
  { value: "99.9%", label: "Uptime" },
  { value: "Smart", label: "Personalized AQI" },
  { value: "Live", label: "Real-time Alerts" },
];

const pipelineNodes = [
  { icon: Wind, label: "Sensors" },
  { icon: Cpu, label: "ESP32" },
  { icon: Activity, label: "Python" },
  { icon: Brain, label: "AI Models" },
  { icon: Database, label: "Database" },
];

const impactStats = [
  {
    value: "90%",
    label: "Time spent indoors",
    desc: "People spend the majority of their lives inside buildings where air quality is often worse than outdoors.",
    color: "text-cyan-neon",
    borderColor: "border-cyan-neon/20",
  },
  {
    value: "4.2M",
    label: "Premature deaths/year",
    desc: "The World Health Organization attributes 4.2 million annual premature deaths to outdoor air pollution and millions more to indoor exposure.",
    color: "text-danger",
    borderColor: "border-danger/20",
  },
  {
    value: "2–5×",
    label: "More pollutants indoors vs. outdoor",
    desc: "Indoor environments concentrate pollutants from cooking, cleaning, and materials—sometimes 2–5× higher than outdoor air.",
    color: "text-warning",
    borderColor: "border-warning/20",
  },
];

const sensorConfig = [
  {
    key: "co2" as const,
    label: "CO₂",
    unit: "ppm",
    icon: CloudFog,
    color: "#2EE6D6",
  },
  {
    key: "nh3" as const,
    label: "NH₃",
    unit: "ppm",
    icon: FlaskConical,
    color: "#7C5CFF",
  },
  {
    key: "co" as const,
    label: "CO",
    unit: "ppm",
    icon: Wind,
    color: "#FFB020",
  },
  {
    key: "temperature" as const,
    label: "Temp",
    unit: "°C",
    icon: Thermometer,
    color: "#FF4D4F",
  },
  {
    key: "humidity" as const,
    label: "Hum",
    unit: "%",
    icon: Droplets,
    color: "#2ED47A",
  },
];

function AnimatedCounter({
  target,
  duration = 1200,
}: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Home() {
  const { current, status } = useSensor();

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-cyan-neon/10"
              style={{
                width: `${i * 180}px`,
                height: `${i * 180}px`,
                animation: `spin-slow ${8 + i * 4}s linear infinite${
                  i % 2 === 0 ? " reverse" : ""
                }`,
              }}
            />
          ))}
          <div className="w-40 h-40 rounded-full bg-cyan-neon/5 blur-3xl absolute" />
        </div>

        {particles.map((p) => (
          <div
            key={p.id}
            className="particle bg-cyan-neon/40"
            style={
              {
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                "--duration": `${p.duration}s`,
                "--delay": `${p.delay}s`,
                "--tx": `${p.tx}px`,
              } as React.CSSProperties
            }
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-neon/30 bg-cyan-neon/10 text-cyan-neon text-xs font-semibold mb-6">
            <Wind className="w-3.5 h-3.5" />
            Indoor Health Intelligence System
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            Air Quality Monitoring
            <br />
            <span className="text-gradient-cyan">&amp; Disease Prediction</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-3 font-medium">
            Real-time Indoor Health Monitoring System
          </p>
          <p className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Continuously monitors indoor air quality using IoT sensors and
            applies machine learning models to predict health risks — from
            disease spread probability to cardiovascular stress — giving you
            actionable, personalized health insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/dashboard"
              data-ocid="home.dashboard.primary_button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-neon text-background font-semibold text-sm hover:bg-cyan-neon/90 transition-all"
            >
              View Live Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/features"
              data-ocid="home.features.secondary_button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:border-cyan-neon/40 hover:text-cyan-neon transition-all"
            >
              Explore Features
            </Link>
          </div>

          {/* Live sensor strip */}
          <div className="flex flex-wrap justify-center gap-2">
            {sensorConfig.map(({ key, label, unit, icon: Icon, color }) => {
              const isDanger = status[key] === "danger";
              const val = current[key];
              return (
                <motion.div
                  key={key}
                  animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                    isDanger
                      ? "bg-danger/15 border-danger/40 text-danger"
                      : "bg-white/5 border-white/10 text-foreground"
                  }`}
                  style={!isDanger ? { borderColor: `${color}30` } : {}}
                >
                  <Icon
                    className="w-3 h-3"
                    style={{ color: isDanger ? undefined : color }}
                  />
                  <span className="text-muted-foreground">{label}:</span>
                  <span style={{ color: isDanger ? undefined : color }}>
                    {key === "co2" || key === "humidity"
                      ? Math.round(val)
                      : val.toFixed(1)}
                    {unit}
                  </span>
                  {isDanger && (
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 text-xs">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-cyan-neon/40" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card px-3 py-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-gradient-cyan">
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map(
            ({ icon: Icon, title, desc, color, border, iconColor }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card-hover p-6 ${border}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 border ${border}`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* Why Indoor Air Quality Matters */}
      <section className="px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-2">
              Why Indoor Air Quality Matters
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              The invisible threat you breathe every day.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {impactStats.map(
              ({ value, label, desc, color, borderColor }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className={`glass-card p-6 border ${borderColor}`}
                >
                  <div className={`text-4xl font-bold mb-2 ${color}`}>
                    {value === "90%" ? (
                      <>
                        <AnimatedCounter target={90} />%
                      </>
                    ) : value === "4.2M" ? (
                      <>4.2M</>
                    ) : (
                      <>2–5×</>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                  <div
                    className={`mt-4 flex items-center gap-1.5 text-[10px] font-semibold ${color}`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> WHO-verified data
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto glass-card p-8">
          <h2 className="text-center text-lg font-semibold text-foreground mb-8">
            System Pipeline
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pipelineNodes.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-neon" />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                {i < pipelineNodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mb-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Air Quality Monitoring &amp; Disease
          Prediction System
        </p>
      </footer>
    </div>
  );
}
