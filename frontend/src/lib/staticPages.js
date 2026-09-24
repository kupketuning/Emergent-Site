// Konfiguration der statischen Seiten – Rechtstexte gemäß bereitgestellten Dokumenten (Stand: August 2026)

const PLACEHOLDER = 'Dieser Inhalt wird in Kürze ergänzt. Bitte tragen Sie hier den finalen, rechtssicheren Text ein.';

export const STATIC_PAGES = {
  impressum: {
    slug: 'impressum',
    title: 'Impressum',
    metaTitle: 'Impressum',
    metaDescription: 'Impressum und Anbieterkennzeichnung von Kupke Tuning gemäß § 5 DDG.',
    sections: [
      { heading: 'Angaben gemäß § 5 DDG', paragraphs: ['Fa. KupkeTuning', 'Inhaberin: Nadezhda Kupke', 'Kaltes Feld 19', '08468 Heinsdorfergrund', 'Deutschland'] },
      { heading: 'Kontakt', paragraphs: ['Telefon: 0172 6005435', 'E-Mail: shop@kupketuning.de', 'Website: www.kupketuning.de'] },
      { heading: 'Umsatzsteuer-Identifikationsnummer', paragraphs: ['Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE 208143043', 'HRB: 17899', 'Steuernummer: 223/121/01991'] },
      { heading: 'Rechtsform und Registereintrag', paragraphs: ['Fa. Kupke-Tuning ist ein Einzelunternehmen.'] },
      { heading: 'Aufsichtsbehörde / Kammerzugehörigkeit', paragraphs: ['Zuständige IHK: IHK Südwestsachsen Chemnitz-Plauen-Zwickau', 'Thomas Kupke, Kaltes Feld 19, 08468 Heinsdorfergrund'] },
      { heading: 'Verbraucherstreitbeilegung', paragraphs: ['Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).'] },
      { heading: 'Haftung für Inhalte', paragraphs: ['Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.'] },
      { heading: 'Haftung für Links', paragraphs: ['Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'] },
      { heading: 'Urheberrecht', paragraphs: ['Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung der Inhaberin. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie dennoch auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.'] },
      { heading: 'Stand', paragraphs: ['August 2026'] },
    ],
  },
  agb: {
    slug: 'agb',
    title: 'Allgemeine Geschäftsbedingungen',
    metaTitle: 'AGB – Allgemeine Geschäftsbedingungen',
    metaDescription: 'Allgemeine Geschäftsbedingungen (AGB) für Bestellungen bei Kupke Tuning.',
    sections: [
      { heading: 'Allgemeine Geschäftsbedingungen Fa. KupkeTuning – Inhaberin Nadezhda Kupke', paragraphs: [] },
      { heading: '§ 1 Geltungsbereich, Anbieter, Begriffsbestimmungen', paragraphs: [
        '(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge über die Lieferung von Waren, die über den Online-Shop unter www.kupketuning.de zwischen Fa. KupkeTuning, Inhaberin Nadezhda Kupke, Kaltes Feld 19, 08468 Heinsdorfergrund, Telefon: 0172 6005435, E-Mail: shop@kupketuning.de (nachfolgend „Verkäuferin") und dem Besteller (nachfolgend „Kunde") geschlossen werden.',
        '(2) Maßgeblich ist die zum Zeitpunkt der Bestellung gültige Fassung dieser AGB. Der Kunde kann die AGB jederzeit auf der Website abrufen, speichern und ausdrucken.',
        '(3) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).',
        '(4) Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt (§ 14 BGB).',
        '(5) Abweichenden Geschäftsbedingungen des Kunden wird widersprochen. Sie werden nur Vertragsbestandteil, wenn die Verkäuferin ihrer Geltung ausdrücklich in Textform zugestimmt hat.',
        '(6) Individuelle Vereinbarungen zwischen der Verkäuferin und dem Kunden haben in jedem Fall Vorrang vor diesen AGB.',
      ] },
      { heading: '§ 2 Angebot und Vertragsschluss', paragraphs: [
        '(1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Abgabe einer Bestellung.',
        '(2) Durch Anklicken der Schaltfläche „Kostenpflichtig bestellen" gibt der Kunde ein verbindliches Angebot zum Abschluss eines Kaufvertrags über die im Warenkorb befindlichen Waren ab.',
        '(3) Vor Abgabe der Bestellung kann der Kunde seine Eingaben jederzeit über die üblichen Tastatur- und Mausfunktionen korrigieren. Sämtliche Eingaben werden vor verbindlicher Abgabe der Bestellung in einer Übersicht angezeigt und können dort nochmals geändert werden.',
        '(4) Die Verkäuferin bestätigt den Eingang der Bestellung unverzüglich per E-Mail. Diese Eingangsbestätigung stellt noch keine Annahme des Angebots dar.',
        '(5) Der Kaufvertrag kommt zustande, wenn die Verkäuferin das Angebot durch eine gesonderte Auftragsbestätigung in Textform annimmt oder die bestellte Ware versendet. Bei Zahlung per Kreditkarte oder PayPal kommt der Vertrag mit der Bestätigung der Zahlungsanweisung zustande.',
        '(6) Der Vertragstext wird von der Verkäuferin gespeichert. Die Bestelldaten sowie diese AGB werden dem Kunden mit der Bestellbestätigung in Textform übermittelt. Eine darüberhinausgehende Zugänglichmachung des Vertragstextes durch die Verkäuferin erfolgt nicht.',
        '(7) Die Vertragssprache ist ausschließlich Deutsch.',
      ] },
      { heading: '§ 3 Preise und Versandkosten', paragraphs: [
        '(1) Alle im Online-Shop angegebenen Preise sind Endpreise in Euro und enthalten die gesetzliche Umsatzsteuer in Höhe von derzeit 19 %.',
        '(2) Zusätzlich zu den angegebenen Preisen fallen Versandkosten an, sofern der Kunde nicht die Selbstabholung wählt. Die Höhe der Versandkosten wird dem Kunden im Bestellvorgang vor Abgabe der Bestellung deutlich mitgeteilt.',
        '(3) Bei Selbstabholung am Geschäftssitz der Verkäuferin entfallen die Versandkosten. Die Abholung ist nach vorheriger Terminvereinbarung möglich.',
        '(4) Die Verkäuferin stellt dem Kunden für jede Bestellung eine Rechnung aus, die dem Kunden in Textform übermittelt wird.',
      ] },
      { heading: '§ 4 Zahlungsbedingungen', paragraphs: [
        '(1) Die Zahlung erfolgt nach Wahl des Kunden über eine der im Bestellvorgang angebotenen Zahlungsarten: Kreditkarte (Abwicklung über den Zahlungsdienstleister Stripe), Vorkasse per Banküberweisung oder Barzahlung bei Selbstabholung.',
        '(2) Bei Zahlung per Kreditkarte oder PayPal erfolgt die Belastung des Kundenkontos mit Abschluss der Bestellung.',
        '(3) Bei Zahlung per Vorkasse ist der Rechnungsbetrag innerhalb von 7 Kalendertagen nach Vertragsschluss auf das in der Bestellbestätigung genannte Konto zu überweisen. Die Ware wird nach vollständigem Zahlungseingang versandt. Geht die Zahlung nicht innerhalb von 14 Kalendertagen nach Vertragsschluss ein, ist die Verkäuferin berechtigt, vom Vertrag zurückzutreten.',
        '(4) Gerät der Kunde mit einer Zahlung in Verzug, ist die Verkäuferin berechtigt, Verzugszinsen nach den gesetzlichen Bestimmungen zu verlangen. Die Geltendmachung eines weitergehenden Verzugsschadens bleibt vorbehalten.',
        '(5) Ein Recht zur Aufrechnung steht dem Kunden nur zu, wenn seine Gegenansprüche rechtskräftig festgestellt, unbestritten oder von der Verkäuferin anerkannt sind. Zur Ausübung eines Zurückbehaltungsrechts ist der Kunde nur befugt, soweit sein Gegenanspruch auf demselben Vertragsverhältnis beruht.',
      ] },
      { heading: '§ 5 Lieferung, Liefergebiet und Gefahrübergang', paragraphs: [
        '(1) Die Lieferung erfolgt ausschließlich innerhalb der Bundesrepublik Deutschland an die vom Kunden angegebene Lieferadresse. Eine Lieferung an Adressen außerhalb Deutschlands ist nicht möglich.',
        '(2) Der Versand erfolgt über den Versanddienstleister Hermes. Die Lieferzeit beträgt zwischen 3 bis 5 Werktage für vorrätige Artikel.',
        '(3) Sofern in der Artikelbeschreibung nicht abweichend angegeben, beträgt die Lieferfrist für vorrätige Artikel 5 Werktage ab Vertragsschluss, bei Zahlung per Vorkasse 5 Werktage ab Zahlungseingang.',
        '(4) Die Verfügbarkeit der einzelnen Artikel ist in der jeweiligen Produktbeschreibung angegeben. Ist ein bestellter Artikel nicht verfügbar, informiert die Verkäuferin den Kunden unverzüglich. Bereits geleistete Zahlungen werden in diesem Fall unverzüglich erstattet.',
        '(5) Teillieferungen sind zulässig, soweit dies für den Kunden zumutbar ist. Durch Teillieferungen entstehende Mehrkosten trägt die Verkäuferin. Für Verbraucher gilt: Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht erst mit Übergabe der Ware an den Kunden über. Für Unternehmer gilt abweichend: Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware sowie die Verzögerungsgefahr gehen bereits mit Auslieferung der Ware an den Versanddienstleister über.',
      ] },
      { heading: '§ 6 Eigentumsvorbehalt', paragraphs: [
        '(1) Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises Eigentum der Verkäuferin.',
        '(2) Gegenüber Unternehmern behält sich die Verkäuferin das Eigentum an der Ware darüber hinaus bis zum Ausgleich aller offenen Forderungen aus der laufenden Geschäftsbeziehung vor.',
        '(3) Der Kunde ist verpflichtet, die Ware pfleglich zu behandeln, solange das Eigentum noch nicht auf ihn übergegangen ist.',
      ] },
      { heading: '§ 7 Mängelhaftung (Gewährleistung)', paragraphs: [
        '(1) Es gelten die gesetzlichen Bestimmungen des Mängelhaftungsrechts, soweit nachfolgend nichts Abweichendes bestimmt ist.',
        '(2) Die Verkäuferin vertreibt ausschließlich Neuwaren. Ein Verkauf gebrauchter Waren findet nicht statt. Für Verbraucher gilt: Die Verjährungsfrist für Mängelansprüche beträgt zwei Jahre ab Ablieferung der Ware. Für Unternehmer gilt abweichend: Die Verjährungsfrist für Mängelansprüche beträgt ein Jahr ab Ablieferung der Ware. Ergänzend gilt die kaufmännische Untersuchungs- und Rügepflicht nach § 377 HGB. Unterlässt der Unternehmer die ordnungsgemäße Untersuchung und Mängelanzeige, gilt die Ware als genehmigt. Diese Verkürzungen gelten nicht bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, bei Vorsatz oder grober Fahrlässigkeit, bei arglistig verschwiegenen Mängeln sowie bei Übernahme einer Beschaffenheitsgarantie.',
        '(3) Kein Mangel liegt vor, wenn ein Schaden auf unsachgemäßem Einbau, unsachgemäßer Behandlung, natürlicher Abnutzung, Überbeanspruchung oder auf einer Verwendung im Rennsport- bzw. Wettbewerbseinsatz beruht, sofern das Bauteil hierfür nicht ausdrücklich bestimmt ist.',
        '(4) Bauteile, die bestimmungsgemäß im Motorsport eingesetzt werden, unterliegen einer erheblich verkürzten Lebensdauer. Ein hierauf zurückzuführender Verschleiß stellt keinen Sachmangel dar.',
        '(5) Werden Waren mit offensichtlichen Transportschäden angeliefert, soll der Kunde diese unverzüglich beim Versanddienstleister reklamieren und die Verkäuferin informieren. Die Unterlassung ändert nichts an den gesetzlichen Mängelansprüchen des Kunden, hilft der Verkäuferin jedoch, eigene Ansprüche gegenüber dem Versanddienstleister geltend zu machen.',
      ] },
      { heading: '§ 8 Technische Hinweise, Betriebserlaubnis und Verantwortung des Kunden', paragraphs: [
        '(1) Die Verkäuferin vertreibt sowohl Bauteile, die für den Betrieb im öffentlichen Straßenverkehr bestimmt sind, als auch Bauteile, die ausschließlich für den Einsatz im Motorsport außerhalb des öffentlichen Straßenverkehrs vorgesehen sind.',
        '(2) In der jeweiligen Produktbeschreibung ist ausgewiesen, welcher Kategorie ein Bauteil angehört und ob für dieses ein Gutachten vorliegt.',
        '(3) Der Einbau von Bauteilen, die nicht für den öffentlichen Straßenverkehr zugelassen sind, führt gemäß § 19 Abs. 2 StVZO zum Erlöschen der Betriebserlaubnis des Fahrzeugs. Damit entfällt regelmäßig auch der Versicherungsschutz.',
        '(4) Sofern für ein Bauteil ein Teilegutachten vorliegt, ist nach dem Einbau eine Abnahme durch eine amtlich anerkannte Prüforganisation und eine Eintragung in die Fahrzeugpapiere erforderlich. Die Verkäuferin liefert das Gutachten mit dem Bauteil aus.',
        '(5) Die Verantwortung für den fachgerechten Einbau sowie für die Einhaltung der straßenverkehrsrechtlichen Vorschriften liegt beim Kunden bzw. beim Fahrzeughalter. Die Verkäuferin schuldet keine Prüfung der Zulässigkeit des Einbaus im konkreten Fahrzeug.',
        '(6) Die Verkäuferin empfiehlt ausdrücklich, den Einbau sicherheitsrelevanter Bauteile – insbesondere an Bremse, Fahrwerk und Karosserie – durch eine qualifizierte Fachwerkstatt vornehmen zu lassen.',
      ] },
      { heading: '§ 9 Haftung', paragraphs: [
        '(1) Die Verkäuferin haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.',
        '(2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) haftet die Verkäuferin der Höhe nach begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Wesentliche Vertragspflichten sind solche Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf.',
        '(3) Im Übrigen ist die Haftung der Verkäuferin für leicht fahrlässig verursachte Schäden ausgeschlossen.',
        '(4) Die Haftung nach dem Produkthaftungsgesetz sowie bei Übernahme einer Beschaffenheitsgarantie bleibt unberührt.',
        '(5) Soweit die Haftung der Verkäuferin ausgeschlossen oder beschränkt ist, gilt dies auch für die persönliche Haftung ihrer Mitarbeiter, Vertreter und Erfüllungsgehilfen.',
      ] },
      { heading: '§ 10 Widerrufsrecht', paragraphs: [
        '(1) Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die Einzelheiten ergeben sich aus der gesonderten Widerrufsbelehrung, die dem Kunden vor Abgabe der Bestellung sowie mit der Bestellbestätigung in Textform zur Verfügung gestellt wird.',
        '(2) Unternehmern steht kein Widerrufsrecht zu.',
        '(3) Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB).',
        '(4) Die unmittelbaren Kosten der Rücksendung im Widerrufsfall trägt der Kunde.',
      ] },
      { heading: '§ 11 Datenschutz', paragraphs: [
        'Die Verarbeitung personenbezogener Daten erfolgt ausschließlich nach Maßgabe der gesetzlichen Bestimmungen, insbesondere der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG). Einzelheiten ergeben sich aus der gesondert abrufbaren Datenschutzerklärung.',
      ] },
      { heading: '§ 12 Verbraucherstreitbeilegung', paragraphs: [
        'Die Verkäuferin ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch verpflichtet (§ 36 VSBG).',
      ] },
      { heading: '§ 13 Schlussbestimmungen', paragraphs: [
        '(1) Auf Verträge zwischen der Verkäuferin und dem Kunden findet das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts Anwendung. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als dadurch der durch zwingende Bestimmungen des Rechts des Staates des gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird.',
        '(2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis der Geschäftssitz der Verkäuferin.',
        '(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.',
      ] },
      { heading: 'Stand', paragraphs: ['August 2026'] },
    ],
  },
  widerruf: {
    slug: 'widerruf',
    title: 'Widerrufsbelehrung',
    metaTitle: 'Widerrufsbelehrung & Widerrufsrecht',
    metaDescription: 'Informationen zum Widerrufsrecht und zur Widerrufsbelehrung bei Kupke Tuning.',
    sections: [
      { heading: 'Widerrufsrecht für Verbraucher', paragraphs: [
        'Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB). Unternehmern im Sinne des § 14 BGB steht ein Widerrufsrecht nicht zu.',
        'Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat.',
        'Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — Fa. KupkeTuning, Inhaberin Nadezhda Kupke, Kaltes Feld 19, 08468 Heinsdorfergrund, Telefon: 0172 6005435, E-Mail: shop@kupketuning.de — mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.',
        'Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.',
      ] },
      { heading: 'Folgen des Widerrufs', paragraphs: [
        'Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.',
        'Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.',
        'Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.',
        'Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.',
      ] },
      { heading: 'Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts', paragraphs: [
        'Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB).',
      ] },
      { heading: 'Muster-Widerrufsformular', paragraphs: [
        '(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)',
        'An: Fa. KupkeTuning, Nadezhda Kupke, Kaltes Feld 19, 08468 Heinsdorfergrund, E-Mail: shop@kupketuning.de',
        'Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*): ______________________________________',
        'Bestellt am (*) / erhalten am (*): ______________________________________',
        'Name des/der Verbraucher(s): ______________________________________',
        'Anschrift des/der Verbraucher(s): ______________________________________',
        'Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier), Datum: ______________________________________',
        '(*) Unzutreffendes streichen.',
      ] },
      { heading: 'Stand', paragraphs: ['August 2026'] },
    ],
  },
  datenschutz: {
    slug: 'datenschutz',
    title: 'Datenschutzerklärung',
    metaTitle: 'Datenschutzerklärung',
    metaDescription: 'Datenschutzerklärung von Kupke Tuning gemäß DSGVO.',
    sections: [
      { heading: '1. Verantwortlicher', paragraphs: [
        'Verantwortlich für die Datenverarbeitung auf dieser Website ist: Fa. KupkeTuning, Inhaberin: Nadezhda Kupke, Kaltes Feld 19, 08468 Heinsdorfergrund, Telefon: 0172 6005435, E-Mail: shop@kupketuning.de.',
        'Ein Datenschutzbeauftragter ist gesetzlich nicht bestellt, da die Voraussetzungen des § 38 BDSG nicht erfüllt sind.',
      ] },
      { heading: '2. Allgemeines zur Datenverarbeitung', paragraphs: [
        'Wir verarbeiten personenbezogene Daten grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung der betroffenen Person oder wenn eine Rechtsvorschrift die Verarbeitung gestattet.',
        'Rechtsgrundlagen der Verarbeitung sind je nach Verarbeitungsvorgang: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen), Art. 6 Abs. 1 lit. c DSGVO (Erfüllung rechtlicher Verpflichtungen) und Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).',
      ] },
      { heading: '3. Hosting und Bereitstellung der Website (Server-Logfiles)', paragraphs: [
        'Beim Aufruf unserer Website werden automatisch Informationen erfasst, die Ihr Browser übermittelt: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse.',
        'Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der technisch fehlerfreien Darstellung und der Sicherheit unserer Website.',
        'Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt.',
      ] },
      { heading: '4. Cookies und Einwilligungsverwaltung', paragraphs: [
        'Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Technisch notwendige Cookies sind für den Betrieb der Website erforderlich, insbesondere zur Speicherung des Warenkorbs und zur Aufrechterhaltung der Sitzung. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. f DSGVO.',
        'Alle darüberhinausgehenden Cookies werden nur mit Ihrer vorherigen Einwilligung gesetzt (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über den Link „Cookie-Einstellungen" im Footer widerrufen oder anpassen.',
      ] },
      { heading: '5. Kontaktaufnahme', paragraphs: [
        'Kontaktformular: Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular einschließlich der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Die Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung widerrufen oder der Zweck für die Datenspeicherung entfällt. Zwingende gesetzliche Aufbewahrungsfristen bleiben unberührt.',
        'Anfrage per E-Mail oder Telefon: Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Es gelten die vorstehenden Rechtsgrundlagen entsprechend.',
      ] },
      { heading: '6. Bestellabwicklung im Online-Shop', paragraphs: [
        'Zur Abwicklung Ihrer Bestellung verarbeiten wir folgende Daten: Vor- und Nachname, gegebenenfalls Firmenname, Rechnungs- und Lieferanschrift, E-Mail-Adresse, Telefonnummer (sofern angegeben), Bestell- und Zahlungsdaten.',
        'Die Verarbeitung erfolgt zur Erfüllung des Kaufvertrags auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Eine Weitergabe Ihrer Daten erfolgt ausschließlich an die zur Vertragsabwicklung erforderlichen Stellen, insbesondere an den Versanddienstleister, den Zahlungsdienstleister sowie – im Rahmen der steuerlichen Pflichten – an das Steuerbüro. Rechnungsdaten unterliegen den handels- und steuerrechtlichen Aufbewahrungsfristen und werden entsprechend für die Dauer von zehn Jahren aufbewahrt (§ 147 AO, § 257 HGB).',
      ] },
      { heading: '7. Zahlungsdienstleister', paragraphs: [
        'Stripe: Bei Zahlung per Kreditkarte werden die Zahlungsdaten an die Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland, übermittelt. Die Übermittlung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung des Vertrags. Stripe kann Daten an die Stripe, Inc. in den Vereinigten Staaten übermitteln. Die Absicherung des Drittlandtransfers erfolgt über die Standardvertragsklauseln der Europäischen Kommission. Weitere Informationen finden Sie in der Datenschutzerklärung von Stripe unter: https://stripe.com/de/privacy',
        'Zahlung per Banküberweisung: Bei Zahlung per Vorkasse werden Ihre Zahlungsdaten im Rahmen des Zahlungsverkehrs an das kontoführende Kreditinstitut übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      ] },
      { heading: '8. Versandabwicklung', paragraphs: [
        'Sendcloud: Zur Erstellung von Versandetiketten und zur Abwicklung des Versands nutzen wir die Dienste der Sendcloud B.V., Stadhuisplein 10, 5611 EM Eindhoven, Niederlande. Übermittelt werden Name, Lieferanschrift, E-Mail-Adresse und Telefonnummer, soweit dies für die Zustellung erforderlich ist. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
        'Hermes: Der Versand erfolgt über die Hermes Germany GmbH, Essener Straße 89, 22419 Hamburg. Zur Zustellung übermitteln wir Name und Lieferanschrift sowie – sofern angegeben – E-Mail-Adresse und Telefonnummer zur Versandbenachrichtigung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      ] },
      { heading: '9. Versand von Transaktions-E-Mails', paragraphs: [
        'Für den Versand von Bestellbestätigungen, Rechnungen und Versandbenachrichtigungen nutzen wir den Dienst Resend. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung des Vertrags.',
      ] },
      { heading: '10. Newsletter', paragraphs: [
        'Wenn Sie unseren Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Die Anmeldung erfolgt im Double-Opt-In-Verfahren: Nach Ihrer Anmeldung erhalten Sie eine E-Mail, in der Sie Ihre Anmeldung bestätigen müssen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung jederzeit widerrufen, etwa über den Abmeldelink in jedem Newsletter. Die Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.',
      ] },
      { heading: '11. Soziale Medien', paragraphs: [
        'Wir unterhalten ein Profil im sozialen Netzwerk Instagram (Meta Platforms Ireland Ltd., 4 Grand Canal Square, Dublin 2, Irland). Auf unserer Website verlinken wir lediglich auf dieses Profil. Es werden keine Inhalte von Instagram eingebettet und keine Daten an Instagram übertragen, solange Sie den Link nicht aktiv anklicken. Erst beim Anklicken werden Sie auf die Seiten des Anbieters weitergeleitet, wo dessen Datenschutzbestimmungen gelten.',
      ] },
      { heading: '12. Speicherdauer', paragraphs: [
        'Wir verarbeiten und speichern personenbezogene Daten nur so lange, wie dies zur Erreichung des Speicherzwecks erforderlich ist oder soweit gesetzliche Aufbewahrungsfristen dies vorsehen. Nach Wegfall des Zwecks bzw. Ablauf der Fristen werden die entsprechenden Daten routinemäßig gelöscht oder gesperrt.',
      ] },
      { heading: '13. Ihre Rechte als betroffene Person', paragraphs: [
        'Ihnen stehen nach der DSGVO folgende Rechte zu: Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO), Berichtigung unrichtiger Daten (Art. 16 DSGVO), Löschung Ihrer Daten, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch gegen die Verarbeitung (Art. 21 DSGVO) und Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO). Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die oben genannten Kontaktdaten.',
        'Widerspruchsrecht nach Art. 21 DSGVO: Sofern die Datenverarbeitung auf Grundlage berechtigter Interessen nach Art. 6 Abs. 1 lit. f DSGVO erfolgt, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen diese Verarbeitung Widerspruch einzulegen. Werden Ihre Daten zum Zwecke der Direktwerbung verarbeitet, haben Sie das Recht, jederzeit und ohne Angabe von Gründen Widerspruch einzulegen. Ihre Daten werden dann nicht mehr für diese Zwecke verwendet.',
        'Beschwerderecht bei der Aufsichtsbehörde: Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für uns ist: Die Sächsische Datenschutzbeauftragte, Devrientstraße 5, 01067 Dresden, Telefon: 0351 85471-101, E-Mail: saechsdsb@slt.sachsen.de.',
      ] },
      { heading: '14. Änderungen dieser Datenschutzerklärung', paragraphs: [
        'Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen, etwa bei der Einführung neuer Dienste. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.',
      ] },
      { heading: 'Stand', paragraphs: ['August 2026'] },
    ],
  },
  batterieverordnung: {
    slug: 'batterieverordnung',
    title: 'Hinweise zur Batterieverordnung',
    metaTitle: 'Hinweise zur Batterieverordnung (BattG)',
    metaDescription: 'Pflichthinweise zur Rücknahme und Entsorgung von Batterien nach dem Batteriegesetz.',
    sections: [
      { heading: 'Rücknahme von Altbatterien', paragraphs: [PLACEHOLDER] },
      { heading: 'Bedeutung der Symbole', paragraphs: [PLACEHOLDER] },
    ],
  },
  verpackungsverordnung: {
    slug: 'verpackungsverordnung',
    title: 'Hinweise zum Verpackungsgesetz',
    metaTitle: 'Hinweise zum Verpackungsgesetz (VerpackG)',
    metaDescription: 'Informationen zu unseren Pflichten nach dem Verpackungsgesetz (VerpackG).',
    sections: [
      { heading: 'Verpackungsgesetz (VerpackG)', paragraphs: [PLACEHOLDER] },
    ],
  },
  'ueber-uns': {
    slug: 'ueber-uns',
    title: 'Über uns — Kupke Tuning seit 1995',
    metaTitle: 'Über uns – Kupke Tuning seit 1995',
    metaDescription: 'Die Geschichte von Kupke Tuning: Trabant-Tuning und Motorsport aus Heinsdorfergrund seit 1995.',
    sections: [
      { heading: 'Unsere Geschichte', paragraphs: ['[Platzhalter für Firmengeschichte] – Kupke Tuning steht seit 1995 für hochwertige Trabant-Ersatzteile und Motorsport-Eigenentwicklungen.', PLACEHOLDER] },
      { heading: 'Motorsport im Blut', paragraphs: [PLACEHOLDER] },
      { heading: 'Eigenentwicklung & Fertigung', paragraphs: [PLACEHOLDER] },
    ],
  },
  dekra: {
    slug: 'dekra',
    title: 'DEKRA-geprüfte Qualität',
    metaTitle: 'DEKRA-geprüfte Qualität',
    metaDescription: 'Was bedeutet DEKRA-geprüft bei Kupke Tuning? Antworten rund um Prüfung und Zulassung unserer Teile.',
    faq: [
      { q: 'Warum wir prüfen lassen', a: 'Motorsporttechnik im Straßenverkehr steht und fällt mit einer Frage: Ist das Bauteil zulassungsfähig? Ein Fahrwerk, das auf der Rennstrecke funktioniert, ist damit noch nicht automatisch für den öffentlichen Straßenverkehr geeignet. Genau hier setzen wir an. Seit vielen Jahren lassen wir Bauteile aus unserer Fertigung durch die DEKRA prüfen. Diese Prüfungen sind aufwendig und kostspielig — sie sind für uns aber die Grundlage dafür, dass unsere Kunden ihre Fahrzeuge legal auf der Straße bewegen können.' },
      { q: 'Was bedeutet „DEKRA-geprüft" bei uns konkret?', a: 'Für einen Teil unserer Produkte liegen Gutachten der DEKRA vor. Diese Gutachten dokumentieren, dass das jeweilige Bauteil unter definierten Bedingungen geprüft wurde. Bei jedem Produkt, für das ein solches Gutachten vorliegt, ist dies in der Produktbeschreibung ausgewiesen. Wir weisen ausdrücklich darauf hin, dass es sich nicht um eine Zertifizierung durch die DEKRA handelt, sondern um Prüfgutachten für einzelne Bauteile.' },
      { q: 'Brauche ich nach dem Einbau noch eine Abnahme?', a: 'Ja. Liegt ein Teilegutachten nach § 19 Abs. 3 StVZO vor, ist nach dem Einbau eine Abnahme durch eine amtlich anerkannte Prüforganisation (z. B. DEKRA, TÜV, GTÜ) erforderlich. Die Änderung wird anschließend in die Fahrzeugpapiere eingetragen. Das Gutachten liefern wir mit dem Bauteil aus. Bitte bewahren Sie es auf und legen Sie es bei der Abnahme vor.' },
      { q: 'Gilt das für alle Produkte im Shop?', a: 'Nein. Unser Sortiment umfasst sowohl geprüfte Bauteile als auch Teile, die ausschließlich für den Motorsport bestimmt sind. Produkte, die ausdrücklich für den Renneinsatz vorgesehen sind, verfügen in der Regel über keine Zulassung für den öffentlichen Straßenverkehr. Der Einbau solcher Teile führt zum Erlöschen der Betriebserlaubnis des Fahrzeugs. Bei jedem Produkt ist gekennzeichnet, welcher Kategorie es angehört. Im Zweifel sprechen Sie uns bitte vor der Bestellung an.' },
      { q: 'Was passiert, wenn ich ein Rennsportteil im Straßenverkehr verbaue?', a: 'Der Einbau nicht zugelassener Bauteile führt nach § 19 Abs. 2 StVZO zum Erlöschen der Betriebserlaubnis. Damit entfällt der Versicherungsschutz, und es drohen bußgeldrechtliche Konsequenzen. Die Verantwortung für die straßenverkehrsrechtliche Zulässigkeit des Einbaus liegt beim Fahrzeughalter. Wir beraten Sie gern im Vorfeld, können diese Prüfung aber nicht für Sie übernehmen.' },
      { q: 'Kann ich vor dem Kauf Fragen stellen?', a: 'Ja, und wir empfehlen das ausdrücklich. Gerade bei Umbauten an Bremse, Fahrwerk und Abgasanlage entscheidet die Fahrzeugkonfiguration darüber, welches Bauteil passt und was zulassungsrechtlich möglich ist. Sie erreichen uns telefonisch unter 0172 6005435 oder per E-Mail an shop@kupketuning.de.' },
      { q: 'Warum ist das ein Unterschied zu anderen Anbietern?', a: 'Viele Bauteile für Fahrzeuge dieser Baujahre stammen aus Kleinserienfertigung ohne dokumentierte Prüfung. Das kann funktionieren — nachweisbar ist es nicht. Wir haben uns bewusst für den anderen Weg entschieden: Prüfung dort, wo sie sinnvoll und möglich ist, und eine klare Kennzeichnung dort, wo ein Bauteil ausschließlich in den Motorsport gehört.' },
    ],
  },
};

export const staticPageBySlug = (slug) => STATIC_PAGES[slug];
