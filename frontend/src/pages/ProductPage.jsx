import React, { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Check, Truck, ShieldCheck, Mail, BadgeCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { formatPrice, isPurchasable } from '../mock';
import { VEHICLES, TYPES, ASSEMBLIES } from '../lib/catalog';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const ytEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const ProductPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const decoded = decodeURIComponent(sku || '');
  const product = useMemo(() => products.find((p) => (p.sku || p.art_nr) === decoded), [products, decoded]);

  if (loading && !product) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-400" data-testid="product-loading">Produkt wird geladen …</div>;
  if (!product) return <div className="max-w-[1300px] mx-auto px-4 py-20 text-center text-gray-500" data-testid="product-not-found">Produkt nicht gefunden.</div>;

  const v = VEHICLES.find((x) => x.code === product.vehicle_code);
  const t = TYPES.find((x) => x.code === product.type_code);
  const a = ASSEMBLIES.find((x) => x.code === product.assembly_code);
  const images = product.images && product.images.length ? product.images : [product.image];
  const inStock = (product.stock_quantity ?? 0) > 0;
  const embed = ytEmbed(product.youtube_url);
  const related = products.filter((p) => p.assembly_code === product.assembly_code && p.id !== product.id).slice(0, 4);

  const handleAdd = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const askForPrice = () => navigate(`/kontakt?produkt=${encodeURIComponent(product.name)}&art=${encodeURIComponent(product.sku || '')}`);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="product-page">
      <Seo title={product.name} description={(product.description || '').slice(0, 155) || `${product.name} – Art.-Nr. ${product.sku}. Jetzt bei Kupke Tuning.`} path={`/produkt/${encodeURIComponent(product.sku || product.art_nr)}`} image={product.image} type="product" />
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        {v && <><ChevronRight className="w-4 h-4" /><Link to={`/katalog/${v.slug}`} className="hover:text-[#E63946]">{v.name}</Link></>}
        {v && t && <><ChevronRight className="w-4 h-4" /><Link to={`/katalog/${v.slug}/${t.slug}`} className="hover:text-[#E63946]">{t.name}</Link></>}
        {v && t && a && <><ChevronRight className="w-4 h-4" /><Link to={`/katalog/${v.slug}/${t.slug}/${a.slug}`} className="hover:text-[#E63946]">{a.name}</Link></>}
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="border border-gray-200 rounded-lg p-8 flex items-center justify-center bg-white relative">
            {product.dekra_certified && <span className="absolute top-4 left-4 bg-[#148F81] text-white text-xs font-bold px-3 py-1 rounded uppercase">DEKRA-geprüft</span>}
            <img src={images[activeImg]} alt={product.name} className="max-h-[420px] object-contain" data-testid="product-main-image" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 border rounded-md p-1 bg-white ${i === activeImg ? 'border-[#E63946]' : 'border-gray-200 hover:border-gray-300'}`} data-testid={`product-thumb-${i}`}>
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-logo text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight mb-2">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-4">Art.-Nr.: {product.sku}</p>

          <div className="flex items-center gap-2 text-sm mb-5" data-testid="product-stock">
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${inStock ? 'bg-[#008d36]' : 'bg-[#f59e0b]'}`} />
            <span className={`font-semibold ${inStock ? 'text-[#008d36]' : 'text-[#d97706]'}`}>{inStock ? 'Auf Lager' : 'Auf Anfrage'}</span>
          </div>

          <div className="mb-6">
            <p className="text-4xl font-bold text-[#17191d]" data-testid="product-price">{formatPrice(product.price)}</p>
            {isPurchasable(product) && <p className="text-xs text-gray-400 mt-1">inkl. 19% MwSt., zzgl. Versandkosten</p>}
          </div>

          {isPurchasable(product) ? (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-semibold" data-testid="product-qty">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAdd} data-testid="product-add-to-cart" className={`flex-1 h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-colors ${added ? 'bg-[#C92F3C]' : 'bg-[#E63946] hover:bg-[#C92F3C]'}`}>
                {added ? (<><Check className="w-5 h-5" /> Im Warenkorb</>) : 'In den Warenkorb'}
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-[#fdf2f2] border border-[#f3c6c6] rounded-md p-4 mb-3 text-sm text-[#7a1a1a]">Für diesen Artikel ist kein Festpreis hinterlegt. Fordert einfach ein unverbindliches Angebot an.</div>
              <button onClick={askForPrice} data-testid="product-inquire" className="w-full h-12 rounded-md font-semibold text-white bg-[#E63946] hover:bg-[#C92F3C] transition-colors flex items-center justify-center gap-2"><Mail className="w-5 h-5" /> Preis anfragen</button>
            </div>
          )}

          {added && <button onClick={() => navigate('/warenkorb')} className="text-[#E63946] font-semibold text-sm underline mb-6">Zum Warenkorb →</button>}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Truck className="w-5 h-5 text-[#E63946]" /> Täglicher Versand</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-[#E63946]" /> Passgenauigkeit garantiert</div>
            {product.dekra_certified && <div className="flex items-center gap-2 text-sm text-gray-600"><BadgeCheck className="w-5 h-5 text-[#148F81]" /> DEKRA-geprüft</div>}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-[#17191d] mb-2">Beschreibung</h3>
            <p className="text-[#3a4658] leading-relaxed whitespace-pre-line">{product.description}</p>
            {product.fahrzeug && <p className="text-sm text-gray-500 mt-3">Passend für: <span className="font-semibold text-[#17191d]">{product.fahrzeug}</span></p>}
          </div>
        </div>
      </div>

      {embed && (
        <section className="mt-12">
          <h2 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-4">Video</h2>
          <div className="relative w-full max-w-3xl" style={{ aspectRatio: '16/9' }}>
            <iframe title="Produktvideo" src={embed} className="absolute inset-0 w-full h-full rounded-lg border border-gray-200" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen data-testid="product-youtube" />
          </div>
        </section>
      )}

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

export default ProductPage;
