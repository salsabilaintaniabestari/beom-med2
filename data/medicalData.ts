export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Laki-laki" | "Perempuan";
  email: string;
  phone: string;
  address: string;
  medicalConditions: string[];
  doctorId: string;
  doctorName: string;
  registrationDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  allergies: string[];
  bloodType: string;
  weight: number;
  height: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  category: "Antibiotik" | "Vitamin" | "Analgesik" | "Antihipertensi" | "Antidiabetes" | "Lainnya";
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
  instructions: string;
  isActive: boolean;
  prescribedBy: string;
}

export interface ConsumptionRecord {
  id: string;
  patientId: string;
  scheduleId: string;
  medicationName: string;
  scheduledTime: string;
  actualTime?: string;
  status: "taken" | "missed" | "late";
  date: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  patients: string[];
}

// Sample Data
export const sampleMedications: Medication[] = [
  {
    id: "med-1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "2x sehari",
    instructions: "Diminum setelah makan",
    sideEffects: ["Mual", "Diare", "Perut kembung"],
    category: "Antidiabetes"
  },
  {
    id: "med-2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "1x sehari",
    instructions: "Diminum sebelum makan",
    sideEffects: ["Batuk kering", "Pusing"],
    category: "Antihipertensi"
  },
  {
    id: "med-3",
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "1x sehari",
    instructions: "Diminum setelah makan",
    sideEffects: ["Minimal"],
    category: "Vitamin"
  },
  {
    id: "med-4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3x sehari",
    instructions: "Diminum setiap 8 jam",
    sideEffects: ["Mual", "Ruam kulit", "Diare"],
    category: "Antibiotik"
  },
  {
    id: "med-5",
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "Bila perlu",
    instructions: "Untuk demam dan nyeri",
    sideEffects: ["Jarang"],
    category: "Analgesik"
  }
];

// Sample users for authentication
export const sampleUsers = [
  {
    id: "admin-1",
    name: "Administrator",
    email: "admin@beom-med.com",
    password: "admin123", 
    role: "admin" as const,
    avatar: "A"
  },
  {
    id: "doctor-1",
    name: "Dr. Michael Chen",
    email: "michael.chen@beom-med.com",
    password: "doctor123",
    role: "doctor" as const,
    avatar: "MC"
  },
  {
    id: "doctor-2", 
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@beom-med.com",
    password: "doctor123",
    role: "doctor" as const,
    avatar: "SW"
  },
  {
    id: "patient-1",
    name: "John Smith",
    email: "john.smith@email.com",
    password: "patient123",
    role: "patient" as const,
    avatar: "JS"
  }
];

export const sampleDoctors: Doctor[] = [
  {
    id: "doctor-1",
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    specialization: "Penyakit Dalam",
    licenseNumber: "STR-12345678",
    phone: "+62 21 9876 5432",
    patients: ["patient-1", "patient-3", "patient-5"]
  },
  {
    id: "doctor-2",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@hospital.com",
    specialization: "Kardiologi",
    licenseNumber: "STR-87654321",
    phone: "+62 21 5432 9876",
    patients: ["patient-2", "patient-4"]
  },
  {
    id: "doctor-3",
    name: "Dr. Ahmad Rahman",
    email: "ahmad.rahman@hospital.com",
    specialization: "Endokrinologi",
    licenseNumber: "STR-11223344",
    phone: "+62 21 1122 3344",
    patients: []
  },
  {
    id: "doctor-4",
    name: "Dr. Sari Dewi",
    email: "sari.dewi@hospital.com",
    specialization: "Neurologi",
    licenseNumber: "STR-55667788",
    phone: "+62 21 5566 7788",
    patients: []
  },
  {
    id: "doctor-5",
    name: "Dr. Budi Santoso",
    email: "budi.santoso@hospital.com",
    specialization: "Ortopedi",
    licenseNumber: "STR-99887766",
    phone: "+62 21 9988 7766",
    patients: []
  }
];

export const samplePatients: Patient[] = [
  {
    id: "patient-1",
    name: "John Smith",
    age: 45,
    gender: "Laki-laki",
    email: "john.smith@email.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta",
    medicalConditions: ["Hipertensi", "Diabetes Tipe 2"],
    doctorId: "doctor-1",
    doctorName: "Dr. Michael Chen",
    registrationDate: "2024-01-15",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+62 812 9876 5432",
      relationship: "Istri"
    },
    allergies: ["Penisilin"],
    bloodType: "O+",
    weight: 75,
    height: 170
  },
  {
    id: "patient-2",
    name: "Maria Garcia",
    age: 38,
    gender: "Perempuan",
    email: "maria.garcia@email.com",
    phone: "+62 813 2468 1357",
    address: "Jl. Thamrin No. 456, Jakarta",
    medicalConditions: ["Diabetes Tipe 1"],
    doctorId: "doctor-2",
    doctorName: "Dr. Sarah Wilson",
    registrationDate: "2024-01-14",
    emergencyContact: {
      name: "Carlos Garcia",
      phone: "+62 813 1357 2468",
      relationship: "Suami"
    },
    allergies: ["Sulfa"],
    bloodType: "A+",
    weight: 65,
    height: 165
  },
  {
    id: "patient-3",
    name: "Robert Johnson",
    age: 62,
    gender: "Laki-laki",
    email: "robert.johnson@email.com",
    phone: "+62 814 9876 5432",
    address: "Jl. Gatot Subroto No. 789, Jakarta",
    medicalConditions: ["Penyakit Jantung Koroner", "Hipertensi"],
    doctorId: "doctor-1",
    doctorName: "Dr. Michael Chen",
    registrationDate: "2024-01-13",
    emergencyContact: {
      name: "Mary Johnson",
      phone: "+62 814 5432 9876",
      relationship: "Istri"
    },
    allergies: ["Aspirin"],
    bloodType: "B+",
    weight: 80,
    height: 175
  },
  {
    id: "patient-4",
    name: "Lisa Anderson",
    age: 29,
    gender: "Perempuan",
    email: "lisa.anderson@email.com",
    phone: "+62 815 1234 5678",
    address: "Jl. Kuningan No. 321, Jakarta",
    medicalConditions: ["Asma"],
    doctorId: "doctor-2",
    doctorName: "Dr. Sarah Wilson",
    registrationDate: "2024-01-12",
    emergencyContact: {
      name: "Mike Anderson",
      phone: "+62 815 8765 4321",
      relationship: "Suami"
    },
    allergies: ["Debu", "Bulu kucing"],
    bloodType: "AB+",
    weight: 60,
    height: 160
  },
  {
    id: "patient-5",
    name: "Ahmad Wijaya",
    age: 55,
    gender: "Laki-laki",
    email: "ahmad.wijaya@email.com",
    phone: "+62 816 2468 1357",
    address: "Jl. Kemang No. 654, Jakarta",
    medicalConditions: ["Kolesterol Tinggi", "Hipertensi"],
    doctorId: "doctor-1",
    doctorName: "Dr. Michael Chen",
    registrationDate: "2024-01-11",
    emergencyContact: {
      name: "Siti Wijaya",
      phone: "+62 816 1357 2468",
      relationship: "Istri"
    },
    allergies: ["Tidak ada"],
    bloodType: "O-",
    weight: 78,
    height: 168
  }
];

export const sampleSchedules: MedicationSchedule[] = [
  {
    id: "schedule-1",
    patientId: "patient-1",
    medicationId: "med-1",
    medicationName: "Metformin 500mg",
    dosage: "500mg",
    times: ["08:00", "20:00"],
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    instructions: "Diminum setelah makan",
    isActive: true,
    prescribedBy: "Dr. Michael Chen"
  },
  {
    id: "schedule-2",
    patientId: "patient-1",
    medicationId: "med-2",
    medicationName: "Lisinopril 10mg",
    dosage: "10mg",
    times: ["12:00"],
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    instructions: "Diminum sebelum makan siang",
    isActive: true,
    prescribedBy: "Dr. Michael Chen"
  },
  {
    id: "schedule-3",
    patientId: "patient-1",
    medicationId: "med-3",
    medicationName: "Vitamin D3 1000 IU",
    dosage: "1000 IU",
    times: ["14:30"],
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    instructions: "Diminum setelah makan siang",
    isActive: true,
    prescribedBy: "Dr. Michael Chen"
  }
];

export const sampleConsumptionRecords: ConsumptionRecord[] = [
  // John Smith records for the past week
  {
    id: "record-1",
    patientId: "patient-1",
    scheduleId: "schedule-1",
    medicationName: "Metformin 500mg",
    scheduledTime: "08:00",
    actualTime: "08:05",
    status: "taken",
    date: "2024-01-20",
    notes: "Diminum tepat waktu"
  },
  {
    id: "record-2",
    patientId: "patient-1",
    scheduleId: "schedule-1",
    medicationName: "Metformin 500mg",
    scheduledTime: "20:00",
    actualTime: "20:15",
    status: "late",
    date: "2024-01-20",
    notes: "Terlambat 15 menit"
  },
  {
    id: "record-3",
    patientId: "patient-1",
    scheduleId: "schedule-2",
    medicationName: "Lisinopril 10mg",
    scheduledTime: "12:00",
    actualTime: "12:00",
    status: "taken",
    date: "2024-01-20"
  },
  {
    id: "record-4",
    patientId: "patient-1",
    scheduleId: "schedule-3",
    medicationName: "Vitamin D3 1000 IU",
    scheduledTime: "14:30",
    status: "missed",
    date: "2024-01-20",
    notes: "Lupa minum obat"
  }
];

// Data store class for managing application state
export class MedicalDataStore {
  private patients: Patient[] = [...samplePatients];
  private medications: Medication[] = [...sampleMedications];
  private schedules: MedicationSchedule[] = [...sampleSchedules];
  private records: ConsumptionRecord[] = [...sampleConsumptionRecords];
  private doctors: Doctor[] = [...sampleDoctors];

  // Patient methods
  getPatients(): Patient[] {
    return this.patients;
  }

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  getPatientsByDoctor(doctorId: string): Patient[] {
    return this.patients.filter(p => p.doctorId === doctorId);
  }

  addPatient(patient: Omit<Patient, 'id'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: `patient-${Date.now()}`
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | undefined {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates };
      return this.patients[index];
    }
    return undefined;
  }

  deletePatient(id: string): boolean {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      // Also remove related schedules and records
      this.schedules = this.schedules.filter(s => s.patientId !== id);
      this.records = this.records.filter(r => r.patientId !== id);
      return true;
    }
    return false;
  }

  // Medication methods
  getMedications(): Medication[] {
    return this.medications;
  }

  getMedicationById(id: string): Medication | undefined {
    return this.medications.find(m => m.id === id);
  }

  // Schedule methods
  getSchedules(): MedicationSchedule[] {
    return this.schedules;
  }

  getSchedulesByPatient(patientId: string): MedicationSchedule[] {
    return this.schedules.filter(s => s.patientId === patientId && s.isActive);
  }

  addSchedule(schedule: Omit<MedicationSchedule, 'id'>): MedicationSchedule {
    const newSchedule: MedicationSchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`
    };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  updateSchedule(id: string, updates: Partial<MedicationSchedule>): MedicationSchedule | undefined {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.schedules[index] = { ...this.schedules[index], ...updates };
      return this.schedules[index];
    }
    return undefined;
  }

  deleteSchedule(id: string): boolean {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.schedules.splice(index, 1);
      // Also remove related records
      this.records = this.records.filter(r => r.scheduleId !== id);
      return true;
    }
    return false;
  }

  // Consumption record methods
  getConsumptionRecords(): ConsumptionRecord[] {
    return this.records;
  }

  getRecordsByPatient(patientId: string): ConsumptionRecord[] {
    return this.records.filter(r => r.patientId === patientId);
  }

  getRecordsByDoctor(doctorId: string): ConsumptionRecord[] {
    const doctorPatients = this.getPatientsByDoctor(doctorId);
    const patientIds = doctorPatients.map(p => p.id);
    return this.records.filter(r => patientIds.includes(r.patientId));
  }

  addConsumptionRecord(record: Omit<ConsumptionRecord, 'id'>): ConsumptionRecord {
    const newRecord: ConsumptionRecord = {
      ...record,
      id: `record-${Date.now()}`
    };
    this.records.push(newRecord);
    return newRecord;
  }

  // Statistics methods
  getPatientComplianceRate(patientId: string): number {
    const patientRecords = this.getRecordsByPatient(patientId);
    if (patientRecords.length === 0) return 0;
    
    const takenRecords = patientRecords.filter(r => r.status === 'taken' || r.status === 'late');
    return Math.round((takenRecords.length / patientRecords.length) * 100);
  }

  getDoctorPatientsStats(doctorId: string) {
    const patients = this.getPatientsByDoctor(doctorId);
    const totalPatients = patients.length;
    
    let totalCompliance = 0;
    let totalMissed = 0;
    
    patients.forEach(patient => {
      const compliance = this.getPatientComplianceRate(patient.id);
      totalCompliance += compliance;
      
      const missedToday = this.records.filter(r => 
        r.patientId === patient.id && 
        r.status === 'missed' && 
        r.date === new Date().toISOString().split('T')[0]
      ).length;
      totalMissed += missedToday;
    });

    return {
      totalPatients,
      averageCompliance: totalPatients > 0 ? Math.round(totalCompliance / totalPatients) : 0,
      missedToday: totalMissed
    };
  }

  // Doctor methods
  getDoctors(): Doctor[] {
    return this.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  // Authentication method
  authenticateUser(email: string, password: string) {
    const user = sampleUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}

// Global instance
export const medicalDataStore = new MedicalDataStore();