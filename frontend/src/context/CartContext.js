import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("gamebrew_cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("gamebrew_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prev) => [...prev, { ...item, cartId: Date.now().toString() }]);
    };

    const removeFromCart = (cartId) => {
        setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.total_amount, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
