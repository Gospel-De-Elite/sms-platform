import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, ArrowRight } from "lucide-react";

const team = [
    {
        name: "Gospel",
        title: "Founder & CEO",
        bio: "Full-stack developer and entrepreneur building tools that solve real problems for Nigerian businesses.",
        initials: "G",
        color: "bg-blue-600",
    },
];

const values = [
    {
        icon: Target,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        title: "Reliability First",
        description: "Every message matters. We obsess over delivery rates so your customers always receive your communications.",
    },
    {
        icon: Eye,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        title: "Radical Transparency",
        description: "No hidden fees. No surprise charges. What you see is exactly what you pay — always.",
    },
    {
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-500/10",
        title: "Built for Nigeria",
        description: "We understand the Nigerian telecom landscape deeply. Our platform is optimized for local networks and business realities.",
    },
];

export default function AboutUs() {
    return (
        <div className="bg-slate-950">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4">
                        About SMSPro
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        We're on a Mission to Make Business
                        Communication <span className="text-blue-500">Effortless</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        SMSPro was built out of frustration with unreliable, expensive and
                        developer-unfriendly SMS platforms in Nigeria. We set out to build
                        something better — and we're just getting started.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="bg-slate-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4">
                                Our Story
                            </p>
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Built by a Developer, for Developers and Businesses
                            </h2>
                            <div className="space-y-4 text-slate-400 leading-relaxed">
                                <p>
                                    SMSPro started as a solo project by Gospel, a full-stack developer
                                    at De Elite Digitals. After working with multiple Nigerian businesses
                                    struggling with SMS delivery issues and opaque pricing, the decision
                                    was made to build a platform that prioritized reliability, transparency
                                    and developer experience above everything else.
                                </p>
                                <p>
                                    Built entirely with modern technology — Node.js, React, PostgreSQL
                                    and a battle-tested gateway abstraction layer — SMSPro routes messages
                                    through multiple carriers with automatic failover to ensure your SMS
                                    always gets through.
                                </p>
                                <p>
                                    Today SMSPro serves businesses across Nigeria in fintech, e-commerce,
                                    healthcare and education — and we're growing fast.
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "2024", label: "Year Founded" },
                                { value: "99.9%", label: "Platform Uptime" },
                                { value: "2", label: "Gateway Partners" },
                                { value: "Nigeria", label: "Headquarters" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center"
                                >
                                    <p className="text-3xl font-bold text-blue-500 mb-2">{stat.value}</p>
                                    <p className="text-slate-400 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                            Our Values
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={value.title}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition"
                                >
                                    <div className={`w-12 h-12 ${value.bg} rounded-xl flex items-center justify-center mb-5`}>
                                        <Icon size={22} className={value.color} />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-3">{value.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="bg-slate-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                            The Team
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            The People Behind SMSPro
                        </h2>
                    </div>

                    <div className="flex justify-center">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center max-w-sm"
                            >
                                <div className={`w-20 h-20 ${member.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5`}>
                                    {member.initials}
                                </div>
                                <h3 className="text-white font-bold text-xl mb-1">{member.name}</h3>
                                <p className="text-blue-500 text-sm mb-4">{member.title}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 py-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-blue-100 mb-8">
                        Join businesses across Nigeria sending reliable SMS with SMSPro.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition"
                    >
                        Create Free Account
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}