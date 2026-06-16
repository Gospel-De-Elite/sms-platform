const testimonials = [
    {
        quote: "SMSPro transformed how we send transaction alerts. Delivery rates went from 78% to over 96% overnight. Our customers are now always informed.",
        name: "Adewale Okonkwo",
        title: "CTO, FinEdge Payments",
        initials: "AO",
        color: "bg-blue-600",
    },
    {
        quote: "We integrated the API in less than 2 hours. The documentation is clean, the sandbox works perfectly and support responded in minutes when we had a question.",
        name: "Chioma Eze",
        title: "Lead Developer, ShopEasy NG",
        initials: "CE",
        color: "bg-purple-600",
    },
    {
        quote: "As a healthcare provider we needed reliability above everything else. SMSPro delivers appointment reminders for 15,000 patients monthly without a single failure.",
        name: "Dr. Emeka Nwachukwu",
        title: "Head of Operations, MedConnect",
        initials: "EN",
        color: "bg-green-600",
    },
];

export default function Testimonials() {
    return (
        <section className="bg-slate-900 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                        Social Proof
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Trusted by Businesses Across Nigeria
                    </h2>
                    <p className="text-slate-400">
                        See what our customers are saying about SMSPro.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-sm">★</span>
                                ))}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">{testimonial.name}</p>
                                    <p className="text-slate-500 text-xs">{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}