import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import GamesMenu from "@/pages/GamesMenu";
import Booking from "@/pages/Booking";
import CafeBooking from "@/pages/CafeBooking";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import CartCheckout from "@/pages/CartCheckout";
import { CartProvider } from "@/context/CartContext";

function App() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="App">
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/games" element={<GamesMenu />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/checkout" element={<CartCheckout />} />
                            <Route path="/cafe-booking" element={<CafeBooking />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin" element={<AdminLogin />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </div>
    );
}

export default App;
