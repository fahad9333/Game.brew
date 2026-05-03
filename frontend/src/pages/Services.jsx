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
        </div>
    );
}
