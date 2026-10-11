import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const params = new URLSearchParams(location.hash.replace('#', '?'));
    const sessionId = params.get('session_id');
    if (!sessionId) { navigate('/konto/anmelden', { replace: true }); return; }
    (async () => {
      const target = localStorage.getItem('post_auth_redirect') || '/konto';
      localStorage.removeItem('post_auth_redirect');
      try {
        const user = await api.googleSession(sessionId);
        setUser(user);
        window.history.replaceState({}, '', window.location.pathname);
        navigate(target, { replace: true, state: { user } });
      } catch {
        setError('Die Google-Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setTimeout(() => navigate('/konto/anmelden', { replace: true }), 2000);
      }
    })();
  }, [location.hash, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" data-testid="auth-callback">
      {error ? (
        <p className="text-[#E63946] text-sm">{error}</p>
      ) : (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Anmeldung wird verarbeitet ...
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
