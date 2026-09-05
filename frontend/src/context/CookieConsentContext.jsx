import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'kupke_cookie_consent';
const POSTHOG_KEY = 'phc_DbsPb39SRc8z3EiQ6Dhj6ikv4H4rTKcht9d4sZSesceP';

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const applyAnalytics = (enabled) => {
  if (typeof window === 'undefined' || !window.posthog) return;
  if (enabled) {
    if (!window.posthog.__loaded) {
      window.posthog.init(POSTHOG_KEY, {
        api_host: 'https://ap.emergent.sh',
        person_profiles: 'identified_only',
        session_recording: { recordCrossOriginIframes: true, capturePerformance: false },
      });
    } else if (window.posthog.opt_in_capturing) {
      window.posthog.opt_in_capturing();
    }
  } else if (window.posthog.opt_out_capturing) {
    window.posthog.opt_out_capturing();
  }
};

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(readStored);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (consent) applyAnalytics(!!consent.analytics);
  }, [consent]);

  const saveConsent = (analytics) => {
    const value = { necessary: true, analytics, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setShowPreferences(false);
  };

  return (
    <CookieConsentContext.Provider value={{ consent, saveConsent, showPreferences, setShowPreferences }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext);
