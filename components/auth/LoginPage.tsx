import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Shield, Stethoscope, User, Heart, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, Info } from "lucide-react";
import { User as UserType, UserRole } from "../../App";
import { firebaseService } from "../../services/firebaseService";
import { config } from "../../lib/firebase";

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    phone: ""
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { user: authUser } = await firebaseService.signIn(formData.email, formData.password);
      
      if (!authUser) {
        throw new Error('Login gagal - tidak ada data pengguna');
      }

      // Get full user profile
      const userProfile = await firebaseService.getCurrentUser();
      
      if (!userProfile) {
        throw new Error('Profil pengguna tidak ditemukan');
      }

      onLogin(userProfile);
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Terjadi kesalahan saat login';
      
      if (error?.message?.includes('demo')) {
        errorMessage = 'Mode demo aktif. Silakan konfigurasi Firebase untuk fitur lengkap.';
      } else if (error?.message?.includes('user-not-found') || error?.message?.includes('wrong-password')) {
        errorMessage = 'Email atau password salah';
      } else if (error?.message?.includes('too-many-requests')) {
        errorMessage = 'Terlalu banyak percobaan login. Coba lagi nanti';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Semua field wajib harus diisi");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (selectedRole === 'doctor' && (!formData.specialization || !formData.licenseNumber)) {
      setError("Spesialisasi dan nomor izin praktik wajib diisi untuk dokter");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userData = {
        name: formData.name,
        role: selectedRole,
        specialization: formData.specialization || undefined,
        license_number: formData.licenseNumber || undefined,
        phone: formData.phone || undefined,
      };

      const { user: authUser } = await firebaseService.signUp(formData.email, formData.password, userData);
      
      if (!authUser) {
        throw new Error('Pendaftaran gagal - tidak ada data pengguna');
      }

      setError("");
      alert("Pendaftaran berhasil! Anda akan diarahkan ke dashboard.");
      
      // Get the created user profile and login automatically
      const userProfile = await firebaseService.getCurrentUser();
      if (userProfile) {
        onLogin(userProfile);
      } else {
        // Switch to login mode if auto-login fails
        setIsSignUp(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          specialization: "",
          licenseNumber: "",
          phone: ""
        });
      }
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Terjadi kesalahan saat mendaftar';
      
      if (error?.message?.includes('demo')) {
        errorMessage = 'Mode demo aktif. Silakan konfigurasi Firebase untuk fitur lengkap.';
      } else if (error?.message?.includes('email-already-in-use')) {
        errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login';
      } else if (error?.message?.includes('weak-password')) {
        errorMessage = 'Password terlalu lemah. Gunakan minimal 6 karakter dengan kombinasi huruf dan angka';
      } else if (error?.message?.includes('invalid-email')) {
        errorMessage = 'Format email tidak valid';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isSignUp) {
        handleSignUp();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl flex items-center justify-center dark-shadow-lg mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark-primary mb-2">Beom-med</h1>
          <p className="text-dark-secondary font-medium">Sistem Pengingat Obat Rumah Sakit</p>
        </div>

        {/* Demo Mode Info - More subtle */}
        {config.isDemoMode && showDemoInfo && (
          <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-sm text-orange-400">Mode Demo - Konfigurasi Firebase untuk fitur lengkap</span>
              </div>
              <button
                onClick={() => setShowDemoInfo(false)}
                className="text-orange-400 hover:text-orange-300 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="dark-card">
          <div className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-dark-primary">
                {isSignUp ? "Daftar Akun" : "Login"}
              </h2>
              {isSignUp && (
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      specialization: "",
                      licenseNumber: "",
                      phone: ""
                    });
                  }}
                  className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 text-dark-secondary" />
                </button>
              )}
            </div>
            <p className="text-dark-secondary font-medium">
              {isSignUp 
                ? "Buat akun baru untuk mengakses sistem" 
                : "Masukkan email dan password untuk login"
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {!isSignUp ? (
              // Login Form
              <>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Email</label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-dark-tag border-dark-color text-dark-primary"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-dark-tag border-dark-color text-dark-primary pr-10"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-secondary hover:text-dark-primary"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="dark-button-primary w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    'Login ke Sistem'
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-dark-color">
                  <p className="text-sm text-dark-secondary mb-3">Belum punya akun?</p>
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                    disabled={isLoading}
                  >
                    Daftar Akun Baru
                  </button>
                </div>
              </>
            ) : (
              // Sign Up Form
              <>
                {/* Role Selection for Sign Up */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-dark-primary">Peran Pengguna</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole as (value: string) => void} disabled={isLoading}>
                    <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-card border-dark-color">
                      <SelectItem value="admin" className="text-dark-primary hover:bg-dark-hover">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span>Administrator</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="doctor" className="text-dark-primary hover:bg-dark-hover">
                        <div className="flex items-center space-x-3">
                          <Stethoscope className="w-4 h-4 text-green-400" />
                          <span>Dokter</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="patient" className="text-dark-primary hover:bg-dark-hover">
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-purple-400" />
                          <span>Pasien</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Nama Lengkap</label>
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-dark-tag border-dark-color text-dark-primary"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Email</label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-dark-tag border-dark-color text-dark-primary"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Nomor Telepon</label>
                  <Input
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-dark-tag border-dark-color text-dark-primary"
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-dark-primary">Spesialisasi *</label>
                      <Input
                        type="text"
                        placeholder="Penyakit Dalam, Kardiologi, dll"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        className="bg-dark-tag border-dark-color text-dark-primary"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-dark-primary">Nomor Izin Praktik *</label>
                      <Input
                        type="text"
                        placeholder="STR/SIP"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        className="bg-dark-tag border-dark-color text-dark-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-dark-tag border-dark-color text-dark-primary pr-10"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-secondary hover:text-dark-primary"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-primary">Konfirmasi Password</label>
                  <Input
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-dark-tag border-dark-color text-dark-primary"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>

                {/* Sign Up Button */}
                <Button 
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="dark-button-primary w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      {selectedRole === 'admin' && <Shield className="w-4 h-4" />}
                      {selectedRole === 'doctor' && <Stethoscope className="w-4 h-4" />}
                      {selectedRole === 'patient' && <User className="w-4 h-4" />}
                      Daftar sebagai {selectedRole === 'admin' ? 'Administrator' : selectedRole === 'doctor' ? 'Dokter' : 'Pasien'}
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-dark-color">
                  <p className="text-sm text-dark-secondary mb-3">Sudah punya akun?</p>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                    disabled={isLoading}
                  >
                    Login ke Akun Anda
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-dark-secondary">
            © 2024 Beom-med - Sistem Manajemen Pengingat Obat
          </p>
        </div>
      </div>
    </div>
  );
}