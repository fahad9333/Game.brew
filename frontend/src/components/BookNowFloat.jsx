import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

export default function BookNowFloat() {
    const loc = useLocation();
    if (loc.pathname.startsWith("/admin")) return null;
    if (loc.pathname === "/booking") return null;
    return (
        <Link
            to="/booking"
            data-testid="booknow-float-btn"
            className="fixed bottom-6 left-6 z-40 hidden md:inline-flex items-center gap-2 btn-clip bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-wider text-sm px-6 py-3 shadow-[0_0_24px_rgba(255,0,51,0.5)]"
        >
            <Zap size={16}/> Book Now
        </Link>
    );
}
