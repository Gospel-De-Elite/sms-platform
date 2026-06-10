import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSenderIDs, createSenderID, deleteSenderID } from "../../services/senderIDService";

const statusConfig = {
  PENDING: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock, label: "Pending" },
  APPROVED: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle, label: "Approved" },
  REJECTED: { color: "text-red-500", bg: "bg-red-500/10", icon: XCircle, label: "Rejected" },
};

export default function SenderID() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["senderIDs"],
    queryFn: getSenderIDs,
  });

  const senderIDs = data?.data || [];

  const createMutation = useMutation({
    mutationFn: createSenderID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senderIDs"] });
      toast.success("Sender ID submitted for approval");
      setName("");
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create Sender ID");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSenderID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senderIDs"] });
      toast.success("Sender ID deleted");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete Sender ID");
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Sender IDs</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your SMS sender names (max 11 characters)
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={16} />
            Register Sender ID
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-400 text-sm">
            Sender IDs must be approved by our team before use. Approval typically takes 24–48 hours.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : senderIDs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No sender IDs registered yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Name</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Status</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Reason</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {senderIDs.map((sender) => {
                  const config = statusConfig[sender.status];
                  const Icon = config.icon;
                  return (
                    <tr
                      key={sender.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{sender.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
                          <Icon size={12} className={config.color} />
                          <span className={`text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-sm">
                          {sender.rejectionReason || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {sender.status !== "APPROVED" && (
                          <button
                            onClick={() => deleteMutation.mutate(sender.id)}
                            className="text-slate-600 hover:text-red-500 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white font-semibold mb-1">Register Sender ID</h2>
            <p className="text-slate-400 text-sm mb-4">Maximum 11 characters, no spaces</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
              placeholder="e.g. SMSPro"
              maxLength={11}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition mb-1"
            />
            <p className="text-slate-600 text-xs mb-4">{name.length}/11 characters</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate({ name })}
                disabled={createMutation.isPending || !name}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm hover:bg-blue-700 disabled:bg-blue-800 transition"
              >
                {createMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}