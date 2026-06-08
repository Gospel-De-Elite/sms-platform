import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ name, value, onChange, placeholder = "Enter password" }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition pr-10"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}