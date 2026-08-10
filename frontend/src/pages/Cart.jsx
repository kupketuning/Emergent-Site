import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatEuro } from '../mock';

const Cart = () => {
  const { items, updateQty, removeItem, total, clear } = useCart();
  const shipping = total >= 200 || total === 0 ? 0 : 5.9;

  if (items.length === 0) {
    return (
      <div className="max-w-[1300px] mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-3">Euer Warenkorb ist leer</h1>
        <p className="text-gray-500 mb-6">Stöbert in unserem Sortiment und findet die passenden Teile für Euer Projekt.</p>
        <Link to="/" className="inline-block bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold px-6 py-3 rounded-md transition-colors">Weiter einkaufen</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#e11d1d]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">Warenkorb</span>
      </div>

      <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-8">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 border border-gray-200 rounded-lg p-4 items-center">
              <Link to={`/product/${item.id}`} className="w-24 h-24 shrink-0 border border-gray-100 rounded p-2 flex items-center justify-center bg-white">
                <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-bold text-[#1a1a1a] hover:text-[#e11d1d] transition-colors line-clamp-2">{item.name}</Link>
                {item.variant && <p className="text-xs text-gray-600 mt-1">{item.variant}</p>}
                <p className="text-[#e11d1d] font-semibold mt-1 sm:hidden">{formatEuro(item.price)}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-semibold text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="hidden sm:block w-28 text-right font-bold text-[#1a1a1a]">{formatEuro(item.price * item.qty)}</div>
              <button onClick={() => removeItem(item.key)} aria-label="Entfernen" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#e11d1d] transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-gray-500 hover:text-[#e11d1d] transition-colors">Warenkorb leeren</button>
        </div>

        {/* Summary */}
        <div className="border border-gray-200 rounded-lg p-6 h-fit lg:sticky lg:top-40">
          <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Zusammenfassung</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Zwischensumme</span><span className="font-semibold">{formatEuro(total)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Versand</span><span className="font-semibold">{shipping === 0 ? 'Kostenlos' : formatEuro(shipping)}</span></div>
            {shipping > 0 && <p className="text-xs text-[#e11d1d]">Noch {formatEuro(200 - total)} bis zum kostenlosen Versand!</p>}
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-[#1a1a1a]"><span>Gesamt</span><span>{formatEuro(total + shipping)}</span></div>
            <p className="text-xs text-gray-400">inkl. MwSt.</p>
          </div>
          <button onClick={() => alert('Checkout ist im Demo-Shop noch nicht aktiv.')} className="w-full mt-5 h-12 bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold rounded-md transition-colors">Zur Kasse</button>
          <Link to="/" className="block text-center mt-3 text-sm text-gray-500 hover:text-[#e11d1d]">Weiter einkaufen</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
