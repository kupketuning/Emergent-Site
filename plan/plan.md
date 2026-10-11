# Benutzerkonten, Rollen & Admin-Übersicht für Kupke-Tuning

Kunden erhalten ein eigenes Konto mit Bestellübersicht, das Shop-Team arbeitet künftig mit
persönlichen Logins statt einem gemeinsamen Passwort. Eine neue Rolle "Bearbeiter" regelt,
wer im Admin-Bereich was darf, ergänzt um eine Kennzahlen-Übersicht beim Einloggen.

## Für wen

- **Kunden** von kupketuning.de, die ihre Bestellungen und Rechnungen wiederfinden möchten,
  ohne jedes Mal Gast-Daten neu einzugeben.
- **Das Shop-Team**: der Admin (volle Kontrolle) und ein oder mehrere Bearbeiter (Tagesgeschäft:
  Produkte, Bestellungen, Anfragen, Versand), die nicht mehr ein gemeinsames Passwort teilen.

## Kernfunktionen

- **Kundenkonto**: Registrierung/Login per E-Mail + Passwort ODER per Google-Login. Im Konto
  sieht der Kunde seine Bestellhistorie inkl. Rechnungs-Download. Bestellen als Gast bleibt
  weiterhin möglich – ein Konto ist eine Option, keine Pflicht.
- **Mitarbeiterkonten mit Rollen**: Statt eines geteilten Admin-Passworts bekommt jedes
  Teammitglied ein eigenes Login (E-Mail + Passwort).
  - **Admin**: voller Zugriff, inkl. Benutzerverwaltung (neue Bearbeiter anlegen/deaktivieren).
  - **Bearbeiter**: Zugriff auf (fast) alles – Produkte, Lagerbestand, Bestellungen, Anfragen,
    Versandlabel-Upload, Rechnungen einsehen – außer der Benutzerverwaltung.
- **Neue Admin-Übersicht**: Eine Kennzahlen-Startseite im Admin-Bereich mit: Bestellungen &
  Umsatz im laufenden Monat, Anzahl offener Kundenanfragen, Anzahl Artikel mit niedrigem
  Lagerbestand – auf einen Blick, statt erst in jeden Tab wechseln zu müssen.
- **Passwort vergessen**: sowohl für Kunden als auch für Mitarbeiter.

## Ablauf

**Kunde:** Klickt auf "Anmelden/Konto" → registriert sich per E-Mail/Passwort oder per
"Mit Google anmelden" → landet in "Mein Konto" mit seiner Bestellübersicht. Frühere
Gast-Bestellungen mit derselben E-Mail-Adresse erscheinen automatisch mit.

**Mitarbeiter:** Admin meldet sich mit seinem persönlichen Login an → sieht im Admin-Bereich
einen zusätzlichen Tab "Benutzer" (nur für Admin sichtbar) → legt dort einen neuen Bearbeiter
mit E-Mail + Startpasswort an. Der Bearbeiter meldet sich an, sieht alle Tabs außer "Benutzer".

**Beim Einloggen** landet jeder Mitarbeiter zuerst auf der neuen "Übersicht" mit den
wichtigsten Kennzahlen, bevor er zu Produkten/Bestellungen/Anfragen wechselt.

## Look & Feel

Kunden-Login und "Mein Konto" übernehmen die bestehende Optik des Shops (Rot/Schwarz,
kräftige Großbuchstaben-Headlines, wie auf den übrigen Seiten). Der Admin-Bereich bleibt
beim bisherigen dunklen Admin-Look; die neue Übersicht fügt sich dort als zusätzliche Seite
mit Kennzahlen-Kacheln ein, im gleichen Stil wie die bestehenden Tabs.

## Umsetzungsphasen

**Phase 1 – MVP (wird jetzt gebaut)**
Kundenkonto (E-Mail/Passwort + Google-Login) mit Bestellhistorie · persönliche Mitarbeiter-Logins
mit den Rollen Admin/Bearbeiter · neuer "Benutzer"-Tab (nur Admin) zum Anlegen/Deaktivieren von
Bearbeitern · neue Admin-Übersicht mit den vier genannten Kennzahlen · "Passwort vergessen" für
beide Kontotypen.

**Phase 2 – als nächstes**
Erweiterte Reports (Umsatzverlauf, Bestseller, Aufschlüsselung nach Fahrzeug/Kategorie,
CSV-Export) · gespeicherte Lieferadressen & "Erneut bestellen" im Kundenkonto · Protokoll,
wer im Admin-Bereich was geändert hat.

**Phase 3 – perspektivisch**
Feinere, frei definierbare Rollen über Admin/Bearbeiter hinaus · Rabattcodes/Treuevorteile für
registrierte Kunden. (Die bereits bekannte spätere Hermes-API-Automatisierung bleibt ein
separates, unverändertes Vorhaben und ist nicht Teil dieses Plans.)

## Annahmen

- Gast-Checkout bleibt bestehen; ein Kundenkonto ist optional, keine Voraussetzung zum Bestellen.
- Das bisherige geteilte Admin-Passwort entfällt; der heutige Zugang wird zum ersten
  "Admin"-Konto.
- Neue Bearbeiter-Konten legt ausschließlich ein Admin an (E-Mail + Startpasswort) – keine
  öffentliche Registrierung fürs Team.
- Frühere Gast-Bestellungen erscheinen automatisch in der Bestellhistorie, wenn die
  Konto-E-Mail mit der beim Checkout verwendeten E-Mail übereinstimmt.
- Google-Login gibt es nur für Kunden, nicht fürs Team (wie gewünscht).
- Die vier Kennzahlen auf der Übersicht sind eine Einschätzung der nützlichsten Werte und
  können nach Durchsicht angepasst werden.
- Die vorher angefragte Deployment-Prüfung erfolgt im Anschluss an die Freigabe dieses Plans,
  bevor an den neuen Funktionen weitergebaut wird.
