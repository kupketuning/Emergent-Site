import React from 'react';
import { Facebook, Instagram, Youtube, MapPin } from 'lucide-react';
import { brands } from '../mock';

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[#e11d1d] font-bold text-lg mb-4 uppercase tracking-wide">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l}>
          <a href="#" className="text-gray-300 text-[15px] hover:text-white transition-colors">{l}</a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
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
          {/* Contact */}
          <div>
            <h4 className="text-[#e11d1d] font-bold text-lg mb-4 uppercase tracking-wide">Kupke-Tuning</h4>
            <p className="text-gray-300 text-sm mb-4">Ihr Partner für den Trabant im Rennsport und auf der Straße.</p>
            <div className="flex items-start gap-2 text-gray-300 text-sm mb-3">
              <MapPin className="w-5 h-5 text-[#e11d1d] shrink-0" />
              <span>Kupke-Tuning<br/>08485 Lengenfeld<br/>Sachsen</span>
            </div>
            <p className="text-gray-400 text-xs mb-4">Beratung & Anfragen gerne per Kontaktformular.</p>
            <button className="bg-[#e11d1d] hover:bg-[#b3161c] text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors uppercase tracking-wide">
              Kontakt aufnehmen
            </button>
          </div>

          <FooterCol title="Über uns" links={['Datenschutz', 'Kontakt', 'Impressum', 'AGB', 'Motorsport-Historie']} />
          <FooterCol title="Informationen" links={['Versandkosten', 'Zahlungsarten', 'Widerrufsrecht', 'Komplettaufbau', 'Sonderanfertigungen']} />

          {/* Motorsport claim */}
          <div>
            <div className="font-logo text-2xl font-bold mb-2 uppercase">Motorsport<span className="text-[#e11d1d]">.</span></div>
            <p className="text-gray-300 text-sm mb-4">Unsere Teile sind im aktiven Rennsport – Ralley, Berg & Slalom – erprobt. Wir unterstützen junge Teams in ihrer Entwicklung.</p>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <span className="font-logo text-3xl font-bold text-[#e11d1d]">RS</span>
              <span className="text-sm text-gray-300">Rennsport-erprobte<br/>Eigenentwicklungen</span>
            </div>
          </div>
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
          © {new Date().getFullYear()} Kupke-Tuning – Demo-Neugestaltung. Alle Daten sind Beispieldaten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
