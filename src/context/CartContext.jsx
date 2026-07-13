import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hima_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (productName, price) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === productName);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.name === productName ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { name: productName, price, quantity: 1 }];
      }
      localStorage.setItem('hima_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productName) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.name !== productName);
      localStorage.setItem('hima_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productName);
      return;
    }
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.name === productName ? { ...item, quantity } : item
      );
      localStorage.setItem('hima_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('hima_cart');
  };

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalQty,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
