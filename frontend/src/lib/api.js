import axios from "axios";

export const API = process.env.REACT_APP_API_URL || "/api";

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("gb_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "";
export const PHONE_DISPLAY = process.env.REACT_APP_PHONE_DISPLAY || "";
export const EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "";
export const INSTAGRAM_URL = process.env.REACT_APP_INSTAGRAM_URL || "";

export const waLink = (message = "Hi, I want to book a gaming slot at GAMEBREW") =>
    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

export const openExternal = (url) => {
    if (!url) return;
    try {
        const w = window.open(url, "_blank", "noopener,noreferrer");
        if (w) return;
    } catch (_) {}
    try {
        if (window.top && window.top !== window.self) {
            window.top.location.href = url;
            return;
        }
    } catch (_) {}
    window.location.href = url;
};

export const handleExternalClick = (url) => (e) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
    if (e) e.preventDefault();
    openExternal(url);
};
