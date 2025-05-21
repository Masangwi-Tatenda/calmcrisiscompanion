
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

interface GoogleMapProps {
  height?: string;
  width?: string;
  location?: string;
  markers?: {
    position: { lat: number, lng: number };
    title: string;
    info?: string;
  }[];
  center?: { lat: number, lng: number };
  zoom?: number;
  onMapClick?: (location: { lat: number, lng: number }) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  height = '400px',
  width = '100%',
  markers = [],
  center,
  zoom = 14,
  onMapClick,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);

  // Request user location if no center provided
  useEffect(() => {
    if (!center && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast("Could not access your location", {
            description: "Please enable location services or enter location manually",
            duration: 5000,
          });
          // Default to a fallback location (Chinhoyi, Zimbabwe)
          setUserLocation({ lat: -17.3667, lng: 30.2 });
        }
      );
    }
  }, [center]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    
    const mapCenter = center || userLocation || { lat: -17.3667, lng: 30.2 };
    
    const mapOptions = {
      center: mapCenter,
      zoom: zoom,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    };
    
    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    
    // Add click listener if needed
    if (onMapClick) {
      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng && onMapClick) {
          const clickedPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          onMapClick(clickedPos);
        }
      });
    }
    
    return () => {
      // Clean up markers and info windows
      mapMarkers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(window => window.close());
    };
  }, [mapRef.current, window.google, userLocation, center]);

  // Add markers to map
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(window => window.close());
    
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];
    
    // Add user location marker if available
    if (userLocation && (!center || markers.length === 0)) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });
      
      const userInfo = new google.maps.InfoWindow({
        content: "<div><strong>Your Location</strong></div>",
      });
      
      userMarker.addListener("click", () => {
        userInfo.open(map, userMarker);
      });
      
      newMarkers.push(userMarker);
      newInfoWindows.push(userInfo);
    }
    
    // Add provided markers
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
      });
      
      if (markerData.info) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${markerData.title}</strong>${markerData.info ? `<p>${markerData.info}</p>` : ''}</div>`,
        });
        
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
        
        newInfoWindows.push(infoWindow);
      }
      
      newMarkers.push(marker);
    });
    
    setMapMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
    
    // Center map if we have markers
    if (newMarkers.length > 0 && !center) {
      if (newMarkers.length === 1) {
        map.setCenter(newMarkers[0].getPosition()!);
      } else {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          if (marker.getPosition()) {
            bounds.extend(marker.getPosition()!);
          }
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, markers, userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width }} 
      className={`rounded-lg border border-border overflow-hidden ${className}`}
    />
  );
};

export default GoogleMap;
