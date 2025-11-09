export type RiskState = 'SAFE' | 'WATCH' | 'ALERT' | 'CRITICAL';

export interface TelemetryData {
  timestamp: string;
  gps: {
    lat: number;
    lon: number;
  };
  buckleState: 'BUCKLED' | 'UNBUCKLED';
  seatPresence: boolean;
  motionState: 'STILL' | 'MOVING';
  vehicleMoving: boolean;
  temperatureF: number;
  battery: number;
  connectionStatus: 'wifi' | 'cellular' | 'offline';
}

export type AlertEventType = 'critical' | 'alert' | 'watch' | 'telemetry' | 'social';

export interface AlertEvent {
  id: string;
  message: string;
  type: AlertEventType;
  riskState: RiskState;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}
