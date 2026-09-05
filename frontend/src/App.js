import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import ProductPage from './pages/ProductPage';
import CatalogVehicle from './pages/CatalogVehicle';
import CatalogType from './pages/CatalogType';
import CatalogAssembly from './pages/CatalogAssembly';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Search from './pages/Search';
import Kontakt from './pages/Kontakt';
import Team from './pages/Team';
import SpecialCategory from './pages/SpecialCategory';
import StaticPage from './pages/StaticPage';
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
        <Route path="/katalog/:vehicle" element={<CatalogVehicle />} />
        <Route path="/katalog/:vehicle/:type" element={<CatalogType />} />
        <Route path="/katalog/:vehicle/:type/:assembly" element={<CatalogAssembly />} />
        <Route path="/produkt/:sku" element={<ProductPage />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/warenkorb" element={<Cart />} />
        <Route path="/kasse" element={<Checkout />} />
        <Route path="/bestellung-bestaetigt" element={<Success />} />
        <Route path="/search" element={<Search />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/team" element={<Team />} />
        <Route
          path="/normteile"
          element={<SpecialCategory category="NORMTEIL" title="Normteile" description="Schrauben, Muttern, Splinte & Co. – ohne Fahrzeugzuordnung, direkt aus unserem Lager." path="/normteile" />}
        />
        <Route
          path="/abverkauf"
          element={<SpecialCategory category="ABVERKAUF" title="Abverkauf & Einzelstücke" description="DDR-Teile, Deko-Artikel und Sonderposten zum Stöbern – nur solange der Vorrat reicht." path="/abverkauf" />}
        />
        <Route path="/impressum" element={<StaticPage slug="impressum" />} />
        <Route path="/agb" element={<StaticPage slug="agb" />} />
        <Route path="/widerruf" element={<StaticPage slug="widerruf" />} />
        <Route path="/datenschutz" element={<StaticPage slug="datenschutz" />} />
        <Route path="/batterieverordnung" element={<StaticPage slug="batterieverordnung" />} />
        <Route path="/verpackungsverordnung" element={<StaticPage slug="verpackungsverordnung" />} />
        <Route path="/ueber-uns" element={<StaticPage slug="ueber-uns" />} />
        <Route path="/dekra" element={<StaticPage slug="dekra" />} />
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
          <CookieConsentProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/*" element={<ShopRoutes />} />
              </Routes>
            </BrowserRouter>
          </CookieConsentProvider>
        </CartProvider>
      </ProductsProvider>
    </div>
  );
}

export default App;
