import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Search from './pages/Search';
import Kontakt from './pages/Kontakt';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
  return null;
}

function ShopRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <div className="App">
      <ProductsProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/*" element={<ShopRoutes />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ProductsProvider>
    </div>
  );
}

export default App;
