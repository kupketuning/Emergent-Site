import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Youtube as Yt } from 'lucide-react';

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[#008d36] font-bold text-lg mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l}>
          <a href="#" className="text-[#3a4658] text-[15px] hover:text-[#008d36] transition-colors">{l}</a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-4">
      <div className="max-w-[1300px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Service-Hotline */}
          <div>
            <h4 className="text-[#008d36] font-bold text-lg mb-4">Service-Hotline</h4>
            <p className="text-[#3a4658] text-sm mb-3">Unterstützung und Beratung unter:</p>
            <a href="tel:037521492520" className="block text-[#1a1a1a] font-bold text-xl mb-2 hover:text-[#008d36] transition-colors">(0375) 21492520</a>
            <p className="text-[#3a4658] text-sm mb-4">Mo-Fr, 8:00 - 12:00 Uhr und 12:30 - 16:00 Uhr</p>
            <h5 className="text-[#008d36] font-bold mb-1">Abholshop</h5>
            <p className="text-[#3a4658] text-sm mb-4">Di - Fr 13:00 - 15:00 Uhr</p>
            <button className="bg-[#2b3f5c] hover:bg-[#1f2f45] text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors">
              Vertrag widerrufen
            </button>
          </div>

          <FooterCol title="Über uns" links={['Datenschutz', 'Kontakt', 'Impressum', 'AGB', 'Cookies konfigurieren']} />
          <FooterCol title="Informationen" links={['Versandkosten', 'Zahlungsarten', 'Widerrufsrecht', 'Hinweise zum Altteilpfand', 'Recycling', 'Barrierefreiheit']} />

          {/* TrabiTipp */}
          <div>
            <div className="font-logo text-[#1a1a1a] text-2xl font-bold mb-1">TrabiTipp</div>
            <p className="text-[#e11d1d] font-bold text-sm flex items-center gap-1 mb-1">Dein YouTube Kanal! <Yt className="w-4 h-4" /></p>
            <p className="text-[#3a4658] text-xs mb-4">Powered by Zündgebär!</p>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#f4f6f9] border border-gray-200 text-[#008d36] font-bold text-center text-sm p-4">
              4,83 / 5⭐<br/>Käuferschutz
            </div>
          </div>
        </div>

        {/* Payment + socials */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {['Vorkasse', 'PayPal', 'Rechnung', 'VISA', 'Apple Pay', 'Google Pay', 'SEPA', 'DHL'].map((p) => (
              <span key={p} className="px-3 py-2 border border-gray-200 rounded bg-white text-xs font-semibold text-gray-600 shadow-sm">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[#4a5568]">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#008d36] transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#008d36] transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#008d36] transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Trabantwelt-Klon – Demo-Shop. Alle Daten sind Beispieldaten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
