import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Save,
  User,
  Heart,
  Calendar
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { medicalDataStore, Patient } from "../../../data/medicalData";

export function DoctorPatientPage() {
  const [patients, setPatients] = useState<Patient[]>(medicalDataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    medicalConditions: [],
    allergies: [],
    bloodType: "",
    weight: "",
    height: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: ""
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.email.toLowerCase().includes(term.toLowerCase()) ||
      patient.medicalConditions.some(condition => 
        condition.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      medicalConditions: [],
      allergies: [],
      bloodType: "",
      weight: "",
      height: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: ""
    });
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;

    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id
        ? {
            ...patient,
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender as "Laki-laki" | "Perempuan",
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            bloodType: formData.bloodType,
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height),
            emergencyContact: {
              name: formData.emergencyContactName,
              phone: formData.emergencyContactPhone,
              relationship: formData.emergencyContactRelationship
            }
          }
        : patient
    );

    setPatients(updatedPatients);
    handleSearch(searchTerm);
    setIsEditDialogOpen(false);
    resetForm();
    setSelectedPatient(null);
  };

  const handleDeletePatient = (patient: Patient) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pasien ${patient.name}?`)) {
      const updatedPatients = patients.filter(p => p.id !== patient.id);
      setPatients(updatedPatients);
      handleSearch(searchTerm);
    }
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      medicalConditions: patient.medicalConditions,
      allergies: patient.allergies,
      bloodType: patient.bloodType,
      weight: patient.weight.toString(),
      height: patient.height.toString(),
      emergencyContactName: patient.emergencyContact.name,
      emergencyContactPhone: patient.emergencyContact.phone,
      emergencyContactRelationship: patient.emergencyContact.relationship
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const PatientForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Usia</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Jenis Kelamin</Label>
        <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue placeholder="Pilih jenis kelamin" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-color">
            <SelectItem value="Laki-laki" className="text-dark-primary">Laki-laki</SelectItem>
            <SelectItem value="Perempuan" className="text-dark-primary">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bloodType">Golongan Darah</Label>
        <Select value={formData.bloodType} onValueChange={(value) => setFormData({...formData, bloodType: value})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue placeholder="Pilih golongan darah" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-color">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
              <SelectItem key={type} value={type} className="text-dark-primary">{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Berat Badan (kg)</Label>
        <Input
          id="weight"
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({...formData, weight: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">Tinggi Badan (cm)</Label>
        <Input
          id="height"
          type="number"
          value={formData.height}
          onChange={(e) => setFormData({...formData, height: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
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
            <h1 className="text-2xl font-semibold text-dark-primary">Data Pasien</h1>
            <p className="text-sm text-dark-secondary mt-1">Lihat dan edit data pasien di bawah pengawasan</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-secondary" />
            <Input
              placeholder="Cari pasien berdasarkan nama, email, atau kondisi..."
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

        {/* Patients Table */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Daftar Pasien ({filteredPatients.length})
            </h3>
            <p className="text-dark-secondary font-medium">Kelola dan pantau data pasien Anda</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">Pasien</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Kondisi Medis</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Kontak</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Umur</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Golongan Darah</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{patient.name}</p>
                          <p className="text-xs text-dark-secondary">{patient.gender}, {patient.age} tahun</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalConditions.map((condition, idx) => (
                          <span key={idx} className="dark-tag bg-red-500/20 text-red-400 text-xs">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-dark-secondary text-sm">
                      <div>
                        <p>{patient.email}</p>
                        <p>{patient.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="dark-tag bg-dark-cta text-white">
                        {patient.age} tahun
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="dark-tag bg-purple-500/20 text-purple-400">
                        {patient.bloodType}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openViewDialog(patient)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                        >
                          <Eye className="w-4 h-4 text-dark-secondary" />
                        </button>
                        <button 
                          onClick={() => openEditDialog(patient)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                        >
                          <Edit className="w-4 h-4 text-dark-secondary" />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient)}
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
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada pasien ditemukan</h3>
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
                Edit Data Pasien
              </DialogTitle>
              <DialogDescription className="text-dark-secondary">
                Ubah informasi pasien {selectedPatient?.name}
              </DialogDescription>
            </DialogHeader>
            <PatientForm />
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedPatient(null);
                }}
                className="border-dark-color text-dark-secondary hover:bg-dark-hover"
              >
                Batal
              </Button>
              <Button 
                onClick={handleEditPatient}
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
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Detail Pasien
              </DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-3">Informasi Dasar</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Nama:</span> <span className="text-dark-primary">{selectedPatient.name}</span></p>
                      <p><span className="text-dark-secondary">Usia:</span> <span className="text-dark-primary">{selectedPatient.age} tahun</span></p>
                      <p><span className="text-dark-secondary">Jenis Kelamin:</span> <span className="text-dark-primary">{selectedPatient.gender}</span></p>
                      <p><span className="text-dark-secondary">Golongan Darah:</span> <span className="text-dark-primary">{selectedPatient.bloodType}</span></p>
                      <p><span className="text-dark-secondary">Berat/Tinggi:</span> <span className="text-dark-primary">{selectedPatient.weight} kg / {selectedPatient.height} cm</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-3">Kontak</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Email:</span> <span className="text-dark-primary">{selectedPatient.email}</span></p>
                      <p><span className="text-dark-secondary">Telepon:</span> <span className="text-dark-primary">{selectedPatient.phone}</span></p>
                      <p><span className="text-dark-secondary">Alamat:</span> <span className="text-dark-primary">{selectedPatient.address}</span></p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-dark-primary mb-3">Kondisi Medis</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.medicalConditions.map((condition, idx) => (
                      <span key={idx} className="dark-tag bg-red-500/20 text-red-400">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-dark-primary mb-3">Alergi</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, idx) => (
                      <span key={idx} className="dark-tag bg-yellow-500/20 text-yellow-400">
                        {allergy}
                      </span>
                    ))}
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