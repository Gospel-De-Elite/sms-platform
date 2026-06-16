import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How does billing work?",
        answer: "SMSPro uses a credit-based system. You fund your wallet and each SMS deducts units based on message length and recipient count. Standard SMS is 160 characters = 1 unit. There are no monthly fees — you only pay for what you send.",
    },
    {
        question: "Which networks are supported in Nigeria?",
        answer: "We support all major Nigerian networks including MTN, Airtel, Glo and 9mobile. Messages are routed through the best available path to ensure maximum delivery rates.",
    },
    {
        question: "How long does Sender ID approval take?",
        answer: "Sender ID approval typically takes 24–48 hours. Our team reviews each submission to ensure compliance with carrier guidelines. You'll be notified by email once your Sender ID is approved or if there are any issues.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes — you can create a free account and explore the dashboard without paying. To send actual SMS messages you'll need to fund your wallet. There's no minimum top-up amount.",
    },
    {
        question: "How secure is my data?",
        answer: "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard JWT authentication, HMAC webhook signing and never store sensitive credentials in plain text.",
    },
    {
        question: "Can I send SMS internationally?",
        answer: "Currently SMSPro is optimized for Nigerian networks. International SMS support is on our roadmap. Contact sales if you have specific international requirements.",
    },
    {
        question: "What happens if an SMS fails to deliver?",
        answer: "Failed messages are not charged. If our primary gateway fails we automatically retry through a secondary gateway. You can view failed messages in your reports dashboard with failure reasons.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="bg-slate-950 py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                        FAQ
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-400">
                        Everything you need to know about SMSPro.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left"
                            >
                                <span className="text-white font-medium text-sm pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-5">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}