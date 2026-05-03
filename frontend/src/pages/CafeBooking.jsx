import { useState } from "react";
import { api, waLink, handleExternalClick } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { PartyPopper, CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/data";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function CafeBooking() {
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        name: "", phone: "", email: "",
        event_date: todayStr(),
        guest_count: 20,
        event_type: "Birthday",
        details: "",
    });
    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/cafe-booking", form);
            toast.success("Request sent! We'll get back to you soon.");
            setDone(true);
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to submit");
        }
    };

    return (
        <div className="min-h-screen py-12" data-testid="cafe-booking-page">
            <Toaster richColors position="top-right"/>
            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
                <div>
                    <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Full café booking</div>
                    <h1 className="font-display text-4xl md:text-6xl font-black mb-6">Own the <span className="neon-red">Arena.</span></h1>
                    <img src={IMAGES.pc} alt="" className="w-full object-cover neon-border mb-6"/>
                    <p className="text-white/70 leading-relaxed">
                        Book all 10 PCs, 4 PS5 rooms, both sim racers, and pool tables for your private event.
                        Perfect for birthdays, corporate nights, tournaments, and product launches.
                    </p>
                </div>

                {done ? (
                    <div className="glass p-8 h-fit text-center" data-testid="cafe-booking-success">
                        <CheckCircle2 className="mx-auto text-neon-red mb-4" size={56}/>
                        <h2 className="font-display text-2xl font-bold mb-2">Request received!</h2>
                        <p className="text-white/70 mb-6">Our team will contact you within 12 hours to confirm availability and custom pricing.</p>
                        <a href={waLink("Hi, I just submitted a full café booking request on GAMEBREW site.")} onClick={handleExternalClick(waLink("Hi, I just submitted a full café booking request on GAMEBREW site."))} target="_blank" rel="noreferrer" className="btn-clip inline-block bg-[#25D366] text-black font-display uppercase tracking-widest px-6 py-3">
                            Follow up on WhatsApp
                        </a>
                    </div>
                ) : (
                    <form onSubmit={submit} className="glass p-6 md:p-8 space-y-4" data-testid="cafe-booking-form">
                        <div className="flex items-center gap-3 mb-2">
                            <PartyPopper className="text-neon-red"/>
                            <h2 className="font-display text-xl uppercase tracking-widest">Tell us about it</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input required placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)}
                                data-testid="cafe-name-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                            <input required placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                                data-testid="cafe-phone-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                        </div>
                        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)}
                            data-testid="cafe-email-input"
                            className="w-full bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                        <div className="grid md:grid-cols-3 gap-4">
                            <input type="date" min={todayStr()} value={form.event_date} onChange={(e) => update("event_date", e.target.value)}
                                data-testid="cafe-date-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none"/>
                            <input type="number" min={1} value={form.guest_count} onChange={(e) => update("guest_count", Number(e.target.value))} placeholder="Guests"
                                data-testid="cafe-guests-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                            <select value={form.event_type} onChange={(e) => update("event_type", e.target.value)}
                                data-testid="cafe-type-select"
                                className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none">
                                {["Birthday", "Corporate", "Tournament", "Launch", "Other"].map((t) => (
                                    <option key={t} value={t} children={t} />
                                ))}
                            </select>
                        </div>
                        <textarea rows={4} placeholder="Event details (food, timings, theme...)" value={form.details} onChange={(e) => update("details", e.target.value)}
                            data-testid="cafe-details-input"
                            className="w-full bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit" data-testid="cafe-submit-btn" className="btn-clip flex-1 bg-neon-red text-white font-display uppercase tracking-widest text-sm px-6 py-4">
                                Submit Request
                            </button>
                            <a href={waLink(`Hi, I want to book the full GAMEBREW café on ${form.event_date} for ${form.guest_count} guests (${form.event_type}).`)} onClick={handleExternalClick(waLink(`Hi, I want to book the full GAMEBREW café on ${form.event_date} for ${form.guest_count} guests (${form.event_type}).`))} target="_blank" rel="noreferrer"
                                data-testid="cafe-whatsapp-btn"
                                className="btn-clip border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black font-display uppercase tracking-widest text-sm px-6 py-4 inline-flex items-center justify-center transition-colors">
                                WhatsApp Inquiry
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
