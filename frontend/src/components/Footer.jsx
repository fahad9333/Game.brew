import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { PHONE_DISPLAY, EMAIL, INSTAGRAM_URL, waLink, handleExternalClick } from "@/lib/api";
import { IMAGES as IMG } from "@/lib/data";

export default function Footer() {
    const footerRef = useRef(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastShown, setToastShown] = useState(false);

    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !toastShown) {
                    setToastShown(true);
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 4000);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [toastShown]);

    return (
        <>
            {/* Dev toast — fixed, fires once when footer scrolls into view */}
            <div
                aria-live="polite"
                style={{
                    position: "fixed",
                    bottom: "1.25rem",
                    right: "1.25rem",
                    zIndex: 9999,
                    pointerEvents: "none",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    opacity: toastVisible ? 1 : 0,
                    transform: toastVisible ? "translateY(0)" : "translateY(20px)",
                }}
            >
                <div style={{
                    background: "rgba(10,10,10,0.92)",
                    border: "1px solid rgba(255,40,40,0.35)",
                    borderRadius: "6px",
                    padding: "0.55rem 1rem",
                    boxShadow: "0 0 18px rgba(255,40,40,0.18)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap",
                }}>
                    <span style={{ color: "rgba(255,40,40,0.8)", fontSize: "0.65rem" }}>⚡</span>
                    <span style={{
                        fontFamily: "inherit",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)",
                    }}>
                        Developed by Mufaiz &amp; Fahad
                    </span>
                </div>
            </div>

            <footer ref={footerRef} className="relative border-t border-neon-red/20 bg-black" data-testid="site-footer">
                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src={IMG.logo} alt="GAMEBREW" className="w-10 h-10 object-contain" />
                            <span className="font-display font-bold text-xl tracking-widest">
                                GAME<span className="neon-red">BREW</span>
                            </span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Brewed for gamers. High-end gaming café in Belagavi with PCs, PS5 rooms, sim racing and pool tables.
                        </p>
                        <br />
                    </div>

                    <div>
                        <h4 className="font-display uppercase tracking-widest text-sm mb-4 text-neon-red">Explore</h4>
                        <ul className="space-y-2 text-white/70">
                            <li><Link to="/services" className="hover:text-white">Services</Link></li>
                            <li><Link to="/booking" className="hover:text-white">Book a Slot</Link></li>
                            <li><Link to="/cafe-booking" className="hover:text-white">Full Café Booking</Link></li>
                            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display uppercase tracking-widest text-sm mb-4 text-neon-red">Contact</h4>
                        <ul className="space-y-3 text-white/70 text-sm">
                            <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, '')}`} target="_blank" rel="noreferrer" data-testid="footer-phone-link">
                                <li className="flex items-start gap-2"><Phone size={16} className="mt-1 text-neon-red" /> {PHONE_DISPLAY}</li>
                            </a>
                            <br />
                            <a href={`mailto:${EMAIL}`} target="_blank" rel="noreferrer" data-testid="footer-email-link">
                                <li className="flex items-start gap-2"><Mail size={16} className="mt-1 text-neon-red" /> {EMAIL}</li>
                            </a>
                            <li className="flex items-start gap-2"><MapPin size={60} className="mt-1 text-neon-red" /> Second Floor, Khanapur Main Rd, above KFC, beside Axis Bank, Mrutyunajay Nagar, Hindu Nagar, Tilakwadi, Belagavi, Karnataka 590006 · 11 AM – 11 PM</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display uppercase tracking-widest text-sm mb-4 text-neon-red">Social</h4>
                        <div className="flex items-center gap-3">
                            <a href={INSTAGRAM_URL} onClick={handleExternalClick(INSTAGRAM_URL)} target="_blank" rel="noreferrer" data-testid="footer-instagram-link"
                                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-neon-red hover:text-neon-red transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href={waLink()} onClick={handleExternalClick(waLink())} target="_blank" rel="noreferrer" data-testid="footer-whatsapp-link"
                                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-neon-red hover:text-neon-red transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.5 3.9 1.6.6 2.2.7 3 .6.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.2-.2-.5-.2zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.2L2 22l4.9-1.3c1.5.8 3.3 1.3 5.1 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" /></svg>
                            </a>
                        </div>
                        <a href={INSTAGRAM_URL} onClick={handleExternalClick(INSTAGRAM_URL)} target="_blank" rel="noreferrer"
                            className="mt-4 block text-xs text-white/50 hover:text-white">@gamebrew.in</a>
                    </div>
                </div>

                <div className="border-t border-white/10 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-1 text-xs font-display tracking-wider uppercase">
                    <span className="text-white/40">© {new Date().getFullYear()} GAMEBREW · Brewed for Gamers</span>
                </div>
            </footer>
        </>
    );
}
