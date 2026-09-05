import React from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

// Generische Seite für fahrzeugunabhängige Sonderkategorien (Normteile, Abverkauf)
const SpecialCategory = ({ category, title, description, path }) => {
  const { products, loading } = useProducts();
  const list = products.filter((p) => p.special_category === category);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-10" data-testid={`special-category-${category.toLowerCase()}`}>
      <Seo title={title} description={description} path={path} />
      <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 uppercase">{title}</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">{description}</p>

      {loading && list.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Lädt …</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">Aktuell keine Artikel in dieser Kategorie hinterlegt.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default SpecialCategory;
