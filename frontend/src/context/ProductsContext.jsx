import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api';

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (e) {
      setError('Produkte konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const getById = useCallback((id) => products.find((p) => String(p.id) === String(id)), [products]);
  const byCategory = useCallback((cat) => products.filter((p) => p.category === cat), [products]);

  const value = { products, loading, error, refetch, getById, byCategory };
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
