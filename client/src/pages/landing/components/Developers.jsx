import { Link } from "react-router-dom";
import { Terminal, ArrowRight } from "lucide-react";

const codeExample = `// Send SMS via SMSPro API
const response = await fetch('https://api.smspro.ng/v1/sms/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '08012345678',
    sender: 'MyBrand',
    message: 'Hello! Your OTP is 123456'
  })
});

const data = await response.json();
// { messageId: 'msg_xxx', status: 'SENT', units: 1, cost: 4 }`;

export default function Developers() {
    return (
        <section id="developers" className="bg-slate-950 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider mb-3">
                            For Developers
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Built for Developers, Loved by Teams
                        </h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Integrate SMSPro into your app in minutes with our clean REST API.
                            Full documentation, code samples in multiple languages and a sandbox
                            environment so you can test before you go live.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                "REST API with JSON responses",
                                "Code samples in Node.js, PHP, Python",
                                "Webhook delivery callbacks",
                                "Sandbox environment for testing",
                                "API key management dashboard",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                    <span className="text-slate-300 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/register"
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition text-sm"
                            >
                                Get API Key
                                <ArrowRight size={16} />
                            </Link>
                            <a
                                href="#"
                                className="text-blue-500 hover:text-blue-400 text-sm font-medium transition"
                            >
                                View Docs →
                            </a>
                        </div>
                    </div>

                    {/* Right Code Block */}
                    <div className="relative">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
                            {/* Code Header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 bg-slate-800">
                                <Terminal size={14} className="text-slate-400" />
                                <span className="text-slate-400 text-xs font-mono">send-sms.js</span>
                            </div>

                            {/* Code Content */}
                            <pre className="p-6 text-sm font-mono overflow-x-auto">
                                <code className="text-slate-300 leading-relaxed whitespace-pre">
                                    {codeExample.split("\n").map((line, i) => {
                                        if (line.startsWith("//")) {
                                            return <span key={i} className="text-slate-500">{line}{"\n"}</span>;
                                        }
                                        if (line.includes("'Authorization'") || line.includes("'Content-Type'")) {
                                            return <span key={i} className="text-blue-400">{line}{"\n"}</span>;
                                        }
                                        if (line.includes("Bearer") || line.includes("application/json")) {
                                            return <span key={i} className="text-green-400">{line}{"\n"}</span>;
                                        }
                                        return <span key={i}>{line}{"\n"}</span>;
                                    })}
                                </code>
                            </pre>
                        </div>

                        {/* Glow */}
                        <div className="absolute -inset-1 bg-blue-500/5 rounded-2xl blur-xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section >
    );
}