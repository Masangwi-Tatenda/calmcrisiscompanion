
import { supabase } from "@/integrations/supabase/client";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
}

const authService = {
  signIn: async ({ email, password }: AuthCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return { 
          success: false, 
          message: error.message 
        };
      }
      
      return { 
        success: true,
        user: data.user
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "An error occurred during sign in" 
      };
    }
  },
  
  signUp: async ({ email, password, name }: SignUpData): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) {
        return { 
          success: false, 
          message: error.message 
        };
      }
      
      return { 
        success: true,
        user: data.user
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || "An error occurred during sign up" 
      };
    }
  },
  
  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },
  
  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: true,
        message: "Password reset instructions sent to your email"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "An error occurred during password reset"
      };
    }
  }
};

export default authService;
