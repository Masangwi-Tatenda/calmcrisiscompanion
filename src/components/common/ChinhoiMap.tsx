
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Heart, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chinhoyiLocations } from "../../data/chinhoyiLocations";

interface ChinhoiMapProps {
  className?: string;
}

const ChinhoiMap = ({ className = "" }: ChinhoiMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handlePan = (direction: string) => {
    setIsInteracting(true);
    // Simulate panning effect
    setTimeout(() => setIsInteracting(false), 300);
  };

  const handleSelectLocation = (index: number) => {
    setSelectedLocationIndex(index);
  };

  const getIconForLocationType = (category: string) => {
    switch (category) {
      case "hospital":
        return <Heart className="h-5 w-5 text-crisis-red" />;
      case "police":
        return <Shield className="h-5 w-5 text-crisis-blue" />;
      case "fire":
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <MapPin className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div
        ref={mapRef}
        className={`bg-muted h-64 w-full flex items-center justify-center transition-all duration-300 ${
          isInteracting ? "bg-opacity-90" : ""
        }`}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Simulated map grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
          {Array(48)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border border-muted-foreground/10" />
            ))}
        </div>

        {/* Map center pin - Chinhoyi */}
        <div className="relative z-10 animate-pulse">
          <MapPin
            className="h-8 w-8 text-primary drop-shadow-md"
            strokeWidth={2.5}
          />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-md"></span>
        </div>

        {/* Location pins */}
        {chinhoyiLocations.map((location, index) => (
          <div
            key={index}
            className={`absolute z-10 cursor-pointer transition-all ${
              getMapPinPosition(index)
            } ${
              selectedLocationIndex === index ? "scale-150" : "scale-100"
            }`}
            onClick={() => handleSelectLocation(index)}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-full ${
                  location.category === "hospital"
                    ? "bg-red-100"
                    : location.category === "police"
                    ? "bg-blue-100"
                    : location.category === "fire"
                    ? "bg-orange-100"
                    : "bg-primary/10"
                }`}
              >
                {getIconForLocationType(location.category)}
              </div>
              {selectedLocationIndex === index && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-0.5 rounded text-xs whitespace-nowrap shadow-md">
                  {location.name}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Location name */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <div className="inline-block bg-background/80 text-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            Chinhoyi, Zimbabwe
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-2 right-2 bg-background/80 rounded-md shadow-md backdrop-blur-sm">
        <div className="flex flex-col gap-1 p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
          >
            <span className="text-xl font-bold">+</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
          >
            <span className="text-xl font-bold">−</span>
          </Button>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute bottom-2 right-2">
        <div className="bg-background/80 p-1 rounded-full backdrop-blur-sm shadow-md">
          <Compass className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

// Helper function to position pins randomly but consistently around the center
function getMapPinPosition(index: number): string {
  const positions = [
    "top-1/4 left-1/4",
    "top-1/3 right-1/3",
    "bottom-1/4 right-1/4",
    "bottom-1/3 left-1/3",
    "top-1/2 left-1/3",
    "bottom-1/2 right-1/4",
    "top-1/4 right-1/4",
    "bottom-1/3 right-1/3",
  ];
  return positions[index % positions.length];
}

export default ChinhoiMap;
