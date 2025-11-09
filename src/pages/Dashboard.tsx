import { useAuth } from "@/contexts/AuthContext";
import { useMockTelemetry } from "@/hooks/useMockTelemetry";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { VehicleStatusCard } from "@/components/dashboard/VehicleStatusCard";
import { SensorReadings } from "@/components/dashboard/SensorReadings";
import { AlertTimeline } from "@/components/dashboard/AlertTimeline";
import { LocationMap } from "@/components/dashboard/LocationMap";
import { EmergencyContacts } from "@/components/dashboard/EmergencyContacts";
import { LogOut, Shield } from "lucide-react";

export const Dashboard = () => {
  const { logout, user } = useAuth();
  const { telemetry, riskState, alerts, acknowledgeAlert, timeStill } = useMockTelemetry();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SafeTrack
              </h1>
              <p className="text-xs text-muted-foreground">Parent: {user?.username}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Risk Status Banner */}
        <div
          className={`p-6 rounded-xl border-2 transition-all ${
            riskState === "SAFE"
              ? "bg-statusSafeBg border-statusSafe"
              : riskState === "WATCH"
                ? "bg-statusWatchBg border-statusWatch"
                : riskState === "ALERT"
                  ? "bg-statusAlertBg border-statusAlert"
                  : "bg-statusCriticalBg border-statusCritical shadow-alert"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge state={riskState} />
                <span className="text-sm text-muted-foreground">
                  {telemetry.vehicleMoving
                    ? "Vehicle in motion"
                    : `Stationary: ${Math.floor(timeStill / 60)} min ${timeStill % 60} sec`}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">
                {riskState === "SAFE" && "All Systems Normal"}
                {riskState === "WATCH" && "Potential Risk Detected"}
                {riskState === "ALERT" && "Alert: Intervention May Be Needed"}
                {riskState === "CRITICAL" && "CRITICAL: Immediate Action Required"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Last update: {new Date(telemetry.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {riskState !== "SAFE" && (
              <Button size="lg" variant="destructive" className="gap-2">
                Call Emergency Services
              </Button>
            )}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <VehicleStatusCard telemetry={telemetry} />
            <SensorReadings telemetry={telemetry} />
            <EmergencyContacts />
          </div>

          <div className="space-y-6">
            <LocationMap lat={telemetry.gps.lat} lon={telemetry.gps.lon} timestamp={telemetry.timestamp} />
            <AlertTimeline alerts={alerts} onAcknowledge={acknowledgeAlert} />
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-6 text-xs text-muted-foreground border-t">
          <p>AI Agent Hackathon Demo • Google Cloud Run • Mock Data Simulation</p>
          <p className="mt-1">Real implementation uses BLE sensors + GPS + Cloud AI agents</p>
        </div>
      </main>
    </div>
  );
};
