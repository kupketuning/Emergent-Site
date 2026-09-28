import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Einheitliche schwarze Kachel für die Fahrzeugnavigation (Startseite, Fahrzeug, Modell, Kategorie)
export const CatalogTile = ({ to, icon: Icon, title, subtitle, big, testId }) => (
  <Link
    to={to}
    data-testid={testId}
    className={`group relative overflow-hidden rounded-xl border-2 border-[#23262b] bg-[#17191d] hover:border-[#E63946] transition-colors flex flex-col items-center justify-center text-center p-6 ${big ? 'md:col-span-2 md:row-span-2 min-h-[280px]' : 'min-h-[180px]'}`}
  >
    {Icon && (
      <span className={`rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#E63946]/20 group-hover:border-[#E63946]/50 transition-colors ${big ? 'w-20 h-20' : 'w-14 h-14'}`}>
        <Icon className={`text-[#E63946] transition-colors ${big ? 'w-10 h-10' : 'w-7 h-7'}`} strokeWidth={1.6} />
      </span>
    )}
    <span className={`font-logo font-bold text-white uppercase tracking-wide ${big ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{title}</span>
    {subtitle && <span className="text-sm text-gray-400 mt-1">{subtitle}</span>}
    <span className="mt-3 inline-flex items-center gap-1 text-[#2EC4B6] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      Ansehen <ChevronRight className="w-4 h-4" />
    </span>
  </Link>
);

export default CatalogTile;
