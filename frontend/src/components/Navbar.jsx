import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { IMAGES } from "@/lib/data";
import { useCart } from "@/context/CartContext";

const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/games", label: "Games" },
    { to: "/booking", label: "Book Now" },
    { to: "/cafe-booking", label: "Full Café" },
    { to: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const loc = useLocation();
    const { cart } = useCart();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setOpen(false); }, [loc.pathname]);

    return (
        <header
            data-testid="site-navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-black/80 backdrop-blur-xl border-b border-neon-red/30" : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
                    <img src={IMAGES.logo} alt="GAMEBREW" className="w-10 h-10 object-contain" />
                    <span className="font-display font-bold text-xl tracking-widest">
                        GAME<span className="neon-red">BREW</span>
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            data-testid={`nav-${l.label.toLowerCase().replace(/ /g, "-")}-link`}
                            className={({ isActive }) =>
                                `font-display text-sm uppercase tracking-wider px-4 py-2 transition-colors ${
                                    isActive ? "text-neon-red" : "text-white/80 hover:text-neon-red"
                                }`
                            }
                            end={l.to === "/"}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    {cart.length > 0 && (
                        <Link to="/checkout" className="relative text-white hover:text-neon-red transition-colors">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-neon-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {cart.length}
                            </span>
                        </Link>
                    )}
                    <Link
                        to="/booking"
                        data-testid="navbar-cta-book-btn"
                        className="inline-flex items-center btn-clip bg-neon-red hover:bg-neon-redSoft text-white font-display uppercase tracking-wider text-sm px-6 py-3 transition-colors"
                    >
                        Book Slot
                    </Link>
                </div>

                <div className="lg:hidden flex items-center gap-4">
                    {cart.length > 0 && (
                        <Link to="/checkout" className="relative text-white hover:text-neon-red transition-colors">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-neon-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {cart.length}
                            </span>
                        </Link>
                    )}
                    <button
                        className="text-white"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="menu"
                        data-testid="mobile-menu-toggle"
                    >
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="lg:hidden bg-black/95 border-t border-neon-red/30" data-testid="mobile-menu">
                    <div className="flex flex-col p-6 gap-2">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                data-testid={`mobile-nav-${l.label.toLowerCase().replace(/ /g, "-")}-link`}
                                className={({ isActive }) =>
                                    `font-display uppercase tracking-wider py-3 border-b border-white/10 ${
                                        isActive ? "text-neon-red" : "text-white/80"
                                    }`
                                }
                                end={l.to === "/"}
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
