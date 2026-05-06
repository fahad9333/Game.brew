import { Instagram } from "lucide-react";
import { INSTAGRAM_URL, handleExternalClick } from "@/lib/api";
import { IMAGES } from "@/lib/data";

const tiles = [
    { img: IMAGES.pc, caption: "PC BATTLE STATION · RGB on point" },
    { img: IMAGES.skullPc, caption: "GHOST MODE · 10 RIGS RAGING" },
    { img: IMAGES.racing, caption: "FULL MOTION SIM RACING" },
    { img: IMAGES.pool, caption: "AMERICAN POOL · Under the red lights" },
    { img: IMAGES.ps5Rooms, caption: "PS5 PRIVATE PODS · Soundproofed" },
    { img: IMAGES.ps5, caption: "PS5 NIGHT · Mortal Kombat hits different" },
];

export default function InstagramGrid() {
    return (
        <section className="relative py-20 overflow-hidden" data-testid="instagram-grid-section">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                    <div>
                        <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">@gamebrew.in</div>
                        <h2 className="font-display text-3xl md:text-5xl font-bold">From the <span className="neon-red">Feed</span></h2>
                    </div>
                    <a
                        href={INSTAGRAM_URL}
                        onClick={handleExternalClick(INSTAGRAM_URL)}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="instagram-follow-btn"
                        className="btn-clip inline-flex items-center gap-2 border border-neon-red text-neon-red hover:bg-neon-red hover:text-white px-5 py-3 font-display uppercase tracking-wider text-xs transition-colors"
                    >
                        <Instagram size={16}/> Follow on Instagram
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {tiles.map((t, i) => (
                        <a
                            key={i}
                            href={INSTAGRAM_URL}
                            onClick={handleExternalClick(INSTAGRAM_URL)}
                            target="_blank"
                            rel="noreferrer"
                            data-testid={`instagram-tile-${i}`}
                            className="relative group overflow-hidden aspect-square border border-white/5"
                        >
                            <img src={t.img} alt={t.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Instagram size={18} className="text-white"/>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
