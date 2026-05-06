import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";

export default function Services() {
    const [services, setServices] = useState([]);
    useEffect(() => { api.get("/services").then((r) => setServices(r.data.services || [])); }, []);
    return (
        <div data-testid="services-page" className="min-h-screen">
            <section className="py-16 bg-black gb-noise relative">
                <div className="absolute inset-0 gb-grid opacity-40" />
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Pick your battle</div>
                    <h1 className="font-display text-5xl md:text-7xl font-black mb-4">Gaming <span className="neon-red">Services</span></h1>
                    <p className="text-white/70 text-lg max-w-2xl">Four worlds under one roof. Pricing is transparent, slots are real-time.</p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
                    </div>
                </div>
            </section>

            {/* Ad Banner Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="glass neon-border rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff0033]/20 to-[#00e5ff]/20 opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative z-10 flex-1">
                            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Fuel Your <span className="neon-red">Game</span></h2>
                            <p className="text-white/80 text-lg mb-6 max-w-lg">
                                Stay sharp and energized. We stock ice-cold Monster Energy and Redbull to keep you carrying the team all night.
                            </p>
                        </div>
                        <div className="relative z-10 flex gap-4 md:gap-8 items-center justify-center">
                            <div className="w-24 h-40 md:w-32 md:h-48 rounded-lg overflow-hidden glass-hover shadow-lg">
                                <img src="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&q=80&w=300" alt="Monster Energy" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-24 h-40 md:w-32 md:h-48 rounded-lg overflow-hidden glass-hover shadow-lg mt-8 md:mt-12">
                                <img src="https://images.unsplash.com/photo-1541334691461-125c15e45a0b?auto=format&fit=crop&q=80&w=300" alt="Red Bull" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
