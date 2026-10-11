# Admin-Verbesserungen: Telefonbestellung, Lieferschein & Darstellung

Erweiterungen für den Admin-Bereich von Kupke Tuning: besser lesbare Kopfzeilen, eine
leistungsfähigere Telefonbestellung mit Bestandskunden-Auswahl und individuellen Produkten,
ein abrufbarer und automatisch versendeter Lieferschein sowie eine flexible
Bezahlbestätigung für Kunden mit Konto- oder Gast-Option.

## Für wen

Das Shop-Team (Admin/Bearbeiter), das telefonische Bestellungen erfasst und Aufträge
abwickelt, sowie Kunden, die eine telefonisch vorbereitete Bestellung online bestätigen
und bezahlen.

## Core Features und Erlebnis

- **Admin-Darstellung:** Die Kopfzeilen-Überschriften im Admin-Bereich (z. B. "Übersicht",
  "Produkte", "Bestellungen") werden größer und besser lesbar dargestellt.
- **Telefonbestellung – Bestandskunde auswählen:** Beim Anlegen einer Telefonbestellung kann
  der Admin statt einer neuen E-Mail-Adresse einen bereits vorhandenen Kunden auswählen;
  Name und Adresse werden automatisch aus dessen Kundendaten übernommen.
- **Telefonbestellung – individuelles Produkt:** Der Admin kann direkt in der
  Telefonbestellung ein einmaliges, individuelles Produkt mit eigenem Namen, Nettopreis,
  abweichenden Versandkosten und einer Versandlaufzeit-Angabe ("Lieferung in X Werktagen
  nach Zahlungseingang") anlegen. Dieses Produkt wird dauerhaft im Produktkatalog
  gespeichert, bleibt aber inaktiv/unsichtbar im normalen Shop.
- **Bestätigungsseite für Telefonbestellungen:** Der Kunde kann dort wählen zwischen
  "Anmelden" (bestehendes Konto), "Registrieren" (E-Mail/Passwort oder "Mit Google
  registrieren") oder "Als Gast bezahlen" (ohne Konto, direkt zur Zahlung).
- **Lieferschein:** Im Admin-Bereich kann zu jeder Bestellung jederzeit ein Lieferschein
  (Artikel + Menge + Lieferadresse, ohne Preise) heruntergeladen und ausgedruckt werden.
  Zusätzlich wird der Lieferschein automatisch per E-Mail an den Kunden geschickt, sobald
  ein Mitarbeiter den Bestellstatus auf "Versendet" setzt.
- **ZUGFeRD (E-Rechnung) – geklärt, keine Umsetzung:** Die gesetzliche E-Rechnungspflicht in
  Deutschland betrifft nur B2B/B2G-Geschäfte, nicht den B2C-Verkauf an Privatkunden. Da
  Kupke Tuning an Privatkunden verkauft, besteht keine Pflicht. Es wird daher nichts an der
  Rechnungserstellung geändert.

## User Flow

**Telefonbestellung anlegen:** Admin öffnet "Telefonbestellung anlegen" → wählt entweder
einen Bestandskunden aus einer Liste (Daten werden automatisch übernommen) oder trägt einen
neuen Kunden ein → fügt Katalogprodukte hinzu und/oder legt ein individuelles Produkt mit
Name, Nettopreis, Versandkosten und Lieferzeit an → speichert → der Kunde erhält die
Bestätigungs-E-Mail mit Link (wie bisher).

**Kunde bestätigt & bezahlt:** Kunde öffnet den Link → sieht die Bestellübersicht → wählt
"Anmelden", "Registrieren" (auch mit Google) oder "Als Gast bezahlen" → schließt die Zahlung
über die bestehende Stripe-Kasse ab.

**Versand & Lieferschein:** Admin setzt im Bestellungen-Tab den Status einer Bestellung auf
"Versendet" → das System verschickt automatisch den Lieferschein per E-Mail an den Kunden.
Der Admin kann den Lieferschein für jede Bestellung außerdem jederzeit manuell herunterladen
und ausdrucken.

## UI/UX-Gefühl

Der Admin-Bereich bleibt im bestehenden dunklen Dashboard-Look; lediglich die
Kopfzeilen-Schriftgröße wird für bessere Lesbarkeit angehoben. Die Erweiterungen der
Telefonbestellung (Kundenauswahl, individuelles Produkt) fügen sich in das bestehende
Formular ein. Die Bestätigungsseite für Kunden bleibt im hellen Shop-Look, mit den drei
Optionen (Anmelden/Registrieren/Gast) klar und gleichwertig nebeneinander dargestellt.

## Umsetzungsphasen

**Phase 1 – MVP (wird jetzt gebaut)**
Größere Kopfzeilen-Schrift im Admin-Bereich · Telefonbestellung: Bestandskunden-Auswahl mit
automatischer Datenübernahme · Telefonbestellung: individuelles Produkt mit Name,
Nettopreis, Versandkosten und Lieferzeit, dauerhaft im Katalog aber inaktiv gespeichert ·
Bestätigungsseite mit den drei Optionen Anmelden/Registrieren (inkl. Google)/Gast-Zahlung ·
Lieferschein als On-Demand-Download im Admin-Bereich sowie automatischer E-Mail-Versand an
den Kunden beim Statuswechsel auf "Versendet".

**Phase 2 – als nächstes**
Dynamische, gewichts-/größenabhängige Versandkosten auch für reguläre Katalogbestellungen ·
durchgehender Anfragen-Dialog im Kundenkonto · gespeicherte Lieferadressen und "Erneut
bestellen".

**Phase 3 – perspektivisch**
Echte Hermes-API-Automatisierung für Versand- und Rücksendelabels · ZUGFeRD-Umsetzung, falls
sich die gesetzliche Lage künftig ändert oder Geschäftskunden dies ausdrücklich verlangen
(aktuell nicht erforderlich).

## Annahmen

- Individuelle Produkte aus Telefonbestellungen werden als inaktive Katalogprodukte
  gespeichert, erhalten automatisch eine Artikelnummer nach dem bestehenden Schema und
  erscheinen nicht in der normalen Shop-Navigation oder Suche.
- Die Versandlaufzeit wird als Information in der Bestätigungs-E-Mail und auf der
  Bestätigungsseite angezeigt; sie löst keinen automatischen Versandprozess aus – die
  tatsächliche Label-Erstellung bleibt wie bisher ein manueller Schritt im Admin-Bereich.
- "Als Gast bezahlen" bei Telefonbestellungen funktioniert wie der bestehende normale
  Gast-Checkout im Shop: Zahlung ohne Konto, die Bestellung bleibt aber mit der beim
  Telefonat angegebenen Kunden-E-Mail verknüpft.
- Der Lieferschein verwendet das gleiche Layout wie der bereits bestehende interne
  Packzettel (Artikel, Menge, Lieferadresse, ohne Preise), wird aber als eigenständig
  abrufbares und an den Kunden versendbares Dokument unter der Bezeichnung "Lieferschein"
  bereitgestellt.
- Die größere Kopfzeilen-Schrift betrifft die Haupt-Überschriften der Admin-Tabs, nicht die
  gesamte übrige Admin-Oberfläche (Tabellen, Formulare etc. bleiben in der bisherigen
  Größe).
- ZUGFeRD gilt mit dieser Klärung als abgeschlossen behandelt und ist kein aktiver
  Arbeitspunkt in den kommenden Phasen, sofern sich die gesetzliche Lage nicht ändert.
