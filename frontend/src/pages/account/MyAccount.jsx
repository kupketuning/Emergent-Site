import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, LogOut, FileText, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { formatEuro } from '../../mock';
import Seo from '../../components/Seo';

const STATUS_LABEL = { NEU: 'Neu', BEZAHLT: 'Bezahlt', IN_BEARBEITUNG: 'In Bearbeitung', VERSENDET: 'Versendet', ABGEHOLT: 'Abgeholt', STORNIERT: 'Storniert' };

const MyAccount = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try { setOrders(await api.getMyOrders()); } catch { /* ignore */ } finally { setLoading(false); }
    })();
  }, [user]);

  if (user === null) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }
  if (user === false) {
    return <Navigate to="/konto/anmelden" replace />;
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-10" data-testid="my-account-page">
      <Seo title="Mein Konto" description="Bestellhistorie und Kontodaten bei Kupke Tuning." path="/konto" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-logo text-2xl font-bold text-[#17191d] uppercase">Mein Konto</h1>
          <p className="text-gray-500 text-sm mt-1" data-testid="my-account-email">{user.name ? `${user.name} · ` : ''}{user.email}</p>
        </div>
        <button onClick={logout} data-testid="account-logout-btn" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E63946]">
          <LogOut className="w-4 h-4" /> Abmelden
        </button>
      </div>

      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-4">Meine Bestellungen</h2>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Wird geladen ...</div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-400" data-testid="no-orders">
          <Package className="w-10 h-10 mx-auto mb-3" /> Noch keine Bestellungen vorhanden.
          <div className="mt-4"><Link to="/" className="text-[#E63946] font-semibold hover:underline">Jetzt im Shop stöbern</Link></div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2" data-testid={`my-order-${o.order_number}`}>
              <div>
                <p className="font-mono text-sm font-semibold text-[#17191d]">{o.order_number}</p>
                <p className="text-xs text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString('de-DE') : ''}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700">{STATUS_LABEL[o.status] || o.status}</span>
              <span className="font-bold text-[#17191d]">{formatEuro(o.total_gross)}</span>
              {o.invoice_pdf_url ? (
                <a href={o.invoice_pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-[#E63946] hover:underline" data-testid={`my-order-invoice-${o.order_number}`}>
                  <FileText className="w-4 h-4" /> Rechnung
                </a>
              ) : <span className="text-xs text-gray-400">Rechnung folgt</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccount;
