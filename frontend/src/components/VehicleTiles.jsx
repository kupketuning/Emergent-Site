import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Car } from 'lucide-react';
import { VEHICLES } from '../lib/catalog';

const Tile = ({ v, big }) => (
  <Link
    to={`/katalog/${v.slug}`}
    data-testid={`vehicle-tile-${v.slug}`}
    className={`group relative overflow-hidden rounded-xl border-2 border-[#23262b] bg-[#17191d] hover:border-[#E63946] transition-colors flex flex-col items-center justify-center text-center p-6 ${big ? 'md:col-span-2 md:row-span-2 min-h-[280px]' : 'min-h-[180px]'}`}
  >
    <span className={`rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#E63946]/20 group-hover:border-[#E63946]/50 transition-colors ${big ? 'w-20 h-20' : 'w-14 h-14'}`}>
      <Car className={`text-[#E63946] group-hover:text-white transition-colors ${big ? 'w-10 h-10' : 'w-7 h-7'}`} strokeWidth={1.6} />
    </span>
    <span className={`font-logo font-bold text-white uppercase tracking-wide ${big ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{v.name}</span>
    <span className="mt-3 inline-flex items-center gap-1 text-[#2EC4B6] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
      Katalog öffnen <ChevronRight className="w-4 h-4" />
    </span>
  </Link>
);

const VehicleTiles = () => {
  const primary = VEHICLES.find((v) => v.primary);
  const rest = VEHICLES.filter((v) => !v.primary);
  return (
    <section className="max-w-[1300px] mx-auto px-4 py-12" data-testid="vehicle-tiles">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-logo text-2xl md:text-3xl font-bold text-[#17191d] uppercase">Wähle Dein Fahrzeug</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {primary && <Tile v={primary} big />}
        {rest.map((v) => <Tile key={v.slug} v={v} />)}
      </div>
    </section>
  );
};

export default VehicleTiles;
