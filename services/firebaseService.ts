import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp
} from 'firebase/firestore';
import { auth, db, config, COLLECTIONS, getFirebaseErrorMessage } from '../lib/firebase';
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
  medicalConditions: string[];
  doctorId: string | null;
  doctorName: string;
  registrationDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  allergies: string[];
  bloodType: string;
  weight: number;
  height: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Doctor {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  patientIds: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  category: 'Antibiotik' | 'Vitamin' | 'Analgesik' | 'Antihipertensi' | 'Antidiabetes' | 'Lainnya';
  manufacturer?: string;
  expiryDate?: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MedicationSchedule {
  id: string;
  patientId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate: string;
  instructions: string | null;
  isActive: boolean;
  prescribedBy: string | null;
  prescribedByName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConsumptionRecord {
  id: string;
  patientId: string;
  scheduleId: string;
  medicationName: string;
  scheduledTime: string;
  actualTime: string | null;
  status: 'taken' | 'missed' | 'late';
  date: string;
  notes: string | null;
  reminderSent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SystemSettings {
  id: string;
  settingKey: string;
  settingValue: any;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Timestamp;
}

class FirebaseService {
  private checkDemoMode() {
    if (config.isDemoMode) {
      throw new Error('Aplikasi dalam mode demo. Konfigurasi Firebase untuk fitur lengkap.');
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: any) {
    try {
      this.checkDemoMode();
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });
      
      // Create user profile in Firestore
      await addDoc(collection(db, COLLECTIONS.USERS), {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        role: userData.role,
        specialization: userData.specialization || null,
        licenseNumber: userData.license_number || null,
        phone: userData.phone || null,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // If user is a doctor, create doctor profile
      if (userData.role === 'doctor') {
        await addDoc(collection(db, COLLECTIONS.DOCTORS), {
          userId: firebaseUser.uid,
          name: userData.name,
          email: firebaseUser.email!,
          specialization: userData.specialization,
          licenseNumber: userData.license_number,
          phone: userData.phone || '',
          patientIds: [],
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return { user: firebaseUser };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(getFirebaseErrorMessage(error.code) || error.message);
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.checkDemoMode();
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, session: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(getFirebaseErrorMessage(error.code) || error.message);
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(getFirebaseErrorMessage(error.code) || error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (config.isDemoMode) {
        return null;
      }

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      // Get user profile from Firestore
      const userProfileQuery = query(
        collection(db, COLLECTIONS.USERS),
        where('id', '==', firebaseUser.uid)
      );
      
      const userProfileSnapshot = await getDocs(userProfileQuery);
      
      if (userProfileSnapshot.empty) {
        throw new Error('Profil pengguna tidak ditemukan');
      }
      
      const userProfileData = userProfileSnapshot.docs[0].data() as UserProfile;

      return {
        id: firebaseUser.uid,
        name: userProfileData.name,
        email: firebaseUser.email!,
        role: userProfileData.role,
        avatar: userProfileData.name.charAt(0).toUpperCase()
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Authentication state listener
  onAuthStateChange(callback: (user: User | null) => void) {
    if (config.isDemoMode) {
      setTimeout(() => callback(null), 100);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (config.isDemoMode) return null;
      
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where('id', '==', userId)
      );
      
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) return null;
      
      const userData = userSnapshot.docs[0].data() as UserProfile;
      return {
        ...userData,
        id: userSnapshot.docs[0].id
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      this.checkDemoMode();
      
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where('id', '==', userId)
      );
      
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        throw new Error('Profil pengguna tidak ditemukan');
      }
      
      const userDocRef = doc(db, COLLECTIONS.USERS, userSnapshot.docs[0].id);
      
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(userDocRef);
      return { ...updatedDoc.data(), id: updatedDoc.id } as UserProfile;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    try {
      if (config.isDemoMode) return [];
      
      const patientsQuery = query(
        collection(db, COLLECTIONS.PATIENTS),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const patientsSnapshot = await getDocs(patientsQuery);
      
      return patientsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Patient));
    } catch (error) {
      console.error('Get patients error:', error);
      return [];
    }
  }

  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    try {
      if (config.isDemoMode) return [];
      
      const patientsQuery = query(
        collection(db, COLLECTIONS.PATIENTS),
        where('doctorId', '==', doctorId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const patientsSnapshot = await getDocs(patientsQuery);
      
      return patientsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Patient));
    } catch (error) {
      console.error('Get patients by doctor error:', error);
      return [];
    }
  }

  async getPatient(id: string): Promise<Patient | null> {
    try {
      if (config.isDemoMode) return null;
      
      const patientDoc = await getDoc(doc(db, COLLECTIONS.PATIENTS, id));
      
      if (!patientDoc.exists()) return null;
      
      return {
        ...patientDoc.data(),
        id: patientDoc.id
      } as Patient;
    } catch (error) {
      console.error('Get patient error:', error);
      return null;
    }
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    try {
      this.checkDemoMode();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.PATIENTS), {
        ...patient,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newPatientDoc = await getDoc(docRef);
      return {
        ...newPatientDoc.data(),
        id: newPatientDoc.id
      } as Patient;
    } catch (error) {
      console.error('Create patient error:', error);
      throw error;
    }
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    try {
      this.checkDemoMode();
      
      const patientRef = doc(db, COLLECTIONS.PATIENTS, id);
      
      await updateDoc(patientRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedPatientDoc = await getDoc(patientRef);
      return {
        ...updatedPatientDoc.data(),
        id: updatedPatientDoc.id
      } as Patient;
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      this.checkDemoMode();
      
      const patientRef = doc(db, COLLECTIONS.PATIENTS, id);
      
      await updateDoc(patientRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  }

  // Doctor methods
  async getDoctors(): Promise<Doctor[]> {
    try {
      if (config.isDemoMode) return [];
      
      const doctorsQuery = query(
        collection(db, COLLECTIONS.DOCTORS),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const doctorsSnapshot = await getDocs(doctorsQuery);
      
      return doctorsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Doctor));
    } catch (error) {
      console.error('Get doctors error:', error);
      return [];
    }
  }

  async getDoctor(id: string): Promise<Doctor | null> {
    try {
      if (config.isDemoMode) return null;
      
      const doctorDoc = await getDoc(doc(db, COLLECTIONS.DOCTORS, id));
      
      if (!doctorDoc.exists()) return null;
      
      return {
        ...doctorDoc.data(),
        id: doctorDoc.id
      } as Doctor;
    } catch (error) {
      console.error('Get doctor error:', error);
      return null;
    }
  }

  async createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> {
    try {
      this.checkDemoMode();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.DOCTORS), {
        ...doctor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newDoctorDoc = await getDoc(docRef);
      return {
        ...newDoctorDoc.data(),
        id: newDoctorDoc.id
      } as Doctor;
    } catch (error) {
      console.error('Create doctor error:', error);
      throw error;
    }
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    try {
      this.checkDemoMode();
      
      const doctorRef = doc(db, COLLECTIONS.DOCTORS, id);
      
      await updateDoc(doctorRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoctorDoc = await getDoc(doctorRef);
      return {
        ...updatedDoctorDoc.data(),
        id: updatedDoctorDoc.id
      } as Doctor;
    } catch (error) {
      console.error('Update doctor error:', error);
      throw error;
    }
  }

  async deleteDoctor(id: string): Promise<void> {
    try {
      this.checkDemoMode();
      
      const doctorRef = doc(db, COLLECTIONS.DOCTORS, id);
      
      await updateDoc(doctorRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Delete doctor error:', error);
      throw error;
    }
  }

  // Medication methods
  async getMedications(): Promise<Medication[]> {
    try {
      if (config.isDemoMode) return [];
      
      const medicationsQuery = query(
        collection(db, COLLECTIONS.MEDICATIONS),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const medicationsSnapshot = await getDocs(medicationsQuery);
      
      return medicationsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Medication));
    } catch (error) {
      console.error('Get medications error:', error);
      return [];
    }
  }

  async getMedication(id: string): Promise<Medication | null> {
    try {
      if (config.isDemoMode) return null;
      
      const medicationDoc = await getDoc(doc(db, COLLECTIONS.MEDICATIONS, id));
      
      if (!medicationDoc.exists()) return null;
      
      return {
        ...medicationDoc.data(),
        id: medicationDoc.id
      } as Medication;
    } catch (error) {
      console.error('Get medication error:', error);
      return null;
    }
  }

  async createMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medication> {
    try {
      this.checkDemoMode();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.MEDICATIONS), {
        ...medication,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newMedicationDoc = await getDoc(docRef);
      return {
        ...newMedicationDoc.data(),
        id: newMedicationDoc.id
      } as Medication;
    } catch (error) {
      console.error('Create medication error:', error);
      throw error;
    }
  }

  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    try {
      this.checkDemoMode();
      
      const medicationRef = doc(db, COLLECTIONS.MEDICATIONS, id);
      
      await updateDoc(medicationRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedMedicationDoc = await getDoc(medicationRef);
      return {
        ...updatedMedicationDoc.data(),
        id: updatedMedicationDoc.id
      } as Medication;
    } catch (error) {
      console.error('Update medication error:', error);
      throw error;
    }
  }

  async deleteMedication(id: string): Promise<void> {
    try {
      this.checkDemoMode();
      
      const medicationRef = doc(db, COLLECTIONS.MEDICATIONS, id);
      
      await updateDoc(medicationRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Delete medication error:', error);
      throw error;
    }
  }

  // Schedule methods
  async getSchedules(): Promise<MedicationSchedule[]> {
    try {
      if (config.isDemoMode) return [];
      
      const schedulesQuery = query(
        collection(db, COLLECTIONS.SCHEDULES),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const schedulesSnapshot = await getDocs(schedulesQuery);
      
      return schedulesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as MedicationSchedule));
    } catch (error) {
      console.error('Get schedules error:', error);
      return [];
    }
  }

  async getSchedulesByPatient(patientId: string): Promise<MedicationSchedule[]> {
    try {
      if (config.isDemoMode) return [];
      
      const schedulesQuery = query(
        collection(db, COLLECTIONS.SCHEDULES),
        where('patientId', '==', patientId),
        where('isActive', '==', true),
        orderBy('startDate', 'desc')
      );
      
      const schedulesSnapshot = await getDocs(schedulesQuery);
      
      return schedulesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as MedicationSchedule));
    } catch (error) {
      console.error('Get schedules by patient error:', error);
      return [];
    }
  }

  async createSchedule(schedule: Omit<MedicationSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicationSchedule> {
    try {
      this.checkDemoMode();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.SCHEDULES), {
        ...schedule,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newScheduleDoc = await getDoc(docRef);
      return {
        ...newScheduleDoc.data(),
        id: newScheduleDoc.id
      } as MedicationSchedule;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  }

  async updateSchedule(id: string, updates: Partial<MedicationSchedule>): Promise<MedicationSchedule> {
    try {
      this.checkDemoMode();
      
      const scheduleRef = doc(db, COLLECTIONS.SCHEDULES, id);
      
      await updateDoc(scheduleRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedScheduleDoc = await getDoc(scheduleRef);
      return {
        ...updatedScheduleDoc.data(),
        id: updatedScheduleDoc.id
      } as MedicationSchedule;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  }

  async deleteSchedule(id: string): Promise<void> {
    try {
      this.checkDemoMode();
      
      const scheduleRef = doc(db, COLLECTIONS.SCHEDULES, id);
      
      await updateDoc(scheduleRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  }

  // Consumption record methods
  async getConsumptionRecords(): Promise<ConsumptionRecord[]> {
    try {
      if (config.isDemoMode) return [];
      
      const recordsQuery = query(
        collection(db, COLLECTIONS.CONSUMPTION_RECORDS),
        orderBy('date', 'desc'),
        orderBy('scheduledTime', 'desc')
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      
      return recordsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ConsumptionRecord));
    } catch (error) {
      console.error('Get consumption records error:', error);
      return [];
    }
  }

  async getConsumptionRecordsByPatient(patientId: string): Promise<ConsumptionRecord[]> {
    try {
      if (config.isDemoMode) return [];
      
      const recordsQuery = query(
        collection(db, COLLECTIONS.CONSUMPTION_RECORDS),
        where('patientId', '==', patientId),
        orderBy('date', 'desc'),
        orderBy('scheduledTime', 'desc')
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      
      return recordsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ConsumptionRecord));
    } catch (error) {
      console.error('Get consumption records by patient error:', error);
      return [];
    }
  }

  async createConsumptionRecord(record: Omit<ConsumptionRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConsumptionRecord> {
    try {
      this.checkDemoMode();
      
      const docRef = await addDoc(collection(db, COLLECTIONS.CONSUMPTION_RECORDS), {
        ...record,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newRecordDoc = await getDoc(docRef);
      return {
        ...newRecordDoc.data(),
        id: newRecordDoc.id
      } as ConsumptionRecord;
    } catch (error) {
      console.error('Create consumption record error:', error);
      throw error;
    }
  }

  async updateConsumptionRecord(id: string, updates: Partial<ConsumptionRecord>): Promise<ConsumptionRecord> {
    try {
      this.checkDemoMode();
      
      const recordRef = doc(db, COLLECTIONS.CONSUMPTION_RECORDS, id);
      
      await updateDoc(recordRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedRecordDoc = await getDoc(recordRef);
      return {
        ...updatedRecordDoc.data(),
        id: updatedRecordDoc.id
      } as ConsumptionRecord;
    } catch (error) {
      console.error('Update consumption record error:', error);
      throw error;
    }
  }

  // Analytics and statistics
  async getPatientComplianceRate(patientId: string): Promise<number> {
    try {
      if (config.isDemoMode) return 0;
      
      const recordsQuery = query(
        collection(db, COLLECTIONS.CONSUMPTION_RECORDS),
        where('patientId', '==', patientId)
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      
      if (recordsSnapshot.empty) return 0;
      
      const records = recordsSnapshot.docs.map(doc => doc.data() as ConsumptionRecord);
      const takenRecords = records.filter(r => r.status === 'taken' || r.status === 'late');
      
      return Math.round((takenRecords.length / records.length) * 100);
    } catch (error) {
      console.error('Get patient compliance rate error:', error);
      return 0;
    }
  }

  async getDashboardStats(userId: string, userRole: string) {
    try {
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

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (userRole === 'admin') {
        // Admin dashboard stats
        const [patientsSnapshot, doctorsSnapshot, medicationsSnapshot, todayRecordsSnapshot] = await Promise.all([
          getDocs(query(collection(db, COLLECTIONS.PATIENTS), where('isActive', '==', true))),
          getDocs(query(collection(db, COLLECTIONS.DOCTORS), where('isActive', '==', true))),
          getDocs(query(collection(db, COLLECTIONS.MEDICATIONS), where('isActive', '==', true))),
          getDocs(query(collection(db, COLLECTIONS.CONSUMPTION_RECORDS), where('date', '==', today)))
        ]);

        const totalPatients = patientsSnapshot.size;
        const totalDoctors = doctorsSnapshot.size;
        const totalMedications = medicationsSnapshot.size;
        const todayRecords = todayRecordsSnapshot.docs.map(doc => doc.data() as ConsumptionRecord);
        const missedToday = todayRecords.filter(r => r.status === 'missed').length;
        const complianceToday = todayRecords.length > 0 
          ? Math.round((todayRecords.filter(r => r.status === 'taken' || r.status === 'late').length / todayRecords.length) * 100)
          : 0;

        return {
          totalPatients,
          totalDoctors,
          totalMedications,
          missedToday,
          complianceToday
        };
      } else if (userRole === 'doctor') {
        // Doctor dashboard stats
        const myPatientsSnapshot = await getDocs(
          query(collection(db, COLLECTIONS.PATIENTS), where('doctorId', '==', userId), where('isActive', '==', true))
        );
        
        const myPatients = myPatientsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient));
        
        if (myPatients.length === 0) {
          return {
            totalPatients: 0,
            averageCompliance: 0,
            missedToday: 0,
            schedulesToday: 0
          };
        }

        const patientIds = myPatients.map(p => p.id);
        const [todayRecordsSnapshot, activeSchedulesSnapshot] = await Promise.all([
          getDocs(query(collection(db, COLLECTIONS.CONSUMPTION_RECORDS), where('date', '==', today))),
          getDocs(query(collection(db, COLLECTIONS.SCHEDULES), where('isActive', '==', true)))
        ]);

        const todayRecords = todayRecordsSnapshot.docs
          .map(doc => doc.data() as ConsumptionRecord)
          .filter(record => patientIds.includes(record.patientId));
        
        const activeSchedules = activeSchedulesSnapshot.docs
          .map(doc => doc.data() as MedicationSchedule)
          .filter(schedule => patientIds.includes(schedule.patientId));
        
        const missedToday = todayRecords.filter(r => r.status === 'missed').length;

        // Calculate average compliance across all patients
        let totalCompliance = 0;
        for (const patient of myPatients) {
          const compliance = await this.getPatientComplianceRate(patient.id);
          totalCompliance += compliance;
        }
        const averageCompliance = myPatients.length > 0 ? Math.round(totalCompliance / myPatients.length) : 0;

        return {
          totalPatients: myPatients.length,
          averageCompliance,
          missedToday,
          schedulesToday: activeSchedules.length
        };
      } else if (userRole === 'patient') {
        // Patient dashboard stats
        const userProfile = await this.getUserProfile(userId);
        if (!userProfile) throw new Error('User profile not found');

        // Find patient record by email
        const patientQuery = query(
          collection(db, COLLECTIONS.PATIENTS),
          where('email', '==', userProfile.email)
        );
        
        const patientSnapshot = await getDocs(patientQuery);
        
        if (patientSnapshot.empty) {
          return {
            schedulesToday: 0,
            compliance: 0,
            missedThisWeek: 0,
            upcomingReminders: 0
          };
        }

        const patientData = patientSnapshot.docs[0].data() as Patient;
        const patientId = patientSnapshot.docs[0].id;

        const [todaySchedulesSnapshot, weekRecordsSnapshot] = await Promise.all([
          getDocs(query(
            collection(db, COLLECTIONS.SCHEDULES), 
            where('patientId', '==', patientId), 
            where('isActive', '==', true)
          )),
          getDocs(query(
            collection(db, COLLECTIONS.CONSUMPTION_RECORDS), 
            where('patientId', '==', patientId),
            where('date', '>=', weekAgo)
          ))
        ]);

        const todaySchedules = todaySchedulesSnapshot.docs
          .map(doc => doc.data() as MedicationSchedule)
          .filter(schedule => {
            const startDate = new Date(schedule.startDate);
            const endDate = new Date(schedule.endDate);
            const todayDate = new Date(today);
            return startDate <= todayDate && endDate >= todayDate;
          });

        const weekRecords = weekRecordsSnapshot.docs.map(doc => doc.data() as ConsumptionRecord);
        const schedulesToday = todaySchedules.reduce((total, schedule) => total + schedule.times.length, 0);
        const missedThisWeek = weekRecords.filter(r => r.status === 'missed').length;
        const compliance = await this.getPatientComplianceRate(patientId);

        return {
          schedulesToday,
          compliance,
          missedThisWeek,
          upcomingReminders: schedulesToday // Simplified for now
        };
      }

      return {};
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {};
    }
  }

  // Real-time subscriptions using Firestore onSnapshot
  subscribeToPatients(callback: (patients: Patient[]) => void) {
    if (config.isDemoMode) {
      return () => {};
    }
    
    const patientsQuery = query(
      collection(db, COLLECTIONS.PATIENTS),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(patientsQuery, (snapshot) => {
      const patients = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Patient));
      callback(patients);
    });
  }

  subscribeToSchedules(callback: (schedules: MedicationSchedule[]) => void) {
    if (config.isDemoMode) {
      return () => {};
    }
    
    const schedulesQuery = query(
      collection(db, COLLECTIONS.SCHEDULES),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(schedulesQuery, (snapshot) => {
      const schedules = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as MedicationSchedule));
      callback(schedules);
    });
  }

  subscribeToConsumptionRecords(callback: (records: ConsumptionRecord[]) => void) {
    if (config.isDemoMode) {
      return () => {};
    }
    
    const recordsQuery = query(
      collection(db, COLLECTIONS.CONSUMPTION_RECORDS),
      orderBy('date', 'desc'),
      orderBy('scheduledTime', 'desc')
    );
    
    return onSnapshot(recordsQuery, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ConsumptionRecord));
      callback(records);
    });
  }

  // Cleanup subscriptions
  unsubscribe(unsubscribeFunction: () => void) {
    if (unsubscribeFunction && !config.isDemoMode) {
      unsubscribeFunction();
    }
  }
}

export const firebaseService = new FirebaseService();