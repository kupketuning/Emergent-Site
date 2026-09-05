import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api';

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clear } = useCart();
  const [state, setState] = useState('loading'); // loading | success | pending | error
  const [orderNumber, setOrderNumber] = useState(null);
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) { setState('error'); return; }
    let attempts = 0;
    let timer;
    const poll = async () => {
      attempts += 1;
      try {
        const res = await api.checkoutStatus(sessionId);
        if (res.status === 'BEZAHLT') {
          setOrderNumber(res.order_number);
          setState('success');
          if (!cleared.current) { clear(); cleared.current = true; }
          return;
        }
      } catch (e) { /* keep polling */ }
      if (attempts >= 8) { setState('pending'); return; }
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="max-w-[720px] mx-auto px-4 py-20 text-center" data-testid="order-success-page">
      {state === 'loading' && (
        <div data-testid="order-loading">
          <Loader2 className="w-14 h-14 text-[#E63946] mx-auto mb-4 animate-spin" />
          <h1 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-2">Zahlung wird bestätigt ...</h1>
          <p className="text-gray-500">Einen Moment bitte, wir prüfen Eure Zahlung.</p>
        </div>
      )}

      {state === 'success' && (
        <div data-testid="order-confirmed">
          <CheckCircle2 className="w-16 h-16 text-[#008d36] mx-auto mb-4" />
          <h1 className="font-logo text-3xl font-bold text-[#1a1a1a] mb-3 uppercase">Vielen Dank für Eure Bestellung!</h1>
          <p className="text-gray-600 mb-2">Eure Zahlung war erfolgreich. Wir haben Eure Bestellung erhalten.</p>
          {orderNumber && <p className="text-lg font-bold text-[#1a1a1a] mb-6">Bestellnummer: <span className="text-[#E63946]" data-testid="order-number">{orderNumber}</span></p>}
          <Link to="/" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-6 py-3 rounded-md transition-colors">Weiter einkaufen</Link>
        </div>
      )}

      {state === 'pending' && (
        <div data-testid="order-pending">
          <Loader2 className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h1 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-2">Zahlung wird verarbeitet</h1>
          <p className="text-gray-500 mb-6">Eure Bestellung wird gleich bestätigt. Ihr erhaltet eine Bestätigung per E-Mail.</p>
          <Link to="/" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-6 py-3 rounded-md">Zur Startseite</Link>
        </div>
      )}

      {state === 'error' && (
        <div data-testid="order-error">
          <XCircle className="w-14 h-14 text-[#E63946] mx-auto mb-4" />
          <h1 className="font-logo text-2xl font-bold text-[#1a1a1a] mb-2">Etwas ist schiefgelaufen</h1>
          <p className="text-gray-500 mb-6">Wir konnten Eure Bestellung nicht laden. Bitte kontaktiert uns bei Fragen.</p>
          <Link to="/" className="inline-block bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-6 py-3 rounded-md">Zur Startseite</Link>
        </div>
      )}
    </div>
  );
};

export default Success;
