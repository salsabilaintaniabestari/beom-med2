import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, UserRole } from '../App';

export interface CreateUserData {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
}

export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  isActive: boolean;
}

class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user document from Firestore
      const userDoc = await this.getUserDocument(user.uid);
      
      if (!userDoc) {
        throw new Error('User document not found in database');
      }

      if (!userDoc.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      return {
        id: userDoc.uid,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        avatar: userDoc.name.charAt(0).toUpperCase()
      };
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        throw new Error(this.getReadableErrorMessage(error.message));
      }
      throw new Error('An unexpected error occurred during sign in');
    }
  }

  // Create new user account
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;

      // Create user document in Firestore
      const userDocument: UserDocument = {
        uid: user.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: new Date().toISOString(),
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber,
        phone: userData.phone,
        isActive: true
      };

      await setDoc(doc(db, 'users', user.uid), userDocument);

      return {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.name.charAt(0).toUpperCase()
      };
    } catch (error) {
      console.error('Create user error:', error);
      if (error instanceof Error) {
        throw new Error(this.getReadableErrorMessage(error.message));
      }
      throw new Error('An unexpected error occurred during account creation');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get user document from Firestore
  async getUserDocument(uid: string): Promise<UserDocument | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        return userDocSnap.data() as UserDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Get user document error:', error);
      return null;
    }
  }

  // Check if email already exists
  async emailExists(email: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await this.getUserDocument(firebaseUser.uid);
          if (userDoc && userDoc.isActive) {
            const user: User = {
              id: userDoc.uid,
              name: userDoc.name,
              email: userDoc.email,
              role: userDoc.role,
              avatar: userDoc.name.charAt(0).toUpperCase()
            };
            callback(user);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Convert Firebase error messages to user-friendly messages
  private getReadableErrorMessage(errorMessage: string): string {
    if (errorMessage.includes('user-not-found')) {
      return 'No account found with this email address';
    }
    if (errorMessage.includes('wrong-password')) {
      return 'Incorrect password';
    }
    if (errorMessage.includes('email-already-in-use')) {
      return 'An account with this email already exists';
    }
    if (errorMessage.includes('weak-password')) {
      return 'Password should be at least 6 characters';
    }
    if (errorMessage.includes('invalid-email')) {
      return 'Please enter a valid email address';
    }
    if (errorMessage.includes('too-many-requests')) {
      return 'Too many failed attempts. Please try again later';
    }
    if (errorMessage.includes('network-request-failed')) {
      return 'Network error. Please check your connection';
    }
    
    return errorMessage;
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();