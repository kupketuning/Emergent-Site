import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight, Cog, Disc, Waypoints, Wind, Zap, Car } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { vehicleBySlug, typeBySlug, ASSEMBLIES, MODELS } from '../lib/catalog';
import { CatalogTile } from '../components/CatalogTile';
import Seo from '../components/Seo';

const ICON = { MOTOR: Cog, BREMSE: Disc, FAHRWERK: Waypoints, ABGAS: Wind, ELEKTRIK: Zap, KAROSSERIE: Car };

const CatalogType = () => {
  const { vehicle, type } = useParams();
  const [searchParams] = useSearchParams();
  const modellSlug = searchParams.get('modell') || '';
  const { products, loading } = useProducts();
  const v = vehicleBySlug(vehicle);
  const t = typeBySlug(type);
  const selectedModel = v ? (MODELS[v.code] || []).find((m) => m.slug === modellSlug) : null;
  const modelQuery = modellSlug ? `?modell=${modellSlug}` : '';

  const matches = (p) => v && t && p.vehicle_code === v.code && p.type_code === t.code && (!selectedModel || !p.vehicle_model || p.vehicle_model === selectedModel.code);

  const available = useMemo(() => {
    if (!v || !t) return [];
    return ASSEMBLIES.filter((a) => products.some((p) => matches(p) && p.assembly_code === a.code));
  }, [v, t, products, selectedModel]);

  if (!v || !t) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Seite nicht gefunden.</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="catalog-type-page">
      <Seo title={`${v.name} — ${t.name}teile`} description={`${t.name}teile für ${v.name} bei Kupke Tuning. Baugruppen: Motor, Bremse, Fahrwerk, Abgas, Elektrik, Karosserie.`} path={`/katalog/${v.slug}/${t.slug}`} />
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/katalog/${v.slug}${modelQuery}`} className="hover:text-[#E63946]">{v.name}{selectedModel ? ` ${selectedModel.name}` : ''}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{t.name}</span>
      </div>

      <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{v.name}{selectedModel ? ` ${selectedModel.name}` : ''} — {t.name}teile</h1>
      <p className="text-gray-500 mb-10">Wähle eine Baugruppe.</p>

      {loading && available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Lädt …</p>
      ) : available.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Keine Baugruppen mit Artikeln vorhanden.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {available.map((a) => {
            const count = products.filter((p) => matches(p) && p.assembly_code === a.code).length;
            return (
              <CatalogTile
                key={a.slug}
                to={`/katalog/${v.slug}/${t.slug}/${a.slug}${modelQuery}`}
                icon={ICON[a.code] || Cog}
                title={a.name}
                subtitle={`${count} Artikel`}
                testId={`assembly-tile-${a.slug}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogType;
