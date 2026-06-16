import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold text-white">
                            SMS<span className="text-blue-500">Pro</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-slate-400 hover:text-white text-sm transition">
                            Product
                        </a>
                        <a href="#usecases" className="text-slate-400 hover:text-white text-sm transition">
                            Solutions
                        </a>
                        <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition">
                            Pricing
                        </a>
                        <a href="#developers" className="text-slate-400 hover:text-white text-sm transition">
                            Developers
                        </a>
                        <a href="#faq" className="text-slate-400 hover:text-white text-sm transition">
                            FAQ
                        </a>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-slate-300 hover:text-white text-sm font-medium transition"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                            Sign Up Free
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
                    <a href="#features" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white text-sm py-2">Product</a>
                    <a href="#usecases" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white text-sm py-2">Solutions</a>
                    <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white text-sm py-2">Pricing</a>
                    <a href="#developers" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white text-sm py-2">Developers</a>
                    <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white text-sm py-2">FAQ</a>
                    <div className="pt-3 flex flex-col gap-2 border-t border-slate-800">
                        <Link to="/login" className="text-center text-slate-300 hover:text-white text-sm font-medium py-2">Log In</Link>
                        <Link to="/register" className="text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">Sign Up Free</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}