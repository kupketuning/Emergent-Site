import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../mock';
import { useProducts } from '../context/ProductsContext';

const Category = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const category = categories.find((c) => c.id === id);
  const [activeSub, setActiveSub] = useState('all');
  const [sort, setSort] = useState('name');

  const list = useMemo(() => {
    let l = id === 'neu'
      ? products.filter((p) => p.badge === 'Neu')
      : products.filter((p) => p.category === id);
    if (activeSub !== 'all') l = l.filter((p) => p.sub === activeSub);
    l = [...l];
    if (sort === 'price-asc') l.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') l.sort((a, b) => b.price - a.price);
    else l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [id, activeSub, sort, products]);

  if (!category) {
    return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Kategorie nicht gefunden.</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#e11d1d]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{category.name}</span>
      </div>

      <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-2">{category.name}</h1>
      <p className="text-gray-500 mb-8">{list.length} Artikel gefunden</p>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-[#1a1a1a] mb-3">Unterkategorien</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setActiveSub('all')} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeSub === 'all' ? 'bg-[#e11d1d] text-white' : 'text-gray-700 hover:bg-[#f0f5fa]'}`}>Alle anzeigen</button>
              </li>
              {category.sub.map((s) => (
                <li key={s}>
                  <button onClick={() => setActiveSub(s)} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeSub === s ? 'bg-[#e11d1d] text-white' : 'text-gray-700 hover:bg-[#f0f5fa]'}`}>{s}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex items-center justify-end mb-5">
            <label className="text-sm text-gray-600 mr-2">Sortieren:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 border border-gray-300 rounded-md px-3 text-sm outline-none focus:border-[#e11d1d]">
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="py-20 text-center text-gray-400">Keine Produkte in dieser Auswahl.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
