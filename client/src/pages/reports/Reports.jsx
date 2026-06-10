import { useQuery } from "@tanstack/react-query";
import {
  MessageSquare, CheckCircle, XCircle, BarChart2, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getReports } from "../../services/smsService";
import dayjs from "dayjs";

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  const reports = data?.data;
  const summary = reports?.summary;
  const dailyStats = reports?.dailyStats || [];
  const recentMessages = reports?.recentMessages || [];

  const chartData = dailyStats.map((d) => ({
    date: dayjs(d.date).format("MMM D"),
    total: Number(d.total),
    delivered: Number(d.delivered),
    failed: Number(d.failed),
  }));

  const stats = [
    {
      label: "Total Messages",
      value: summary?.totalMessages || 0,
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Delivered",
      value: summary?.totalDelivered || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Failed",
      value: summary?.totalFailed || 0,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Delivery Rate",
      value: `${summary?.deliveryRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const statusColors = {
    PENDING: "text-yellow-500",
    SENT: "text-blue-500",
    DELIVERED: "text-green-500",
    FAILED: "text-red-500",
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Reports & Analytics</h1>

        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                  >
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 size={18} className="text-blue-500" />
                <h2 className="text-white font-semibold">Last 7 Days</h2>
              </div>

              {chartData.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">
                  No data available yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      fill="url(#totalGrad)"
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="delivered"
                      stroke="#22c55e"
                      fill="url(#deliveredGrad)"
                      name="Delivered"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="text-white font-semibold">Recent Messages</h2>
              </div>
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No messages yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Recipient</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Sender ID</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Units</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                      >
                        <td className="px-6 py-3">
                          <span className="text-white text-sm">{msg.recipient}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-slate-300 text-sm">{msg.senderID?.name}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-slate-300 text-sm">{msg.units}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm font-medium ${statusColors[msg.status]}`}>
                            {msg.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-slate-400 text-sm">
                            {dayjs(msg.createdAt).format("MMM D, h:mm A")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}