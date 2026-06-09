import { useQuery } from "@tanstack/react-query";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { getPlatformStats } from "../../services/adminService";

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["platformStats"],
        queryFn: getPlatformStats,
    });

    const stats = data?.data;

    const cards = [
        {
            label: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Total Messages",
            value: stats?.totalMessages || 0,
            icon: MessageSquare,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            label: "Total Revenue",
            value: `₦${parseFloat(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
    ];

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

            {isLoading ? (
                <p className="text-slate-400">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                            >
                                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-4`}>
                                    <Icon size={20} className={card.color} />
                                </div>
                                <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                                <p className="text-slate-400 text-sm">{card.label}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}