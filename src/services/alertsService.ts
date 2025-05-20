
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  source: string;
  created_at: string;
  start_time: string;
  end_time?: string;
  latitude: number;
  longitude: number;
  radius: number;
}

// Chinhoyi, Zimbabwe coordinates
const CHINHOYI_LATITUDE = -17.3667;
const CHINHOYI_LONGITUDE = 30.2;

export const useGetAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      // We're filtering alerts to only show those related to Chinhoyi
      // In a real app, this would query alerts within a distance radius of Chinhoyi
      const { data: alerts, error } = await supabase
        .rpc('get_nearby_alerts', { 
          user_lat: CHINHOYI_LATITUDE, 
          user_lng: CHINHOYI_LONGITUDE, 
          radius_meters: 50000 // 50km radius around Chinhoyi
        })
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Set location to Chinhoyi for all alerts
      const chinhoyiAlerts = (alerts as Alert[]).map(alert => ({
        ...alert,
        location: "Chinhoyi, Zimbabwe"
      }));
      
      return chinhoyiAlerts;
    },
  });
};

export const useGetRecentAlerts = (limit = 5) => {
  return useQuery({
    queryKey: ['alerts', 'recent', limit],
    queryFn: async () => {
      // We're filtering alerts to only show those related to Chinhoyi
      const { data: alerts, error } = await supabase
        .rpc('get_nearby_alerts', { 
          user_lat: CHINHOYI_LATITUDE, 
          user_lng: CHINHOYI_LONGITUDE, 
          radius_meters: 50000 // 50km radius around Chinhoyi
        })
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Set location to Chinhoyi for all alerts
      const chinhoyiAlerts = (alerts as Alert[]).map(alert => ({
        ...alert,
        location: "Chinhoyi, Zimbabwe"
      }));
      
      return chinhoyiAlerts;
    },
  });
};

export const useGetAlertById = (alertId: string) => {
  return useQuery({
    queryKey: ['alerts', alertId],
    queryFn: async () => {
      const { data: alert, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('id', alertId)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { ...alert, location: "Chinhoyi, Zimbabwe" };
    },
    enabled: !!alertId,
  });
};

export const useSubscribeToAlerts = (callback: (alert: Alert) => void) => {
  const channel = supabase
    .channel('public:alerts')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'alerts'
      },
      (payload) => {
        // Check if the alert is relevant to Chinhoyi
        const alert = payload.new as unknown as Alert;
        const distance = calculateDistance(
          CHINHOYI_LATITUDE,
          CHINHOYI_LONGITUDE,
          alert.latitude,
          alert.longitude
        );
        
        if (distance <= 50) { // 50km radius
          callback({
            ...alert,
            location: "Chinhoyi, Zimbabwe"
          });
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

// Helper function to calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
