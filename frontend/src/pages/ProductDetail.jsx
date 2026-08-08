import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Check, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products, categories, formatPrice } from '../mock';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => String(p.id) === String(id));
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Produkt nicht gefunden.</div>;
  }

  const category = categories.find((c) => c.id === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#008d36]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        {category && <><Link to={`/category/${category.id}`} className="hover:text-[#008d36]">{category.name}</Link><ChevronRight className="w-4 h-4" /></>}
        <span className="text-[#1a1a1a] font-semibold line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="border border-gray-200 rounded-lg p-8 flex items-center justify-center bg-white relative">
          {product.badge && <span className="absolute top-4 left-4 bg-[#008d36] text-white text-xs font-bold px-3 py-1 rounded">{product.badge}</span>}
          <img src={product.image} alt={product.name} className="max-h-[420px] object-contain" />
        </div>

        {/* Info */}
        <div>
          <h1 className="font-logo text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight mb-2">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-5">Artikel-Nr.: {product.id}</p>

          <div className="flex items-center gap-2 text-sm mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008d36] inline-block" />
            <span className="text-[#008d36] font-semibold">Sofort verfügbar</span>
            <span className="text-gray-500">| Lieferzeit: {product.delivery}</span>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400">Regulärer Preis:</p>
            <p className="text-4xl font-bold text-[#1a1a1a]">{formatPrice(product.price)}</p>
            <p className="text-xs text-gray-400 mt-1">inkl. MwSt. zzgl. Versandkosten</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAdd} className={`flex-1 h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-colors ${added ? 'bg-[#00732c]' : 'bg-[#008d36] hover:bg-[#00732c]'}`}>
              {added ? (<><Check className="w-5 h-5" /> Im Warenkorb</>) : 'In den Warenkorb'}
            </button>
            <button onClick={() => alert('Wunschliste folgt in Kürze!')} className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#008d36] hover:border-[#008d36] transition-colors"><Heart className="w-5 h-5" /></button>
          </div>

          {added && (
            <button onClick={() => navigate('/cart')} className="text-[#008d36] font-semibold text-sm underline mb-6">Zum Warenkorb →</button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Truck className="w-5 h-5 text-[#008d36]" /> Täglicher DHL-Versand</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-[#008d36]" /> Passgenauigkeit garantiert</div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-[#1a1a1a] mb-2">Beschreibung</h3>
            <p className="text-[#3a4658] leading-relaxed">{product.desc}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
