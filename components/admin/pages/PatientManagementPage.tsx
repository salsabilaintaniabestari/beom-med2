import { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  UserPlus
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { medicalDataStore, Patient, sampleDoctors } from "../../../data/medicalData";

export function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(medicalDataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    email: "",
    phone: "",
    address: "",
    medicalConditions: "",
    doctorId: "",
    allergies: "",
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
      patient.id.toLowerCase().includes(term.toLowerCase()) ||
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
      gender: "Laki-laki",
      email: "",
      phone: "",
      address: "",
      medicalConditions: "",
      doctorId: "",
      allergies: "",
      bloodType: "",
      weight: "",
      height: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: ""
    });
  };

  const handleAddPatient = () => {
    const doctor = sampleDoctors.find(d => d.id === formData.doctorId);
    if (!doctor) return;

    const newPatient = medicalDataStore.addPatient({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      medicalConditions: formData.medicalConditions.split(",").map(c => c.trim()).filter(c => c),
      doctorId: formData.doctorId,
      doctorName: doctor.name,
      registrationDate: new Date().toISOString().split('T')[0],
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      },
      allergies: formData.allergies.split(",").map(a => a.trim()).filter(a => a),
      bloodType: formData.bloodType,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    });

    const updatedPatients = medicalDataStore.getPatients();
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;

    const doctor = sampleDoctors.find(d => d.id === formData.doctorId);
    if (!doctor) return;

    const updatedPatient = medicalDataStore.updatePatient(selectedPatient.id, {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      medicalConditions: formData.medicalConditions.split(",").map(c => c.trim()).filter(c => c),
      doctorId: formData.doctorId,
      doctorName: doctor.name,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      },
      allergies: formData.allergies.split(",").map(a => a.trim()).filter(a => a),
      bloodType: formData.bloodType,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height)
    });

    if (updatedPatient) {
      const updatedPatients = medicalDataStore.getPatients();
      setPatients(updatedPatients);
      handleSearch(searchTerm);
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedPatient(null);
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pasien ${patient.name}?`)) {
      medicalDataStore.deletePatient(patient.id);
      const updatedPatients = medicalDataStore.getPatients();
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
      medicalConditions: patient.medicalConditions.join(", "),
      doctorId: patient.doctorId,
      allergies: patient.allergies.join(", "),
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

  const PatientForm = ({ isEdit = false }) => (
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
        <Select value={formData.gender} onValueChange={(value: "Laki-laki" | "Perempuan") => setFormData({...formData, gender: value})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue />
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
        <Label htmlFor="phone">Telepon</Label>
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
            <SelectItem value="A+" className="text-dark-primary">A+</SelectItem>
            <SelectItem value="A-" className="text-dark-primary">A-</SelectItem>
            <SelectItem value="B+" className="text-dark-primary">B+</SelectItem>
            <SelectItem value="B-" className="text-dark-primary">B-</SelectItem>
            <SelectItem value="AB+" className="text-dark-primary">AB+</SelectItem>
            <SelectItem value="AB-" className="text-dark-primary">AB-</SelectItem>
            <SelectItem value="O+" className="text-dark-primary">O+</SelectItem>
            <SelectItem value="O-" className="text-dark-primary">O-</SelectItem>
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

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="doctor">Dokter yang Menangani</Label>
        <Select value={formData.doctorId} onValueChange={(value) => setFormData({...formData, doctorId: value})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue placeholder="Pilih dokter" />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-color">
            {sampleDoctors.map(doctor => (
              <SelectItem key={doctor.id} value={doctor.id} className="text-dark-primary">
                {doctor.name} - {doctor.specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="conditions">Kondisi Medis (pisahkan dengan koma)</Label>
        <Input
          id="conditions"
          value={formData.medicalConditions}
          onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
          placeholder="Hipertensi, Diabetes, dll"
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="allergies">Alergi (pisahkan dengan koma)</Label>
        <Input
          id="allergies"
          value={formData.allergies}
          onChange={(e) => setFormData({...formData, allergies: e.target.value})}
          placeholder="Penisilin, Aspirin, dll"
          className="bg-dark-tag border-dark-color text-dark-primary"
        />
      </div>

      <div className="md:col-span-2">
        <h4 className="font-semibold text-dark-primary mb-3">Kontak Darurat</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Nama</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
              className="bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Telepon</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
              className="bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">Hubungan</Label>
            <Input
              id="emergencyRelation"
              value={formData.emergencyContactRelationship}
              onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}
              className="bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Manajemen Pasien</h1>
            <p className="text-sm text-dark-secondary mt-1">Kelola data pasien rumah sakit</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="dark-button-primary gap-2 flex items-center" onClick={() => resetForm()}>
                <Plus className="w-4 h-4" />
                Tambah Pasien
              </button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-dark-primary flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Tambah Pasien Baru
                </DialogTitle>
                <DialogDescription className="text-dark-secondary">
                  Masukkan informasi lengkap pasien baru
                </DialogDescription>
              </DialogHeader>
              <PatientForm />
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-dark-color text-dark-secondary hover:bg-dark-hover"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleAddPatient}
                  className="dark-button-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pasien
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
              placeholder="Cari pasien berdasarkan nama, ID, atau kondisi..."
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
              <Users className="w-5 h-5 text-blue-400" />
              Daftar Pasien ({filteredPatients.length})
            </h3>
            <p className="text-dark-secondary font-medium">Kelola dan pantau data semua pasien</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">ID Pasien</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Nama</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Usia</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Kondisi</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Dokter</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Kepatuhan</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => {
                  const compliance = medicalDataStore.getPatientComplianceRate(patient.id);
                  return (
                    <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                      <td className="py-4">
                        <div className="dark-tag bg-dark-cta">
                          {patient.id}
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-dark-primary">{patient.name}</p>
                          <p className="text-xs text-dark-secondary">{patient.gender}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center font-medium text-dark-primary">{patient.age}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalConditions.slice(0, 2).map((condition, i) => (
                            <div key={i} className="dark-tag text-xs">
                              {condition}
                            </div>
                          ))}
                          {patient.medicalConditions.length > 2 && (
                            <div className="dark-tag text-xs">
                              +{patient.medicalConditions.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-dark-secondary text-sm">{patient.doctorName}</td>
                      <td className="py-4 text-center">
                        <span className={`text-sm font-semibold ${compliance >= 90 ? 'text-dark-positive' : compliance >= 80 ? 'text-yellow-400' : 'text-dark-negative'}`}>
                          {compliance}%
                        </span>
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
                  );
                })}
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
            <PatientForm isEdit={true} />
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
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Detail Pasien
              </DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Informasi Dasar</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Nama:</span> <span className="text-dark-primary">{selectedPatient.name}</span></p>
                      <p><span className="text-dark-secondary">Usia:</span> <span className="text-dark-primary">{selectedPatient.age} tahun</span></p>
                      <p><span className="text-dark-secondary">Jenis Kelamin:</span> <span className="text-dark-primary">{selectedPatient.gender}</span></p>
                      <p><span className="text-dark-secondary">Golongan Darah:</span> <span className="text-dark-primary">{selectedPatient.bloodType}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Kontak</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Email:</span> <span className="text-dark-primary">{selectedPatient.email}</span></p>
                      <p><span className="text-dark-secondary">Telepon:</span> <span className="text-dark-primary">{selectedPatient.phone}</span></p>
                      <p><span className="text-dark-secondary">Alamat:</span> <span className="text-dark-primary">{selectedPatient.address}</span></p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-dark-primary mb-2">Kondisi Medis</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.medicalConditions.map((condition, i) => (
                      <span key={i} className="dark-tag">{condition}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-dark-primary mb-2">Dokter yang Menangani</h4>
                  <p className="text-dark-primary">{selectedPatient.doctorName}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-dark-primary mb-2">Kontak Darurat</h4>
                  <div className="text-sm">
                    <p><span className="text-dark-secondary">Nama:</span> <span className="text-dark-primary">{selectedPatient.emergencyContact.name}</span></p>
                    <p><span className="text-dark-secondary">Telepon:</span> <span className="text-dark-primary">{selectedPatient.emergencyContact.phone}</span></p>
                    <p><span className="text-dark-secondary">Hubungan:</span> <span className="text-dark-primary">{selectedPatient.emergencyContact.relationship}</span></p>
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