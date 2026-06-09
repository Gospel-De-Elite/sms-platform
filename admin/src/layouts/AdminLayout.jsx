import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/users", icon: Users },
    { label: "Transactions", path: "/transactions", icon: CreditCard },
    { label: "Settings", path: "/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold text-white">
                        SMS<span className="text-blue-500">Pro</span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">Admin Panel</p>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }
                `}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="px-4 py-2 mb-2">
                        <p className="text-white text-sm font-medium">
                            {admin?.firstName} {admin?.lastName}
                        </p>
                        <p className="text-slate-500 text-xs">{admin?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}