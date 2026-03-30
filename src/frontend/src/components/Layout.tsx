import { Link, useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Cpu,
  Home,
  Info,
  LayoutDashboard,
  Menu,
  Network,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSensor } from "../App";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/features", label: "Features", icon: Zap },
  { to: "/data", label: "Data", icon: BarChart3 },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/about", label: "About", icon: Info },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/dashboard": "Live Dashboard",
  "/features": "Health Modules",
  "/data": "Data & Analytics",
  "/architecture": "System Architecture",
  "/about": "About the System",
  "/alerts": "Alert Log",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const { isAnyDanger, status, alerts } = useSensor();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState("");

  const dangerCount = Object.values(status).filter(
    (s) => s === "danger",
  ).length;
  const alertCount = alerts.length;

  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pageTitle = pageTitles[pathname] ?? "AirQ System";
  const isDashboard = pathname === "/dashboard";

  function NavLink({
    to,
    label,
    icon: Icon,
  }: { to: string; label: string; icon: React.ElementType }) {
    const isActive = pathname === to;
    const isDash = to === "/dashboard";
    const isAlerts = to === "/alerts";
    const badge =
      isDash && isAnyDanger
        ? dangerCount
        : isAlerts && alertCount > 0
          ? alertCount
          : 0;
    return (
      <Link
        to={to}
        data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {label}
        {badge > 0 && (
          <span
            className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
              isDash ? "bg-danger text-white" : "bg-violet-neon text-white"
            }`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-panel-dark">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-sidebar scrollbar-thin overflow-y-auto"
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-neon/20 to-violet-neon/20 flex items-center justify-center border border-cyan-neon/30">
            <Wind className="w-5 h-5 text-cyan-neon" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tracking-wide">
              AirQ
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Health Monitor
            </p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden w-full h-full cursor-default"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 z-50 border-r border-border bg-sidebar flex flex-col transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <Wind className="w-5 h-5 text-cyan-neon" />
            <span className="font-bold text-foreground">AirQ</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.to}
              onClick={() => setMobileOpen(false)}
              onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
            >
              <NavLink {...item} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 py-3.5 border-b border-border bg-sidebar/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-foreground">
              {pageTitle}
            </h1>
            {isDashboard && (
              <span className="live-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">
              {clock}
            </span>
            {isAnyDanger && (
              <Link to="/alerts" className="relative">
                <Bell className="w-4 h-4 text-danger animate-pulse" />
                {alertCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-neon/20 to-violet-neon/20 border border-cyan-neon/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-neon" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
