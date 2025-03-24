
// Simple authentication service
// In a real app, this would connect to a backend service

// Types for auth
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
}

// Local storage keys
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';
const IS_AUTHENTICATED_KEY = 'isAuthenticated';

// Service methods
export const authService = {
  // Sign in
  signIn: async (credentials: UserCredentials): Promise<AuthResponse> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation - in a real app this would be on the server
        if (credentials.email && credentials.password.length >= 6) {
          // Create dummy user data
          const userData = {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
          };
          
          // Store in localStorage
          localStorage.setItem(AUTH_TOKEN_KEY, 'dummy-token-123');
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
          
          resolve({
            success: true,
            user: userData,
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid email or password',
          });
        }
      }, 1000);
    });
  },

  // Sign up
  signUp: async (userData: UserRegistration): Promise<AuthResponse> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation - in a real app this would be on the server
        if (userData.email && userData.password.length >= 6 && userData.name) {
          // Create dummy user data
          const newUser = {
            id: '1',
            name: userData.name,
            email: userData.email,
          };
          
          // Store in localStorage
          localStorage.setItem(AUTH_TOKEN_KEY, 'dummy-token-123');
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
          localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
          
          resolve({
            success: true,
            user: newUser,
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid registration data',
          });
        }
      }, 1000);
    });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Just return success for demo
        resolve({
          success: true,
          message: 'Password reset instructions sent to your email',
        });
      }, 1000);
    });
  },

  // Sign out
  signOut: async (): Promise<void> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(IS_AUTHENTICATED_KEY);
        resolve();
      }, 500);
    });
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem(IS_AUTHENTICATED_KEY) === 'true';
  },

  // Get current user
  getCurrentUser: (): any => {
    const userData = localStorage.getItem(AUTH_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
