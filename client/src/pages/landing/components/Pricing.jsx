import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Pay As You Go",
        price: "₦4",
        per: "per SMS unit",
        description: "Perfect for businesses with variable SMS needs. Only pay for what you send.",
        features: [
            "No monthly commitment",
            "All Nigerian networks",
            "Custom Sender ID",
            "Real-time delivery reports",
            "API access",
            "Email support",
        ],
        cta: "Get Started Free",
        href: "/register",
        highlight: false,
    },
    {
        name: "Business",
        price: "₦3.50",
        per: "per SMS unit",
        description: "For growing businesses that send at high volume and want better rates.",
        features: [
            "Everything in Pay As You Go",
            "Discounted unit pricing",
            "Priority delivery routing",
            "Dedicated account manager",
            "Advanced analytics",
            "Priority support",
        ],
        cta: "Contact Sales",
        href: "#contact",
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        per: "pricing",
        description: "For large organizations with custom integration, compliance and SLA requirements.",
        features: [
            "Everything in Business",
            "Custom unit pricing",
            "SLA guarantee",
            "Dedicated infrastructure",
            "Custom integrations",
            "24/7 phone support",
        ],
        cta: "Talk to Sales",
        href: "#contact",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="bg-slate-900 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                        Pricing
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-slate-400">
                        No hidden fees. No surprises. Pay only for the SMS you send.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 border transition ${plan.highlight
                                    ? "bg-blue-600 border-blue-500"
                                    : "bg-slate-800 border-slate-700 hover:border-slate-600"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-white text-blue-600 text-xs font-bold px-4 py-1 rounded-full">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-white"}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-white"}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-sm ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>
                                        {plan.per}
                                    </span>
                                </div>
                                <p className={`text-sm ${plan.highlight ? "text-blue-100" : "text-slate-400"}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check
                                            size={16}
                                            className={plan.highlight ? "text-blue-200" : "text-blue-500"}
                                        />
                                        <span className={`text-sm ${plan.highlight ? "text-blue-100" : "text-slate-300"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.href}
                                className={`block text-center font-semibold py-3 rounded-xl transition text-sm ${plan.highlight
                                        ? "bg-white text-blue-600 hover:bg-blue-50"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}