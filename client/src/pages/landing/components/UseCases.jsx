import { Building2, ShoppingCart, Heart, GraduationCap, Truck, Landmark } from "lucide-react";

const useCases = [
    {
        icon: Landmark,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        title: "Banking & Fintech",
        description: "Transaction alerts, OTP verification, fraud notifications and account activity updates delivered instantly.",
        examples: ["OTP / 2FA", "Transaction alerts", "Fraud warnings"],
    },
    {
        icon: ShoppingCart,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        title: "E-commerce",
        description: "Keep customers informed at every stage of their purchase journey with automated order and delivery updates.",
        examples: ["Order confirmations", "Delivery updates", "Promo campaigns"],
    },
    {
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-500/10",
        title: "Healthcare",
        description: "Reduce no-shows and keep patients informed with appointment reminders and health notifications.",
        examples: ["Appointment reminders", "Lab results", "Health tips"],
    },
    {
        icon: GraduationCap,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        title: "Education",
        description: "Communicate exam schedules, fee reminders and important notices to students and parents instantly.",
        examples: ["Exam notices", "Fee reminders", "School alerts"],
    },
    {
        icon: Truck,
        color: "text-green-500",
        bg: "bg-green-500/10",
        title: "Logistics",
        description: "Keep customers updated on shipment status, delivery ETAs and pickup confirmations in real time.",
        examples: ["Shipment tracking", "Delivery ETA", "Pickup alerts"],
    },
    {
        icon: Building2,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        title: "Enterprise",
        description: "Internal HR notifications, staff alerts, compliance reminders and enterprise communication at scale.",
        examples: ["Staff alerts", "HR notices", "Compliance updates"],
    },
];

export default function UseCases() {
    return (
        <section id="usecases" className="bg-slate-950 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                        Use Cases
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Built for Every Industry
                    </h2>
                    <p className="text-slate-400">
                        Whether you're a startup or enterprise, SMSPro adapts to your communication needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase) => {
                        const Icon = useCase.icon;
                        return (
                            <div
                                key={useCase.title}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
                            >
                                <div className={`w-12 h-12 ${useCase.bg} rounded-xl flex items-center justify-center mb-5`}>
                                    <Icon size={22} className={useCase.color} />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-3">{useCase.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">{useCase.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {useCase.examples.map((ex) => (
                                        <span
                                            key={ex}
                                            className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full"
                                        >
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}