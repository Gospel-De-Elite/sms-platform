import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="bg-blue-600 py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Start Sending SMS Today
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                    Join thousands of Nigerian businesses using SMSPro to reach their
                    customers reliably. No monthly fees. No setup costs. Just results.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition text-base"
                    >
                        Create Free Account
                        <ArrowRight size={18} />
                    </Link>
                    <a
                        href="mailto:hello@smspro.ng"
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 border border-blue-500 text-white font-medium px-8 py-4 rounded-xl transition text-base"
                    >
                        Contact Sales
                    </a>
                </div>
            </div>
        </section>
    );
}