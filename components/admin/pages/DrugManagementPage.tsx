import { useState } from "react";
import { 
  Pill, 
  Plus, 
  Calendar, 
  Clock,
  Search,
  Edit,
  Trash2,
  Save,
  User
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { medicalDataStore, MedicationSchedule, sampleMedications } from "../../../data/medicalData";

export function DrugManagementPage() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(medicalDataStore.getSchedules());
  const [patients] = useState(medicalDataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState<MedicationSchedule[]>(schedules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MedicationSchedule | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    medicationId: "",
    dosage: "",
    times: [""],
    startDate: "",
    endDate: "",
    instructions: "",
    prescribedBy: "Dr. Sarah Wilson"
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = schedules.filter(schedule => {
      const patient = patients.find(p => p.id === schedule.patientId);
      return schedule.medicationName.toLowerCase().includes(term.toLowerCase()) ||
             patient?.name.toLowerCase().includes(term.toLowerCase()) ||
             schedule.prescribedBy.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredSchedules(filtered);
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      medicationId: "",
      dosage: "",
      times: [""],
      startDate: "",
      endDate: "",
      instructions: "",
      prescribedBy: "Dr. Sarah Wilson"
    });
  };

  const handleAddTime = () => {
    setFormData({
      ...formData,
      times: [...formData.times, ""]
    });
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      times: newTimes.length > 0 ? newTimes : [""]
    });
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const handleAddSchedule = () => {
    const medication = sampleMedications.find(m => m.id === formData.medicationId);
    if (!medication) return;

    const newSchedule = medicalDataStore.addSchedule({
      patientId: formData.patientId,
      medicationId: formData.medicationId,
      medicationName: `${medication.name} ${formData.dosage}`,
      dosage: formData.dosage,
      times: formData.times.filter(t => t.trim() !== ""),
      startDate: formData.startDate,
      endDate: formData.endDate,
      instructions: formData.instructions,
      isActive: true,
      prescribedBy: formData.prescribedBy
    });

    const updatedSchedules = medicalDataStore.getSchedules();
    setSchedules(updatedSchedules);
    setFilteredSchedules(updatedSchedules);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSchedule = () => {
    if (!selectedSchedule) return;

    const medication = sampleMedications.find(m => m.id === formData.medicationId);
    if (!medication) return;

    const updatedSchedule = medicalDataStore.updateSchedule(selectedSchedule.id, {
      patientId: formData.patientId,
      medicationId: formData.medicationId,
      medicationName: `${medication.name} ${formData.dosage}`,
      dosage: formData.dosage,
      times: formData.times.filter(t => t.trim() !== ""),
      startDate: formData.startDate,
      endDate: formData.endDate,
      instructions: formData.instructions,
      prescribedBy: formData.prescribedBy
    });

    if (updatedSchedule) {
      const updatedSchedules = medicalDataStore.getSchedules();
      setSchedules(updatedSchedules);
      handleSearch(searchTerm);
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedSchedule(null);
    }
  };

  const handleDeleteSchedule = (schedule: MedicationSchedule) => {
    const patient = patients.find(p => p.id === schedule.patientId);
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal ${schedule.medicationName} untuk ${patient?.name}?`)) {
      medicalDataStore.deleteSchedule(schedule.id);
      const updatedSchedules = medicalDataStore.getSchedules();
      setSchedules(updatedSchedules);
      handleSearch(searchTerm);
    }
  };

  const openEditDialog = (schedule: MedicationSchedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      patientId: schedule.patientId,
      medicationId: schedule.medicationId,
      dosage: schedule.dosage,
      times: schedule.times,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      instructions: schedule.instructions,
      prescribedBy: schedule.prescribedBy
    });
    setIsEditDialogOpen(true);
  };

  const ScheduleForm = ({ isEdit = false }) => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient">Pasien</Label>
          <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
            <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
              <SelectValue placeholder="Pilih pasien" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-dark-color">
              {patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id} className="text-dark-primary">
                  {patient.name} - {patient.age} tahun
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medication">Obat</Label>
          <Select value={formData.medicationId} onValueChange={(value) => setFormData({...formData, medicationId: value})}>
            <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
              <SelectValue placeholder="Pilih obat" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-dark-color">
              {sampleMedications.map(medication => (
                <SelectItem key={medication.id} value={medication.id} className="text-dark-primary">
                  {medication.name} - {medication.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosis</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            placeholder="500mg, 1 tablet, dll"
            className="bg-dark-tag border-dark-color text-dark-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prescribedBy">Diresepkan oleh</Label>
          <Input
            id="prescribedBy"
            value={formData.prescribedBy}
            onChange={(e) => setFormData({...formData, prescribedBy: e.target.value})}
            className="bg-dark-tag border-dark-color text-dark-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="bg-dark-tag border-dark-color text-dark-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="bg-dark-tag border-dark-color text-dark-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Waktu Konsumsi</Label>
          <Button
            type="button"
            onClick={handleAddTime}
            size="sm"
            className="dark-button-secondary text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Tambah Waktu
          </Button>
        </div>
        <div className="space-y-2">
          {formData.times.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="bg-dark-tag border-dark-color text-dark-primary"
              />
              {formData.times.length > 1 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveTime(index)}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instruksi Khusus</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          placeholder="Diminum setelah makan, dll"
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
            <h1 className="text-2xl font-semibold text-dark-primary">Manajemen Obat & Jadwal</h1>
            <p className="text-sm text-dark-secondary mt-1">Kelola obat dan jadwal pengingat untuk pasien</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="dark-button-primary gap-2 flex items-center" onClick={() => resetForm()}>
                <Plus className="w-4 h-4" />
                Tambah Jadwal Obat
              </button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-dark-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Tambah Jadwal Obat Baru
                </DialogTitle>
                <DialogDescription className="text-dark-secondary">
                  Buat jadwal konsumsi obat untuk pasien
                </DialogDescription>
              </DialogHeader>
              <ScheduleForm />
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-dark-color text-dark-secondary hover:bg-dark-hover"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleAddSchedule}
                  className="dark-button-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Jadwal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-secondary" />
            <Input
              placeholder="Cari berdasarkan nama obat, pasien, atau dokter..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
        </div>

        {/* Schedules Table */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-400" />
              Jadwal Obat Aktif ({filteredSchedules.filter(s => s.isActive).length})
            </h3>
            <p className="text-dark-secondary font-medium">Daftar semua jadwal konsumsi obat pasien</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">Pasien</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Obat & Dosis</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Waktu Konsumsi</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Periode</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Diresepkan oleh</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Status</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule, index) => {
                  const patient = patients.find(p => p.id === schedule.patientId);
                  return (
                    <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-dark-primary">{patient?.name}</p>
                            <p className="text-xs text-dark-secondary">{patient?.age} tahun</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-dark-primary">{schedule.medicationName}</p>
                          <p className="text-xs text-dark-secondary">{schedule.instructions}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {schedule.times.map((time, i) => (
                            <div key={i} className="dark-tag text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {time}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="text-sm">
                          <p className="text-dark-primary">{schedule.startDate}</p>
                          <p className="text-dark-secondary">s.d {schedule.endDate}</p>
                        </div>
                      </td>
                      <td className="py-4 text-dark-secondary text-sm">{schedule.prescribedBy}</td>
                      <td className="py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          schedule.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {schedule.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openEditDialog(schedule)}
                            className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                          >
                            <Edit className="w-4 h-4 text-dark-secondary" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSchedule(schedule)}
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
          
          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada jadwal ditemukan</h3>
              <p className="text-dark-secondary">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Edit className="w-5 h-5 text-green-400" />
                Edit Jadwal Obat
              </DialogTitle>
              <DialogDescription className="text-dark-secondary">
                Ubah jadwal konsumsi obat
              </DialogDescription>
            </DialogHeader>
            <ScheduleForm isEdit={true} />
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedSchedule(null);
                }}
                className="border-dark-color text-dark-secondary hover:bg-dark-hover"
              >
                Batal
              </Button>
              <Button 
                onClick={handleEditSchedule}
                className="dark-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}