import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../api';
import Seo from '../components/Seo';

const Kontakt = () => {
  const [params] = useSearchParams();
  const prefillProduct = params.get('produkt') || '';
  const prefillArt = params.get('art') || '';
  const prefillVariant = params.get('variante') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: prefillProduct ? `Anfrage: ${prefillProduct}` : '',
    product_name: prefillProduct,
    product_art_nr: prefillArt,
    variant: prefillVariant,
    message: prefillProduct
      ? `Guten Tag,\n\nich interessiere mich für "${prefillProduct}"${prefillArt ? ` (Art.-Nr. ${prefillArt})` : ''}${prefillVariant ? `\nAusführung: ${prefillVariant}` : ''} und bitte um ein Angebot.\n\nMit freundlichen Grüßen`
      : '',
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setErr('');
    try {
      const { subject, ...rest } = form;
      const payload = { ...rest, message: subject ? `Betreff: ${subject}\n\n${form.message}` : form.message };
      await api.createInquiry(payload);
      setSent(true);
    } catch {
      setErr('Die Anfrage konnte nicht gesendet werden. Bitte versucht es später erneut.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <Seo title="Kontakt & Anfrage" description="Kontaktformular, Kontaktdaten und Lageradresse von Kupke Tuning in Lengenfeld. Fordern Sie ein persönliches Angebot an." path="/kontakt" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#17191d] font-semibold">Kontakt & Anfrage</span>
      </div>

      <h1 className="font-logo text-3xl font-bold text-[#17191d] mb-2 uppercase">Kontakt & Anfrage</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">Ob Sonderanfertigung, Komplettaufbau oder Preisanfrage – schreibt uns! Wir melden uns schnellstmöglich mit einem persönlichen Angebot.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Form */}
        <div>
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center" data-testid="kontakt-success">
              <CheckCircle2 className="w-14 h-14 text-[#008d36] mx-auto mb-4" />
              <h2 className="font-logo text-2xl font-bold text-[#17191d] mb-2 uppercase">Vielen Dank!</h2>
              <p className="text-gray-600 mb-6">Eure Anfrage ist bei uns eingegangen. Wir melden uns zeitnah bei Euch.</p>
              <Link to="/" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-6 py-3 rounded-md transition-colors">Weiter einkaufen</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              {(form.product_name || form.product_art_nr) && (
                <div className="bg-[#fdf2f2] border border-[#f3c6c6] rounded-md p-4">
                  <p className="text-xs uppercase tracking-wide text-[#C92F3C] font-bold mb-1">Ihre Anfrage betrifft</p>
                  <p className="font-semibold text-[#17191d]">{form.product_name}</p>
                  {form.product_art_nr && <p className="text-sm text-gray-500">Art.-Nr.: {form.product_art_nr}</p>}
                  {form.variant && <p className="text-sm text-gray-600 mt-1">Ausführung: {form.variant}</p>}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Name *</label>
                  <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="inp" data-testid="kontakt-name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Telefon</label>
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="inp" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">E-Mail *</label>
                <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="inp" data-testid="kontakt-email" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Betreff *</label>
                <input required value={form.subject} onChange={(e) => set('subject', e.target.value)} className="inp" data-testid="kontakt-subject" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Nachricht *</label>
                <textarea required rows={7} value={form.message} onChange={(e) => set('message', e.target.value)} className="inp" data-testid="kontakt-message" />
              </div>
              {err && <p className="text-[#E63946] text-sm">{err}</p>}
              <button type="submit" disabled={sending} data-testid="kontakt-submit" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-8 py-3 rounded-md transition-colors disabled:opacity-60">
                <Send className="w-5 h-5" /> {sending ? 'Wird gesendet ...' : 'Anfrage senden'}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <aside className="space-y-4">
          <div className="bg-[#17191d] text-white rounded-lg p-6">
            <h3 className="font-logo text-xl font-bold uppercase mb-4">Kupke-Tuning</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#E63946] shrink-0" /><span><strong>Lager & Abholung</strong><br/>[Straße & Hausnummer]<br/>08485 Lengenfeld, Sachsen</span></div>
              <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[#E63946] shrink-0" /><span>[Telefonnummer]<br/>Beratung nach Vereinbarung</span></div>
              <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-[#E63946] shrink-0" /><span>shop@kupketuning.de</span></div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-[#17191d] mb-2">Sonderanfertigungen</h3>
            <p className="text-sm text-gray-600">Vom einzelnen Tuningteil bis zum kompletten Rennfahrzeug nach ONS-Vorgaben – sprecht uns einfach an.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Kontakt;
