import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { IMAGES } from "@/lib/data";
import {
    LayoutDashboard, CalendarCheck, Mail, Users, LogOut,
    TrendingUp, DollarSign, Clock, PartyPopper, CheckCircle2, XCircle
} from "lucide-react";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "cafe", label: "Café Requests", icon: PartyPopper },
    { id: "messages", label: "Messages", icon: Mail },
];

function Stat({ icon: Icon, label, value, sub }) {
    return (
        <div className="glass p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 flex items-center justify-center border border-neon-red text-neon-red"><Icon size={18}/></div>
                {sub && <span className="text-xs text-white/40 font-display tracking-widest uppercase">{sub}</span>}
            </div>
            <div className="font-display text-3xl font-bold">{value}</div>
            <div className="text-white/60 text-sm mt-1">{label}</div>
        </div>
    );
}

export default function AdminDashboard() {
    const nav = useNavigate();
    const [tab, setTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [cafeReqs, setCafeReqs] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("gb_admin_token")) { nav("/admin/login"); return; }
        load();
    }, []);

    const load = async () => {
        try {
            const [s, b, c, m] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/bookings"),
                api.get("/admin/cafe-bookings"),
                api.get("/admin/messages"),
            ]);
            setStats(s.data);
            setBookings(b.data.items);
            setCafeReqs(c.data.items);
            setMessages(m.data.items);
        } catch (err) {
            if (err?.response?.status === 401) nav("/admin/login");
            toast.error("Failed to load data");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/bookings/${id}`, { status });
            toast.success(`Booking ${status}`);
            load();
        } catch { toast.error("Update failed"); }
    };

    const logout = () => {
        localStorage.removeItem("gb_admin_token");
        localStorage.removeItem("gb_admin_email");
        nav("/admin/login");
    };

    return (
        <div className="min-h-screen flex bg-[#030303]" data-testid="admin-dashboard-page">
            <Toaster richColors position="top-right"/>

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <img src={IMAGES.logo} alt="" className="w-8 h-8 object-contain"/>
                    <span className="font-display font-bold tracking-widest">GAME<span className="neon-red">BREW</span></span>
                </div>
                <nav className="flex-1 space-y-1">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            data-testid={`admin-tab-${t.id}`}
                            className={`w-full flex items-center gap-3 px-4 py-3 font-display uppercase text-xs tracking-widest transition-colors ${
                                tab === t.id ? "bg-neon-red text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <t.icon size={16}/> {t.label}
                        </button>
                    ))}
                </nav>
                <button onClick={logout} data-testid="admin-logout-btn" className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-neon-red font-display uppercase text-xs tracking-widest">
                    <LogOut size={16}/> Logout
                </button>
            </aside>

            {/* Mobile nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-black border-b border-white/10 p-3 flex gap-2 overflow-x-auto">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} data-testid={`admin-mobile-tab-${t.id}`}
                        className={`px-3 py-2 text-xs font-display uppercase whitespace-nowrap ${tab === t.id ? "bg-neon-red text-white" : "text-white/60"}`}>
                        {t.label}
                    </button>
                ))}
                <button onClick={logout} className="px-3 py-2 text-xs font-display uppercase text-neon-red">Logout</button>
            </div>

            <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10">
                {tab === "overview" && stats && (
                    <div data-testid="admin-overview">
                        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-white/50 mb-8">Live metrics from GAMEBREW</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Stat icon={CalendarCheck} label="Total Bookings" value={stats.total_bookings}/>
                            <Stat icon={Clock} label="Today" value={stats.today_bookings}/>
                            <Stat icon={TrendingUp} label="Confirmed" value={stats.confirmed_bookings}/>
                            <Stat icon={DollarSign} label="Revenue" value={`₹${Math.round(stats.total_revenue || 0)}`}/>
                            <Stat icon={Mail} label="Unread Msgs" value={stats.unread_messages}/>
                            <Stat icon={PartyPopper} label="Café Requests" value={stats.cafe_requests}/>
                            <Stat icon={Clock} label="Pending" value={stats.pending_bookings}/>
                            <Stat icon={Users} label="Services" value={stats.by_service?.length || 4}/>
                        </div>
                        <div className="glass p-6">
                            <h3 className="font-display text-xl mb-4">Revenue by Service</h3>
                            <div className="space-y-3">
                                {(stats.by_service || []).map((s) => (
                                    <div key={s.service_id} className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="font-display uppercase tracking-wider text-sm">{s.service_id}</span>
                                        <span className="text-white/60 text-sm">{s.count} bookings</span>
                                        <span className="neon-red font-bold">₹{Math.round(s.revenue)}</span>
                                    </div>
                                ))}
                                {!stats.by_service?.length && <p className="text-white/40 text-sm">No bookings yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {tab === "bookings" && (
                    <div data-testid="admin-bookings-tab">
                        <h1 className="font-display text-3xl font-bold mb-8">Bookings</h1>
                        <div className="glass overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-black/50">
                                    <tr className="text-left font-display uppercase tracking-widest text-xs text-white/50">
                                        <th className="p-4">Name</th><th className="p-4">Service</th><th className="p-4">Date</th>
                                        <th className="p-4">Slot</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b.id} className="border-t border-white/5" data-testid={`booking-row-${b.id}`}>
                                            <td className="p-4">
                                                <div>{b.name}</div>
                                                <div className="text-xs text-white/50">{b.phone}</div>
                                            </td>
                                            <td className="p-4">{b.service_name}</td>
                                            <td className="p-4">{b.booking_date}</td>
                                            <td className="p-4">{b.time_slot} · {b.duration_hours}h</td>
                                            <td className="p-4 neon-red font-bold">₹{b.total_amount}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-display uppercase tracking-wider ${
                                                    b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                                                    b.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                                                    "bg-yellow-500/20 text-yellow-400"
                                                }`}>{b.status}</span>
                                            </td>
                                            <td className="p-4 flex gap-1">
                                                <button onClick={() => updateStatus(b.id, "confirmed")} data-testid={`confirm-${b.id}`} title="Confirm" className="p-1 text-green-400 hover:bg-green-500/20"><CheckCircle2 size={16}/></button>
                                                <button onClick={() => updateStatus(b.id, "cancelled")} data-testid={`cancel-${b.id}`} title="Cancel" className="p-1 text-red-400 hover:bg-red-500/20"><XCircle size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!bookings.length && <tr><td colSpan={7} className="p-8 text-center text-white/40">No bookings yet</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === "cafe" && (
                    <div data-testid="admin-cafe-tab">
                        <h1 className="font-display text-3xl font-bold mb-8">Full Café Requests</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cafeReqs.map((c) => (
                                <div key={c.id} className="glass p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-display text-lg font-bold">{c.name}</div>
                                            <div className="text-white/50 text-sm">{c.phone} · {c.email}</div>
                                        </div>
                                        <span className="font-display uppercase text-xs tracking-widest neon-red">{c.event_type}</span>
                                    </div>
                                    <div className="text-sm text-white/70 mb-2">Date: {c.event_date} · Guests: {c.guest_count}</div>
                                    {c.details && <p className="text-white/60 text-sm italic">"{c.details}"</p>}
                                </div>
                            ))}
                            {!cafeReqs.length && <p className="text-white/40">No requests yet</p>}
                        </div>
                    </div>
                )}

                {tab === "messages" && (
                    <div data-testid="admin-messages-tab">
                        <h1 className="font-display text-3xl font-bold mb-8">Messages</h1>
                        <div className="space-y-3">
                            {messages.map((m) => (
                                <div key={m.id} className="glass p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-display font-bold">{m.name}</div>
                                            <div className="text-xs text-white/50">{m.email} · {m.phone || "—"}</div>
                                        </div>
                                        {!m.is_read && <span className="font-display uppercase text-xs tracking-widest neon-red">New</span>}
                                    </div>
                                    {m.subject && <div className="text-sm text-neon-red font-display mb-2">{m.subject}</div>}
                                    <p className="text-white/80 text-sm">{m.message}</p>
                                </div>
                            ))}
                            {!messages.length && <p className="text-white/40">Inbox is empty</p>}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
