import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { vehicleBySlug, typeBySlug, assemblyBySlug } from '../lib/catalog';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import api from '../api';

const CatalogAssembly = () => {
  const { vehicle, type, assembly } = useParams();
  const { products, loading } = useProducts();
  const v = vehicleBySlug(vehicle);
  const t = typeBySlug(type);
  const a = assemblyBySlug(assembly);
  const [drawing, setDrawing] = useState(null);

  useEffect(() => {
    if (!v || !a) return;
    let active = true;
    api.getDrawings({ vehicle: v.code, assembly_group: a.code })
      .then((rows) => { if (active) setDrawing((rows || []).find((d) => d.image_url) || null); })
      .catch(() => {});
    return () => { active = false; };
  }, [v, a]);

  const list = useMemo(() => {
    if (!v || !t || !a) return [];
    const l = products.filter((p) => p.vehicle_code === v.code && p.type_code === t.code && p.assembly_code === a.code);
    return [...l].sort((x, y) => {
      if (!!y.is_set !== !!x.is_set) return (y.is_set ? 1 : 0) - (x.is_set ? 1 : 0);
      if ((x.sort_order || 100) !== (y.sort_order || 100)) return (x.sort_order || 100) - (y.sort_order || 100);
      return x.name.localeCompare(y.name);
    });
  }, [v, t, a, products]);

  if (!v || !t || !a) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Seite nicht gefunden.</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="catalog-assembly-page">
      <Seo title={`${v.name} / ${t.name} / ${a.name}`} description={`${a.name}-Teile (${t.name}) für ${v.name} bei Kupke Tuning – Komplettsets und Einzelteile, DEKRA-geprüft.`} path={`/katalog/${v.slug}/${t.slug}/${a.slug}`} />
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/katalog/${v.slug}`} className="hover:text-[#E63946]">{v.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/katalog/${v.slug}/${t.slug}`} className="hover:text-[#E63946]">{t.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{a.name}</span>
      </div>

      <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-2">{v.name} / {t.name} / {a.name}</h1>
      <p className="text-gray-500 mb-6">{list.length} Artikel gefunden</p>

      {drawing && (
        <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden bg-[#f4f5f7]" data-testid="explosion-drawing">
          {drawing.title && <div className="px-4 py-2 text-sm font-semibold text-[#17191d] bg-white border-b border-gray-200">Explosionszeichnung: {drawing.title}</div>}
          <img src={drawing.image_url} alt={drawing.title || 'Explosionszeichnung'} className="w-full max-h-[420px] object-contain p-4" />
        </div>
      )}

      {loading && list.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Lädt …</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Keine Produkte in dieser Auswahl.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default CatalogAssembly;
