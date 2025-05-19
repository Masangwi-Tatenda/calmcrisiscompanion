
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  location?: string;
  severity: string;
  icon?: string;
  created_at: string;
}

// Interface to match what's in the database
interface AlertFromDB {
  id: string;
  alert_type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: string;
  created_at: string;
  end_time?: string;
  created_by?: string;
  updated_at?: string;
}

export const useGetAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the database fields to our Alert interface
      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.alert_type || 'other', // Handle field name from DB
        title: alert.title,
        description: alert.description,
        location: `${alert.latitude}, ${alert.longitude}`,
        severity: alert.severity,
        icon: getIconForAlertType(alert.alert_type),
        created_at: alert.created_at
      })) as Alert[];
    },
  });
};

export const useGetRecentAlerts = (limit = 5) => {
  return useQuery({
    queryKey: ['recent-alerts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the database fields to our Alert interface
      return (data || []).map(alert => ({
        id: alert.id,
        type: alert.alert_type || 'other', // Handle field name from DB
        title: alert.title,
        description: alert.description,
        location: `${alert.latitude}, ${alert.longitude}`,
        severity: alert.severity,
        icon: getIconForAlertType(alert.alert_type),
        created_at: alert.created_at
      })) as Alert[];
    },
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
        // Convert payload to match Alert interface
        const newAlert = {
          id: payload.new.id,
          type: payload.new.alert_type || 'other',
          title: payload.new.title,
          description: payload.new.description,
          location: `${payload.new.latitude}, ${payload.new.longitude}`,
          severity: payload.new.severity,
          icon: getIconForAlertType(payload.new.alert_type),
          created_at: payload.new.created_at
        } as Alert;
        
        callback(newAlert);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Helper function to get icon based on alert type
function getIconForAlertType(alertType: string): string {
  switch (alertType?.toLowerCase()) {
    case 'weather':
      return 'cloud-rain';
    case 'police':
      return 'shield';
    case 'fire':
      return 'flame';
    case 'health':
      return 'heart-pulse';
    default:
      return 'alert-triangle';
  }
}
