import { Link } from "react-router-dom";
import { X, Linkedin, Youtube, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold text-white">
                                SMS<span className="text-blue-500">Pro</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Reliable bulk SMS messaging for Nigerian businesses. Fast, affordable and built to scale.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: X, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Youtube, href: "#" },
                                { icon: Github, href: "#" },
                            ].map(({ icon: Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Features", href: "#features" },
                                { label: "Pricing", href: "#pricing" },
                                { label: "API", href: "#developers" },
                                { label: "Status Page", href: "#" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-slate-400 hover:text-white text-sm transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "About Us", href: "/about" },
                                { label: "Blog", href: "#" },
                                { label: "Careers", href: "#" },
                                { label: "Contact", href: "mailto:hello@smspro.ng" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-slate-400 hover:text-white text-sm transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Documentation", href: "#" },
                                { label: "Help Center", href: "#" },
                                { label: "FAQs", href: "#faq" },
                                { label: "Support", href: "mailto:support@smspro.ng" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-slate-400 hover:text-white text-sm transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Terms of Service", href: "#" },
                                { label: "Privacy Policy", href: "#" },
                                { label: "Cookie Policy", href: "#" },
                                { label: "NDPR Compliance", href: "#" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-slate-400 hover:text-white text-sm transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} SMSPro by De Elite Digitals. All rights reserved.
                    </p>
                    <p className="text-slate-600 text-xs">
                        Built with ❤️ in Nigeria 🇳🇬
                    </p>
                </div>
            </div>
        </footer >
    );
}