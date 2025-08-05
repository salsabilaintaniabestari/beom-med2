import { User, Mail, Phone, MapPin, Calendar, Heart } from "lucide-react";
import { User as UserType } from "../../../App";

interface PatientProfilePageProps {
  user: UserType;
}

export function PatientProfilePage({ user }: PatientProfilePageProps) {
  return (
    <>
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Profil Saya</h1>
            <p className="text-sm text-dark-secondary mt-1">Informasi pribadi dan riwayat kesehatan</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        <div className="max-w-2xl mx-auto">
          <div className="dark-card">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-primary">{user.name}</h2>
                <p className="text-dark-secondary mb-2">Pasien</p>
                <div className="dark-tag bg-purple-600">
                  ID: {user.id}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <p className="font-medium text-dark-primary">+62 812 3456 7890</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Alamat</p>
                    <p className="font-medium text-dark-primary">Jakarta, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-dark-secondary" />
                  <div>
                    <p className="text-sm text-dark-secondary">Umur</p>
                    <p className="font-medium text-dark-primary">35 tahun</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="border-t border-dark-color pt-8">
              <h3 className="text-lg font-semibold text-dark-primary mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Riwayat Kesehatan
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-tag rounded-lg">
                  <h4 className="font-medium text-dark-primary">Kondisi Saat Ini</h4>
                  <p className="text-sm text-dark-secondary mt-1">Hipertensi, Diabetes Tipe 2</p>
                </div>
                <div className="p-4 bg-dark-tag rounded-lg">
                  <h4 className="font-medium text-dark-primary">Dokter yang Menangani</h4>
                  <p className="text-sm text-dark-secondary mt-1">Dr. Michael Chen - Penyakit Dalam</p>
                </div>
                <div className="p-4 bg-dark-tag rounded-lg">
                  <h4 className="font-medium text-dark-primary">Alergi Obat</h4>
                  <p className="text-sm text-dark-secondary mt-1">Penisilin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}