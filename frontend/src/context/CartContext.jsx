import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'kt_cart_v2';

const makeKey = (id, variant) => `${id}::${variant || ''}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // variant is an optional human-readable string, e.g. "Dämpfer: KONI-Rot, Achse: Vorderachse"
  const addItem = (product, qty = 1, variant = '') => {
    const key = makeKey(product.id, variant);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        { key, id: product.id, name: product.name, price: product.price, image: product.image, variant, qty },
      ];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeItem(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, i) => s + i.qty * (i.price || 0), 0), [items]);

  const value = { items, addItem, removeItem, updateQty, clear, count, total };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
