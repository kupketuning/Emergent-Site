import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Cog, Disc, Waypoints, Wind, Zap, Car } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { vehicleBySlug, typeBySlug, ASSEMBLIES } from '../lib/catalog';
import Seo from '../components/Seo';

const ICON = { MOTOR: Cog, BREMSE: Disc, FAHRWERK: Waypoints, ABGAS: Wind, ELEKTRIK: Zap, KAROSSERIE: Car };

const CatalogType = () => {
  const { vehicle, type } = useParams();
  const { products, loading } = useProducts();
  const v = vehicleBySlug(vehicle);
  const t = typeBySlug(type);

  const available = useMemo(() => {
    if (!v || !t) return [];
    return ASSEMBLIES.filter((a) => products.some((p) => p.vehicle_code === v.code && p.type_code === t.code && p.assembly_code === a.code));
  }, [v, t, products]);

  if (!v || !t) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Seite nicht gefunden.</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="catalog-type-page">
      <Seo title={`${v.name} — ${t.name}teile`} description={`${t.name}teile für ${v.name} bei Kupke Tuning. Baugruppen: Motor, Bremse, Fahrwerk, Abgas, Elektrik, Karosserie.`} path={`/katalog/${v.slug}/${t.slug}`} />
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/katalog/${v.slug}`} className="hover:text-[#E63946]">{v.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{t.name}</span>
      </div>

      <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{v.name} — {t.name}teile</h1>
      <p className="text-gray-500 mb-10">Wähle eine Baugruppe.</p>

      {loading && available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Lädt …</p>
      ) : available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Keine Baugruppen mit Artikeln vorhanden.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {available.map((a) => {
            const Icon = ICON[a.code] || Cog;
            const count = products.filter((p) => p.vehicle_code === v.code && p.type_code === t.code && p.assembly_code === a.code).length;
            return (
              <Link key={a.slug} to={`/katalog/${v.slug}/${t.slug}/${a.slug}`} data-testid={`assembly-tile-${a.slug}`}
                className="group border border-gray-200 rounded-xl p-6 text-center hover:border-[#E63946] hover:shadow-lg transition-all flex flex-col items-center">
                <span className="w-14 h-14 rounded-full bg-[#17191d] flex items-center justify-center mb-3 group-hover:bg-[#E63946] transition-colors">
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                </span>
                <span className="font-logo text-lg font-bold text-[#17191d] uppercase group-hover:text-[#E63946] transition-colors">{a.name}</span>
                <span className="text-xs text-gray-500 mt-1">{count} Artikel</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogType;
