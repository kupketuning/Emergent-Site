import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, CreditCard } from 'lucide-react';
import api from '../../api';
import { formatEuro } from '../../mock';
import Seo from '../../components/Seo';

const PhoneOrderConfirm = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [pw, setPw] = useState({ password: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionId) { setErr('Kein gültiger Bestätigungslink.'); setLoading(false); return; }
    (async () => {
      try { setPreview(await api.getPhoneOrderPreview(sessionId)); }
      catch { setErr('Diese Bestellung konnte nicht gefunden werden. Der Link ist eventuell abgelaufen.'); }
      finally { setLoading(false); }
    })();
  }, [sessionId]);

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwErr('');
    if (pw.password !== pw.confirm) { setPwErr('Die Passwörter stimmen nicht überein.'); return; }
    if (pw.password.length < 8) { setPwErr('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    setSaving(true);
    try {
      await api.setInitialPassword(sessionId, pw.password);
      setPreview((p) => ({ ...p, needs_password: false }));
    } catch (error) {
      setPwErr(error?.response?.data?.detail || 'Das hat leider nicht geklappt.');
    } finally {
      setSaving(false);
    }
  };

  const pay = () => { window.location.href = preview.checkout_url; };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }
  if (err) {
    return <div className="max-w-[480px] mx-auto px-4 py-16 text-center"><p className="text-[#E63946]" data-testid="phone-order-error">{err}</p></div>;
  }
  if (preview.finalized) {
    return (
      <div className="max-w-[480px] mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#008d36] mx-auto mb-4" />
        <p className="text-gray-700 mb-4">Diese Bestellung ist bereits bezahlt.</p>
        <Link to="/konto" className="text-[#E63946] font-semibold hover:underline">Zu meinem Konto</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 py-10" data-testid="phone-order-confirm-page">
      <Seo title="Bestellung bestätigen" description="Bestellung bestätigen und bezahlen." path="/bestellung-bezahlen" />
      <h1 className="font-logo text-2xl font-bold text-[#17191d] mb-2 uppercase">Bestellung {preview.preview_number}</h1>
      <p className="text-gray-500 text-sm mb-6">Bitte prüfen Sie Ihre telefonisch besprochene Bestellung und schließen Sie die Zahlung ab.</p>

      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        {preview.items.map((it, i) => (
          <div key={i} className="flex justify-between py-1.5 text-sm border-b border-gray-100 last:border-0">
            <span>{it.quantity}× {it.name}</span>
            <span className="font-semibold">{formatEuro(it.unit_price_gross * it.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-sm text-gray-500"><span>Versand</span><span>{formatEuro(preview.shipping_cost_gross)}</span></div>
        <div className="flex justify-between pt-2 font-bold text-[#17191d] text-lg"><span>Gesamt</span><span>{formatEuro(preview.total_gross)}</span></div>
      </div>

      {preview.needs_password ? (
        <form onSubmit={submitPassword} className="space-y-4" data-testid="phone-order-password-form">
          <p className="text-sm text-gray-600">Für Ihr neues Konto bei Kupke Tuning vergeben Sie bitte zunächst ein Passwort:</p>
          <input required type="password" minLength={8} placeholder="Passwort" value={pw.password} onChange={(e) => setPw((f) => ({ ...f, password: e.target.value }))} className="inp" data-testid="phone-order-password" />
          <input required type="password" minLength={8} placeholder="Passwort bestätigen" value={pw.confirm} onChange={(e) => setPw((f) => ({ ...f, confirm: e.target.value }))} className="inp" data-testid="phone-order-password-confirm" />
          {pwErr && <p className="text-[#E63946] text-sm">{pwErr}</p>}
          <button type="submit" disabled={saving} className="w-full h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="phone-order-password-submit">
            {saving ? 'Wird gespeichert ...' : 'Passwort speichern & weiter'}
          </button>
        </form>
      ) : (
        <button onClick={pay} className="w-full flex items-center justify-center gap-2 h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md" data-testid="phone-order-pay-btn">
          <CreditCard className="w-5 h-5" /> Jetzt bezahlen
        </button>
      )}
    </div>
  );
};

export default PhoneOrderConfirm;
