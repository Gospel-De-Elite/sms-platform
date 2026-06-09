import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTransactions } from "../../services/walletService";
import dayjs from "dayjs";

export default function Transactions() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["transactions", page],
        queryFn: () => getTransactions(page, 20),
    });

    const transactions = data?.data?.transactions || [];
    const pagination = data?.data?.pagination;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Transaction History</h1>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-slate-400">No transactions yet</p>
                            <p className="text-slate-600 text-sm mt-1">Fund your wallet to get started</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Type</th>
                                        <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Description</th>
                                        <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Amount</th>
                                        <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Balance After</th>
                                        <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                            <td className="px-6 py-4">
                                                {tx.type === "CREDIT" ? (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowUpCircle size={18} className="text-green-500" />
                                                        <span className="text-green-500 text-sm">Credit</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <ArrowDownCircle size={18} className="text-red-500" />
                                                        <span className="text-red-500 text-sm">Debit</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white text-sm">{tx.description}</p>
                                                <p className="text-slate-500 text-xs">{tx.reference}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-medium ${tx.type === "CREDIT" ? "text-green-500" : "text-red-500"
                                                    }`}>
                                                    {tx.type === "CREDIT" ? "+" : "-"}₦{parseFloat(tx.amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white text-sm">
                                                    ₦{parseFloat(tx.balanceAfter).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-400 text-sm">
                                                    {dayjs(tx.createdAt).format("MMM D, YYYY")}
                                                </span>
                                                <p className="text-slate-600 text-xs">
                                                    {dayjs(tx.createdAt).format("h:mm A")}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                                    <p className="text-slate-400 text-sm">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === pagination.totalPages}
                                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}