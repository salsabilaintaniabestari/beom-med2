import { useState } from "react";
import { 
  LayoutGrid, 
  Users, 
  Pill, 
  FileText, 
  User,
  LogOut,
  Stethoscope,
  Heart
} from "lucide-react";
import { Separator } from "../ui/separator";
import { User as UserType } from "../../App";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { DoctorPatientPage } from "./pages/DoctorPatientPage";
import { DoctorDrugPage } from "./pages/DoctorDrugPage";
import { DoctorHistoryPage } from "./pages/DoctorHistoryPage";
import { DoctorProfilePage } from "./pages/DoctorProfilePage";

const mainNavItems = [
  { icon: LayoutGrid, label: "Dashboard", key: "dashboard" },
  { icon: Users, label: "Data Pasien", key: "patients" },
  { icon: Pill, label: "Data Obat & Jadwal", key: "drugs" },
  { icon: FileText, label: "Riwayat Konsumsi", key: "history" },
];

const otherItems = [
  { icon: User, label: "Profil Saya", key: "profile" },
];

interface DoctorDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
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
        return <DoctorDashboardPage />;
      case "patients":
        return <DoctorPatientPage />;
      case "drugs":
        return <DoctorDrugPage />;
      case "history":
        return <DoctorHistoryPage />;
      case "profile":
        return <DoctorProfilePage user={user} />;
      default:
        return <DoctorDashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-72 bg-dark-bg border-r border-dark-color flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-dark-color">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center dark-shadow-lg relative overflow-hidden">
              <Heart className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-primary">MediReminder</h1>
              <p className="text-xs text-dark-secondary font-medium">Panel Dokter</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-6 border-b border-dark-color">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-dark-primary">{user.name}</h4>
              <p className="text-xs text-dark-secondary">Dokter</p>
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