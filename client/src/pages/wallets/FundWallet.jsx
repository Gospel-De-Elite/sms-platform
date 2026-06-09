import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Wallet, CreditCard, Building } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getWallet, initializePaystack, initializeMonnify } from "../../services/walletService";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function FundWallet() {
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState("");
    const [gateway, setGateway] = useState("paystack");

    const { data: walletData } = useQuery({
        queryKey: ["wallet"],
        queryFn: getWallet,
    });

    const wallet = walletData?.data;

    const paystackMutation = useMutation({
        mutationFn: initializePaystack,
        onSuccess: (response) => {
            window.location.href = response.data.authorization_url;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to initialize payment");
        },
    });

    const monnifyMutation = useMutation({
        mutationFn: initializeMonnify,
        onSuccess: (response) => {
            window.location.href = response.data.checkoutUrl;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to initialize payment");
        },
    });

    const isPending = paystackMutation.isPending || monnifyMutation.isPending;

    const handleSubmit = () => {
        if (!amount || parseFloat(amount) < 100) {
            toast.error("Minimum amount is ₦100");
            return;
        }
        if (gateway === "paystack") {
            paystackMutation.mutate(parseFloat(amount));
        } else {
            monnifyMutation.mutate(parseFloat(amount));
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Fund Wallet</h1>

                {/* Current Balance */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Wallet size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Current Balance</p>
                            <p className="text-3xl font-bold text-white">
                                ₦{parseFloat(wallet?.balance || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fund Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="text-sm text-slate-400 mb-2 block">Enter Amount (₦)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="100"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Preset Amounts */}
                    <div className="mb-6">
                        <p className="text-sm text-slate-400 mb-3">Quick Select</p>
                        <div className="grid grid-cols-3 gap-2">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setAmount(preset.toString())}
                                    className={`py-2 rounded-lg text-sm font-medium transition ${amount === preset.toString()
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        }`}
                                >
                                    ₦{preset.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Gateway */}
                    <div className="mb-6">
                        <p className="text-sm text-slate-400 mb-3">Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setGateway("paystack")}
                                className={`flex items-center gap-3 p-4 rounded-lg border transition ${gateway === "paystack"
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-slate-700 bg-slate-800 hover:border-slate-600"
                                    }`}
                            >
                                <CreditCard size={20} className="text-blue-500" />
                                <div className="text-left">
                                    <p className="text-white text-sm font-medium">Paystack</p>
                                    <p className="text-slate-500 text-xs">Card, Bank Transfer</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setGateway("monnify")}
                                className={`flex items-center gap-3 p-4 rounded-lg border transition ${gateway === "monnify"
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-slate-700 bg-slate-800 hover:border-slate-600"
                                    }`}
                            >
                                <Building size={20} className="text-green-500" />
                                <div className="text-left">
                                    <p className="text-white text-sm font-medium">Monnify</p>
                                    <p className="text-slate-500 text-xs">Bank Transfer, USSD</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !amount}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 transition"
                    >
                        {isPending ? "Processing..." : `Fund ₦${parseFloat(amount || 0).toLocaleString()}`}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}