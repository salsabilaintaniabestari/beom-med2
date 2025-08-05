import { supabase, config } from '../lib/supabase';
import { User } from '../App';

// Database types based on our schema
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  email: string;
  phone: string;
  address: string;
  medical_conditions: string[];
  doctor_id: string | null;
  doctor_name: string;
  registration_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  allergies: string[];
  blood_type: string;
  weight: number;
  height: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  specialization: string;
  license_number: string;
  phone: string;
  patients: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  side_effects: string[];
  category: 'Antibiotik' | 'Vitamin' | 'Analgesik' | 'Antihipertensi' | 'Antidiabetes' | 'Lainnya';
  manufacturer?: string;
  expiry_date?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationSchedule {
  id: string;
  patient_id: string;
  medication_id: string;
  medication_name: string;
  dosage: string;
  times: string[];
  start_date: string;
  end_date: string;
  instructions: string | null;
  is_active: boolean;
  prescribed_by: string | null;
  prescribed_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ConsumptionRecord {
  id: string;
  patient_id: string;
  schedule_id: string;
  medication_name: string;
  scheduled_time: string;
  actual_time: string | null;
  status: 'taken' | 'missed' | 'late';
  date: string;
  notes: string | null;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  specialization?: string;
  license_number?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class SupabaseService {
  private handleDemoMode(operation: string) {
    if (config.isDemoMode) {
      throw new Error(`Aplikasi dalam mode demo. Konfigurasi Supabase untuk menggunakan ${operation}.`);
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: any) {
    try {
      this.handleDemoMode('pendaftaran akun');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.handleDemoMode('login');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (config.isDemoMode) {
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        avatar: userProfile.name.charAt(0).toUpperCase()
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (config.isDemoMode) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      this.handleDemoMode('update profil');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Patient methods - return empty arrays in demo mode
  async getPatients(): Promise<Patient[]> {
    try {
      if (config.isDemoMode) return [];
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get patients error:', error);
      return [];
    }
  }

  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    try {
      if (config.isDemoMode) return [];
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get patients by doctor error:', error);
      return [];
    }
  }

  async createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    try {
      this.handleDemoMode('tambah pasien');
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create patient error:', error);
      throw error;
    }
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    try {
      this.handleDemoMode('update pasien');
      
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      this.handleDemoMode('hapus pasien');
      
      const { error } = await supabase
        .from('patients')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  }

  // Other methods - return empty data in demo mode
  async getDoctors(): Promise<Doctor[]> {
    if (config.isDemoMode) return [];
    return [];
  }

  async getMedications(): Promise<Medication[]> {
    if (config.isDemoMode) return [];
    return [];
  }

  async getSchedules(): Promise<MedicationSchedule[]> {
    if (config.isDemoMode) return [];
    return [];
  }

  async getConsumptionRecords(): Promise<ConsumptionRecord[]> {
    if (config.isDemoMode) return [];
    return [];
  }

  async getDashboardStats(userId: string, userRole: string) {
    if (config.isDemoMode) {
      return {
        totalPatients: 0,
        totalDoctors: 0,
        totalMedications: 0,
        missedToday: 0,
        complianceToday: 0,
        averageCompliance: 0,
        schedulesToday: 0,
        compliance: 0,
        missedThisWeek: 0,
        upcomingReminders: 0
      };
    }
    
    return {
      totalPatients: 0,
      totalDoctors: 0,
      totalMedications: 0,
      missedToday: 0,
      complianceToday: 0
    };
  }

  // Real-time subscriptions (disabled in demo mode)
  subscribeToPatients(callback: (payload: any) => void) {
    if (config.isDemoMode) {
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('patients_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients'
      }, callback)
      .subscribe();
  }

  subscribeToSchedules(callback: (payload: any) => void) {
    if (config.isDemoMode) {
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('schedules_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'schedules'
      }, callback)
      .subscribe();
  }

  subscribeToConsumptionRecords(callback: (payload: any) => void) {
    if (config.isDemoMode) {
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('consumption_records_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'consumption_records'
      }, callback)
      .subscribe();
  }

  // Cleanup subscriptions
  unsubscribe(subscription: any) {
    if (subscription && !config.isDemoMode) {
      supabase.removeChannel(subscription);
    }
  }
}

export const supabaseService = new SupabaseService();