import {
    MessageSquare, Users, BarChart2, Tag, Code, Shield,
} from "lucide-react";

const features = [
    {
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        title: "Bulk SMS Messaging",
        description:
            "Send messages to thousands of recipients in a single API call or dashboard upload. Support for personalized messages with merge fields and scheduling.",
    },
    {
        icon: Users,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        title: "Contact & Campaign Management",
        description:
            "Upload contact lists via CSV, create and manage phonebooks and groups, and segment your audience for targeted campaigns.",
    },
    {
        icon: BarChart2,
        color: "text-green-500",
        bg: "bg-green-500/10",
        title: "Delivery & Reporting",
        description:
            "Real-time delivery status tracking with campaign analytics. See how many were sent, delivered, and failed. Export reports anytime.",
    },
    {
        icon: Tag,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        title: "Sender ID / Branding",
        description:
            "Register a custom Sender ID so your business name appears on every message. Build trust with your recipients from the first SMS.",
    },
    {
        icon: Code,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        title: "API & Integrations",
        description:
            "Clean REST API with code samples in Node.js, PHP, and Python. Webhook support for delivery callbacks and easy integration with your existing stack.",
    },
    {
        icon: Shield,
        color: "text-red-500",
        bg: "bg-red-500/10",
        title: "OTP & Two-Factor Auth",
        description:
            "Generate and verify one-time passwords via SMS. Protect your users from fraud with token-based authentication built directly into your product.",
    },
];

export default function Features() {
    return (
        <section id="features" className="bg-slate-950 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                        Everything You Need
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Built for Businesses That Need Results
                    </h2>
                    <p className="text-slate-400">
                        From single SMS sends to million-message campaigns — SMSPro has
                        every tool you need to reach your customers.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition group"
                            >
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}>
                                    <Icon size={22} className={feature.color} />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}