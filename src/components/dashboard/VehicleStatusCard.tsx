import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TelemetryData } from '@/types/monitoring';
import { Car, MapPin, Wifi, WifiOff, Smartphone, Activity } from 'lucide-react';

interface VehicleStatusCardProps {
  telemetry: TelemetryData;
}

export const VehicleStatusCard = ({ telemetry }: VehicleStatusCardProps) => {
  const connectionIcon = telemetry.connectionStatus === 'wifi' ? Wifi : 
                          telemetry.connectionStatus === 'cellular' ? Smartphone : WifiOff;
  const ConnectionIcon = connectionIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-statusSafe animate-heartbeat" />
            <span className="text-sm font-medium">Heartbeat</span>
          </div>
          <span className="text-sm text-muted-foreground">Active</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Location</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {telemetry.gps.lat.toFixed(4)}°, {telemetry.gps.lon.toFixed(4)}°
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ConnectionIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Connection</span>
          </div>
          <span className="text-sm text-muted-foreground capitalize">{telemetry.connectionStatus}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Battery</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${telemetry.battery * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(telemetry.battery * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
