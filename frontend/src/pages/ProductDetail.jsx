import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Check, Truck, ShieldCheck, Heart, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories, formatPrice, isPurchasable } from '../mock';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getById } = useProducts();
  const product = getById(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selected, setSelected] = useState({});
  const [variantErr, setVariantErr] = useState('');

  if (!product) {
    return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500">Produkt nicht gefunden.</div>;
  }

  const category = categories.find((c) => c.id === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const variants = product.variants || [];

  const variantSummary = () =>
    variants.map((g) => `${g.name}: ${selected[g.name]}`).join(', ');

  const allSelected = () => variants.every((g) => selected[g.name]);

  const handleAdd = () => {
    if (!allSelected()) {
      setVariantErr('Bitte wählt zunächst alle Ausführungen aus.');
      return;
    }
    setVariantErr('');
    addItem(product, qty, variantSummary());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const askForPrice = () => {
    const q = new URLSearchParams({
      produkt: product.name,
      art: product.art_nr || '',
      variante: allSelected() ? variantSummary() : '',
    });
    navigate(`/kontakt?${q.toString()}`);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#e11d1d]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        {category && <><Link to={`/category/${category.id}`} className="hover:text-[#e11d1d]">{category.name}</Link><ChevronRight className="w-4 h-4" /></>}
        <span className="text-[#1a1a1a] font-semibold line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="border border-gray-200 rounded-lg p-8 flex items-center justify-center bg-white relative">
          {product.badge && <span className="absolute top-4 left-4 bg-[#e11d1d] text-white text-xs font-bold px-3 py-1 rounded">{product.badge}</span>}
          <img src={product.image} alt={product.name} className="max-h-[420px] object-contain" />
        </div>

        {/* Info */}
        <div>
          <h1 className="font-logo text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight mb-2">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-5">Art.-Nr.: {product.art_nr}</p>

          <div className="flex items-center gap-2 text-sm mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e11d1d] inline-block" />
            <span className="text-[#e11d1d] font-semibold">Sofort verfügbar</span>
            <span className="text-gray-500">| Lieferzeit: {product.delivery}</span>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400">{isPurchasable(product) ? 'Regulärer Preis:' : 'Preis:'}</p>
            <p className="text-4xl font-bold text-[#17191d]">{formatPrice(product.price)}</p>
            {isPurchasable(product) && <p className="text-xs text-gray-400 mt-1">inkl. MwSt. zzgl. Versandkosten</p>}
          </div>

          {variants.length > 0 && (
            <div className="mb-6 space-y-4">
              {variants.map((g) => (
                <div key={g.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{g.name} <span className="text-[#e11d1d]">*</span></label>
                  <select
                    value={selected[g.name] || ''}
                    onChange={(e) => { setSelected((s) => ({ ...s, [g.name]: e.target.value })); setVariantErr(''); }}
                    className="inp"
                  >
                    <option value="">Bitte wählen ...</option>
                    {g.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {variantErr && <p className="text-[#e11d1d] text-sm">{variantErr}</p>}
            </div>
          )}

          {isPurchasable(product) ? (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAdd} className={`flex-1 h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-colors ${added ? 'bg-[#b3161c]' : 'bg-[#e11d1d] hover:bg-[#b3161c]'}`}>
              {added ? (<><Check className="w-5 h-5" /> Im Warenkorb</>) : 'In den Warenkorb'}
            </button>
            <button onClick={() => alert('Wunschliste folgt in Kürze!')} className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#e11d1d] hover:border-[#e11d1d] transition-colors"><Heart className="w-5 h-5" /></button>
          </div>
          ) : (
          <div className="mb-6">
            <div className="bg-[#fdf2f2] border border-[#f3c6c6] rounded-md p-4 mb-3 text-sm text-[#7a1a1a]">Dieser Artikel wird individuell gefertigt bzw. konfiguriert. Fordert einfach ein unverbindliches Angebot an{variants.length > 0 ? ' – wählt vorher gern Eure Ausführung' : ''}.</div>
            <button onClick={askForPrice} className="w-full h-12 rounded-md font-semibold text-white bg-[#e11d1d] hover:bg-[#b3161c] transition-colors flex items-center justify-center gap-2"><Mail className="w-5 h-5" /> Preis anfragen</button>
          </div>
          )}

          {added && (
            <button onClick={() => navigate('/cart')} className="text-[#e11d1d] font-semibold text-sm underline mb-6">Zum Warenkorb →</button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Truck className="w-5 h-5 text-[#e11d1d]" /> Täglicher DHL-Versand</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-[#e11d1d]" /> Passgenauigkeit garantiert</div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-[#17191d] mb-2">Beschreibung</h3>
            <p className="text-[#3a4658] leading-relaxed">{product.description}</p>
            {product.fahrzeug && <p className="text-sm text-gray-500 mt-3">Passend für: <span className="font-semibold text-[#17191d]">{product.fahrzeug}</span></p>}
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
