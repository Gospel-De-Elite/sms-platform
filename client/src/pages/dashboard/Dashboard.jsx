import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Wallet, MessageSquare, TrendingUp, Users, Plus, ArrowUpRight } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getWallet, getTransactions } from "../../services/walletService";
import dayjs from "dayjs";

export default function Dashboard() {
    const { data: walletData } = useQuery({
        queryKey: ["wallet"],
        queryFn: getWallet,
    });

    const { data: txData } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => getTransactions(1, 5),
    });

    const wallet = walletData?.data;
    const transactions = txData?.data?.transactions || [];

    const stats = [
        {
            label: "Wallet Balance",
            value: `₦${parseFloat(wallet?.balance || 0).toLocaleString()}`,
            icon: Wallet,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            link: "/wallet",
        },
        {
            label: "Total Funded",
            value: `₦${parseFloat(wallet?.totalFunded || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10",
            link: "/transactions",
        },
        {
            label: "Total Spent",
            value: `₦${parseFloat(wallet?.totalSpent || 0).toLocaleString()}`,
            icon: MessageSquare,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            link: "/reports",
        },
        {
            label: "Contacts",
            value: "0",
            icon: Users,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            link: "/contacts",
        },
    ];

    return (
        <DashboardLayout>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            to={stat.link}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-600" />
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-slate-400 text-sm">{stat.label}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/wallet"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            Fund Wallet
                        </Link>
                        <Link
                            to="/sms"
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition"
                        >
                            <MessageSquare size={16} />
                            Send SMS
                        </Link>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Recent Transactions</h2>
                        <Link to="/transactions" className="text-blue-500 text-sm hover:text-blue-400">
                            View all
                        </Link>
                    </div>
                    {transactions.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No transactions yet</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white text-sm">{tx.description}</p>
                                        <p className="text-slate-500 text-xs">
                                            {dayjs(tx.createdAt).format("MMM D, YYYY h:mm A")}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-medium ${tx.type === "CREDIT" ? "text-green-500" : "text-red-500"
                                        }`}>
                                        {tx.type === "CREDIT" ? "+" : "-"}₦{parseFloat(tx.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}