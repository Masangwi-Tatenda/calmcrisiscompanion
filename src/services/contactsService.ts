
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  type: string;
  is_favorite: boolean;
  created_at: string;
  user_id?: string;
}

export const useGetContacts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Contact[];
    },
    enabled: !!user,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (contact: Omit<Contact, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error("User not authenticated");
      
      // Create the contact with the user_id
      const newContact = {
        ...contact,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(newContact)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(contact)
        .eq('id', contact.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      });
    },
  });
};
