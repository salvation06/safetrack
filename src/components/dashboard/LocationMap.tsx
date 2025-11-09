import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  lat: number;
  lon: number;
  timestamp: string;
}

export const LocationMap = ({ lat, lon, timestamp }: LocationMapProps) => {
  // 1. UPDATED: Use the Google Maps embeddable URL format.
  // This will create a map centered on the coordinates with a pin.
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=14&output=embed`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Vehicle Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 2. UPDATED: Replaced the <img> tag with the <iframe>.
          We wrap it in the same 'aspect-video' div to maintain the
          dashboard's layout.
        */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <iframe
            src={mapUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-medium">
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </div>
        </div>

        {/* This timestamp will be accurate from the mock hook */}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Last update: {new Date(timestamp).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
