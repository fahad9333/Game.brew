import { IMAGES } from "@/lib/data";
import InstagramGrid from "@/components/InstagramGrid";
import { Zap, Shield, Users, Flame } from "lucide-react";

export default function About() {
    return (
        <div data-testid="about-page">
            <section className="relative py-20 overflow-hidden gb-noise">
                <div className="absolute inset-0 gb-grid opacity-40" />
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Our story</div>
                    <h1 className="font-display text-5xl md:text-7xl font-black mb-6">
                        Brewed for <span className="neon-red">Gamers.</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
                        GAMEBREW started as a dream shared between two friends in Belagavi — a place to game, hang out, and feel
                        the adrenaline of an esports arena without the city-level pricing. Today, it's the most iconic gaming café
                        in Karnataka.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-black">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div className="relative">
                        <img src={IMAGES.pc} alt="PC Gaming" className="w-full object-cover neon-border" />
                    </div>
                    <div>
                        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">An arena, <span className="neon-red">not a café.</span></h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            Every corner of GAMEBREW was designed to make you feel like you stepped into a cyberpunk film. Red ambient
                            lighting, soundproof PS5 rooms, custom-built gaming rigs, and energy drinks on tap.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Whether you're grinding a competitive ranked match, racing lap times on our motion rigs, or cracking a
                            cold one at the pool table — you're home.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-black via-[#0a0000] to-black">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">Why <span className="neon-red">GAMEBREW</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {[
                            { icon: Zap,    title: "Zero Lag",       desc: "Top-shelf RTX rigs + fiber internet." },
                            { icon: Shield, title: "Private Rooms",  desc: "4 PS5 rooms, soundproofed." },
                            { icon: Users,  title: "Squad Ready",    desc: "Book full café for events." },
                            { icon: Flame,  title: "Open Late",      desc: "11 AM – 11 PM · 7 days a week." },
                        ].map((f, i) => (
                            <div key={i} className="glass p-6">
                                <f.icon className="text-neon-red mb-4" size={28} />
                                <div className="font-display text-xl font-bold mb-2">{f.title}</div>
                                <div className="text-white/60 text-sm">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <InstagramGrid />
        </div>
    );
}
