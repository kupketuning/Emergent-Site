import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight, Wrench, ShieldCheck, Boxes, Tag } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { vehicleBySlug, TYPES, MODELS } from '../lib/catalog';
import { CatalogTile } from '../components/CatalogTile';
import Seo from '../components/Seo';

const TYPE_ICON = { ORIGINAL: Wrench, TUNING: ShieldCheck };
const SHOW_SPECIAL_BUTTONS = ['TRABANT', 'WARTBURG'];

const CatalogVehicle = () => {
  const { vehicle } = useParams();
  const [searchParams] = useSearchParams();
  const modellSlug = searchParams.get('modell') || '';
  const { products, loading } = useProducts();
  const v = vehicleBySlug(vehicle);
  const models = v ? (MODELS[v.code] || []) : [];
  const selectedModel = models.find((m) => m.slug === modellSlug);
  const needsModelStep = models.length > 0 && !selectedModel;

  const matches = (p) => v && p.vehicle_code === v.code && (!selectedModel || !p.vehicle_model || p.vehicle_model === selectedModel.code);

  const available = useMemo(() => {
    if (!v) return [];
    return TYPES.filter((t) => products.some((p) => matches(p) && p.type_code === t.code));
  }, [v, products, selectedModel]);

  if (!v) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Fahrzeug nicht gefunden.</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="catalog-vehicle-page">
      <Seo title={`${v.name} — Ersatzteile & Tuning`} description={`Ersatzteile und Tuningteile für ${v.name} bei Kupke Tuning. Original und Tuning – DEKRA-geprüft.`} path={`/katalog/${v.slug}`} />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        {selectedModel ? (
          <>
            <Link to={`/katalog/${v.slug}`} className="hover:text-[#E63946]">{v.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a1a1a] font-semibold">{selectedModel.name}</span>
          </>
        ) : (
          <span className="text-[#1a1a1a] font-semibold">{v.name}</span>
        )}
      </div>

      {needsModelStep ? (
        <>
          <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{v.name} — Typ wählen</h1>
          <p className="text-gray-500 mb-10">Für welchen {v.name}-Typ suchst Du Teile?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" data-testid="model-tiles">
            {models.map((m) => (
              <CatalogTile key={m.slug} to={`/katalog/${v.slug}?modell=${m.slug}`} title={`${v.name} ${m.name}`} testId={`model-tile-${m.slug}`} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{v.name}{selectedModel ? ` ${selectedModel.name}` : ''} — Ersatzteile & Tuning</h1>
          <p className="text-gray-500 mb-10">Wähle einen Bereich, um passende Teile für Deinen {v.name} zu finden.</p>

          {loading && available.length === 0 ? (
            <p className="text-gray-400 py-16 text-center">Lädt …</p>
          ) : available.length === 0 ? (
            <p className="text-gray-400 py-16 text-center">Für dieses Fahrzeug sind aktuell keine Teile hinterlegt.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {available.map((t) => {
                const count = products.filter((p) => matches(p) && p.type_code === t.code).length;
                return (
                  <CatalogTile
                    key={t.slug}
                    to={`/katalog/${v.slug}/${t.slug}${modellSlug ? `?modell=${modellSlug}` : ''}`}
                    icon={TYPE_ICON[t.code] || Wrench}
                    title={t.name}
                    subtitle={`${count} Artikel`}
                    testId={`type-tile-${t.slug}`}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {SHOW_SPECIAL_BUTTONS.includes(v.code) && (
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link to="/normteile" data-testid="link-normteile" className="group flex items-center gap-4 border border-gray-200 rounded-xl p-6 hover:border-[#2EC4B6] hover:shadow-lg transition-all">
            <span className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2EC4B6]/20 transition-colors">
              <Boxes className="w-6 h-6 text-[#2EC4B6]" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-logo font-bold text-lg text-[#17191d] uppercase group-hover:text-[#2EC4B6] transition-colors">Normteile</p>
              <p className="text-sm text-gray-500">Schrauben, Muttern & Splinte – ohne Fahrzeugzuordnung</p>
            </div>
          </Link>
          <Link to="/abverkauf" data-testid="link-abverkauf" className="group flex items-center gap-4 border border-gray-200 rounded-xl p-6 hover:border-[#E63946] hover:shadow-lg transition-all">
            <span className="w-12 h-12 rounded-full bg-[#E63946]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E63946]/20 transition-colors">
              <Tag className="w-6 h-6 text-[#E63946]" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-logo font-bold text-lg text-[#17191d] uppercase group-hover:text-[#E63946] transition-colors">Abverkauf &amp; Einzelstücke</p>
              <p className="text-sm text-gray-500">DDR-Teile, Deko und Sonderposten zum Stöbern</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CatalogVehicle;
