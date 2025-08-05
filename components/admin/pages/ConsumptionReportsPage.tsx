import { useState } from "react";
import { 
  Activity, 
  Search, 
  Filter,
  Download,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Input } from "../../ui/input";
import { medicalDataStore } from "../../../data/medicalData";

export function ConsumptionReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records] = useState(medicalDataStore.getConsumptionRecords());
  const [patients] = useState(medicalDataStore.getPatients());

  const filteredRecords = records.filter(record => {
    const patient = patients.find(p => p.id === record.patientId);
    return record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.status.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Rekap & Riwayat Konsumsi</h1>
            <p className="text-sm text-dark-secondary mt-1">Riwayat konsumsi obat semua pasien</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="dark-button-secondary gap-2 flex items-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="dark-button-primary gap-2 flex items-center">
              <Download className="w-4 h-4" />
              Export
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
              placeholder="Cari berdasarkan nama pasien, obat, atau status..."
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
              <Activity className="w-5 h-5 text-blue-400" />
              Riwayat Konsumsi Obat ({filteredRecords.length})
            </h3>
            <p className="text-dark-secondary font-medium">Data konsumsi obat semua pasien</p>
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
              <h3 className="text-lg font-medium text-dark-primary mb-2">Tidak ada record ditemukan</h3>
              <p className="text-dark-secondary">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}