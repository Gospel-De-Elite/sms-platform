import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, Copy, Eye, EyeOff, Key } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getApiKeys, createApiKey, deleteApiKey } from "../../services/apiKeyService";
import dayjs from "dayjs";

export default function ApiKeys() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [newKey, setNewKey] = useState(null);
    const [showKey, setShowKey] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["apiKeys"],
        queryFn: getApiKeys,
    });

    const keys = data?.data || [];

    const createMutation = useMutation({
        mutationFn: createApiKey,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
            setNewKey(response.data.key);
            setName("");
            setShowModal(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create API key");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
            toast.success("API key deleted");
        },
        onError: () => toast.error("Failed to delete API key"),
    });

    const copyKey = (key) => {
        navigator.clipboard.writeText(key);
        toast.success("Copied to clipboard!");
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">API Keys</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Use these keys to integrate SMSPro into your apps
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New API Key
                    </button>
                </div>

                {/* New Key Display */}
                {newKey && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 mb-6">
                        <p className="text-green-400 font-medium text-sm mb-2">
                            ✅ API Key Created — Copy it now, it won't be shown again
                        </p>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 bg-slate-900 text-green-400 text-sm px-4 py-2.5 rounded-lg font-mono truncate">
                                {showKey ? newKey : "sms_" + "•".repeat(40)}
                            </code>
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="text-slate-400 hover:text-white transition"
                            >
                                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                                onClick={() => copyKey(newKey)}
                                className="text-slate-400 hover:text-white transition"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => setNewKey(null)}
                            className="text-slate-500 text-xs mt-3 hover:text-slate-400"
                        >
                            I've saved my key, dismiss this
                        </button>
                    </div>
                )}

                {/* API Base URL Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
                    <p className="text-slate-400 text-sm mb-2">Base URL</p>
                    <div className="flex items-center gap-3">
                        <code className="flex-1 bg-slate-800 text-blue-400 text-sm px-4 py-2.5 rounded-lg font-mono">
                            {import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/v1
                        </code>
                        <button
                            onClick={() => copyKey(`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/v1`)}
                            className="text-slate-400 hover:text-white transition"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
                    <p className="text-white font-medium text-sm mb-3">Quick Reference</p>
                    <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center gap-3">
                            <span className="text-green-500 w-12">POST</span>
                            <span className="text-slate-300">/v1/sms/send</span>
                            <span className="text-slate-600">— Send SMS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-blue-500 w-12">GET</span>
                            <span className="text-slate-300">/v1/balance</span>
                            <span className="text-slate-600">— Check balance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-blue-500 w-12">GET</span>
                            <span className="text-slate-300">/v1/sms/:id</span>
                            <span className="text-slate-600">— Message status</span>
                        </div>
                    </div>
                </div>

                {/* Keys Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : keys.length === 0 ? (
                        <div className="p-8 text-center">
                            <Key size={32} className="text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No API keys yet</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Name</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Last Used</th>
                                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Created</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.map((key) => (
                                    <tr
                                        key={key.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Key size={14} className="text-slate-500" />
                                                <span className="text-white text-sm">{key.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-400 text-sm">
                                                {key.lastUsedAt
                                                    ? dayjs(key.lastUsedAt).format("MMM D, YYYY")
                                                    : "Never"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-400 text-sm">
                                                {dayjs(key.createdAt).format("MMM D, YYYY")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteMutation.mutate(key.id)}
                                                className="text-slate-600 hover:text-red-500 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-white font-semibold mb-4">Create API Key</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Production App"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition mb-4"
                        />
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
                                {createMutation.isPending ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}