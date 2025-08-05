import {
  initializeApp,
  getApps,
  FirebaseApp,
} from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: "AIzaSyBzhtxNkYC1wRbOiaKrAFR_x6vQcr2eMQU";
  authDomain: "beom-med4.firebaseapp.com";
  projectId: "beom-med4";
  storageBucket: "beom-med4.firebasestorage.app";
  messagingSenderId: "394281537730";
  appId: "1:394281537730:web:fe87cec29a188826d5eb5b";
  measurementId: "G-4B7BPYGPG0";
}

// Get environment variables with fallbacks for demo mode
const getEnvVar = (key: string, fallback?: string): string => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return (window as any).__ENV__?.[key] || fallback || "";
  }

  // Check for Vite environment variables
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || fallback || "";
  }

  // Check for Node.js environment variables
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || fallback || "";
  }

  return fallback || "";
};

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBzhtxNkYC1wRbOiaKrAFR_x6vQcr2eMQU",
  authDomain: "beom-med4.firebaseapp.com",
  projectId: "beom-med4",
  storageBucket: "beom-med4.firebasestorage.app",
  messagingSenderId: "394281537730",
  appId: "1:394281537730:web:fe87cec29a188826d5eb5b",
  measurementId: "G-4B7BPYGPG0",
};

// Check if we're in demo mode
const isDemoMode =
  false; // Set to false since we have real Firebase config

// Initialize Firebase only if not in demo mode and not already initialized
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!isDemoMode) {
  try {
    // Initialize Firebase app if not already initialized
    app =
      getApps().length === 0
        ? initializeApp(firebaseConfig)
        : getApps()[0];

    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Enable offline persistence for Firestore
    // enablePersistence(db).catch((err) => {
    //   if (err.code === 'failed-precondition') {
    //     console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    //   } else if (err.code === 'unimplemented') {
    //     console.warn('The current browser does not support all of the features required to enable persistence');
    //   }
    // });
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

// Export Firebase services
export { auth, db, storage };

// Export configuration and demo mode status
export const config = {
  ...firebaseConfig,
  isDemoMode,
};

// Collection names constants
export const COLLECTIONS = {
  USERS: "users",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  MEDICATIONS: "medications",
  SCHEDULES: "schedules",
  CONSUMPTION_RECORDS: "consumptionRecords",
  SYSTEM_SETTINGS: "systemSettings",
  NOTIFICATIONS: "notifications",
} as const;

// Firestore subcollections
export const SUBCOLLECTIONS = {
  USER_PROFILES: "profiles",
  PATIENT_SCHEDULES: "schedules",
  PATIENT_RECORDS: "records",
  DOCTOR_PATIENTS: "patients",
} as const;

// Firebase error messages in Indonesian
export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Pengguna tidak ditemukan",
  "auth/wrong-password": "Password salah",
  "auth/email-already-in-use": "Email sudah digunakan",
  "auth/weak-password": "Password terlalu lemah",
  "auth/invalid-email": "Format email tidak valid",
  "auth/user-disabled": "Akun pengguna telah dinonaktifkan",
  "auth/too-many-requests":
    "Terlalu banyak percobaan login. Coba lagi nanti",
  "auth/network-request-failed": "Koneksi jaringan bermasalah",
  "permission-denied": "Akses ditolak",
  unavailable: "Layanan tidak tersedia",
  "not-found": "Data tidak ditemukan",
  "already-exists": "Data sudah ada",
  "resource-exhausted": "Kuota terlampaui",
  unauthenticated: "Belum login",
  cancelled: "Operasi dibatalkan",
  unknown: "Terjadi kesalahan yang tidak diketahui",
};

// Helper function to get user-friendly error message
export const getFirebaseErrorMessage = (
  errorCode: string,
): string => {
  return (
    FIREBASE_ERROR_MESSAGES[errorCode] ||
    FIREBASE_ERROR_MESSAGES["unknown"]
  );
};

// Types for Firestore documents
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface BaseDocument {
  id: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  isActive: boolean;
}

// Demo mode status
if (isDemoMode && typeof window !== "undefined") {
  console.info(
    "🔥 Firebase Demo Mode - Konfigurasi Firebase untuk fitur lengkap",
  );
}

export default app;