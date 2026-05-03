import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { waLink, handleExternalClick } from "@/lib/api";
import { SERVICE_IMAGES } from "@/lib/data";

export default function ServiceCard({ service, index = 0 }) {
    const img = SERVICE_IMAGES[service.id];
    return (
        <div
            className="glass glass-hover relative overflow-hidden group rise-in"
            style={{ animationDelay: `${index * 120}ms` }}
            data-testid={`service-card-${service.id}`}
        >
            <div className="relative h-56 overflow-hidden">
                <img src={img} alt={service.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4 font-display text-xs uppercase tracking-widest text-neon-red bg-black/70 px-3 py-1 border border-neon-red/50">
                    {service.resource_count} available
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-display text-2xl font-bold tracking-wide mb-1">{service.name}</h3>
                <p className="text-white/60 text-sm mb-4">{service.tagline}</p>
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <div className="font-display neon-red text-2xl font-bold">{service.price_label}</div>
                    </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{service.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to={`/booking?service=${service.id}`}
                        data-testid={`book-${service.id}-btn`}
                        className="flex-1 btn-clip bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-wider text-xs px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                        Book Now <ArrowRight size={14} />
                    </Link>
                    <a
                        href={waLink(`Hi, I want to book ${service.name} at GAMEBREW`)}
                        onClick={handleExternalClick(waLink(`Hi, I want to book ${service.name} at GAMEBREW`))}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`whatsapp-${service.id}-btn`}
                        className="flex-1 btn-clip border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black font-display uppercase tracking-wider text-xs px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
