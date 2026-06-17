import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Send, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { sendSingleSMS, sendBulkSMS } from "../../services/smsService";
import { getSenderIDs } from "../../services/senderIDService";
import { getGroups, getContacts } from "../../services/contactService";
import { getWallet } from "../../services/walletService";
import { calculateUnits } from "../../utils/smsUtils";

export default function SendSMS() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({
    to: "",
    senderIDId: "",
    message: "",
    campaignName: "",
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [manualNumbers, setManualNumbers] = useState("");

  const { data: senderIDsData } = useQuery({
    queryKey: ["senderIDs"],
    queryFn: getSenderIDs,
  });

  const { data: groupsData } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const { data: walletData } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });

  const { data: contactsData } = useQuery({
    queryKey: ["contacts", selectedGroup],
    queryFn: () => getContacts(1, 1000, selectedGroup),
    enabled: !!selectedGroup,
  });

  const senderIDs = senderIDsData?.data?.filter((s) => s.status === "APPROVED") || [];
  const groups = groupsData?.data || [];
  const wallet = walletData?.data;
  const contacts = contactsData?.data?.contacts || [];

  const units = calculateUnits(formData.message);
  const costPerUnit = 4;
  const recipientCount = mode === "single"
    ? (formData.to ? 1 : 0)
    : selectedGroup
      ? contacts.length
      : manualNumbers.split("\n").filter((n) => n.trim()).length;
  const totalCost = units * costPerUnit * recipientCount;

  const singleMutation = useMutation({
    mutationFn: sendSingleSMS,
    onSuccess: (response) => {
      const messageStatus = response.data.status;
      if (messageStatus === "SENT") {
        toast.success("SMS sent successfully!");
      } else {
        toast.error(`SMS failed: ${response.data.failureReason || "Unknown error"}`);
      }
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setFormData({ ...formData, to: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send SMS");
    },
  });
  const bulkMutation = useMutation({
    mutationFn: sendBulkSMS,
    onSuccess: () => {
      toast.success("Bulk SMS queued successfully!");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setFormData({ ...formData, message: "", campaignName: "" });
      setManualNumbers("");
      setSelectedGroup(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send bulk SMS");
    },
  });

  const handleSubmit = () => {
    if (!formData.senderIDId) {
      toast.error("Please select a sender ID");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (mode === "single") {
      if (!formData.to.trim()) {
        toast.error("Please enter a recipient number");
        return;
      }
      singleMutation.mutate({
        to: formData.to,
        senderIDId: formData.senderIDId,
        message: formData.message,
      });
    } else {
      const recipients = selectedGroup
        ? contacts.map((c) => c.phone)
        : manualNumbers.split("\n").map((n) => n.trim()).filter(Boolean);

      if (recipients.length === 0) {
        toast.error("Please add recipients");
        return;
      }

      bulkMutation.mutate({
        recipients,
        senderIDId: formData.senderIDId,
        message: formData.message,
        campaignName: formData.campaignName,
      });
    }
  };

  const isPending = singleMutation.isPending || bulkMutation.isPending;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Send SMS</h1>

        {/* Mode Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setMode("single")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${mode === "single"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
              }`}
          >
            Single SMS
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${mode === "bulk"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
              }`}
          >
            Bulk SMS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

              {/* Campaign Name (bulk only) */}
              {mode === "bulk" && (
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Campaign Name</label>
                  <input
                    type="text"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                    placeholder="e.g. Promo Campaign June"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              )}

              {/* Sender ID */}
              <div className="space-y-1">
                <label className="text-sm text-slate-400">Sender ID</label>
                {senderIDs.length === 0 ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                    <p className="text-slate-500 text-sm">
                      No approved sender IDs.{" "}
                      <a href="/sender-id" className="text-blue-500 hover:text-blue-400">
                        Register one
                      </a>
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.senderIDId}
                    onChange={(e) => setFormData({ ...formData, senderIDId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">Select sender ID</option>
                    {senderIDs.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Recipient(s) */}
              {mode === "single" ? (
                <div className="space-y-1">
                  <label className="text-sm text-slate-400">Recipient Number</label>
                  <input
                    type="tel"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="08012345678"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm text-slate-400">Recipients</label>

                  {/* Group Select */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">From contact group:</p>
                    <select
                      value={selectedGroup || ""}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value || null);
                        setManualNumbers("");
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="">Select a group</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g._count?.contacts || 0} contacts)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Entry */}
                  {!selectedGroup && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Or enter numbers manually (one per line):</p>
                      <textarea
                        value={manualNumbers}
                        onChange={(e) => setManualNumbers(e.target.value)}
                        placeholder={"08012345678\n08087654321\n07011223344"}
                        rows={5}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-slate-400">Message</label>
                  <span className="text-xs text-slate-500">
                    {formData.message.length} chars · {units} unit{units > 1 ? "s" : ""}
                  </span>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 transition flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {isPending
                  ? "Sending..."
                  : mode === "single"
                    ? "Send SMS"
                    : `Send to ${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`
                }
              </button>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="space-y-4">
            {/* Wallet Balance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-white">
                ₦{parseFloat(wallet?.balance || 0).toLocaleString()}
              </p>
            </div>

            {/* Cost Estimate */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <p className="text-white font-medium text-sm">Cost Estimate</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipients</span>
                  <span className="text-white">{recipientCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Units/SMS</span>
                  <span className="text-white">{units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cost/Unit</span>
                  <span className="text-white">₦{costPerUnit}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between font-medium">
                  <span className="text-slate-300">Total Cost</span>
                  <span className="text-blue-400">₦{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}