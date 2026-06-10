import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { getPendingSenderIDs, approveSenderID, rejectSenderID } from "../../services/adminService";
import dayjs from "dayjs";
import { useState } from "react";

export default function SenderIDs() {
    const queryClient = useQueryClient();
    const [rejectModal, setRejectModal] = useState(null);
    const [reason, setReason] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["pendingSenderIDs"],
        queryFn: getPendingSenderIDs,
    });

    const senderIDs = data?.data || [];

    const approveMutation = useMutation({
        mutationFn: approveSenderID,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingSenderIDs"] });
            toast.success("Sender ID approved");
        },
        onError: () => toast.error("Failed to approve"),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }) => rejectSenderID(id, { reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingSenderIDs"] });
            toast.success("Sender ID rejected");
            setRejectModal(null);
            setReason("");
        },
        onError: () => toast.error("Failed to reject"),
    });

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-white mb-6">Pending Sender IDs</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : senderIDs.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No pending sender IDs</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Sender ID</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">User</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Submitted</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {senderIDs.map((sender) => (
                                <tr key={sender.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">{sender.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white text-sm">
                                            {sender.user.firstName} {sender.user.lastName}
                                        </p>
                                        <p className="text-slate-500 text-xs">{sender.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-400 text-sm">
                                            {dayjs(sender.createdAt).format("MMM D, YYYY")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => approveMutation.mutate(sender.id)}
                                                className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition"
                                            >
                                                <CheckCircle size={14} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setRejectModal(sender)}
                                                className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition"
                                            >
                                                <XCircle size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-white font-semibold mb-1">Reject Sender ID</h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Rejecting: <span className="text-white">{rejectModal.name}</span>
                        </p>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for rejection"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setRejectModal(null); setReason(""); }}
                                className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm hover:bg-slate-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => rejectMutation.mutate({ id: rejectModal.id, reason })}
                                disabled={rejectMutation.isPending}
                                className="flex-1 bg-red-600 text-white rounded-lg py-2.5 text-sm hover:bg-red-700 transition"
                            >
                                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}