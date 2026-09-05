import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Wrench, ShieldCheck, Trophy } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { vehicleBySlug, TYPES } from '../lib/catalog';
import Seo from '../components/Seo';

const TYPE_ICON = { ORIGINAL: Wrench, TUNING: ShieldCheck, RENNSPORT: Trophy };

const CatalogVehicle = () => {
  const { vehicle } = useParams();
  const { products, loading } = useProducts();
  const v = vehicleBySlug(vehicle);

  const available = useMemo(() => {
    if (!v) return [];
    return TYPES.filter((t) => products.some((p) => p.vehicle_code === v.code && p.type_code === t.code));
  }, [v, products]);

  if (!v) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Fahrzeug nicht gefunden.</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="catalog-vehicle-page">
      <Seo title={`${v.name} — Ersatzteile & Tuning`} description={`Ersatzteile und Tuningteile für ${v.name} bei Kupke Tuning. Original, Tuning und Rennsport – DEKRA-geprüft.`} path={`/katalog/${v.slug}`} />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{v.name}</span>
      </div>

      <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{v.name} — Ersatzteile & Tuning</h1>
      <p className="text-gray-500 mb-10">Wähle einen Bereich, um passende Teile für Deinen {v.name} zu finden.</p>

      {loading && available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Lädt …</p>
      ) : available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Für dieses Fahrzeug sind aktuell keine Teile hinterlegt.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {available.map((t) => {
            const Icon = TYPE_ICON[t.code] || Wrench;
            const count = products.filter((p) => p.vehicle_code === v.code && p.type_code === t.code).length;
            return (
              <Link key={t.slug} to={`/katalog/${v.slug}/${t.slug}`} data-testid={`type-tile-${t.slug}`}
                className="group border border-gray-200 rounded-xl p-8 hover:border-[#E63946] hover:shadow-lg transition-all flex flex-col items-start">
                <span className="w-14 h-14 rounded-full bg-[#E63946]/10 flex items-center justify-center mb-4 group-hover:bg-[#E63946]/20 transition-colors">
                  <Icon className="w-7 h-7 text-[#E63946]" strokeWidth={1.8} />
                </span>
                <span className="font-logo text-2xl font-bold text-[#17191d] uppercase group-hover:text-[#E63946] transition-colors">{t.name}</span>
                <span className="text-sm text-gray-500 mt-1">{count} Artikel</span>
                <span className="mt-4 inline-flex items-center gap-1 text-[#E63946] font-semibold text-sm">Ansehen <ChevronRight className="w-4 h-4" /></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogVehicle;
