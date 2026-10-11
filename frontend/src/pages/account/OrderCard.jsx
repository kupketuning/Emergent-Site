import React, { useState } from 'react';
import { FileText, Download, MessageCircle, RotateCcw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api';
import { formatEuro } from '../../mock';

const STEPS = [
  { key: 'NEU', label: 'Neu' },
  { key: 'BEZAHLT', label: 'Bezahlt' },
  { key: 'IN_BEARBEITUNG', label: 'In Bearbeitung' },
  { key: 'VERSENDET', label: 'Versendet' },
  { key: 'ABGEHOLT', label: 'Zugestellt' },
];
const SPECIAL = { WIDERRUF_ANGEFORDERT: 'Widerruf angefordert', STORNIERT: 'Storniert' };
const CATEGORY_OPTIONS = [
  { value: 'RUECKFRAGE', label: 'Rückfrage' },
  { value: 'TERMINANFRAGE', label: 'Terminanfrage' },
  { value: 'REKLAMATION', label: 'Reklamation' },
  { value: 'SONSTIGES', label: 'Sonstiges' },
];
const CANCELLABLE = ['BEZAHLT', 'IN_BEARBEITUNG', 'VERSENDET'];

const Stepper = ({ status }) => {
  const idx = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center" data-testid="order-status-stepper">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i <= idx ? 'bg-[#E63946] text-white' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</div>
            <span className={`text-[10px] mt-1 text-center w-16 ${i <= idx ? 'text-[#17191d] font-semibold' : 'text-gray-400'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < idx ? 'bg-[#E63946]' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderCard = ({ order, onChanged }) => {
  const [expanded, setExpanded] = useState(false);
  const [requests, setRequests] = useState(null);
  const [form, setForm] = useState({ category: 'RUECKFRAGE', message: '' });
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [msg, setMsg] = useState('');

  const loadRequests = async () => {
    try { setRequests(await api.getOwnSupportRequests(order.id)); } catch { setRequests([]); }
  };
  const toggleExpand = () => {
    setExpanded((e) => !e);
    if (!expanded && requests === null) loadRequests();
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setSending(true); setMsg('');
    try {
      await api.createSupportRequest(order.id, form);
      setForm({ category: 'RUECKFRAGE', message: '' });
      setShowForm(false);
      await loadRequests();
      setMsg('Ihre Anfrage wurde übermittelt.');
    } catch {
      setMsg('Senden fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setSending(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm('Bestellung wirklich widerrufen?')) return;
    setCancelling(true);
    try { await onChanged(await api.requestCancellation(order.id)); }
    catch { setMsg('Widerruf fehlgeschlagen. Bitte kontaktieren Sie uns.'); }
    finally { setCancelling(false); }
  };

  const isSpecial = !!SPECIAL[order.status];

  return (
    <div className="border border-gray-200 rounded-lg p-4" data-testid={`my-order-${order.order_number}`}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <p className="font-mono text-sm font-semibold text-[#17191d]">{order.order_number}</p>
          <p className="text-xs text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('de-DE') : ''}</p>
        </div>
        <span className="font-bold text-[#17191d]">{formatEuro(order.total_gross)}</span>
        {order.invoice_pdf_url ? (
          <a href={order.invoice_pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-[#E63946] hover:underline" data-testid={`my-order-invoice-${order.order_number}`}>
            <FileText className="w-4 h-4" /> Rechnung
          </a>
        ) : <span className="text-xs text-gray-400">Rechnung folgt</span>}
        <button onClick={toggleExpand} className="text-gray-400 hover:text-[#E63946]" data-testid={`my-order-toggle-${order.order_number}`}>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isSpecial ? (
        <div className="bg-[#fdecec] text-[#C92F3C] text-xs font-semibold px-3 py-1.5 rounded inline-block mb-2" data-testid={`my-order-special-status-${order.order_number}`}>
          {SPECIAL[order.status]}
        </div>
      ) : (
        <div className="mb-2"><Stepper status={order.status} /></div>
      )}

      {order.shipping_label_url && (
        <a href={order.shipping_label_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#E63946] mb-1">
          <Download className="w-3.5 h-3.5" /> Versandlabel ansehen
        </a>
      )}
      {order.return_label_url && (
        <a href={order.return_label_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#E63946] mb-1" data-testid={`my-order-return-label-${order.order_number}`}>
          <Download className="w-3.5 h-3.5" /> Rücksendelabel herunterladen
        </a>
      )}

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 text-sm font-semibold text-[#E63946] hover:underline" data-testid={`my-order-support-btn-${order.order_number}`}>
              <MessageCircle className="w-4 h-4" /> Anfrage zu dieser Bestellung stellen
            </button>
            {!isSpecial && CANCELLABLE.includes(order.status) && (
              <button onClick={cancelOrder} disabled={cancelling} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#E63946] disabled:opacity-60" data-testid={`my-order-cancel-btn-${order.order_number}`}>
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Bestellung widerrufen
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={submitRequest} className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3" data-testid={`my-order-support-form-${order.order_number}`}>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kategorie</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="inp" data-testid="support-request-category">
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nachricht</label>
                <textarea required rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="inp" data-testid="support-request-message" />
              </div>
              <button type="submit" disabled={sending} className="h-10 px-5 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md text-sm disabled:opacity-60" data-testid="support-request-submit">
                {sending ? 'Wird gesendet ...' : 'Absenden'}
              </button>
            </form>
          )}

          {msg && <p className="text-sm text-gray-600" data-testid={`my-order-msg-${order.order_number}`}>{msg}</p>}

          {requests && requests.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Meine Anfragen</p>
              {requests.map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm" data-testid={`support-request-${r.id}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#17191d]">{CATEGORY_OPTIONS.find((o) => o.value === r.category)?.label || r.category}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${r.status === 'BEANTWORTET' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status === 'BEANTWORTET' ? 'Beantwortet' : 'Offen'}</span>
                  </div>
                  <p className="text-gray-700">{r.message}</p>
                  {r.admin_reply && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-0.5">Antwort von Kupke Tuning:</p>
                      <p className="text-gray-700">{r.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
