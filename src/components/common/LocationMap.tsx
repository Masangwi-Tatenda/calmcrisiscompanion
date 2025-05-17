
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  location?: string;
  className?: string;
}

const LocationMap = ({ location, className = "" }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!location) return;
    
    // In a real application, you would use an actual mapping API
    // like Google Maps, Mapbox, or Leaflet to render the map
    // and handle directions
    
    console.log(`Displaying map for location: ${location}`);
  }, [location]);

  if (!location) return null;

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="bg-muted h-48 w-full flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium">{location}</p>
          <p className="text-xs text-muted-foreground mt-1">Map view would show here</p>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
