import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { VEHICLES } from '../lib/catalog';

const Tile = ({ v, big }) => (
  <Link
    to={`/katalog/${v.slug}`}
    data-testid={`vehicle-tile-${v.slug}`}
    className={`group relative overflow-hidden rounded-xl border border-gray-200 ${big ? 'md:col-span-2 md:row-span-2 min-h-[280px]' : 'min-h-[180px]'}`}
  >
    <img src={v.image} alt={v.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
    <div className="relative h-full flex flex-col justify-end p-5">
      <span className={`font-logo font-bold text-white uppercase ${big ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{v.name}</span>
      <span className="mt-2 inline-flex items-center gap-1 text-[#E63946] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Katalog öffnen <ChevronRight className="w-4 h-4" />
      </span>
    </div>
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
