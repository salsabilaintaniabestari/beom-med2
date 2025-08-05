import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const getEnvVar = (key: string, fallback?: string): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return (window as any).__ENV__?.[key] || fallback || '';
  }
  
  // Check for Vite environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback || '';
  }
  
  // Check for Node.js environment variables
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback || '';
  }
  
  return fallback || '';
};

// For development/demo purposes, we'll use placeholder values if no environment variables are set
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://demo-project.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'demo-anon-key');

// Check if we're in demo mode (silently)
const isDemoMode = supabaseUrl === 'https://demo-project.supabase.co' || supabaseAnonKey === 'demo-anon-key';

// Create a mock Supabase client for development
const createMockSupabaseClient = () => {
  const mockAuth = {
    onAuthStateChange: (callback: any) => {
      // Simulate no initial session
      setTimeout(() => callback('SIGNED_OUT', null), 100);
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async (credentials: any) => {
      throw new Error('Aplikasi dalam mode demo. Silakan konfigurasi Supabase untuk fitur penuh.');
    },
    signUp: async (credentials: any) => {
      throw new Error('Aplikasi dalam mode demo. Silakan konfigurasi Supabase untuk fitur penuh.');
    },
    signOut: async () => {
      // Mock successful signout
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    }
  };

  const mockFrom = (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Mode demo aktif - data tidak tersedia') }),
        order: () => ({ data: [], error: null })
      }),
      order: () => ({ data: [], error: null }),
      single: async () => ({ data: null, error: new Error('Mode demo aktif - data tidak tersedia') })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Mode demo aktif - operasi tidak tersedia') })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error('Mode demo aktif - operasi tidak tersedia') })
        })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: new Error('Mode demo aktif - operasi tidak tersedia') })
    })
  });

  return {
    auth: mockAuth,
    from: mockFrom,
    channel: () => ({
      on: () => ({
        subscribe: () => ({})
      })
    }),
    removeChannel: () => {}
  };
};

// Create Supabase client or mock client (silently)
export const supabase = isDemoMode 
  ? createMockSupabaseClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

// Export configuration for other parts of the app
export const config = {
  supabaseUrl,
  supabaseAnonKey,
  isDemoMode
};

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'doctor' | 'patient'
          created_at: string
          specialization?: string
          license_number?: string
          phone?: string
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'admin' | 'doctor' | 'patient'
          specialization?: string
          license_number?: string
          phone?: string
          is_active?: boolean
        }
        Update: {
          name?: string
          role?: 'admin' | 'doctor' | 'patient'
          specialization?: string
          license_number?: string
          phone?: string
          is_active?: boolean
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          age: number
          gender: 'Laki-laki' | 'Perempuan'
          email: string
          phone: string
          address: string
          medical_conditions: string[]
          doctor_id: string | null
          doctor_name: string
          registration_date: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          allergies: string[]
          blood_type: string
          weight: number
          height: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          age: number
          gender: 'Laki-laki' | 'Perempuan'
          email: string
          phone: string
          address: string
          medical_conditions: string[]
          doctor_id: string | null
          doctor_name: string
          registration_date: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          allergies: string[]
          blood_type: string
          weight: number
          height: number
        }
        Update: {
          name?: string
          age?: number
          gender?: 'Laki-laki' | 'Perempuan'
          email?: string
          phone?: string
          address?: string
          medical_conditions?: string[]
          doctor_id?: string | null
          doctor_name?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          allergies?: string[]
          blood_type?: string
          weight?: number
          height?: number
        }
      }
    }
  }
}