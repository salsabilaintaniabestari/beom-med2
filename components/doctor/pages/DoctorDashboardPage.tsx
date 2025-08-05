import { 
  Users, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Activity
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statisticsData = [
  {
    title: "Pasien Saya",
    value: "48",
    change: "+3",
    icon: Users,
    iconColor: "text-blue-400",
    isPositive: true,
    subtitle: "Pasien dalam pengawasan"
  },
  {
    title: "Tingkat Kepatuhan", 
    value: "89.2%",
    change: "+2.1%",
    icon: CheckCircle,
    iconColor: "text-green-400",
    isPositive: true,
    subtitle: "Rata-rata pasien saya"
  },
  {
    title: "Pengingat Terlewat",
    value: "12",
    change: "-5",
    icon: AlertTriangle,
    iconColor: "text-orange-400",
    isPositive: true,
    subtitle: "Hari ini"
  },
];

const weeklyPatientData = [
  { day: "Sen", compliant: 42, total: 48 },
  { day: "Sel", compliant: 44, total: 48 },
  { day: "Rab", compliant: 41, total: 48 },
  { day: "Kam", compliant: 45, total: 48 },
  { day: "Jum", compliant: 43, total: 48 },  
  { day: "Sab", compliant: 40, total: 48 },
  { day: "Min", compliant: 39, total: 45 },
];

const trendData = [
  { month: "Jan", compliance: 86.2 },
  { month: "Feb", compliance: 87.1 },
  { month: "Mar", compliance: 88.3 },
  { month: "Apr", compliance: 87.9 },
  { month: "Mei", compliance: 89.1 },
  { month: "Jun", compliance: 89.2 },
];

export function DoctorDashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-primary mb-2">Dashboard Dokter</h1>
            <p className="text-dark-secondary font-medium">Pantau pasien di bawah pengawasan Anda</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="dark-tag">
              <Activity className="w-4 h-4 mr-2" />
              Data Real-time
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Weekly Patient Compliance */}
          <div className="dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">Kepatuhan Pasien Mingguan</h3>
              <p className="text-dark-secondary font-medium">Jumlah pasien yang patuh vs total pasien</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPatientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <Bar dataKey="total" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Total Pasien" />
                  <Bar dataKey="compliant" fill="#22C55E" radius={[4, 4, 0, 0]} name="Patuh" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="dark-card">
            <div className="pb-6">
              <h3 className="text-xl font-bold text-dark-primary mb-2">Tren Kepatuhan</h3>
              <p className="text-dark-secondary font-medium">Perkembangan tingkat kepatuhan pasien</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        </div>
      </main>
    </>
  );
}