import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Patient, 
  Doctor, 
  Medication, 
  MedicationSchedule, 
  ConsumptionRecord 
} from '../data/medicalData';

export class FirestoreService {
  // Patients Collection
  async getPatients(): Promise<Patient[]> {
    try {
      const patientsRef = collection(db, 'patients');
      const snapshot = await getDocs(patientsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  }

  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    try {
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, where('doctorId', '==', doctorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
    } catch (error) {
      console.error('Error fetching patients by doctor:', error);
      return [];
    }
  }

  async addPatient(patient: Omit<Patient, 'id'>): Promise<string> {
    try {
      const patientsRef = collection(db, 'patients');
      const docRef = await addDoc(patientsRef, {
        ...patient,
        registrationDate: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw new Error('Failed to add patient');
    }
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
    try {
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, updates);
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      const patientRef = doc(db, 'patients', id);
      await deleteDoc(patientRef);
      
      // Also delete related schedules and records
      await this.deletePatientSchedules(id);
      await this.deletePatientRecords(id);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }
  }

  // Doctors Collection
  async getDoctors(): Promise<Doctor[]> {
    try {
      const doctorsRef = collection(db, 'doctors');
      const snapshot = await getDocs(doctorsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }

  async addDoctor(doctor: Omit<Doctor, 'id'>): Promise<string> {
    try {
      const doctorsRef = collection(db, 'doctors');
      const docRef = await addDoc(doctorsRef, doctor);
      return docRef.id;
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor');
    }
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    try {
      const doctorRef = doc(db, 'doctors', id);
      await updateDoc(doctorRef, updates);
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw new Error('Failed to update doctor');
    }
  }

  async deleteDoctor(id: string): Promise<void> {
    try {
      const doctorRef = doc(db, 'doctors', id);
      await deleteDoc(doctorRef);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw new Error('Failed to delete doctor');
    }
  }

  // Medications Collection
  async getMedications(): Promise<Medication[]> {
    try {
      const medicationsRef = collection(db, 'medications');
      const snapshot = await getDocs(medicationsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  }

  async addMedication(medication: Omit<Medication, 'id'>): Promise<string> {
    try {
      const medicationsRef = collection(db, 'medications');
      const docRef = await addDoc(medicationsRef, medication);
      return docRef.id;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error('Failed to add medication');
    }
  }

  async updateMedication(id: string, updates: Partial<Medication>): Promise<void> {
    try {
      const medicationRef = doc(db, 'medications', id);
      await updateDoc(medicationRef, updates);
    } catch (error) {
      console.error('Error updating medication:', error);
      throw new Error('Failed to update medication');
    }
  }

  async deleteMedication(id: string): Promise<void> {
    try {
      const medicationRef = doc(db, 'medications', id);
      await deleteDoc(medicationRef);
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw new Error('Failed to delete medication');
    }
  }

  // Medication Schedules Collection
  async getSchedules(): Promise<MedicationSchedule[]> {
    try {
      const schedulesRef = collection(db, 'schedules');
      const q = query(schedulesRef, orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicationSchedule));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return [];
    }
  }

  async getSchedulesByPatient(patientId: string): Promise<MedicationSchedule[]> {
    try {
      const schedulesRef = collection(db, 'schedules');
      const q = query(
        schedulesRef, 
        where('patientId', '==', patientId),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicationSchedule));
    } catch (error) {
      console.error('Error fetching patient schedules:', error);
      return [];
    }
  }

  async addSchedule(schedule: Omit<MedicationSchedule, 'id'>): Promise<string> {
    try {
      const schedulesRef = collection(db, 'schedules');
      const docRef = await addDoc(schedulesRef, schedule);
      return docRef.id;
    } catch (error) {
      console.error('Error adding schedule:', error);
      throw new Error('Failed to add schedule');
    }
  }

  async updateSchedule(id: string, updates: Partial<MedicationSchedule>): Promise<void> {
    try {
      const scheduleRef = doc(db, 'schedules', id);
      await updateDoc(scheduleRef, updates);
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw new Error('Failed to update schedule');
    }
  }

  async deleteSchedule(id: string): Promise<void> {
    try {
      const scheduleRef = doc(db, 'schedules', id);
      await deleteDoc(scheduleRef);
      
      // Also delete related consumption records
      await this.deleteScheduleRecords(id);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw new Error('Failed to delete schedule');
    }
  }

  // Consumption Records Collection
  async getConsumptionRecords(): Promise<ConsumptionRecord[]> {
    try {
      const recordsRef = collection(db, 'consumption_records');
      const q = query(recordsRef, orderBy('date', 'desc'), limit(1000));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsumptionRecord));
    } catch (error) {
      console.error('Error fetching consumption records:', error);
      return [];
    }
  }

  async getRecordsByPatient(patientId: string): Promise<ConsumptionRecord[]> {
    try {
      const recordsRef = collection(db, 'consumption_records');
      const q = query(
        recordsRef, 
        where('patientId', '==', patientId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsumptionRecord));
    } catch (error) {
      console.error('Error fetching patient records:', error);
      return [];
    }
  }

  async getRecordsByDoctor(doctorId: string): Promise<ConsumptionRecord[]> {
    try {
      // First get patients for this doctor
      const patients = await this.getPatientsByDoctor(doctorId);
      const patientIds = patients.map(p => p.id);
      
      if (patientIds.length === 0) return [];

      const recordsRef = collection(db, 'consumption_records');
      const q = query(
        recordsRef,
        where('patientId', 'in', patientIds),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsumptionRecord));
    } catch (error) {
      console.error('Error fetching doctor records:', error);
      return [];
    }
  }

  async addConsumptionRecord(record: Omit<ConsumptionRecord, 'id'>): Promise<string> {
    try {
      const recordsRef = collection(db, 'consumption_records');
      const docRef = await addDoc(recordsRef, record);
      return docRef.id;
    } catch (error) {
      console.error('Error adding consumption record:', error);
      throw new Error('Failed to add consumption record');
    }
  }

  async updateConsumptionRecord(id: string, updates: Partial<ConsumptionRecord>): Promise<void> {
    try {
      const recordRef = doc(db, 'consumption_records', id);
      await updateDoc(recordRef, updates);
    } catch (error) {
      console.error('Error updating consumption record:', error);
      throw new Error('Failed to update consumption record');
    }
  }

  // Helper methods for data cleanup
  private async deletePatientSchedules(patientId: string): Promise<void> {
    try {
      const schedulesRef = collection(db, 'schedules');
      const q = query(schedulesRef, where('patientId', '==', patientId));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting patient schedules:', error);
    }
  }

  private async deletePatientRecords(patientId: string): Promise<void> {
    try {
      const recordsRef = collection(db, 'consumption_records');
      const q = query(recordsRef, where('patientId', '==', patientId));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting patient records:', error);
    }
  }

  private async deleteScheduleRecords(scheduleId: string): Promise<void> {
    try {
      const recordsRef = collection(db, 'consumption_records');
      const q = query(recordsRef, where('scheduleId', '==', scheduleId));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting schedule records:', error);
    }
  }

  // Analytics and Statistics
  async getPatientComplianceRate(patientId: string): Promise<number> {
    try {
      const records = await this.getRecordsByPatient(patientId);
      if (records.length === 0) return 0;
      
      const takenRecords = records.filter(r => r.status === 'taken' || r.status === 'late');
      return Math.round((takenRecords.length / records.length) * 100);
    } catch (error) {
      console.error('Error calculating compliance rate:', error);
      return 0;
    }
  }

  async getDoctorPatientsStats(doctorId: string) {
    try {
      const patients = await this.getPatientsByDoctor(doctorId);
      const totalPatients = patients.length;
      
      let totalCompliance = 0;
      let totalMissed = 0;
      
      for (const patient of patients) {
        const compliance = await this.getPatientComplianceRate(patient.id);
        totalCompliance += compliance;
        
        const todayRecords = await this.getRecordsByPatient(patient.id);
        const missedToday = todayRecords.filter(r => 
          r.status === 'missed' && 
          r.date === new Date().toISOString().split('T')[0]
        ).length;
        totalMissed += missedToday;
      }

      return {
        totalPatients,
        averageCompliance: totalPatients > 0 ? Math.round(totalCompliance / totalPatients) : 0,
        missedToday: totalMissed
      };
    } catch (error) {
      console.error('Error getting doctor stats:', error);
      return {
        totalPatients: 0,
        averageCompliance: 0,
        missedToday: 0
      };
    }
  }
}

export const firestoreService = new FirestoreService();