import { useState } from "react";
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Save,
  UserPlus
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { medicalDataStore, Doctor, sampleDoctors } from "../../../data/medicalData";

export function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    phone: "",
    experience: "",
    education: "",
    address: ""
  });

  const specializations = [
    "Penyakit Dalam",
    "Kardiologi", 
    "Endokrinologi",
    "Neurologi",
    "Pulmonologi",
    "Gastroenterologi",
    "Ortopedi",
    "Dermatologi",
    "Psikiatri",
    "Urologi"
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(term.toLowerCase()) ||
      doctor.email.toLowerCase().includes(term.toLowerCase()) ||
      doctor.licenseNumber.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      specialization: "",
      licenseNumber: "",
      phone: "",
      experience: "",
      education: "",
      address: ""
    });
  };

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: `doctor-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      phone: formData.phone,
      patients: []
    };

    const updatedDoctors = [...doctors, newDoctor];
    setDoctors(updatedDoctors);
    setFilteredDoctors(updatedDoctors);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditDoctor = () => {
    if (!selectedDoctor) return;

    const updatedDoctors = doctors.map(doctor => 
      doctor.id === selectedDoctor.id
        ? {
            ...doctor,
            name: formData.name,
            email: formData.email,
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber,
            phone: formData.phone
          }
        : doctor
    );

    setDoctors(updatedDoctors);
    handleSearch(searchTerm);
    setIsEditDialogOpen(false);
    resetForm();
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data dokter ${doctor.name}?`)) {
      const updatedDoctors = doctors.filter(d => d.id !== doctor.id);
      setDoctors(updatedDoctors);
      handleSearch(searchTerm);
    }
  };

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      phone: doctor.phone,
      experience: "",
      education: "",
      address: ""
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewDialogOpen(true);
  };

  const DoctorForm = ({ isEdit = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="Dr. Nama Lengkap"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="email@hospital.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Spesialisasi</Label>
        <Select value={formData.specialization} onValueChange={(value) => setFormData({...formData, specialization: value})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue placeholder="Pilih spesialisasi" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-color">
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec} className="text-dark-primary">
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseNumber">Nomor Izin Praktik</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="STR-12345678"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="+62 21 1234 5678"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Pengalaman</Label>
        <Input
          id="experience"
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="10 tahun"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="education">Pendidikan</Label>
        <Input
          id="education"
          value={formData.education}
          onChange={(e) => setFormData({...formData, education: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="S1 Kedokteran Universitas Indonesia"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address">Alamat Praktik</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="Jl. Sudirman No. 123, Jakarta"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Manajemen Dokter</h1>
            <p className="text-sm text-dark-secondary mt-1">Kelola data dokter rumah sakit</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="dark-button-primary gap-2 flex items-center" onClick={() => resetForm()}>
                <Plus className="w-4 h-4" />
                Tambah Dokter
              </button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-dark-primary flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-400" />
                  Tambah Dokter Baru
                </DialogTitle>
                <DialogDescription className="text-dark-secondary">
                  Masukkan informasi lengkap dokter baru
                </DialogDescription>
              </DialogHeader>
              <DoctorForm />
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-dark-color text-dark-secondary hover:bg-dark-hover"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleAddDoctor}
                  className="dark-button-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Dokter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-secondary" />
            <Input
              placeholder="Cari dokter berdasarkan nama, spesialisasi, atau SIP..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
          <button className="dark-button-secondary gap-2 flex items-center">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Doctors Table */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-400" />
              Daftar Dokter ({filteredDoctors.length})
            </h3>
            <p className="text-dark-secondary font-medium">Kelola dan pantau data semua dokter</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">Dokter</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Spesialisasi</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">SIP</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Kontak</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Pasien</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{doctor.name}</p>
                          <p className="text-xs text-dark-secondary">{doctor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="dark-tag bg-green-500/20 text-green-400">
                        {doctor.specialization}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="dark-tag bg-dark-cta">
                        {doctor.licenseNumber}
                      </div>
                    </td>
                    <td className="py-4 text-dark-secondary text-sm">
                      {doctor.phone}
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-sm font-semibold text-dark-primary">
                        {doctor.patients.length}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openViewDialog(doctor)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                        >
                          <Eye className="w-4 h-4 text-dark-secondary" />
                        </button>
                        <button 
                          onClick={() => openEditDialog(doctor)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                        >
                          <Edit className="w-4 h-4 text-dark-secondary" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDoctor(doctor)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada dokter ditemukan</h3>
              <p className="text-dark-secondary">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Edit className="w-5 h-5 text-green-400" />
                Edit Data Dokter
              </DialogTitle>
              <DialogDescription className="text-dark-secondary">
                Ubah informasi dokter {selectedDoctor?.name}
              </DialogDescription>
            </DialogHeader>
            <DoctorForm isEdit={true} />
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedDoctor(null);
                }}
                className="border-dark-color text-dark-secondary hover:bg-dark-hover"
              >
                Batal
              </Button>
              <Button 
                onClick={handleEditDoctor}
                className="dark-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Detail Dokter
              </DialogTitle>
            </DialogHeader>
            {selectedDoctor && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Informasi Dasar</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Nama:</span> <span className="text-dark-primary">{selectedDoctor.name}</span></p>
                      <p><span className="text-dark-secondary">Email:</span> <span className="text-dark-primary">{selectedDoctor.email}</span></p>
                      <p><span className="text-dark-secondary">Telepon:</span> <span className="text-dark-primary">{selectedDoctor.phone}</span></p>
                      <p><span className="text-dark-secondary">SIP:</span> <span className="text-dark-primary">{selectedDoctor.licenseNumber}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Profesional</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Spesialisasi:</span> <span className="text-dark-primary">{selectedDoctor.specialization}</span></p>
                      <p><span className="text-dark-secondary">Jumlah Pasien:</span> <span className="text-dark-primary">{selectedDoctor.patients.length} orang</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}