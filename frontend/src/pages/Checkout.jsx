import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Truck, Store, Loader2, AlertTriangle, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatEuro } from '../mock';
import api from '../api';

const SHIPPING = { HERMES: 5.95, ABHOLUNG: 0 };

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label} {required && <span className="text-[#E63946]">*</span>}</label>
    {children}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const [shipping, setShipping] = useState('HERMES');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    email: '', first_name: '', last_name: '', company: '',
    street: '', zip: '', city: '', country: 'DE', phone: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const hasUnpriced = useMemo(() => items.some((i) => !i.price || i.price <= 0), [items]);
  const shippingCost = SHIPPING[shipping];
  const grandTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-[1300px] mx-auto px-4 py-20 text-center" data-testid="checkout-empty">
        <p className="text-gray-500 mb-6">Euer Warenkorb ist leer.</p>
        <Link to="/" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-6 py-3 rounded-md">Weiter einkaufen</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (hasUnpriced) { setErr('Bitte entfernt Artikel ohne Preis aus dem Warenkorb.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty, variant: i.variant || '' })),
        shipping_method: shipping,
        customer: form,
        origin_url: window.location.origin,
      };
      const res = await api.checkout(payload);
      window.location.href = res.url;
    } catch (e2) {
      setErr(e2?.response?.data?.detail || 'Die Zahlung konnte nicht gestartet werden. Bitte versucht es erneut.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8" data-testid="checkout-page">
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/warenkorb" className="hover:text-[#E63946]">Warenkorb</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">Kasse</span>
      </div>

      <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-8 uppercase">Kasse</h1>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left: form */}
        <div className="space-y-8">
          {/* Address */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Rechnungs- & Lieferadresse</h2>
            <div className="space-y-4">
              <Field label="E-Mail" required><input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="inp" data-testid="checkout-email" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Vorname" required><input required value={form.first_name} onChange={(e) => set('first_name', e.target.value)} className="inp" data-testid="checkout-first-name" /></Field>
                <Field label="Nachname" required><input required value={form.last_name} onChange={(e) => set('last_name', e.target.value)} className="inp" data-testid="checkout-last-name" /></Field>
              </div>
              <Field label="Firma (optional)"><input value={form.company} onChange={(e) => set('company', e.target.value)} className="inp" data-testid="checkout-company" /></Field>
              <Field label="Straße & Hausnummer" required><input required value={form.street} onChange={(e) => set('street', e.target.value)} className="inp" data-testid="checkout-street" /></Field>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <Field label="PLZ" required><input required value={form.zip} onChange={(e) => set('zip', e.target.value)} className="inp" data-testid="checkout-zip" /></Field>
                <Field label="Ort" required><input required value={form.city} onChange={(e) => set('city', e.target.value)} className="inp" data-testid="checkout-city" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Land"><input value={form.country} onChange={(e) => set('country', e.target.value)} className="inp" data-testid="checkout-country" /></Field>
                <Field label="Telefon (optional)"><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="inp" data-testid="checkout-phone" /></Field>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Versandart</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-colors ${shipping === 'HERMES' ? 'border-[#E63946] bg-[#fdf2f2]' : 'border-gray-200 hover:border-gray-300'}`} data-testid="checkout-shipping-hermes">
                <input type="radio" name="shipping" checked={shipping === 'HERMES'} onChange={() => setShipping('HERMES')} className="accent-[#E63946]" />
                <Truck className="w-5 h-5 text-[#E63946]" />
                <span className="flex-1 font-semibold text-[#1a1a1a]">Hermes Versand</span>
                <span className="font-bold text-[#1a1a1a]">{formatEuro(5.95)}</span>
              </label>
              <label className={`flex items-center gap-3 border rounded-md p-4 cursor-pointer transition-colors ${shipping === 'ABHOLUNG' ? 'border-[#E63946] bg-[#fdf2f2]' : 'border-gray-200 hover:border-gray-300'}`} data-testid="checkout-shipping-abholung">
                <input type="radio" name="shipping" checked={shipping === 'ABHOLUNG'} onChange={() => setShipping('ABHOLUNG')} className="accent-[#E63946]" />
                <Store className="w-5 h-5 text-[#E63946]" />
                <span className="flex-1 font-semibold text-[#1a1a1a]">Selbstabholung in Lengenfeld</span>
                <span className="font-bold text-[#008d36]">Kostenlos</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="border border-gray-200 rounded-lg p-6 h-fit lg:sticky lg:top-40">
          <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Bestellübersicht</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {items.map((i) => (
              <div key={i.key} className="flex gap-3 text-sm">
                <img src={i.image} alt="" className="w-12 h-12 object-contain border border-gray-100 rounded p-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a1a1a] line-clamp-2">{i.name}</p>
                  <p className="text-gray-500">{i.qty} × {formatEuro(i.price)}</p>
                </div>
                <span className="font-semibold whitespace-nowrap">{formatEuro(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
            <div className="flex justify-between"><span className="text-gray-600">Zwischensumme</span><span className="font-semibold" data-testid="checkout-subtotal">{formatEuro(total)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Versand</span><span className="font-semibold" data-testid="checkout-shipping-cost">{shippingCost === 0 ? 'Kostenlos' : formatEuro(shippingCost)}</span></div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-[#1a1a1a]"><span>Gesamt</span><span data-testid="checkout-grand-total">{formatEuro(grandTotal)}</span></div>
            <p className="text-xs text-gray-400">inkl. MwSt.</p>
          </div>

          {hasUnpriced && (
            <div className="mt-4 flex items-start gap-2 bg-[#fdf2f2] border border-[#f3c6c6] rounded-md p-3 text-sm text-[#7a1a1a]">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Bitte entfernt Artikel ohne Preis aus dem Warenkorb.</span>
            </div>
          )}
          {err && <p className="text-[#E63946] text-sm mt-3" data-testid="checkout-error">{err}</p>}

          <button type="submit" disabled={submitting || hasUnpriced} className="w-full mt-5 h-12 bg-[#E63946] hover:bg-[#C92F3C] disabled:opacity-50 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2" data-testid="checkout-pay-btn">
            {submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Weiterleitung ...</>) : (<><Lock className="w-4 h-4" /> Jetzt bezahlen</>)}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Sichere Zahlung über Stripe</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
