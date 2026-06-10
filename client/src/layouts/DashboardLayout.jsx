import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import useAuthStore from "../store/authStore";
import {
  LayoutDashboard, MessageSquare, Send, Users, Wallet,
  BarChart2, Settings, LogOut, Menu, X, CreditCard, Key, Tag,
} from "lucide-react";
const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Send SMS", path: "/sms", icon: MessageSquare },
  { label: "Campaigns", path: "/campaigns", icon: Send },
  { label: "Contacts", path: "/contacts", icon: Users },
  { label: "Wallet", path: "/wallet", icon: Wallet },
  { label: "Transactions", path: "/transactions", icon: CreditCard },
  { label: "Reports", path: "/reports", icon: BarChart2 },
  { label: "Sender IDs", path: "/sender-id", icon: Tag },
  { label: "API Keys", path: "/api-keys", icon: Key },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout, isPending } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">
            SMS<span className="text-blue-500">Pro</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
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

        {/* User + Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <LogOut size={18} />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="lg:hidden">
            <h1 className="text-lg font-bold text-white">
              SMS<span className="text-blue-500">Pro</span>
            </h1>
          </div>
          <div className="hidden lg:block">
            <p className="text-slate-400 text-sm">
              Welcome back, <span className="text-white font-medium">{user?.firstName}</span>
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}