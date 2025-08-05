import { useState } from "react";
import { 
  LayoutGrid, 
  Users, 
  Pill, 
  FileText, 
  UserCheck, 
  User,
  LogOut,
  Shield,
  Heart
} from "lucide-react";
import { Separator } from "../ui/separator";
import { User as UserType } from "../../App";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { PatientManagementPage } from "./pages/PatientManagementPage";
import { DrugManagementPage } from "./pages/DrugManagementPage";
import { ConsumptionReportsPage } from "./pages/ConsumptionReportsPage";
import { DoctorManagementPage } from "./pages/DoctorManagementPage";
import { AdminProfilePage } from "./pages/AdminProfilePage";

const mainNavItems = [
  { icon: LayoutGrid, label: "Dashboard", key: "dashboard" },
  { icon: Users, label: "Manajemen Pasien", key: "patients" },
  { icon: Pill, label: "Manajemen Obat & Jadwal", key: "drugs" },
  { icon: FileText, label: "Rekap & Riwayat Konsumsi", key: "reports" },
  { icon: UserCheck, label: "Manajemen Akun Dokter", key: "doctors" },
];

const otherItems = [
  { icon: User, label: "Profil Saya", key: "profile" },
];

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderNavItem = (item: any, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <button
        key={item.key}
        onClick={() => setActivePage(item.key)}
        className={`dark-nav-item w-full text-left ${
          isActive ? "dark-nav-item-active" : ""
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-dark-primary" : "text-dark-secondary"}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboardPage />;
      case "patients":
        return <PatientManagementPage />;
      case "drugs":
        return <DrugManagementPage />;
      case "reports":
        return <ConsumptionReportsPage />;
      case "doctors":
        return <DoctorManagementPage />;
      case "profile":
        return <AdminProfilePage user={user} />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-72 bg-dark-bg border-r border-dark-color flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-dark-color">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center dark-shadow-lg relative overflow-hidden">
              <Heart className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-primary">MediReminder</h1>
              <p className="text-xs text-dark-secondary font-medium">Administrator Panel</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-6 border-b border-dark-color">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-dark-primary">{user.name}</h4>
              <p className="text-xs text-dark-secondary">Administrator</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {mainNavItems.map((item) => renderNavItem(item, activePage === item.key))}
          </div>

          <Separator style={{ backgroundColor: '#374151' }} />

          {/* Other */}
          <div className="space-y-4">
            <div className="px-4">
              <h3 className="text-xs font-bold text-dark-secondary uppercase tracking-widest">Lainnya</h3>
            </div>
            <div className="space-y-2">
              {otherItems.map((item) => renderNavItem(item, activePage === item.key))}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-dark-color">
          <button 
            onClick={onLogout}
            className="dark-nav-item w-full text-left text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}