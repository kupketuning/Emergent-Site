import React from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopBar />
        <Header />
        <Navigation />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;
