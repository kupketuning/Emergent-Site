import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, isPurchasable } from '../mock';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-white p-6 flex items-center justify-center overflow-hidden">
          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#e11d1d] text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">{product.badge}</span>
        )}
        <button aria-label="Merken" onClick={(e) => { e.preventDefault(); alert('Wunschliste folgt in Kürze!'); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#e11d1d] hover:border-[#e11d1d] transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {product.brand && <p className="text-[11px] font-bold text-[#e11d1d] uppercase tracking-wide mb-1">{product.brand}</p>}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[15px] font-bold text-[#17191d] leading-snug hover:text-[#e11d1d] transition-colors line-clamp-2 min-h-[42px]">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1">Art.-Nr.: {product.art_nr}</p>
        <p className="text-[13px] text-gray-600 mt-2 line-clamp-3 flex-1">{product.description}</p>

        <div className="flex items-center gap-1.5 mt-3 text-[13px]">
          <span className="w-2 h-2 rounded-full bg-[#e11d1d] inline-block" />
          <span className="text-gray-600">Lieferzeit: {product.delivery}</span>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400">Preis:</p>
          <p className="text-2xl font-bold text-[#17191d] leading-tight">{formatPrice(product.price)}</p>
        </div>

        {isPurchasable(product) ? (
          <button
            onClick={handleAdd}
            className={`mt-3 w-full h-11 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 ${added ? 'bg-[#b3161c]' : 'bg-[#e11d1d] hover:bg-[#b3161c]'}`}
          >
            {added ? (<><Check className="w-5 h-5" /> Hinzugefügt</>) : 'In den Warenkorb'}
          </button>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); alert('Bitte kontaktiert uns für ein Angebot zu diesem Artikel.'); }}
            className="mt-3 w-full h-11 rounded-md font-semibold text-[#e11d1d] border border-[#e11d1d] hover:bg-[#e11d1d] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" /> Preis anfragen
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
