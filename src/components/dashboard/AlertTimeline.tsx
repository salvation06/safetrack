import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Import the updated types
import { AlertEvent, AlertEventType, RiskState } from '@/types/monitoring';
// Import the Twitter icon
import { CheckCircle, AlertCircle, AlertTriangle, Bell, Twitter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertTimelineProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
}

export const AlertTimeline = ({ alerts, onAcknowledge }: AlertTimelineProps) => {
  // Add 'social' case
  const getIcon = (type: AlertEventType) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-statusCritical" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-statusAlert" />;
      case 'watch':
        return <Bell className="h-4 w-4 text-statusWatch" />;
      // Render Twitter icon
      case 'social':
        return <Twitter className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-statusSafe" />;
    }
  };

  // Filter for valid alerts
  const validAlerts = alerts.filter((a) => {
    const validStates: RiskState[] = ['SAFE', 'WATCH', 'ALERT', 'CRITICAL'];
    if (!a || !a.message || !a.timestamp) return false;
    if (!validStates.includes(a.riskState)) return false; 
    const msg = (a.message || '').toLowerCase().trim();
    if (!msg || msg.includes('undefined') || msg.includes('ai failure')) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {validAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No status updates yet</p>
            <p className="text-xs mt-1">Alerts will appear here when status changes occur</p>
          </div>
        ) : (
          <div className="space-y-3">
            {validAlerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all ${
                  // Special styling for social post
                  alert.type === 'social'
                    ? 'bg-blue-500/10 border-blue-500' 
                    : !alert.acknowledged && alert.type !== 'telemetry'
                    ? 'bg-statusAlertBg border-statusAlert'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {getIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      {/* Special Title for Social Post */}
                      {alert.type === 'social' && (
                        <p className="text-xs font-bold text-blue-500 mb-1">
                          POSTED TO @SafeTrackAlerts
                        </p>
                      )}
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                      {alert.acknowledged && (
                        <p className={`text-xs mt-1 ${
                          alert.acknowledgedBy === 'System' ? 'text-blue-500' : 'text-statusSafe'
                        }`}>
                          {/* Show "Acknowledged by System" */}
                          ✓ Acknowledged by {alert.acknowledgedBy || 'User'}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Hide Button if 'social' or acknowledged */}
                  {!alert.acknowledged && alert.type !== 'telemetry' && alert.type !== 'social' && (
                    <Button
                      size="sm"
                      variant="outline"
      
                      onClick={() => onAcknowledge(alert.id)}
                      className="shrink-0"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};