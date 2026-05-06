import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";

export default function CartCheckout() {
    const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Common customer details
    const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);

        try {
            // Process all bookings in the cart
            const promises = cart.map(item => 
                api.post("/bookings", {
                    name: customer.name,
                    phone: customer.phone,
                    email: customer.email,
                    service_id: item.service_id,
                    booking_date: item.booking_date,
                    time_slot: item.time_slot,
                    duration_hours: item.duration_hours,
                    notes: item.notes || ""
                })
            );
            
            await Promise.all(promises);
            clearCart();
            alert("All bookings confirmed!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Checkout failed. Some slots might no longer be available.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <h2 className="font-display text-4xl text-white mb-4">Your Cart is Empty</h2>
                <button onClick={() => navigate("/services")} className="btn-clip bg-neon-red text-white px-6 py-3 font-display uppercase">
                    Browse Services
                </button>
            </div>
        );
    }

    return (
        <div data-testid="cart-checkout-page" className="min-h-screen bg-black pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="font-display text-4xl md:text-5xl font-black mb-8">Checkout <span className="neon-red">Cart</span></h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cart Items */}
                    <div className="space-y-4">
                        <h2 className="font-display text-xl text-neon-red uppercase tracking-wider mb-4">Selected Slots</h2>
                        {cart.map((item) => (
                            <div key={item.cartId} className="glass p-4 rounded-lg flex justify-between items-center border border-white/10">
                                <div>
                                    <div className="font-display font-bold text-lg">{item.service_name}</div>
                                    <div className="text-white/60 text-sm">{item.booking_date} at {item.time_slot}</div>
                                    <div className="text-white/60 text-sm">Duration: {item.duration_hours} hour(s)</div>
                                    <div className="text-neon-red font-bold mt-1">₹{item.total_amount}</div>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-white/40 hover:text-red-500 transition-colors p-2">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <div className="glass p-4 rounded-lg flex justify-between items-center border border-neon-red mt-6">
                            <span className="font-display font-bold text-xl uppercase">Total Amount</span>
                            <span className="font-display font-bold text-2xl text-neon-red">₹{getCartTotal()}</span>
                        </div>
                    </div>

                    {/* Customer Details Form */}
                    <div className="glass p-6 rounded-lg border border-white/10 h-fit">
                        <h2 className="font-display text-xl text-neon-red uppercase tracking-wider mb-6">Your Details</h2>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-white/70 text-xs font-display uppercase tracking-wider mb-2">Name</label>
                                <input required type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-colors" />
                            </div>
                            <div>
                                <label className="block text-white/70 text-xs font-display uppercase tracking-wider mb-2">Phone</label>
                                <input required type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-colors" />
                            </div>
                            <div>
                                <label className="block text-white/70 text-xs font-display uppercase tracking-wider mb-2">Email</label>
                                <input required type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-colors" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full btn-clip bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-wider py-4 mt-4 transition-colors disabled:opacity-50">
                                {loading ? "Processing..." : "Confirm All Bookings"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
