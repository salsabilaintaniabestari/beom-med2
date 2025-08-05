import { useState } from "react";
import { 
  Pill, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Save,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { medicalDataStore, MedicationSchedule, Patient } from "../../../data/medicalData";

export function DoctorDrugPage() {
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(medicalDataStore.getSchedules());
  const [patients] = useState<Patient[]>(medicalDataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState<MedicationSchedule[]>(schedules);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MedicationSchedule | null>(null);
  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    times: [""],
    startDate: "",
    endDate: "",
    instructions: "",
    isActive: true
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = schedules.filter(schedule => {
      const patient = patients.find(p => p.id === schedule.patientId);
      return schedule.medicationName.toLowerCase().includes(term.toLowerCase()) ||
             patient?.name.toLowerCase().includes(term.toLowerCase()) ||
             schedule.instructions.toLowerCase().includes(term.toLowerCase());
    });
    setFilteredSchedules(filtered);
  };

  const resetForm = () => {
    setFormData({
      medicationName: "",
      dosage: "",
      times: [""],
      startDate: "",
      endDate: "",
      instructions: "",
      isActive: true
    });
  };

  const handleEditSchedule = () => {
    if (!selectedSchedule) return;

    const updatedSchedules = schedules.map(schedule => 
      schedule.id === selectedSchedule.id
        ? {
            ...schedule,
            medicationName: formData.medicationName,
            dosage: formData.dosage,
            times: formData.times.filter(time => time.trim() !== ""),
            startDate: formData.startDate,
            endDate: formData.endDate,
            instructions: formData.instructions,
            isActive: formData.isActive
          }
        : schedule
    );

    setSchedules(updatedSchedules);
    handleSearch(searchTerm);
    setIsEditDialogOpen(false);
    resetForm();
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (schedule: MedicationSchedule) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal ${schedule.medicationName}?`)) {
      const updatedSchedules = schedules.filter(s => s.id !== schedule.id);
      setSchedules(updatedSchedules);
      handleSearch(searchTerm);
    }
  };

  const openEditDialog = (schedule: MedicationSchedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      medicationName: schedule.medicationName,
      dosage: schedule.dosage,
      times: schedule.times,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      instructions: schedule.instructions,
      isActive: schedule.isActive
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (schedule: MedicationSchedule) => {
    setSelectedSchedule(schedule);
    setIsViewDialogOpen(true);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Pasien Tidak Ditemukan';
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      times: [...formData.times, ""]
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = formData.times.filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      times: newTimes.length > 0 ? newTimes : [""]
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const ScheduleForm = () => (
    <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="medicationName">Nama Obat</Label>
        <Input
          id="medicationName"
          value={formData.medicationName}
          onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="Contoh: Metformin 500mg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dosage">Dosis</Label>
        <Input
          id="dosage"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="Contoh: 500mg"
        />
      </div>

      <div className="space-y-2">
        <Label>Waktu Konsumsi</Label>
        {formData.times.map((time, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="time"
              value={time}
              onChange={(e) => updateTimeSlot(index, e.target.value)}
              className="bg-dark-tag border-dark-color text-dark-primary flex-1"
            />
            {formData.times.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeTimeSlot(index)}
                className="border-dark-color text-red-400 hover:bg-red-500/20"
              >
                Hapus
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addTimeSlot}
          className="border-dark-color text-dark-secondary hover:bg-dark-hover"
        >
          + Tambah Waktu
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <Label htmlFor="instructions">Instruksi</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          className="bg-dark-tag border-dark-color text-dark-primary"
          placeholder="Contoh: Diminum setelah makan"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive">Status</Label>
        <Select value={formData.isActive.toString()} onValueChange={(value) => setFormData({...formData, isActive: value === "true"})}>
          <SelectTrigger className="bg-dark-tag border-dark-color text-dark-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-dark-card border-dark-color">
            <SelectItem value="true" className="text-dark-primary">Aktif</SelectItem>
            <SelectItem value="false" className="text-dark-primary">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Data Obat & Jadwal</h1>
            <p className="text-sm text-dark-secondary mt-1">Kelola jadwal pengobatan pasien</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-secondary" />
            <Input
              placeholder="Cari berdasarkan nama obat, pasien, atau instruksi..."
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

        {/* Schedules Table */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-400" />
              Jadwal Pengobatan ({filteredSchedules.length})
            </h3>
            <p className="text-dark-secondary font-medium">Kelola jadwal pengobatan untuk semua pasien</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">Pasien</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Obat & Dosis</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Waktu Konsumsi</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Periode</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Status</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule, index) => (
                  <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{getPatientName(schedule.patientId)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-dark-primary">{schedule.medicationName}</p>
                        <p className="text-sm text-dark-secondary">{schedule.dosage}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {schedule.times.map((time, idx) => (
                          <div key={idx} className="dark-tag bg-blue-500/20 text-blue-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {time}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-dark-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {schedule.startDate} - {schedule.endDate}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        schedule.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {schedule.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openViewDialog(schedule)}
                          className="p-2 rounded-lg bg-dark-tag hover:bg-dark-hover transition-colors"
                        >
                          <Eye className="w-4 h-4 text-dark-secondary" />
                        </button>
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
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <Pill className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada jadwal ditemukan</h3>
              <p className="text-dark-secondary">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                Edit Jadwal Pengobatan
              </DialogTitle>
              <DialogDescription className="text-dark-secondary">
                Ubah jadwal pengobatan {selectedSchedule?.medicationName}
              </DialogDescription>
            </DialogHeader>
            <ScheduleForm />
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

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-dark-card border-dark-color text-dark-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-dark-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Detail Jadwal Pengobatan
              </DialogTitle>
            </DialogHeader>
            {selectedSchedule && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Informasi Obat</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Pasien:</span> <span className="text-dark-primary">{getPatientName(selectedSchedule.patientId)}</span></p>
                      <p><span className="text-dark-secondary">Obat:</span> <span className="text-dark-primary">{selectedSchedule.medicationName}</span></p>
                      <p><span className="text-dark-secondary">Dosis:</span> <span className="text-dark-primary">{selectedSchedule.dosage}</span></p>
                      <p><span className="text-dark-secondary">Status:</span> <span className={selectedSchedule.isActive ? 'text-green-400' : 'text-red-400'}>{selectedSchedule.isActive ? 'Aktif' : 'Tidak Aktif'}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Jadwal</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-dark-secondary">Periode:</span> <span className="text-dark-primary">{selectedSchedule.startDate} - {selectedSchedule.endDate}</span></p>
                      <p><span className="text-dark-secondary">Waktu:</span></p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSchedule.times.map((time, idx) => (
                          <span key={idx} className="dark-tag bg-blue-500/20 text-blue-400 text-xs">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-dark-primary mb-2">Instruksi</h4>
                  <p className="text-sm text-dark-secondary">{selectedSchedule.instructions}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}