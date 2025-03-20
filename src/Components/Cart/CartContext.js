import React, { createContext, useState, useEffect } from "react";

// Kreiramo Context
export const CartContext = createContext();

// Provider komponenta
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Učitavamo korpu iz localStorage kad se aplikacija pokrene
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Čuvamo korpu u localStorage svaki put kad se menja cartItems
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Proveri postoji li već proizvod u korpi
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      // Ako postoji, samo povećaj količinu ili nešto slično
      const updated = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updated);
    } else {
      // Ako ne postoji, dodaj ga sa quantity = 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    setCartItems(updated);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
