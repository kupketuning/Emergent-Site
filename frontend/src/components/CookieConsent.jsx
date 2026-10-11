import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { useCookieConsent } from '../context/CookieConsentContext';

const CookieConsent = () => {
  const { consent, saveConsent, showPreferences, setShowPreferences } = useCookieConsent();
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  if (consent && !showPreferences) return null;

  return (
    <>
      {!showPreferences && (
        <div
          className="fixed bottom-0 inset-x-0 z-[999] bg-[#17191d] border-t-4 border-[#E63946] shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
          data-testid="cookie-banner"
        >
          <div className="max-w-[1300px] mx-auto px-4 py-5 flex flex-col sm:flex-row items-center gap-4">
            <Cookie className="w-8 h-8 text-[#148F81] shrink-0" strokeWidth={1.6} />
            <p className="text-sm text-gray-300 flex-1">
              Wir verwenden Cookies, um unsere Website funktionsfähig zu halten und, mit Deiner Einwilligung, unser Angebot zu verbessern. Mehr dazu in unserer{' '}
              <Link to="/datenschutz" className="underline hover:text-white">Datenschutzerklärung</Link>.
            </p>
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <button
                onClick={() => setShowPreferences(true)}
                data-testid="cookie-settings-btn"
                className="text-sm font-semibold text-gray-300 hover:text-white underline"
              >
                Einstellungen
              </button>
              <button
                onClick={() => saveConsent(false)}
                data-testid="cookie-reject-btn"
                className="text-sm font-semibold border border-white/30 text-white px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors"
              >
                Nur notwendige
              </button>
              <button
                onClick={() => saveConsent(true)}
                data-testid="cookie-accept-btn"
                className="text-sm font-bold bg-[#E63946] hover:bg-[#C92F3C] text-white px-5 py-2.5 rounded-md transition-colors uppercase tracking-wide"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-lg" data-testid="cookie-preferences-modal">
          <DialogHeader>
            <DialogTitle className="font-logo uppercase">Cookie-Einstellungen</DialogTitle>
            <DialogDescription>Wähle, welche Cookies Du zulassen möchtest. Notwendige Cookies sind für den Betrieb der Seite erforderlich.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div>
                <p className="font-semibold text-sm text-[#17191d]">Notwendige Cookies</p>
                <p className="text-xs text-gray-500 mt-1">Für Warenkorb, Login und grundlegende Funktionen – immer aktiv.</p>
              </div>
              <Switch checked disabled data-testid="cookie-toggle-necessary" />
            </div>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div>
                <p className="font-semibold text-sm text-[#17191d]">Analyse & Reichweitenmessung</p>
                <p className="text-xs text-gray-500 mt-1">Hilft uns zu verstehen, wie die Website genutzt wird.</p>
              </div>
              <Switch checked={analyticsChoice} onCheckedChange={setAnalyticsChoice} data-testid="cookie-toggle-analytics" />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => saveConsent(false)} data-testid="cookie-modal-reject">Nur notwendige</Button>
            <Button onClick={() => saveConsent(analyticsChoice)} className="bg-[#E63946] hover:bg-[#C92F3C]" data-testid="cookie-modal-save">
              Auswahl speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
