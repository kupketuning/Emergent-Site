import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Instagram, Youtube, MapPin } from 'lucide-react';
import { brands } from '../mock';

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[#E63946] font-bold text-lg mb-4 uppercase tracking-wide">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="text-gray-300 text-[15px] hover:text-white transition-colors" data-testid={`footer-link-${l.to.replace(/\//g, '')}`}>{l.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const rechtliches = [
    { to: '/impressum', label: 'Impressum' },
    { to: '/agb', label: 'AGB' },
    { to: '/widerruf', label: 'Widerrufsbelehrung' },
    { to: '/datenschutz', label: 'Datenschutzerklärung' },
    { to: '/batterieverordnung', label: 'Batterieverordnung' },
    { to: '/verpackungsverordnung', label: 'Verpackungsgesetz' },
  ];
  const unternehmen = [
    { to: '/ueber-uns', label: 'Über uns' },
    { to: '/dekra', label: 'DEKRA-geprüfte Qualität' },
    { to: '/katalog/trabant', label: 'Trabant-Katalog' },
    { to: '/katalog/trabant/rennsport', label: 'Motorsport-Teile' },
  ];
  const kontaktLinks = [
    { to: '/kontakt', label: 'Kontaktformular' },
    { to: '/warenkorb', label: 'Warenkorb' },
  ];

  return (
    <footer className="bg-[#17191d] text-white mt-4">
      {/* Brand partners strip */}
      <div className="border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <p className="text-center text-gray-400 text-sm uppercase tracking-[0.2em] mb-5">Unsere Marken-Partner</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {brands.map((b) => (
              <span key={b} className="font-logo text-lg md:text-xl font-bold text-gray-400 hover:text-white transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand intro */}
          <div>
            <Logo variant="light" size={40} to={null} />
            <p className="text-gray-300 text-sm mb-4 mt-4">Ihr Partner für den Trabant im Rennsport und auf der Straße – seit 1995.</p>
            <div className="flex items-start gap-2 text-gray-300 text-sm mb-3">
              <MapPin className="w-5 h-5 text-[#E63946] shrink-0" />
              <span>Kupke Tuning<br/>[Straße & Hausnummer]<br/>08485 Lengenfeld, Sachsen</span>
            </div>
            <Link to="/kontakt" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors uppercase tracking-wide">
              Kontakt aufnehmen
            </Link>
          </div>

          <FooterCol title="Rechtliches" links={rechtliches} />
          <FooterCol title="Unternehmen" links={unternehmen} />
          <FooterCol title="Kontakt" links={kontaktLinks} />
        </div>

        {/* Payment + socials */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {['Vorkasse', 'PayPal', 'Rechnung', 'VISA', 'SEPA', 'DHL'].map((p) => (
              <span key={p} className="px-3 py-2 border border-white/15 rounded bg-white/5 text-xs font-semibold text-gray-300">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Kupke-Tuning. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
