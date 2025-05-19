
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  created_at?: string;
}

export function useProfileData() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null;
        }
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!user,
  });

  return {
    profileData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
