# Kundenkonto-Erweiterung, Bestellverfolgung & Support-Anfragen

Das Kundenkonto wird um Bestellverfolgung, Support-Anfragen pro Bestellung, Widerruf mit Rücksendelabel und einen Telefonbestellungs-Flow für den Admin erweitert. Der gemeldete Bearbeiter-Einladungs-"Fehler" stellt sich als bewusst nicht gebaute Funktion heraus und bleibt wie bisher.

## Für wen

Für Shop-Kunden von Kupke Tuning, die ihre Bestellungen nachverfolgen, Rückfragen stellen oder widerrufen möchten, sowie für das Shop-Team (Admin/Bearbeiter), das Bestellungen telefonisch anlegen, Status pflegen und Kundenanfragen beantworten muss.

## Core Features und Erlebnis

- **Kunden-Login im Header:** Der Einstiegspunkt für die Kundenanmeldung im Shop-Header heißt "Konto" (nicht "Admin"); die separate Admin-Seite bleibt davon unberührt und getrennt erreichbar.
- **Registrierung:** Nach der Registrierung erhält der Kunde eine Willkommens-E-Mail und wird direkt auf sein neues Konto weitergeleitet.
- **Bestellstatus-Verfolgung:** Jede Bestellung zeigt im Kundenkonto einen Fortschritts-Schritte-Anzeiger: Neu → Bezahlt → In Bearbeitung → Versendet → Zugestellt/Abgeholt. Storniert/Widerruf ist ein eigener Sonderstatus. Admin und Bearbeiter können den Status jeder Bestellung im Admin-Bereich ändern.
- **Support-Anfragen pro Bestellung:** Der Kunde kann aus seinem Konto zu einer Bestellung eine Anfrage stellen, mit Auswahl einer Kategorie per Dropdown (Rückfrage, Terminanfrage, Reklamation, Sonstiges) und einem Freitext. Die Anfrage erscheint im Admin-Dashboard und wird zusätzlich per E-Mail an den Admin geschickt. Der Admin kann aus dem Dashboard heraus antworten; die Antwort geht per E-Mail an den Kunden.
- **Widerruf & Rücksendelabel:** Der Kunde kann eine Bestellung aus seinem Konto widerrufen. Das löst eine Benachrichtigung an Admin/Lager aus (Dashboard + E-Mail). Der Admin lädt – wie beim Versandlabel – das Hermes-Rücksendelabel als PDF hoch (da noch kein Hermes-API-Zugang besteht); der Kunde kann es danach in seinem Konto herunterladen und drucken.
- **Telefonbestellung durch den Admin:** Der Admin kann im Dashboard einen Kunden per E-Mail-Adresse anlegen (oder einen bestehenden auswählen) und ihm mehrere Produkte mit Mengen zuordnen, wie bei einem kleinen Warenkorb. Der Kunde erhält daraufhin eine E-Mail mit einem Bestätigungs- und Bezahllink. Nach dem Klick vergibt der Kunde ein eigenes Passwort für sein neues Konto und kann die Bestellung ansehen, bestätigen und bezahlen (Zahlung läuft über den bestehenden Stripe-Checkout).
- **Musterkunde & Testbestellung:** Es wird ein Beispiel-Kundenkonto mit einer Beispielbestellung angelegt, damit die neuen Funktionen (Status, Support-Anfrage, Rechnungs-/Labelanzeige) direkt angeschaut werden können.
- **Bearbeiter-Einladung:** Bleibt wie bisher – der Admin vergibt beim Anlegen eines Bearbeiter-Kontos weiterhin direkt E-Mail und Passwort, es wird keine Einladungs-E-Mail verschickt. Das ursprünglich gemeldete Problem war keine fehlerhafte Zustellung, sondern diese Funktion war schlicht nicht vorgesehen – hiermit bestätigt und unverändert belassen.

## User Flow

**Registrierung:** Kunde füllt das Registrierungsformular aus → erhält eine Willkommens-E-Mail → wird direkt in sein neues Konto weitergeleitet.

**Bestellung nachverfolgen:** Kunde öffnet "Mein Konto" → sieht pro Bestellung den aktuellen Schritt im Statusverlauf (Neu/Bezahlt/In Bearbeitung/Versendet/Zugestellt) sowie Rechnung und ggf. Versandlabel.

**Support-Anfrage stellen:** Kunde öffnet eine Bestellung in seinem Konto → wählt eine Kategorie aus dem Dropdown (Rückfrage/Terminanfrage/Reklamation/Sonstiges) → schreibt seine Nachricht → sendet ab. Admin sieht die Anfrage im Dashboard und per E-Mail, beantwortet sie dort; der Kunde erhält die Antwort per E-Mail.

**Widerruf:** Kunde klickt bei einer Bestellung auf "Widerrufen" → Status wechselt auf "Widerruf angefordert" → Admin/Lager werden informiert → Admin lädt das Rücksendelabel hoch → Kunde sieht es in seinem Konto zum Herunterladen/Drucken.

**Telefonbestellung:** Admin öffnet im Dashboard "Neue Bestellung anlegen" → gibt Kunden-E-Mail ein (neu oder bestehend) → fügt ein oder mehrere Produkte mit Mengen hinzu → speichert → System verschickt automatisch eine E-Mail mit Bestätigungs-/Bezahllink an den Kunden → Kunde klickt den Link, vergibt ein Passwort, sieht seine Bestellung und bezahlt per Stripe.

## UI/UX-Gefühl

Die Kundenkonto-Seiten bleiben im bestehenden hellen Shop-Look (rot/schwarze Akzente, Großbuchstaben-Headlines), der Admin-Bereich bleibt im bestehenden dunklen Dashboard-Look. Der neue Status-Schritte-Anzeiger und die Anfragen-Liste orientieren sich an den bereits vorhandenen Karten- und Tabellenstilen, damit sich alles wie ein durchgängiger Teil der Seite anfühlt statt wie ein neuer Fremdkörper.

## Umsetzungsphasen

**Phase 1 – MVP (wird jetzt gebaut)**
Kunden-Login-Beschriftung "Konto" im Header bestätigt · Willkommens-E-Mail nach Registrierung mit Weiterleitung ins Konto · Bestellstatus-Schritte-Anzeiger im Kundenkonto, Status im Admin-Bereich pro Bestellung änderbar · Support-Anfragen pro Bestellung mit Kategorie-Dropdown (Rückfrage/Terminanfrage/Reklamation/Sonstiges), sichtbar im Admin-Dashboard und per E-Mail, mit Antwortmöglichkeit durch den Admin · Widerruf-Anfrage durch den Kunden mit Benachrichtigung an Admin/Lager und Rücksendelabel-Upload durch den Admin zum Download im Kundenkonto · Telefonbestellungs-Flow für den Admin mit mehreren Produkten/Mengen, Bestätigungs-/Bezahl-E-Mail und Passwortvergabe durch den Kunden · Musterkunde mit Testbestellung.

**Phase 2 – als nächstes**
Durchgehender Anfragen-Dialog im Kundenkonto (Kunde kann auf die Antwort des Admins direkt wieder antworten, statt nur eine einzelne Antwort zu erhalten) · gespeicherte Lieferadressen und "Erneut bestellen" · Protokoll der Statusänderungen für den Admin.

**Phase 3 – perspektivisch**
Echte Hermes-API-Anbindung, die den manuellen Label-Upload (Versand und Rücksendung) vollständig ersetzt · umfassenderer Self-Service für Rückgabe/Umtausch.

## Annahmen

- Die Beschriftung "Konto" im Shop-Header für die Kundenanmeldung ist bereits vorhanden und wird hiermit nur bestätigt, nicht neu gebaut.
- Die Antwort des Admins auf eine Kundenanfrage ist für den MVP eine einzelne Antwort per E-Mail; ein fortlaufender Dialog direkt im Kundenkonto folgt in Phase 2.
- Der Telefonbestellungs-Flow nutzt für die Bezahlung den bereits bestehenden Stripe-Checkout; es wird keine neue Zahlungsart eingeführt.
- Der Rücksendelabel-Upload nutzt denselben manuellen PDF-Upload-Mechanismus, der bereits für Versandlabels verwendet wird.
- Die Bearbeiter-Kontoerstellung bleibt unverändert (Admin vergibt E-Mail und Passwort direkt, keine Einladungs-E-Mail) – dies war kein Fehler, sondern wie besprochen so gewollt.
