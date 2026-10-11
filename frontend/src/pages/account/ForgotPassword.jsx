import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../../api';
import Seo from '../../components/Seo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email, `${window.location.origin}/konto/passwort-zuruecksetzen`);
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-10">
      <Seo title="Passwort vergessen" description="Passwort für Ihr Kupke-Tuning Konto zurücksetzen." path="/konto/passwort-vergessen" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/konto/anmelden" className="hover:text-[#E63946]">Mein Konto</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#17191d] font-semibold">Passwort vergessen</span>
      </div>
      <h1 className="font-logo text-2xl font-bold text-[#17191d] mb-2 uppercase">Passwort vergessen</h1>
      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4" data-testid="forgot-password-sent">
          <CheckCircle2 className="w-10 h-10 text-[#008d36] mb-3" />
          <p className="text-gray-700">Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Link zum Zurücksetzen des Passworts versendet.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 mt-4">
          <p className="text-gray-500 text-sm">Gebt eure E-Mail-Adresse ein, wir senden euch einen Link zum Zurücksetzen.</p>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="inp" placeholder="E-Mail-Adresse" data-testid="forgot-password-email" />
          <button type="submit" disabled={loading} className="w-full h-12 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="forgot-password-submit">
            {loading ? 'Wird gesendet ...' : 'Link anfordern'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
