import { useState } from "react";
import { GAMES_MENU, IMAGES } from "@/lib/data";

const TABS = [
    { id: "pc", label: "PC Games" },
    { id: "ps5", label: "PS5" },
    { id: "racing", label: "Sim Racing" },
    // { id: "cafe", label: "Food & Café" },
    { id: "pool", label: "Pool" },
];

const getImagePathBase = (category, name) => {
    // Map categories to their respective folder names
    let folder = category;
    if (category === "pc") folder = "PC games";
    if (category === "ps5") folder = "PS5";
    if (category === "racing") folder = "SIM Racing";
    if (category === "pool") folder = "Pool";

    // Safely encode the URI to handle spaces and special characters, without the extension
    return encodeURI(`/assets/images/games/${folder}/${name}`);
};

export default function GamesMenu() {
    const [activeTab, setActiveTab] = useState("pc");

    return (
        <div data-testid="games-menu-page" className="min-h-screen bg-black">
            <section className="py-16 bg-black gb-noise relative">
                <div className="absolute inset-0 gb-grid opacity-40" />
                <div className="max-w-7xl mx-auto px-6 relative pt-12">
                    <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Browse the arsenal</div>
                    <h1 className="font-display text-5xl md:text-7xl font-black mb-4">Games & <span className="neon-red">Menu</span></h1>
                    <p className="text-white/70 text-lg max-w-2xl">
                        Explore our massive library of games across all platforms and grab a bite to keep your energy up.
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto pb-4 mb-8 gap-2 border-b border-white/10 no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap font-display text-sm uppercase tracking-wider px-6 py-3 transition-colors rounded-t-lg ${activeTab === tab.id
                                    ? "bg-neon-red/10 text-neon-red border-b-2 border-neon-red"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {GAMES_MENU[activeTab].map((item, i) => (
                            <div key={i} className="glass glass-hover rounded-xl overflow-hidden group rise-in" style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={`${getImagePathBase(activeTab, item.name)}.jpg`}
                                        data-ext=".jpg"
                                        alt={item.name}
                                        onError={(e) => {
                                            const exts = ['.jpg', '.jpeg', '.png'];
                                            const currentExt = e.target.getAttribute('data-ext') || '.jpg';
                                            const nextIdx = exts.indexOf(currentExt) + 1;
                                            if (nextIdx < exts.length) {
                                                const nextExt = exts[nextIdx];
                                                e.target.setAttribute('data-ext', nextExt);
                                                e.target.src = `${getImagePathBase(activeTab, item.name)}${nextExt}`;
                                            } else {
                                                e.target.onerror = null; // Prevent infinite loop if fallback fails
                                                e.target.src = IMAGES.logo || "/assets/images/logo.jpeg";
                                            }
                                        }}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-display text-lg font-bold text-white tracking-wide">{item.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
