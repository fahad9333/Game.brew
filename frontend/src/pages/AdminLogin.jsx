import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { Lock } from "lucide-react";
import { IMAGES } from "@/lib/data";

export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState("admin@gamebrew.in");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/admin/login", { email, password });
            localStorage.setItem("gb_admin_token", data.token);
            localStorage.setItem("gb_admin_email", data.email);
            toast.success("Welcome back");
            nav("/admin/dashboard");
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 gb-noise relative" data-testid="admin-login-page">
            <Toaster richColors position="top-right"/>
            <div className="absolute inset-0 gb-grid opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
            <form onSubmit={submit} className="glass p-8 md:p-10 w-full max-w-md relative" data-testid="admin-login-form">
                <div className="flex items-center gap-3 mb-6">
                    <img src={IMAGES.logo} alt="GAMEBREW" className="w-10 h-10 object-contain"/>
                    <span className="font-display font-bold text-xl tracking-widest">
                        GAME<span className="neon-red">BREW</span>
                    </span>
                </div>
                <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Admin access</div>
                <h1 className="font-display text-3xl font-bold mb-6 flex items-center gap-2"><Lock size={22} className="text-neon-red"/> Sign in</h1>

                <label className="font-display uppercase tracking-widest text-xs text-white/60 block mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    data-testid="admin-email-input"
                    className="w-full mb-4 bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none"/>

                <label className="font-display uppercase tracking-widest text-xs text-white/60 block mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    data-testid="admin-password-input"
                    className="w-full mb-6 bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none"/>

                <button type="submit" disabled={loading}
                    data-testid="admin-login-submit-btn"
                    className="btn-clip w-full bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-widest text-sm px-6 py-3 disabled:opacity-50">
                    {loading ? "Signing in..." : "Enter Dashboard"}
                </button>

                {/* <p className="text-white/40 text-xs mt-6 text-center">Default: admin@gamebrew.in / gamebrew123</p> */}
            </form>
        </div>
    );
}
