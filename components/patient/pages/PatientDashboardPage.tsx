import { 
  Pill, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statisticsData = [
  {
    title: "Obat Hari Ini",
    value: "4",
    change: "3 dikonsumsi",
    icon: Pill,
    iconColor: "text-blue-400",
    isPositive: true,
    subtitle: "1 tersisa"
  },
  {
    title: "Tingkat Kepatuhan", 
    value: "92%",
    change: "+3%",
    icon: CheckCircle,
    iconColor: "text-green-400",
    isPositive: true,
    subtitle: "Minggu ini"
  },
  {
    title: "Jadwal Berikutnya",
    value: "14:30",
    change: "30 menit lagi",
    icon: Clock,
    iconColor: "text-purple-400",
    isPositive: true,
    subtitle: "Vitamin D"
  },
];

const weeklyConsumptionData = [
  { day: "Sen", consumed: 4, scheduled: 4 },
  { day: "Sel", consumed: 4, scheduled: 4 },
  { day: "Rab", consumed: 3, scheduled: 4 },
  { day: "Kam", consumed: 4, scheduled: 4 },
  { day: "Jum", consumed: 4, scheduled: 4 },  
  { day: "Sab", consumed: 3, scheduled: 4 },
  { day: "Min", consumed: 4, scheduled: 4 },
];

const complianceData = [
  { name: "Tepat Waktu", value: 85, color: "#22C55E" },
  { name: "Terlambat", value: 10, color: "#F59E0B" },
  { name: "Terlewat", value: 5, color: "#EF4444" },
];

const monthlyComplianceData = [
  { month: "Jan", compliance: 88 },
  { month: "Feb", compliance: 89 },
  { month: "Mar", compliance: 91 },
  { month: "Apr", compliance: 90 },
  { month: "Mei", compliance: 93 },
  { month: "Jun", compliance: 92 },
];

export function PatientDashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-primary mb-2">Dashboard Pasien</h1>
            <p className="text-dark-secondary font-medium">Pantau jadwal dan konsumsi obat Anda</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="dark-tag">
              <Activity className="w-4 h-4 mr-2" />
              Status Aktif
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statisticsData.map((stat) => {
            const Icon = stat.icon;
            
            return (
              <div key={stat.title} className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-bold text-dark-secondary`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-dark-primary mb-2">{stat.value}</h3>
                  <p className="text-sm font-medium text-dark-secondary">{stat.title}</p>
                  <p className="text-xs text-dark-secondary mt-1">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Weekly Consumption Chart */}
          <div className="lg:col-span-2 dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">Konsumsi Obat Mingguan</h3>
              <p className="text-dark-secondary font-medium">Grafik konsumsi vs jadwal obat Anda</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyConsumptionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 8px 24px",
                      color: "#FFFFFF"
                    }}
                  />
                  <Bar dataKey="scheduled" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Dijadwalkan" />
                  <Bar dataKey="consumed" fill="#22C55E" radius={[4, 4, 0, 0]} name="Dikonsumsi" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Pie Chart */}
          <div className="dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">Persentase Kepatuhan</h3>
              <p className="text-dark-secondary font-medium">Distribusi waktu konsumsi obat</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 8px 24px",
                      color: "#FFFFFF"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 pt-4">
              {complianceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-dark-secondary">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-dark-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2">Tren Kepatuhan Bulanan</h3>
            <p className="text-dark-secondary font-medium">Perkembangan tingkat kepatuhan Anda</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyComplianceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    boxShadow: "rgba(0, 0, 0, 0.4) 0px 8px 24px",
                    color: "#FFFFFF"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#22C55E" 
                  strokeWidth={3}
                  dot={{ fill: "#22C55E", strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, stroke: "#22C55E", strokeWidth: 2, fill: "#1E293B" }}
                  name="Kepatuhan (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}