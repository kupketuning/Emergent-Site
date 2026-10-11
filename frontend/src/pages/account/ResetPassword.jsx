import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../../api';
import Seo from '../../components/Seo';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (password !== confirm) { setErr('Die Passwörter stimmen nicht überein.'); return; }
    if (password.length < 8) { setErr('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (error) {
      setErr(error?.response?.data?.detail || 'Der Link ist ungültig oder abgelaufen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-10">
      <Seo title="Neues Passwort vergeben" description="Neues Passwort für Ihr Kupke-Tuning Konto festlegen." path="/konto/passwort-zuruecksetzen" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/konto/anmelden" className="hover:text-[#E63946]">Mein Konto</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#17191d] font-semibold">Neues Passwort</span>
      </div>
      <h1 className="font-logo text-2xl font-bold text-[#17191d] mb-4 uppercase">Neues Passwort vergeben</h1>
      {done ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6" data-testid="reset-password-success">
          <CheckCircle2 className="w-10 h-10 text-[#008d36] mb-3" />
          <p className="text-gray-700 mb-4">Ihr Passwort wurde erfolgreich geändert.</p>
          <button onClick={() => navigate('/konto/anmelden')} className="bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-5 py-2.5 rounded-md">Jetzt anmelden</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Neues Passwort</label>
            <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="inp" data-testid="reset-password-new" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Passwort bestätigen</label>
            <input required type="password" minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="inp" data-testid="reset-password-confirm" />
          </div>
          {err && <p className="text-[#E63946] text-sm" data-testid="reset-password-error">{err}</p>}
          <button type="submit" disabled={loading} className="w-full h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="reset-password-submit">
            {loading ? 'Wird gespeichert ...' : 'Passwort speichern'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
