import { useState } from "react";
import { api, waLink, PHONE_DISPLAY, EMAIL, INSTAGRAM_URL, handleExternalClick } from "@/lib/api";
import { toast, Toaster } from "sonner";
import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/contact", form);
            toast.success("Message sent!");
            setSent(true);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed");
        }
    };

    return (
        <div className="min-h-screen py-12" data-testid="contact-page">
            <Toaster richColors position="top-right"/>
            <div className="max-w-7xl mx-auto px-6">
                <div className="font-display text-xs tracking-[0.5em] text-neon-red uppercase mb-3">// Come say hi</div>
                <h1 className="font-display text-4xl md:text-6xl font-black mb-10">Contact <span className="neon-red">GAMEBREW</span></h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="glass p-6 md:p-8 space-y-4" data-testid="contact-form">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input required placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)}
                                    data-testid="contact-name-input"
                                    className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)}
                                    data-testid="contact-email-input"
                                    className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                                    data-testid="contact-phone-input"
                                    className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                                <input placeholder="Subject" value={form.subject} onChange={(e) => update("subject", e.target.value)}
                                    data-testid="contact-subject-input"
                                    className="bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                            </div>
                            <textarea required rows={5} placeholder="Your message..." value={form.message} onChange={(e) => update("message", e.target.value)}
                                data-testid="contact-message-input"
                                className="w-full bg-black/50 border border-white/20 px-4 py-3 focus:border-neon-red outline-none placeholder:text-white/40"/>
                            <button type="submit" data-testid="contact-submit-btn" className="btn-clip bg-neon-red text-white font-display uppercase tracking-widest text-sm px-6 py-3 inline-flex items-center gap-2">
                                <Send size={14}/> Send Message
                            </button>
                            {sent && <p className="text-green-400 text-sm">Thanks! We'll reach out soon.</p>}
                        </form>

                        <div className="mt-6 aspect-[16/9] border border-white/10">
                            <iframe
                                title="GAMEBREW on map"
                                src="https://www.google.com/maps?q=Belagavi,Karnataka&output=embed"
                                className="w-full h-full"
                                loading="lazy"
                                data-testid="map-iframe"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="glass p-6">
                            <Phone className="text-neon-red mb-3"/>
                            <div className="font-display uppercase tracking-widest text-xs text-white/50">Call us</div>
                            <a href={`tel:+${PHONE_DISPLAY.replace(/\s/g,"").replace("+","")}`} className="font-display text-xl mt-1 block hover:text-neon-red" data-testid="contact-phone-link">{PHONE_DISPLAY}</a>
                        </div>
                        <div className="glass p-6">
                            <Mail className="text-neon-red mb-3"/>
                            <div className="font-display uppercase tracking-widest text-xs text-white/50">Email</div>
                            <a href={`mailto:${EMAIL}`} className="font-display text-lg mt-1 block hover:text-neon-red break-all" data-testid="contact-email-link">{EMAIL}</a>
                        </div>
                        <div className="glass p-6">
                            <MapPin className="text-neon-red mb-3"/>
                            <div className="font-display uppercase tracking-widest text-xs text-white/50">Location</div>
                            <div className="font-display text-lg mt-1">Second Floor, Khanapur Main Rd, above KFC, beside Axis Bank, Mrutyunajay Nagar, Hindu Nagar, Tilakwadi, Belagavi, Karnataka 590006</div>
                            <div className="text-white/60 text-sm mt-1">Open 11 AM – 11 PM</div>
                        </div>
                        <div className="flex gap-3">
                            <a href={waLink()} onClick={handleExternalClick(waLink())} target="_blank" rel="noreferrer" className="flex-1 btn-clip bg-[#25D366] text-black font-display uppercase tracking-widest text-xs px-4 py-3 text-center" data-testid="contact-whatsapp-btn">
                                WhatsApp
                            </a>
                            <a href={INSTAGRAM_URL} onClick={handleExternalClick(INSTAGRAM_URL)} target="_blank" rel="noreferrer" className="flex-1 btn-clip border border-neon-red text-neon-red hover:bg-neon-red hover:text-white font-display uppercase tracking-widest text-xs px-4 py-3 text-center inline-flex items-center justify-center gap-2 transition-colors" data-testid="contact-instagram-btn">
                                <Instagram size={14}/> Follow
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
