import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verifyPaystack } from "../../services/walletService";

export default function WalletVerify() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    useEffect(() => {
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");
        const ref = reference || trxref;

        if (ref) {
            verifyPaystack(ref)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["wallet"] });
                    queryClient.invalidateQueries({ queryKey: ["transactions"] });
                    toast.success("Wallet funded successfully!");
                    navigate("/wallet");
                })
                .catch(() => {
                    toast.error("Payment verification failed");
                    navigate("/wallet");
                });
        } else {
            navigate("/wallet");
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Verifying payment...</p>
            </div>
        </div>
    );
}