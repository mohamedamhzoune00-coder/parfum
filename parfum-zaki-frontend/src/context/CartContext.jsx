import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('parfum_zaki_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('parfum_zaki_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error writing cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    if (!product || !variant) return;
    const itemKey = `${product._id}-${variant.ml}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * variant.price,
        };
        return updated;
      } else {
        const newItem = {
          key: itemKey,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          image: product.images?.[0] || '',
          variant: {
            ml: variant.ml,
            price: variant.price,
          },
          quantity,
          subtotal: quantity * variant.price,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === itemKey
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.variant.price,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
