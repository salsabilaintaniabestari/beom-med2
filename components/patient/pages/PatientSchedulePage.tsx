import { Calendar, Pill, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const medicationSchedule = [
  {
    time: "08:00",
    medication: "Metformin 500mg",
    status: "completed",
    taken: true,
    instruction: "Setelah makan pagi"
  },
  {
    time: "12:00", 
    medication: "Lisinopril 10mg",
    status: "completed",
    taken: true,
    instruction: "Sebelum makan siang"
  },
  {
    time: "14:30",
    medication: "Vitamin D 1000 IU",
    status: "upcoming",
    taken: false,
    instruction: "Setelah makan siang"
  },
  {
    time: "20:00",
    medication: "Metformin 500mg",
    status: "upcoming", 
    taken: false,
    instruction: "Setelah makan malam"
  }
];

const weeklySchedule = [
  { day: "Sen", pills: 4, completed: 4 },
  { day: "Sel", pills: 4, completed: 4 },
  { day: "Rab", pills: 4, completed: 3 },
  { day: "Kam", pills: 4, completed: 4 },
  { day: "Jum", pills: 4, completed: 4 },
  { day: "Sab", pills: 4, completed: 3 },
  { day: "Min", pills: 4, completed: 2 }
];

export function PatientSchedulePage() {
  return (
    <>
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Jadwal Obat</h1>
            <p className="text-sm text-dark-secondary mt-1">Lihat daftar obat dan waktu konsumsi harian</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="dark-card">
              <div className="pb-6">
                <h3 className="text-xl font-bold text-dark-primary mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Jadwal Hari Ini - {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-dark-secondary font-medium">Daftar obat yang harus dikonsumsi hari ini</p>
              </div>
              
              <div className="space-y-4">
                {medicationSchedule.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-all ${
                    item.status === 'completed' 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : item.status === 'upcoming'
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-dark-color bg-dark-tag'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          item.status === 'completed' 
                            ? 'bg-green-500/20' 
                            : item.status === 'upcoming'
                            ? 'bg-blue-500/20'
                            : 'bg-dark-tag'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Pill className="w-6 h-6 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-dark-primary">{item.medication}</h4>
                          <p className="text-sm text-dark-secondary">{item.instruction}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-dark-secondary" />
                          <span className="font-medium text-dark-primary">{item.time}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : item.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="space-y-6">
            <div className="dark-card">
              <div className="pb-6">
                <h3 className="text-xl font-bold text-dark-primary mb-2">Ringkasan Minggu Ini</h3>
                <p className="text-dark-secondary font-medium">Progress konsumsi obat 7 hari terakhir</p>
              </div>
              
              <div className="space-y-3">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dark-tag">
                    <span className="font-medium text-dark-primary">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-dark-secondary">
                        {day.completed}/{day.pills}
                      </span>
                      {day.completed === day.pills ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dark-card">
              <div className="pb-4">
                <h3 className="text-lg font-bold text-dark-primary mb-2">Statistik Cepat</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-dark-tag rounded-lg">
                  <h4 className="text-2xl font-bold text-green-400">92%</h4>
                  <p className="text-sm text-dark-secondary">Kepatuhan Minggu Ini</p>
                </div>
                <div className="text-center p-4 bg-dark-tag rounded-lg">
                  <h4 className="text-2xl font-bold text-blue-400">4</h4>
                  <p className="text-sm text-dark-secondary">Obat Aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}