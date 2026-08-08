import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../mock';

const Search = () => {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase().trim();

  const results = useMemo(() => {
    if (!q) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      String(p.id).includes(q) ||
      (p.sub || '').toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-2">Suchergebnisse</h1>
      <p className="text-gray-500 mb-8">{results.length} Treffer für „<span className="font-semibold text-[#1a1a1a]">{params.get('q')}</span>“</p>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <SearchX className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Keine Produkte gefunden. Versucht es mit einem anderen Suchbegriff.</p>
          <Link to="/" className="inline-block bg-[#e11d1d] hover:bg-[#00732c] text-white font-semibold px-6 py-3 rounded-md transition-colors">Zur Startseite</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Search;
