import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Zap, Monitor, Gamepad2, Car, CircleDot, Coffee, PartyPopper, Star } from "lucide-react";
import { api, waLink, handleExternalClick } from "@/lib/api";
import { IMAGES, TESTIMONIALS, FEATURES } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";
import InstagramGrid from "@/components/InstagramGrid";

const iconMap = { monitor: Monitor, "gamepad-2": Gamepad2, car: Car, "circle-dot": CircleDot, coffee: Coffee, "party-popper": PartyPopper };

export default function Home() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        api.get("/services").then((r) => setServices(r.data.services || [])).catch(() => {});
    }, []);

    return (
        <div data-testid="home-page">
            {/* HERO */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden gb-noise">
                <div className="absolute inset-0 gb-grid opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
                <img src={IMAGES.pc} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen" />
                <div className="absolute inset-0 scanline" />

                <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="max-w-3xl">
                        <div className="rise-in font-display text-xs md:text-sm tracking-[0.5em] text-neon-red uppercase mb-6" style={{animationDelay:'0ms'}}>
                            // Belagavi · Est. 2026
                        </div>
                        <h1
                            data-testid="hero-title"
                            className="rise-in font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6"
                            style={{animationDelay:'120ms'}}
                        >
                            LEVEL UP<br />
                            YOUR <span className="neon-red pulse-glow">GAMING</span><br />
                            EXPERIENCE.
                        </h1>
                        <p className="rise-in text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{animationDelay:'240ms'}}>
                            10 PCs. 4 private PS5 rooms. 2 full-motion sim racers. 2 American pool tables.
                            One cyberpunk cathedral built for gamers.
                        </p>
                        <div className="rise-in flex flex-wrap gap-4" style={{animationDelay:'360ms'}}>
                            <Link
                                to="/booking"
                                data-testid="hero-book-btn"
                                className="btn-clip bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-widest text-sm px-8 py-4 inline-flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,51,0.4)]"
                            >
                                <Zap size={16}/> Book a Slot
                            </Link>
                            <a
                                href={waLink()}
                                onClick={handleExternalClick(waLink())}
                                target="_blank"
                                rel="noreferrer"
                                data-testid="hero-whatsapp-btn"
                                className="btn-clip border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black font-display uppercase tracking-widest text-sm px-8 py-4 inline-flex items-center gap-2 transition-colors"
                            >
                                WhatsApp to Book
                            </a>
                        </div>

                        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
                            {[
                                {k:"10", v:"Gaming PCs"},
                                {k:"4", v:"PS5 Rooms"},
                                {k:"2", v:"Sim Racers"},
                                {k:"2", v:"Pool Tables"},
                            ].map((s, i) => (
                                <div key={i} className="rise-in" style={{animationDelay:`${480 + i*80}ms`}}>
                                    <div className="font-display text-4xl neon-red font-bold">{s.k}</div>
                                    <div className="font-display text-xs tracking-widest uppercase text-white/60 mt-1">{s.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="relative py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-14">
                        <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Choose your weapon</div>
                        <h2 className="font-display text-4xl md:text-6xl font-bold">Gaming <span className="neon-red">Services</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="services-grid">
                        {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 bg-gradient-to-b from-black via-[#0a0000] to-black relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-14">
                        <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Why gamebrew</div>
                        <h2 className="font-display text-4xl md:text-6xl font-bold">Built Different.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => {
                            const Icon = iconMap[f.icon] || Zap;
                            return (
                                <div key={i} className="glass glass-hover p-6 rise-in" style={{animationDelay:`${i * 80}ms`}}>
                                    <div className="w-12 h-12 flex items-center justify-center border border-neon-red text-neon-red mb-4">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
                                    <p className="text-white/60 text-sm">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FULL CAFE CTA */}
            <section className="py-24 relative overflow-hidden">
                <img src={IMAGES.ps5} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Special occasions</div>
                        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Book the <span className="neon-red">Whole Café.</span></h2>
                        <p className="text-white/70 text-lg max-w-xl mb-8">
                            Birthdays, corporate offsites, tournaments, squad nights. Take over GAMEBREW for a private gaming experience your crew will never forget.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/cafe-booking" data-testid="cafe-cta-btn" className="btn-clip bg-neon-red text-white font-display uppercase tracking-wider text-sm px-6 py-3 inline-flex items-center gap-2">
                                Request Booking <ArrowRight size={16}/>
                            </Link>
                            <a href={waLink("Hi, I want to book the full GAMEBREW café for an event.")} onClick={handleExternalClick(waLink("Hi, I want to book the full GAMEBREW café for an event."))} target="_blank" rel="noreferrer" className="btn-clip border border-white/30 hover:border-white text-white font-display uppercase tracking-wider text-sm px-6 py-3 transition-colors" data-testid="cafe-cta-whatsapp">
                                WhatsApp Inquiry
                            </a>
                        </div>
                    </div>
                    <div className="glass p-8 md:p-10">
                        <div className="font-display text-sm tracking-widest uppercase text-neon-red mb-2">Only a few weekends left this month</div>
                        <div className="font-display text-3xl font-bold mb-3">Squad Nights · Birthdays · Launches</div>
                        <ul className="space-y-2 text-white/70">
                            <li>· All 10 PCs + 4 PS5 rooms reserved for your group</li>
                            <li>· Custom food & drinks menu</li>
                            <li>· Private tournament setup on request</li>
                            <li>· Photographer add-on available</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-14">
                        <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Gamer voices</div>
                        <h2 className="font-display text-4xl md:text-6xl font-bold">Respected <span className="neon-red">by the streets.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="glass p-6 rise-in" style={{animationDelay:`${i * 100}ms`}}>
                                <div className="flex gap-1 mb-4 text-neon-red">
                                    {Array.from({length: t.rating}).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
                                <div className="font-display text-sm tracking-wider">{t.name}</div>
                                <div className="text-xs text-white/50">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INSTAGRAM */}
            <InstagramGrid />
        </div>
    );
}
