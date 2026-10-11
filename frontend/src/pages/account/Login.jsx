import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
);

const Login = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.email, form.password, form.name);
      navigate('/konto');
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Das hat leider nicht geklappt. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/konto';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-10">
      <Seo title="Anmelden – Mein Konto" description="Melde dich bei deinem Kupke-Tuning Konto an oder registriere dich neu." path="/konto/anmelden" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#17191d] font-semibold">Mein Konto</span>
      </div>

      <div className="flex mb-6 border-b border-gray-200" data-testid="login-mode-tabs">
        <button onClick={() => setMode('login')} data-testid="login-tab-login"
          className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wide ${mode === 'login' ? 'text-[#E63946] border-b-2 border-[#E63946]' : 'text-gray-400'}`}>
          Anmelden
        </button>
        <button onClick={() => setMode('register')} data-testid="login-tab-register"
          className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wide ${mode === 'register' ? 'text-[#E63946] border-b-2 border-[#E63946]' : 'text-gray-400'}`}>
          Registrieren
        </button>
      </div>

      <h1 className="font-logo text-2xl font-bold text-[#17191d] mb-6 uppercase">
        {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
      </h1>

      <button onClick={googleLogin} data-testid="google-login-btn"
        className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md font-semibold text-[#17191d] hover:bg-gray-50 transition-colors mb-5">
        <GoogleIcon /> Mit Google anmelden
      </button>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400 uppercase">oder</span><div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} className="inp" data-testid="login-name" />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">E-Mail *</label>
          <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="inp" data-testid="login-email" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Passwort *</label>
          <input required type="password" minLength={8} value={form.password} onChange={(e) => set('password', e.target.value)} className="inp" data-testid="login-password" />
        </div>
        {mode === 'login' && (
          <div className="text-right">
            <Link to="/konto/passwort-vergessen" className="text-sm text-gray-500 hover:text-[#E63946]" data-testid="forgot-password-link">Passwort vergessen?</Link>
          </div>
        )}
        {err && <p className="text-[#E63946] text-sm" data-testid="login-error">{err}</p>}
        <button type="submit" disabled={loading} data-testid="login-submit"
          className="w-full flex items-center justify-center gap-2 h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md transition-colors disabled:opacity-60">
          {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {loading ? 'Einen Moment ...' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Ihr könnt auch ohne Konto als Gast bestellen – <Link to="/kasse" className="text-[#E63946] hover:underline">zur Kasse</Link>.
      </p>
    </div>
  );
};

export default Login;
