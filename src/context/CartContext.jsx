import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

// Set the unified localStorage key name across the whole ecosystem
const CART_STORAGE_KEY = "saffronSage_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) ?? [];
    } catch (err) {
      console.error("Failed to parse cart localStorage:", err);
      return [];
    }
  });

  // Keep localStorage synced perfectly using the new key
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  const addToCart = (product) => {
    const targetId = product.id ?? product._id;
    if (!targetId) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => (item.id ?? item._id) === targetId);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity ?? 1) + (product.quantity ?? 1)
        };
        return updated;
      }

      return [...prev, { ...product, id: targetId, quantity: product.quantity ?? 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.id ?? item._id) !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => ((item.id ?? item._id) === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item))
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        (item.id ?? item._id) === id ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) - 1) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be executed within an explicit <CartProvider /> tree element scope.");
  }
  return context;
};