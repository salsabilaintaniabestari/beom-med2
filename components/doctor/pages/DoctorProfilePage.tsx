import { User, Mail, Phone, MapPin, Calendar, Stethoscope } from "lucide-react";
import { User as UserType } from "../../../App";

interface DoctorProfilePageProps {
  user: UserType;
}

export function DoctorProfilePage({ user }: DoctorProfilePageProps) {
  return (
    <>
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Profil Saya</h1>
            <p className="text-sm text-dark-secondary mt-1">Kelola informasi profil dokter</p>
          </div>
          <button className="dark-button-primary">
            Edit Profil
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        <div className="max-w-2xl mx-auto">
          <div className="dark-card">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-primary">{user.name}</h2>
                <p className="text-dark-secondary mb-2">Dokter Spesialis</p>
                <div className="dark-tag bg-green-600">
                  ID: {user.id}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Email</p>
                    <p className="font-medium text-dark-primary">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Telepon</p>
                    <p className="font-medium text-dark-primary">+62 21 9876 5432</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Spesialisasi</p>
                    <p className="font-medium text-dark-primary">Penyakit Dalam</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Bergabung Sejak</p>
                    <p className="font-medium text-dark-primary">Maret 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}