import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { createContext, useContext } from "react";
import Layout from "./components/Layout";
import { useSensorData } from "./hooks/useSensorData";
import About from "./pages/About";
import Alerts from "./pages/Alerts";
import Architecture from "./pages/Architecture";
import Dashboard from "./pages/Dashboard";
import DataAnalytics from "./pages/DataAnalytics";
import Features from "./pages/Features";
import Home from "./pages/Home";

type SensorContextType = ReturnType<typeof useSensorData>;
const SensorContext = createContext<SensorContextType | null>(null);

export function useSensor() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error("useSensor must be inside SensorProvider");
  return ctx;
}

function SensorProvider({ children }: { children: React.ReactNode }) {
  const sensorData = useSensorData(50);
  return (
    <SensorContext.Provider value={sensorData}>
      {children}
    </SensorContext.Provider>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <SensorProvider>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </SensorProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});
const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features",
  component: Features,
});
const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data",
  component: DataAnalytics,
});
const archRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/architecture",
  component: Architecture,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: Alerts,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  featuresRoute,
  dataRoute,
  archRoute,
  aboutRoute,
  alertsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
