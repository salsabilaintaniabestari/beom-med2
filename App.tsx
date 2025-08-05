import { useState, useEffect } from "react";
import { LoginPage } from "./components/auth/LoginPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { DoctorDashboard } from "./components/doctor/DoctorDashboard";
import { PatientDashboard } from "./components/patient/PatientDashboard";
import { firebaseService } from "./services/firebaseService";

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Listen for authentication state changes
    const unsubscribe = firebaseService.onAuthStateChange(async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      
      if (!isMounted) return;

      try {
        if (currentUser) {
          // User signed in
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // User signed out
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await firebaseService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-dark-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    case 'doctor':
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    case 'patient':
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}