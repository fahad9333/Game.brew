import { waLink, handleExternalClick } from "@/lib/api";

export default function WhatsAppFloat() {
    const url = waLink();
    return (
        <a
            href={url}
            onClick={handleExternalClick(url)}
            target="_blank"
            rel="noreferrer"
            data-testid="whatsapp-float-btn"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_24px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform"
        >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.7c.1.2 1.8 2.8 4.5 3.9 1.6.6 2.2.7 3 .6.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.2-.2-.5-.2zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.2L2 22l4.9-1.3c1.5.8 3.3 1.3 5.1 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
            </svg>
            <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-40" />
        </a>
    );
}
