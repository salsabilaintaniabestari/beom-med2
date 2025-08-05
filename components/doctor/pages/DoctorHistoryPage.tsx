import { useState } from "react";
import { 
  Activity, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Input } from "../../ui/input";
import { medicalDataStore, ConsumptionRecord, Patient } from "../../../data/medicalData";

export function DoctorHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records] = useState(medicalDataStore.getConsumptionRecords());
  const [patients] = useState(medicalDataStore.getPatients());

  const filteredRecords = records.filter(record => {
    const patient = patients.find(p => p.id === record.patientId);
    return record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.date.includes(searchTerm);
  });

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Pasien Tidak Ditemukan';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-green-500/20 text-green-400';
      case 'late': return 'bg-yellow-500/20 text-yellow-400';
      case 'missed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken': return 'Diminum';
      case 'late': return 'Terlambat';
      case 'missed': return 'Terlewat';
      default: return 'Unknown';
    }
  };

  const getPatientConditions = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.medicalConditions || [];
  };

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Riwayat Konsumsi</h1>
            <p className="text-sm text-dark-secondary mt-1">Pantau riwayat konsumsi obat pasien Anda</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="dark-button-secondary gap-2 flex items-center">
              <Filter className="w-4 h-4" />
              Filter Tanggal
            </button>
            <button className="dark-button-primary gap-2 flex items-center">
              <Calendar className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-secondary" />
            <Input
              placeholder="Cari berdasarkan nama pasien, obat, tanggal, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-tag border-dark-color text-dark-primary"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Riwayat Konsumsi Obat ({filteredRecords.length})
            </h3>
            <p className="text-dark-secondary font-medium">Data konsumsi obat pasien Anda</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-3">Tanggal</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Pasien</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Obat</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Waktu Jadwal</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Waktu Konsumsi</th>
                  <th className="text-center font-semibold text-dark-primary pb-3">Status</th>
                  <th className="text-left font-semibold text-dark-primary pb-3">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{record.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{getPatientName(record.patientId)}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getPatientConditions(record.patientId).slice(0, 2).map((condition, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-dark-primary">{record.medicationName}</p>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="dark-tag text-xs flex items-center justify-center gap-1 mx-auto max-w-fit">
                        <Clock className="w-3 h-3" />
                        {record.scheduledTime}
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      {record.actualTime ? (
                        <div className="dark-tag text-xs flex items-center justify-center gap-1 mx-auto max-w-fit">
                          <Clock className="w-3 h-3" />
                          {record.actualTime}
                        </div>
                      ) : (
                        <span className="text-dark-secondary text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-dark-secondary text-sm">{record.notes || '-'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada riwayat ditemukan</h3>
              <p className="text-dark-secondary">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="dark-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-secondary">Total Record</p>
                <p className="text-2xl font-bold text-dark-primary mt-2">{filteredRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="dark-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-secondary">Diminum</p>
                <p className="text-2xl font-bold text-dark-primary mt-2">
                  {filteredRecords.filter(r => r.status === 'taken').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="dark-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-secondary">Terlambat</p>
                <p className="text-2xl font-bold text-dark-primary mt-2">
                  {filteredRecords.filter(r => r.status === 'late').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="dark-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-secondary">Terlewat</p>
                <p className="text-2xl font-bold text-dark-primary mt-2">
                  {filteredRecords.filter(r => r.status === 'missed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}