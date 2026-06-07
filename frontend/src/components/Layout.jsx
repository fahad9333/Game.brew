import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BookNowFloat from "./BookNowFloat";

export default function Layout() {
    const loc = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
    const hideChrome = loc.pathname.startsWith("/admin");
    return (
        <div className="min-h-screen flex flex-col bg-background">
            {!hideChrome && <Navbar />}
            <main className={hideChrome ? "flex-1" : "flex-1 page-wrap"}>
                <Outlet />
            </main>
            {!hideChrome && <Footer />}
            {!hideChrome && <BookNowFloat />}
        </div>
    );
}
