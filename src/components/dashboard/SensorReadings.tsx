import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TelemetryData } from '@/types/monitoring';
import { Thermometer, Move, Lock, Unlock } from 'lucide-react';

interface SensorReadingsProps {
  telemetry: TelemetryData;
}

export const SensorReadings = ({ telemetry }: SensorReadingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Thermometer className="h-5 w-5 text-statusAlert" />
            <div>
              <div className="text-sm font-medium">Temperature</div>
              <div className="text-xs text-muted-foreground">Outside cabin</div>
            </div>
          </div>
          <div className="text-2xl font-bold">{Math.round(telemetry.temperatureF)}°F</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Move className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Motion</div>
              <div className="text-xs text-muted-foreground">Movement sensor</div>
            </div>
          </div>
          <div className="text-sm font-semibold">{telemetry.motionState}</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {telemetry.buckleState === 'BUCKLED' ? (
              <Lock className="h-5 w-5 text-statusAlert" />
            ) : (
              <Unlock className="h-5 w-5 text-statusSafe" />
            )}
            <div>
              <div className="text-sm font-medium">Car Seat</div>
              <div className="text-xs text-muted-foreground">Buckle status</div>
            </div>
          </div>
          <div className="text-sm font-semibold">{telemetry.buckleState}</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`h-5 w-5 rounded-full ${telemetry.seatPresence ? 'bg-statusAlert' : 'bg-statusSafe'}`} />
            <div>
              <div className="text-sm font-medium">Presence</div>
              <div className="text-xs text-muted-foreground">Seat detection</div>
            </div>
          </div>
          <div className="text-sm font-semibold">{telemetry.seatPresence ? 'DETECTED' : 'NONE'}</div>
        </div>
      </CardContent>
    </Card>
  );
};
