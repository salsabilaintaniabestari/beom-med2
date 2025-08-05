import { 
  Users, 
  Pill, 
  TrendingUp, 
  Calendar,
  Download,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statisticsData = [
  {
    title: "Total Pasien",
    value: "1,247",
    change: "+12",
    icon: Users,
    iconColor: "text-blue-400",
    isPositive: true,
    subtitle: "Pasien baru bulan ini"
  },
  {
    title: "Obat Aktif", 
    value: "3,456",
    change: "+234",
    icon: Pill,
    iconColor: "text-green-400",
    isPositive: true,
    subtitle: "Resep obat aktif"
  },
  {
    title: "Tingkat Kepatuhan",
    value: "87.4%",
    change: "+5.2%",
    icon: CheckCircle,
    iconColor: "text-purple-400",  
    isPositive: true,
    subtitle: "Rata-rata kepatuhan"
  },
  {
    title: "Pengingat Terlewat",
    value: "156",
    change: "-23",
    icon: AlertTriangle,
    iconColor: "text-orange-400",
    isPositive: true,
    subtitle: "Hari ini"
  },
];

const weeklyConsumptionData = [
  { day: "Sen", consumed: 89, scheduled: 100 },
  { day: "Sel", consumed: 92, scheduled: 98 },
  { day: "Rab", consumed: 87, scheduled: 102 },
  { day: "Kam", consumed: 94, scheduled: 105 },
  { day: "Jum", consumed: 91, scheduled: 99 },  
  { day: "Sab", consumed: 88, scheduled: 95 },
  { day: "Min", consumed: 85, scheduled: 90 },
];

const complianceData = [
  { name: "Patuh", value: 874, color: "#22C55E" },
  { name: "Terlambat", value: 156, color: "#F59E0B" },
  { name: "Terlewat", value: 89, color: "#EF4444" },
];

const monthlyTrendData = [
  { month: "Jan", patients: 1180, compliance: 84.2 },
  { month: "Feb", patients: 1205, compliance: 85.1 },
  { month: "Mar", patients: 1198, compliance: 86.3 },
  { month: "Apr", patients: 1224, compliance: 85.9 },
  { month: "Mei", patients: 1235, compliance: 87.1 },
  { month: "Jun", patients: 1247, compliance: 87.4 },
];

export function AdminDashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-primary mb-2">Dashboard Administrator</h1>
            <p className="text-dark-secondary font-medium">Pantau statistik pasien dan kepatuhan konsumsi obat</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="dark-tag">
              <Activity className="w-4 h-4 mr-2" />
              Data Real-time
            </div>
            <button className="dark-button-primary gap-2 flex items-center">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statisticsData.map((stat) => {
            const Icon = stat.icon;
            
            return (
              <div key={stat.title} className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-dark-tag flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${stat.isPositive ? 'text-dark-positive' : 'text-dark-negative'}`} />
                    <span className={`text-sm font-bold ${stat.isPositive ? 'text-dark-positive' : 'text-dark-negative'}`}>
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
              <p className="text-dark-secondary font-medium">Perbandingan obat yang dikonsumsi vs dijadwalkan</p>
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
              <h3 className="text-xl font-bold text-dark-primary mb-2">Status Kepatuhan</h3>
              <p className="text-dark-secondary font-medium">Distribusi tingkat kepatuhan pasien</p>
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
                  <span className="text-sm font-semibold text-dark-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="dark-card">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-dark-primary mb-2">Tren Bulanan</h3>
            <p className="text-dark-secondary font-medium">Perkembangan jumlah pasien dan tingkat kepatuhan</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="patients"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="compliance"
                  orientation="right"
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
                  yAxisId="patients"
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, stroke: "#3B82F6", strokeWidth: 2, fill: "#1E293B" }}
                  name="Jumlah Pasien"
                />
                <Line 
                  yAxisId="compliance"
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