import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { api, waLink, handleExternalClick } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function Booking() {
    const [params] = useSearchParams();
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(null);

    const [form, setForm] = useState({
        name: "", phone: "", email: "",
        service_id: params.get("service") || "pc",
        booking_date: todayStr(),
        time_slot: "11:00",
        duration_hours: 1,
        notes: "",
    });

    const currentService = useMemo(() => services.find((s) => s.id === form.service_id), [services, form.service_id]);

    useEffect(() => { api.get("/services").then((r) => setServices(r.data.services || [])); }, []);

    useEffect(() => {
        if (!form.service_id || !form.booking_date) return;
        setLoadingSlots(true);
        api.get("/availability", { params: { service_id: form.service_id, booking_date: form.booking_date } })
            .then((r) => setSlots(r.data.slots || []))
            .finally(() => setLoadingSlots(false));
    }, [form.service_id, form.booking_date]);

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const totalAmount = (currentService?.price_per_hour || 0) * form.duration_hours;

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.email) {
            toast.error("Please fill name, phone and email");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await api.post("/bookings", form);
            setConfirmed(data.booking);
            toast.success("Booking received! We'll confirm shortly.");
        } catch (err) {
            const msg = err?.response?.data?.detail || "Booking failed";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (confirmed) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6" data-testid="booking-confirmation">
                <div className="glass p-10 max-w-xl w-full text-center">
                    <CheckCircle2 className="mx-auto text-neon-red mb-4" size={56}/>
                    <h2 className="font-display text-3xl font-bold mb-2">Booking Received</h2>
                    <p className="text-white/70 mb-6">Booking ID: <span className="neon-red">{confirmed.id.slice(0, 8)}</span></p>
                    <div className="text-left space-y-2 mb-6 text-white/80 text-sm">
                        <div><span className="text-white/50 uppercase tracking-widest text-xs font-display">Service:</span> {confirmed.service_name}</div>
                        <div><span className="text-white/50 uppercase tracking-widest text-xs font-display">When:</span> {confirmed.booking_date} · {confirmed.time_slot} · {confirmed.duration_hours}h</div>
                        <div><span className="text-white/50 uppercase tracking-widest text-xs font-display">Total:</span> ₹{confirmed.total_amount}</div>
                    </div>
                    <a
                        href={waLink(`Hi, I just booked ${confirmed.service_name} on ${confirmed.booking_date} at ${confirmed.time_slot}. Booking ID: ${confirmed.id.slice(0,8)}`)}
                        onClick={handleExternalClick(waLink(`Hi, I just booked ${confirmed.service_name} on ${confirmed.booking_date} at ${confirmed.time_slot}. Booking ID: ${confirmed.id.slice(0,8)}`))}
                        target="_blank" rel="noreferrer"
                        className="btn-clip inline-block bg-[#25D366] hover:bg-[#1db855] text-black font-display uppercase tracking-wider text-sm px-6 py-3"
                        data-testid="confirm-whatsapp-btn"
                    >
                        Confirm on WhatsApp
                    </a>
                </div>
                <Toaster richColors position="top-right"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12" data-testid="booking-page">
            <Toaster richColors position="top-right"/>
            <div className="max-w-7xl mx-auto px-6">
                <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Reserve your slot</div>
                <h1 className="font-display text-4xl md:text-6xl font-black mb-10">Book a <span className="neon-red">Session</span></h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    <form onSubmit={submit} className="lg:col-span-2 glass p-6 md:p-8 space-y-5" data-testid="booking-form">
                        <div>
                            <label className="font-display uppercase tracking-widest text-xs text-white/60 mb-2 block">Game Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {services.map((s) => (
                                    <button
                                        type="button"
                                        key={s.id}
                                        onClick={() => update("service_id", s.id)}
                                        data-testid={`select-service-${s.id}`}
                                        className={`p-3 font-display uppercase text-xs tracking-wider transition-all ${
                                            form.service_id === s.id
                                                ? "bg-neon-red text-white"
                                                : "border border-white/20 text-white/70 hover:border-neon-red hover:text-neon-red"
                                        }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-display uppercase tracking-widest text-xs text-white/60 mb-2 block">Date</label>
                                <input
                                    type="date"
                                    min={todayStr()}
                                    value={form.booking_date}
                                    onChange={(e) => update("booking_date", e.target.value)}
                                    data-testid="booking-date-input"
                                    className="w-full bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none"
                                />
                            </div>
                            <div>
                                <label className="font-display uppercase tracking-widest text-xs text-white/60 mb-2 block">Duration</label>
                                <select
                                    value={form.duration_hours}
                                    onChange={(e) => update("duration_hours", Number(e.target.value))}
                                    data-testid="booking-duration-select"
                                    className="w-full bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none"
                                >
                                    {[1, 2, 3, 4].map((h) => (
                                        <option key={h} value={h} children={h === 1 ? "1 hour" : `${h} hours`} />
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="font-display uppercase tracking-widest text-xs text-white/60 mb-2 block">Time Slot</label>
                            {loadingSlots ? (
                                <div className="flex items-center gap-2 text-white/60 text-sm"><Loader2 className="animate-spin" size={16}/> Loading availability...</div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2" data-testid="time-slots-grid">
                                    {slots.map((s) => {
                                        const isSelected = form.time_slot === s.time;
                                        const isLow = !s.is_full && s.available <= 2;
                                        return (
                                            <button
                                                type="button"
                                                key={s.time}
                                                disabled={s.is_full}
                                                onClick={() => update("time_slot", s.time)}
                                                data-testid={`slot-${s.time}`}
                                                className={`relative py-3 font-display text-sm tracking-wider transition-all ${
                                                    s.is_full
                                                        ? "bg-white/5 text-white/20 cursor-not-allowed line-through"
                                                        : isSelected
                                                            ? "bg-neon-red text-white"
                                                            : "border border-white/20 text-white/80 hover:border-neon-red"
                                                }`}
                                            >
                                                {s.time}
                                                {isLow && !isSelected && (
                                                    <span className="absolute -top-2 -right-2 text-[10px] bg-neon-red text-white px-1.5 py-0.5">
                                                        {s.available} left
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <input required placeholder="Your Name" value={form.name} onChange={(e) => update("name", e.target.value)}
                                data-testid="booking-name-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none placeholder:text-white/40"/>
                            <input required placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                                data-testid="booking-phone-input"
                                className="bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none placeholder:text-white/40"/>
                        </div>
                        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)}
                            data-testid="booking-email-input"
                            className="w-full bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none placeholder:text-white/40"/>
                        <textarea placeholder="Notes (optional)" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)}
                            data-testid="booking-notes-input"
                            className="w-full bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none placeholder:text-white/40"/>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                data-testid="booking-submit-btn"
                                className="btn-clip flex-1 bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-widest text-sm px-6 py-4 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={16}/> : null}
                                Confirm Booking · ₹{totalAmount}
                            </button>
                            <a
                                href={waLink(`Hi, I want to book ${currentService?.name || "a slot"} on ${form.booking_date} at ${form.time_slot} for ${form.duration_hours} hour(s). Name: ${form.name || "—"}`)}
                                onClick={handleExternalClick(waLink(`Hi, I want to book ${currentService?.name || "a slot"} on ${form.booking_date} at ${form.time_slot} for ${form.duration_hours} hour(s). Name: ${form.name || "—"}`))}
                                target="_blank" rel="noreferrer"
                                data-testid="booking-whatsapp-btn"
                                className="btn-clip border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black font-display uppercase tracking-widest text-sm px-6 py-4 inline-flex items-center justify-center transition-colors"
                            >
                                Book via WhatsApp
                            </a>
                        </div>
                    </form>

                    <aside className="glass p-6 h-fit sticky top-28" data-testid="booking-summary">
                        <div className="font-display text-xs tracking-widest uppercase text-neon-red mb-2">// Order Summary</div>
                        <div className="font-display text-2xl font-bold mb-4">{currentService?.name || "—"}</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-white/70"><span>Price / hour</span><span>₹{currentService?.price_per_hour || 0}</span></div>
                            <div className="flex justify-between text-white/70"><span>Duration</span><span>{form.duration_hours} hour(s)</span></div>
                            <div className="flex justify-between text-white/70"><span>Date</span><span>{form.booking_date}</span></div>
                            <div className="flex justify-between text-white/70"><span>Slot</span><span>{form.time_slot}</span></div>
                        </div>
                        <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-display text-xl">
                            <span>Total</span><span className="neon-red">₹{totalAmount}</span>
                        </div>
                        <p className="text-white/40 text-xs mt-4">Payment collected at venue. Booking will be confirmed after staff verification.</p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
