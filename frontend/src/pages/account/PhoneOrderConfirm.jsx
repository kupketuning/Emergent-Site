import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, CreditCard, LogIn, UserPlus, ShoppingBag } from 'lucide-react';
import api from '../../api';
import { formatEuro } from '../../mock';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
);

const PhoneOrderConfirm = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const { user, login, register } = useAuth();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState(null); // 'login' | 'register' | 'guest'

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [regPw, setRegPw] = useState({ password: '', confirm: '' });
  const [regErr, setRegErr] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setErr('Kein gültiger Bestätigungslink.'); setLoading(false); return; }
    (async () => {
      try {
        const p = await api.getPhoneOrderPreview(sessionId);
        setPreview(p);
        setLoginForm((f) => ({ ...f, email: p.customer_email || '' }));
      } catch { setErr('Diese Bestellung konnte nicht gefunden werden. Der Link ist eventuell abgelaufen.'); }
      finally { setLoading(false); }
    })();
  }, [sessionId]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoginErr(''); setLoginLoading(true);
    try { await login(loginForm.email, loginForm.password); }
    catch (error) { setLoginErr(error?.response?.data?.detail || 'Anmeldung fehlgeschlagen.'); }
    finally { setLoginLoading(false); }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setRegErr('');
    if (regPw.password !== regPw.confirm) { setRegErr('Die Passwörter stimmen nicht überein.'); return; }
    if (regPw.password.length < 8) { setRegErr('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    setRegLoading(true);
    try { await register(preview.customer_email, regPw.password, ''); }
    catch (error) { setRegErr(error?.response?.data?.detail || 'Registrierung fehlgeschlagen.'); }
    finally { setRegLoading(false); }
  };

  const googleRegister = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    localStorage.setItem('post_auth_redirect', `/bestellung-bezahlen?session_id=${sessionId}`);
    const redirectUrl = window.location.origin + '/konto';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const pay = () => { window.location.href = preview.checkout_url; };

  if (loading || user === null) {
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

  const tabBtn = (key, labelText, Icon) => (
    <button type="button" onClick={() => setMode(key)} data-testid={`phone-order-tab-${key}`}
      className={`flex flex-col items-center gap-1.5 py-3 rounded-md border text-sm font-semibold transition-colors ${mode === key ? 'border-[#E63946] text-[#E63946] bg-[#fdf2f2]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
      <Icon className="w-5 h-5" /> {labelText}
    </button>
  );

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
        {preview.lead_time_text && (
          <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-2" data-testid="phone-order-lead-time">Lieferung: {preview.lead_time_text}</p>
        )}
      </div>

      {user ? (
        <button onClick={pay} className="w-full flex items-center justify-center gap-2 h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md" data-testid="phone-order-pay-btn">
          <CreditCard className="w-5 h-5" /> Jetzt bezahlen
        </button>
      ) : (
        <div data-testid="phone-order-auth-options">
          <div className="grid grid-cols-3 gap-2 mb-5">
            {tabBtn('login', 'Anmelden', LogIn)}
            {tabBtn('register', 'Registrieren', UserPlus)}
            {tabBtn('guest', 'Als Gast', ShoppingBag)}
          </div>

          {mode === 'login' && (
            <form onSubmit={submitLogin} className="space-y-3" data-testid="phone-order-login-form">
              <input required type="email" placeholder="E-Mail" value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} className="inp" data-testid="phone-order-login-email" />
              <input required type="password" placeholder="Passwort" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} className="inp" data-testid="phone-order-login-password" />
              {loginErr && <p className="text-[#E63946] text-sm" data-testid="phone-order-login-error">{loginErr}</p>}
              <button type="submit" disabled={loginLoading} className="w-full h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="phone-order-login-submit">
                {loginLoading ? 'Einen Moment ...' : 'Anmelden & bezahlen'}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <div className="space-y-3" data-testid="phone-order-register-panel">
              <button type="button" onClick={googleRegister} data-testid="phone-order-google-register"
                className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md font-semibold text-[#17191d] hover:bg-gray-50">
                <GoogleIcon /> Mit Google registrieren
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400 uppercase">oder</span><div className="flex-1 h-px bg-gray-200" />
              </div>
              <form onSubmit={submitRegister} className="space-y-3">
                <input disabled value={preview.customer_email} className="inp bg-gray-50 text-gray-500" data-testid="phone-order-register-email" />
                <input required type="password" minLength={8} placeholder="Passwort" value={regPw.password} onChange={(e) => setRegPw((f) => ({ ...f, password: e.target.value }))} className="inp" data-testid="phone-order-register-password" />
                <input required type="password" minLength={8} placeholder="Passwort bestätigen" value={regPw.confirm} onChange={(e) => setRegPw((f) => ({ ...f, confirm: e.target.value }))} className="inp" data-testid="phone-order-register-confirm" />
                {regErr && <p className="text-[#E63946] text-sm" data-testid="phone-order-register-error">{regErr}</p>}
                <button type="submit" disabled={regLoading} className="w-full h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="phone-order-register-submit">
                  {regLoading ? 'Einen Moment ...' : 'Konto erstellen & bezahlen'}
                </button>
              </form>
            </div>
          )}

          {mode === 'guest' && (
            <div data-testid="phone-order-guest-panel">
              <p className="text-sm text-gray-500 mb-3">Sie bezahlen ohne Konto. Rechnung &amp; Versandinfos erhalten Sie per E-Mail an {preview.customer_email}.</p>
              <button onClick={pay} className="w-full flex items-center justify-center gap-2 h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md" data-testid="phone-order-guest-pay-btn">
                <CreditCard className="w-5 h-5" /> Als Gast bezahlen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneOrderConfirm;
