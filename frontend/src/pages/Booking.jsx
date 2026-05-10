import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api, waLink, handleExternalClick } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function Booking() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    
    const { addToCart } = useCart();

    const [form, setForm] = useState({
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
            .then((r) => {
                // Filter slots that have already passed if it's today
                const isToday = form.booking_date === todayStr();
                const now = new Date();
                const currentHour = now.getHours();
                
                const filteredSlots = (r.data.slots || []).map(s => {
                    // Expects s.time in "HH:MM" or "12-hour AM/PM" format
                    // Right now we will assume the backend might send either, but let's parse it safely
                    let slotHourStr = s.time.split(":")[0];
                    let isAM = s.time.toLowerCase().includes("am");
                    let isPM = s.time.toLowerCase().includes("pm");
                    
                    let slotHour = parseInt(slotHourStr, 10);
                    if (isPM && slotHour !== 12) slotHour += 12;
                    if (isAM && slotHour === 12) slotHour = 0;

                    const isPast = isToday && slotHour < currentHour;

                    return {
                        ...s,
                        is_full: s.is_full || isPast,
                        available: isPast ? 0 : s.available
                    };
                });
                
                setSlots(filteredSlots);
            })
            .finally(() => setLoadingSlots(false));
    }, [form.service_id, form.booking_date]);

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const totalAmount = (currentService?.price_per_hour || 0) * form.duration_hours;

    const handleAddToCart = () => {
        addToCart({
            service_id: form.service_id,
            service_name: currentService.name,
            booking_date: form.booking_date,
            time_slot: form.time_slot,
            duration_hours: form.duration_hours,
            total_amount: totalAmount,
            notes: form.notes
        });

        toast.success(`${currentService.name} added to cart!`);
    };

    const handleBookNow = () => {
        addToCart({
            service_id: form.service_id,
            service_name: currentService.name,
            booking_date: form.booking_date,
            time_slot: form.time_slot,
            duration_hours: form.duration_hours,
            total_amount: totalAmount,
            notes: form.notes
        });
        navigate("/checkout");
    };

    const handleWhatsApp = () => {
        const msg = `Hi, I want to book a slot at GAMEBREW:\n\n*Service:* ${currentService?.name}\n*Date:* ${form.booking_date}\n*Time:* ${form.time_slot}\n*Duration:* ${form.duration_hours} hour(s)\n*Total:* ₹${totalAmount}`;
        handleExternalClick(waLink(msg))();
    };

    return (
        <div className="min-h-screen py-12" data-testid="booking-page">
            <Toaster richColors position="top-right" duration={2500}/>
            <div className="max-w-7xl mx-auto px-6">
                <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Reserve your slot</div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <h1 className="font-display text-4xl md:text-6xl font-black">Book a <span className="neon-red">Session</span></h1>
                    <button onClick={() => navigate("/checkout")} className="btn-clip border border-neon-red text-neon-red hover:bg-neon-red hover:text-white px-6 py-3 font-display uppercase text-sm transition-colors w-fit">
                        Go to Checkout
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-2 glass p-6 md:p-8 space-y-5" data-testid="booking-form">
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
                                                {isLow && !isSelected && !s.is_full && (
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

                        <textarea placeholder="Notes (optional)" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)}
                            data-testid="booking-notes-input"
                            className="w-full bg-black/50 border border-white/20 px-4 py-3 text-white focus:border-neon-red outline-none placeholder:text-white/40"/>

                        <div className="flex flex-col md:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleBookNow}
                                className="btn-clip flex-1 bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-widest text-sm px-4 py-4 inline-flex items-center justify-center gap-2"
                            >
                                Book Now
                            </button>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="btn-clip flex-1 border border-neon-red text-neon-red hover:bg-neon-red/10 font-display uppercase tracking-widest text-sm px-4 py-4 inline-flex items-center justify-center gap-2 transition-colors"
                            >
                                Add to Cart
                            </button>
                            <button
                                type="button"
                                onClick={handleWhatsApp}
                                className="btn-clip flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-display uppercase tracking-widest text-sm px-4 py-4 inline-flex items-center justify-center gap-2 transition-colors"
                            >
                                WhatsApp
                            </button>
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
