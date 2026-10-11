import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import OrderCard from './OrderCard';
import Seo from '../../components/Seo';

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

  const handleOrderChanged = (updated) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
  };

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
          {orders.map((o) => <OrderCard key={o.id} order={o} onChanged={handleOrderChanged} />)}
        </div>
      )}
    </div>
  );
};

export default MyAccount;

