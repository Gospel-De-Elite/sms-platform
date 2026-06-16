import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function Hero() {
    return (
        <section className="min-h-screen bg-slate-950 flex items-center pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                        <Zap size={14} className="text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">
                            Nigeria's Most Reliable Bulk SMS Platform
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        Send Bulk SMS to Your{" "}
                        <span className="text-blue-500">Customers</span>,{" "}
                        Instantly
                    </h1>

                    {/* Subheadline */}
                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        SMSPro helps businesses send bulk SMS, OTPs, alerts and promotional
                        messages reliably across all Nigerian networks with industry-leading
                        delivery rates.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to="/register"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base"
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </Link>
                        <a
                            href="#developers"
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-8 py-3.5 rounded-xl transition text-base"
                        >
                            View Documentation
                        </a>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="relative max-w-4xl mx-auto">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                            {/* Mock Dashboard Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="flex-1 bg-slate-800 rounded-md h-6 ml-2"></div>
                            </div>

                            {/* Mock Stats Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                {[
                                    { label: "Messages Sent", value: "12,450" },
                                    { label: "Delivered", value: "11,892" },
                                    { label: "Delivery Rate", value: "95.5%" },
                                    { label: "Balance", value: "₦24,500" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-slate-800 rounded-lg p-3">
                                        <p className="text-blue-400 text-lg font-bold">{stat.value}</p>
                                        <p className="text-slate-500 text-xs">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Mock Campaign List */}
                            <div className="space-y-2">
                                {[
                                    { name: "June Promo Campaign", recipients: "5,000", status: "COMPLETED", color: "text-green-500" },
                                    { name: "OTP Verification", recipients: "1,200", status: "SENDING", color: "text-blue-500" },
                                    { name: "Payment Alert", recipients: "3,250", status: "QUEUED", color: "text-yellow-500" },
                                ].map((campaign) => (
                                    <div key={campaign.name} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
                                        <div>
                                            <p className="text-white text-sm font-medium">{campaign.name}</p>
                                            <p className="text-slate-500 text-xs">{campaign.recipients} recipients</p>
                                        </div>
                                        <span className={`text-xs font-medium ${campaign.color}`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur-xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section >
    );
}