import { useLogout } from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";

export default function Dashboard() {
    const { user } = useAuthStore();
    const { logout, isPending } = useLogout();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome, {user?.firstName}! 👋
                </h1>
                <p className="text-slate-400 mb-8">Dashboard coming in Week 4</p>
                <button
                    onClick={logout}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition"
                >
                    {isPending ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}