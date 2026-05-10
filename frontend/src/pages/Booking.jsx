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
    
    const { cart, addToCart, getCartTotal } = useCart();

    const [form, setForm] = useState({
        service_id: params.get("service") || "pc",
        booking_date: todayStr(),
        time_slot: "11:00",
        duration_hours: 1,
        quantity: 1,
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
                
                const filteredSlots = (r.data.slots || []).map(s => {
                    let slotHourStr = s.time.split(":")[0];
                    let slotMinStr = s.time.includes(":") ? s.time.split(":")[1].substring(0, 2) : "00";
                    let isAM = s.time.toLowerCase().includes("am");
                    let isPM = s.time.toLowerCase().includes("pm");
                    
                    let slotHour = parseInt(slotHourStr, 10);
                    let slotMin = parseInt(slotMinStr, 10);
                    if (isPM && slotHour !== 12) slotHour += 12;
                    if (isAM && slotHour === 12) slotHour = 0;

                    let isPast = false;
                    if (isToday) {
                        const slotDate = new Date();
                        slotDate.setHours(slotHour, slotMin, 0, 0);
                        
                        // Disable exactly 90 minutes before scheduled time
                        const cutoffDate = new Date(slotDate.getTime() - 90 * 60000);
                        
                        if (now >= cutoffDate) {
                            isPast = true;
                        }
                    }

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

    const adjustedSlots = useMemo(() => {
        return slots.map(s => {
            const inCart = cart
                .filter(item => item.service_id === form.service_id && item.booking_date === form.booking_date && item.time_slot === s.time)
                .reduce((sum, item) => sum + (item.quantity || 1), 0);
                
            const actualAvailable = Math.max(0, s.available - inCart);
            const is_full = s.is_full || actualAvailable === 0;
            
            return {
                ...s,
                available: actualAvailable,
                is_full
            };
        });
    }, [slots, cart, form.service_id, form.booking_date]);

    const selectedSlotData = useMemo(() => adjustedSlots.find(s => s.time === form.time_slot), [adjustedSlots, form.time_slot]);
    const maxQuantity = selectedSlotData && !selectedSlotData.is_full ? selectedSlotData.available : 0;

    useEffect(() => {
        if (maxQuantity > 0 && form.quantity > maxQuantity) {
            setForm(f => ({ ...f, quantity: maxQuantity }));
        } else if (maxQuantity === 0) {
            setForm(f => ({ ...f, quantity: 1 }));
        }
    }, [maxQuantity, form.quantity]);

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const totalAmount = (currentService?.price_per_hour || 0) * form.duration_hours * form.quantity;

    const handleAddToCart = () => {
        addToCart({
            service_id: form.service_id,
            service_name: currentService.name,
            booking_date: form.booking_date,
            time_slot: form.time_slot,
            duration_hours: form.duration_hours,
            quantity: form.quantity,
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
            quantity: form.quantity,
            total_amount: totalAmount,
            notes: form.notes
        });
        navigate("/checkout");
    };

    const handleWhatsApp = () => {
        const msg = `Hi, I want to book a slot at GAMEBREW:\n\n*Service:* ${currentService?.name}\n*Date:* ${form.booking_date}\n*Time:* ${form.time_slot}\n*Duration:* ${form.duration_hours} hour(s)\n*Quantity:* ${form.quantity}\n*Total:* ₹${totalAmount}`;
        handleExternalClick(waLink(msg))();
    };

    return (
        <div className="min-h-screen py-12" data-testid="booking-page">
            <Toaster richColors position="top-right" duration={2500}/>
            <div className="max-w-7xl mx-auto px-6">
                <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Reserve your slot</div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <h1 className="font-display text-4xl md:text-6xl font-black">Book a <span className="neon-red">Session</span></h1>
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
                                    {adjustedSlots.map((s) => {
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
                                                {!s.is_full && (
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

                        <div className="flex items-center justify-between mt-2 mb-4 bg-black/30 p-4 border border-white/10">
                            <div className="flex flex-col">
                                <label className="font-display uppercase tracking-widest text-xs text-white/60 mb-1">Quantity</label>
                                {selectedSlotData && !selectedSlotData.is_full ? (
                                    <span className="text-neon-red text-xs font-bold">{maxQuantity} Spots Left</span>
                                ) : (
                                    <span className="text-white/40 text-xs">Unavailable</span>
                                )}
                            </div>
                            <div className="flex items-center border border-white/20 bg-black/50">
                                <button 
                                    type="button" 
                                    onClick={() => update("quantity", Math.max(1, form.quantity - 1))} 
                                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
                                    disabled={form.quantity <= 1 || maxQuantity === 0}
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-display text-sm">{form.quantity}</span>
                                <button 
                                    type="button" 
                                    onClick={() => update("quantity", Math.min(maxQuantity, form.quantity + 1))} 
                                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
                                    disabled={form.quantity >= maxQuantity || maxQuantity === 0}
                                >
                                    +
                                </button>
                            </div>
                        </div>

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

                    <aside className="glass p-6 h-fit sticky top-28 flex flex-col gap-6" data-testid="booking-summary">
                        <div>
                            <div className="font-display text-xs tracking-widest uppercase text-neon-red mb-3">// Current Selection</div>
                            <div className="font-display text-2xl font-bold mb-4">{currentService?.name || "—"}</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-white/70"><span>Price / hour</span><span>₹{currentService?.price_per_hour || 0}</span></div>
                                <div className="flex justify-between text-white/70"><span>Duration</span><span>{form.duration_hours} hour(s)</span></div>
                                <div className="flex justify-between text-white/70"><span>Date</span><span>{form.booking_date}</span></div>
                                <div className="flex justify-between text-white/70"><span>Slot</span><span>{form.time_slot}</span></div>
                                <div className="flex justify-between text-white/70"><span>Quantity</span><span>{form.quantity}</span></div>
                            </div>
                            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-display text-xl">
                                <span>Selection Total</span><span className="neon-red">₹{totalAmount}</span>
                            </div>
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-white/10 pt-6">
                                <div className="font-display text-xs tracking-widest uppercase text-neon-red mb-4">// Cart Items</div>
                                <div className="space-y-3 mb-4">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-white/80">{item.service_name} (x{item.quantity || 1})</span>
                                            <span className="text-white">₹{item.total_amount}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between font-display text-xl">
                                    <span>Grand Total</span><span className="neon-red font-bold">₹{getCartTotal()}</span>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-white/10 pt-6">
                            <p className="text-white/40 text-xs mb-4">Payment collected at venue. Booking will be confirmed after staff verification.</p>
                            <button onClick={() => navigate("/checkout")} className="w-full btn-clip border border-neon-red text-neon-red hover:bg-neon-red hover:text-white px-6 py-4 font-display uppercase text-sm transition-colors text-center block">
                                Go to Checkout
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
