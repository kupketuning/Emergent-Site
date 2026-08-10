"""Kupke-Tuning Produktkatalog (abgeleitet aus kupketuning.de).
Beschreibungen sind eigene, praegnante Formulierungen in korrektem Deutsch.
Preise, die auf der Altseite fehlen, sind als None (=> "Preis auf Anfrage") gesetzt.
"""

IMG = {
    "hero_race": "https://images.unsplash.com/photo-1547025603-ef800f02690e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwzfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwY2FyfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85",
    "race2": "https://images.unsplash.com/photo-1560692830-04adc2f31119?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwyfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwY2FyfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85",
    "coilover1": "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxjb2lsb3ZlciUyMHN1c3BlbnNpb258ZW58MHx8fHwxNzg2MTk4OTA5fDA&ixlib=rb-4.1.0&q=85",
    "coilover2": "https://images.unsplash.com/photo-1760836395716-7dd00b71311a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxjb2lsb3ZlciUyMHN1c3BlbnNpb258ZW58MHx8fHwxNzg2MTk4OTA5fDA&ixlib=rb-4.1.0&q=85",
    "rollcage1": "https://images.unsplash.com/photo-1766801075615-362c19094d43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxyb2xsJTIwY2FnZSUyMGludGVyaW9yfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85",
    "rollcage2": "https://images.unsplash.com/photo-1766801075449-e23b25ac36df?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxyb2xsJTIwY2FnZSUyMGludGVyaW9yfGVufDB8fHx8MTc4NjE5ODkwOXww&ixlib=rb-4.1.0&q=85",
    "bucketseat": "https://images.unsplash.com/photo-1779263449928-575a82e73c53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxyYWNpbmclMjBidWNrZXQlMjBzZWF0fGVufDB8fHx8MTc4NjE5ODkxNnww&ixlib=rb-4.1.0&q=85",
    "steering": "https://images.unsplash.com/photo-1612805144400-88c7821bf36f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHN0ZWVyaW5nJTIwd2hlZWx8ZW58MHx8fHwxNzg2MTk4OTE2fDA&ixlib=rb-4.1.0&q=85",
    "engine": "https://images.unsplash.com/photo-1527383418406-f85a3b146499?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwyfHxjYXIlMjBlbmdpbmV8ZW58MHx8fHwxNzg2MTk4MDMwfDA&ixlib=rb-4.1.0&q=85",
    "carparts": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxjYXIlMjBwYXJ0c3xlbnwwfHx8fDE3ODYxOTgwMDZ8MA&ixlib=rb-4.1.0&q=85",
    "wheel1": "https://images.unsplash.com/photo-1623564493214-6137dff043ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxhbGxveSUyMHdoZWVsfGVufDB8fHx8MTc4NjE5ODAwN3ww&ixlib=rb-4.1.0&q=85",
    "wheel2": "https://images.unsplash.com/photo-1609950692056-bd02e61b5227?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwzfHxhbGxveSUyMHdoZWVsfGVufDB8fHx8MTc4NjE5ODAwN3ww&ixlib=rb-4.1.0&q=85",
    "brake1": "https://images.unsplash.com/photo-1588017530244-c57df911f73b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHw0fHxicmFrZSUyMHBhcnRzfGVufDB8fHx8MTc4NjE5ODAxN3ww&ixlib=rb-4.1.0&q=85",
    "brake2": "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxicmFrZSUyMHBhcnRzfGVufDB8fHx8MTc4NjE5ODAxN3ww&ixlib=rb-4.1.0&q=85",
    "exhaust1": "https://images.unsplash.com/photo-1691924216519-fe00a5a535ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxjYXIlMjBleGhhdXN0fGVufDB8fHx8MTc4NjE5ODAwN3ww&ixlib=rb-4.1.0&q=85",
    "exhaust2": "https://images.unsplash.com/photo-1572435759312-848041b1d659?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxjYXIlMjBleGhhdXN0fGVufDB8fHx8MTc4NjE5ODAwN3ww&ixlib=rb-4.1.0&q=85",
    "exhaust3": "https://images.unsplash.com/photo-1556783151-c6d5e7d296bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxjYXIlMjBleGhhdXN0fGVufDB8fHx8MTc4NjE5ODAwN3ww&ixlib=rb-4.1.0&q=85",
    "filter": "https://images.unsplash.com/photo-1588294020274-1e23a4815b72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxhaXIlMjBmaWx0ZXJ8ZW58MHx8fHwxNzg2MTk4MDE3fDA&ixlib=rb-4.1.0&q=85",
}

CATEGORIES = [
    {"id": "abgasanlagen", "name": "Abgasanlagen", "sub": ["Gruppe A", "Edelstahl-Auspuff", "Fächerkrümmer", "Schalldämpfer"]},
    {"id": "bremsen", "name": "Bremsen", "sub": ["GTI-Umbau", "Rennsport", "Stahlflex", "Bremsscheiben"]},
    {"id": "fahrwerke", "name": "Fahrwerke", "sub": ["Gewindefahrwerk", "Sportfahrwerk", "Tieferlegung", "Stoßdämpfer", "Zubehör"]},
    {"id": "raeder", "name": "Räder", "sub": ["Alufelgen", "Stahlfelgen", "Lochkreisumbau", "Spurverbreiterung", "Radbolzen"]},
    {"id": "sicherheit", "name": "Sicherheit", "sub": ["Überrollbügel", "Überrollkäfig", "Domstreben", "Versteifung"]},
    {"id": "tuning", "name": "Tuning", "sub": ["Ansaugung", "Luftfilter", "Getriebe", "Leistungssteigerung", "Nockenwellen", "Kühlung"]},
    {"id": "design", "name": "Design", "sub": ["Innenraum", "Zierteile"]},
    {"id": "motorsport", "name": "Motorsport", "sub": ["Schalensitze", "Lenkräder", "Sicherheitstechnik"]},
]


def p(art_nr, name, category, sub, brand, price, delivery, image, description, fahrzeug="Trabant 1.1 / 601", badge=None, featured=False):
    return {
        "art_nr": art_nr, "name": name, "category": category, "sub": sub, "brand": brand,
        "price": price, "delivery": delivery, "image": image, "description": description,
        "fahrzeug": fahrzeug, "badge": badge, "featured": featured,
    }


PRODUCTS = [
    # ---------------- ABGASANLAGEN ----------------
    p("KUTABGASGA11", "Edelstahl-Abgasanlage Gruppe A Trabant 1.1", "abgasanlagen", "Gruppe A", "Kupke-Tuning", None, "nach Absprache", IMG["exhaust1"],
      "Komplette Gruppe-A-Abgasanlage aus Edelstahl, speziell für den Trabant 1.1 entwickelt und gefertigt. Optimierter Strömungsverlauf für mehr Leistung und kräftigen Sound. Individuelle Ausführungen möglich.", "Trabant 1.1", "Eigenentwicklung", True),
    p("KUTFK11", "Fächerkrümmer Trabant 1.1", "abgasanlagen", "Fächerkrümmer", "Kupke-Tuning", None, "nach Absprache", IMG["exhaust3"],
      "Strömungsgünstiger Fächerkrümmer zur Reduzierung des Abgasgegendrucks. Ideal in Kombination mit einer Sportnockenwelle für spürbar mehr Leistung.", "Trabant 1.1", None, False),
    p("KUTAUS601", "Edelstahl-Sportauspuff Trabant 601", "abgasanlagen", "Edelstahl-Auspuff", "Kupke-Tuning", None, "nach Absprache", IMG["exhaust2"],
      "Handgefertigte Edelstahl-Auspuffanlage für den Trabant 601. Langlebig, korrosionsbeständig und mit sportlichem Klangbild.", "Trabant 601", None, False),

    # ---------------- BREMSEN ----------------
    p("KUTVWBRUSP601", "VW-GTI-Scheibenbremse Adaptersatz Trabant 601 (VA)", "bremsen", "GTI-Umbau", "Kupke-Tuning", None, "nach Absprache", IMG["brake2"],
      "Adaptersatz für den Umbau auf die VW-Golf-2-GTI-Scheibenbremse an der Vorderachse. Die Serienteile bringt der Kunde selbst mit. Es tritt keine Spurweitenvergrößerung auf.", "Trabant 601", None, False),
    p("KUTVWBRUSP601MAT", "VW-GTI-Scheibenbremse Komplettbausatz Trabant 601 (VA)", "bremsen", "GTI-Umbau", "Kupke-Tuning", None, "nach Absprache", IMG["brake2"],
      "Kompletter GTI-Scheibenbremsen-Bausatz inkl. Bremssättel, Bremssattelträger, Radnaben und Führungsbolzen. Deutlich mehr Bremskraft bei geringer Pedalkraft.", "Trabant 601", "Rennsport", True),
    p("KUTBVA11KPL", "Größere Bremsanlage Trabant 1.1 komplett", "bremsen", "GTI-Umbau", "Kupke-Tuning", None, "nach Absprache", IMG["brake1"],
      "VW-Bremsanlage für den Trabant 1.1 als Komplettbausatz inkl. Bremskraftverstärker. Rennsporterprobt, hervorragend dosierbar und standfest. Mit VVE-Prüfbericht.", "Trabant 1.1", "Rennsport", True),
    p("KUTBVA11", "Größere Bremsanlage Trabant 1.1 (Umbausatz)", "bremsen", "GTI-Umbau", "Kupke-Tuning", None, "nach Absprache", IMG["brake1"],
      "Kostengünstiger Umbausatz auf die größere VW-Bremsanlage im Trabant 1.1 – die Serien-VW-Teile werden selbst beigestellt.", "Trabant 1.1", None, False),
    p("KUTBKVU601", "VW-Bremskraftverstärker-Umbausatz Trabant 601", "bremsen", "GTI-Umbau", "Kupke-Tuning", None, "nach Absprache", IMG["brake1"],
      "Bremskraftverstärker-Umbau auf Golf-Basis für den Trabant 601. Nur in Verbindung mit der VW-Vorderachs-Scheibenbremse zulässig – maximale Motorsport-Performance.", "Trabant 601", None, False),
    p("KUTZR353BRA", "Wartburg-Trommelbremse VA Zentrierringe Trabant 601", "bremsen", "Rennsport", "Kupke-Tuning", None, "nach Absprache", IMG["brake1"],
      "Zentrierringe für den bewährten Umbau der großen Wartburg-Trommelbremse an der Vorderachse. Aus hochfestem Aluminium, im Rennsport über Jahrzehnte bewährt.", "Trabant 601", None, False),
    p("KUTSFBS601", "Edelstahl-Stahlflex-Bremsschläuche Trabant 601 (4-teilig)", "bremsen", "Stahlflex", "Kupke-Tuning", None, "1-2 Wochen", IMG["brake1"],
      "Edelstahl-Teflon-Stahlflexschläuche für einen festen Druckpunkt und präzises Bremsgefühl. 4-teiliger Satz.", "Trabant 601", None, False),
    p("KUTSFBS11", "Stahlflex-Bremsschläuche Trabant 1.1 (4-teilig)", "bremsen", "Stahlflex", "Kupke-Tuning", None, "1-2 Wochen", IMG["brake1"],
      "4-teiliger Stahlflex-Bremsschlauchsatz für den Trabant 1.1 – direkter Druckpunkt, TÜV-geprüft.", "Trabant 1.1", None, False),
    p("KUTBSR20", "Rennsport-Bremsscheibe geschlitzt/gelocht 239x20", "bremsen", "Bremsscheiben", "Kupke-Tuning", None, "1-2 Wochen", IMG["brake1"],
      "Innenbelüftete Rennsport-Bremsscheibe (239x20 mm), geschlitzt und gelocht für beste Wärmeabfuhr – ideal in Kombination mit Ferrodo DS2000.", "Trabant 1.1", None, False),
    p("KUTBBFE", "Ferrodo DS2000 Rennsport-Bremsbelag", "bremsen", "Rennsport", "Ferrodo", None, "1-2 Wochen", IMG["brake2"],
      "Hochleistungs-Bremsbelag Ferrodo DS2000 für konstante Bremsleistung ohne Fading im harten Renneinsatz. Mit TÜV.", "Trabant 1.1", None, False),
    p("KUTMKRB", "Mehrkolben-Rennbremsanlage 14–17 Zoll", "bremsen", "Rennsport", "Kupke-Tuning", None, "nach Absprache", IMG["brake2"],
      "4- oder 6-Kolben-Rennbremsanlage inkl. belüfteter Scheiben und Adapter. Enorme Bremskraft, kein Fading, kein Aufkochen – Einzelabnahme möglich.", "Trabant 1.1", "Motorsport", False),

    # ---------------- FAHRWERKE ----------------
    p("KUTFW113535KR", "KONI Komplett-Sportfahrwerk Trabant 1.1 (35/35, KONI-Rot)", "fahrwerke", "Sportfahrwerk", "KONI", None, "nach Absprache", IMG["coilover1"],
      "Komplettes Sportfahrwerk mit 2 KONI-Sportdämpfern vorn (Zugstufe verstellbar), 2 Öldämpfern hinten und 4 Tieferlegungsfedern (35/35 mm). Lebenslange KONI-Garantie in Verbindung mit dem Kupke-Domdrucklager.", "Trabant 1.1", "Exclusiv", True),
    p("KUTSF1-R", "KUPKE Gewindefahrwerk Trabant 1.1 Typ 1 (KONI-Rot)", "fahrwerke", "Gewindefahrwerk", "KONI", None, "nach Absprache", IMG["coilover1"],
      "Das sportlichste Gewindefahrwerk für den Trabant 1.1 – eine Eigenentwicklung von Kupke-Tuning. Stufenlose Höhenverstellung, KONI-Rot-Dämpfer, alltags- und rennstreckentauglich.", "Trabant 1.1", "Eigenentwicklung", True),
    p("KUTSF3-HA", "Gewinde-Fahrwerk Hinterachse Trabant 1.1 / 601", "fahrwerke", "Gewindefahrwerk", "Kupke-Tuning", None, "nach Absprache", IMG["coilover2"],
      "Gewinde-Federbeine für die Schraubenfeder-Hinterachse. Komfortable, tiefe Ausführung mit stufenloser Höhenverstellung (0–75 mm).", "Trabant 1.1 / 601", None, False),
    p("KUTTL11HA35", "Tieferlegungsfedern 35 mm Hinterachse Trabant 1.1 / 601", "fahrwerke", "Tieferlegung", "Kupke-Tuning", None, "1-2 Wochen", IMG["coilover2"],
      "Speziell für den Trabant ausgelegte Tieferlegungsfedern (35 mm HA), kugelgestrahlt und pulverbeschichtet. Deutlich sportlicheres Fahrverhalten.", "Trabant 1.1 / 601", None, False),
    p("KUTSF4011HA", "Tieferlegungsfedernsatz 40 mm HA (Durchmesser 80 mm)", "fahrwerke", "Tieferlegung", "Kupke-Tuning", None, "1-2 Wochen", IMG["coilover2"],
      "Federsystem mit kleinerem Außendurchmesser (80 mm) für mehr Freigang bei Sonderrädern. 40 mm Tieferlegung inkl. Federtellern.", "Trabant 1.1 / 601", None, False),
    p("KUTSD601", "KONI-Sportdämpfer Trabant 601 (Blattfeder)", "fahrwerke", "Stoßdämpfer", "KONI", None, "1-2 Wochen", IMG["coilover1"],
      "KONI-Rot-Sportdämpfer für den Trabant 601 mit Blattfeder-Aufbau. Kolbenstange gekürzt, Zugstufe 30% härter und nachstellbar.", "Trabant 601", None, False),
    p("KUT9701", "Kupke-Domdrucklager (Satz, 2 Stück)", "fahrwerke", "Zubehör", "Kupke-Tuning", None, "1-2 Tage", IMG["carparts"],
      "Kombiniertes Dom- und Drucklager – deutlich geringere Lenkkräfte und weniger Dämpferverschleiß. Voraussetzung für die KONI-Garantie.", "Trabant 1.1", None, False),
    p("KUT9701-3", "Sport-Domdrucklager exzentrisch (Rennsport)", "fahrwerke", "Zubehör", "Kupke-Tuning", None, "nach Absprache", IMG["carparts"],
      "Aluminium-Rennsport-Domlager mit Sturzverstellung für den harten Einsatz. Fest im Federdom sitzend mit Spezial-Rennsportlager.", "Trabant 1.1", "Motorsport", False),
    p("KUT95012", "Sturzkorrektur Hinterachse Trabant 601 / 1.1", "fahrwerke", "Zubehör", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "Verbesserte Sturzkorrektur für volle Reifenauflage: gleichmäßiger Reifenverschleiß, höhere Kurvengeschwindigkeiten und bessere Straßenlage. Mit Herstellernachweis.", "Trabant 601 / 1.1", None, False),
    p("KUTFWBVA30", "Federwegbegrenzer-Satz 30 mm", "fahrwerke", "Zubehör", "Kupke-Tuning", None, "1-2 Tage", IMG["carparts"],
      "Federwegbegrenzer verhindern das Aufschlagen der Karosserie bei tiefergelegten Fahrzeugen. Benzin-, öl- und witterungsbeständig.", "Trabant 1.1 / 601", None, False),

    # ---------------- RAEDER ----------------
    p("KUTALU1", "ALU-Felge Typ 1 – 5,5x13 Trabant 1.1", "raeder", "Alufelgen", "Kupke-Tuning", 74.14, "3-5 Tage", IMG["wheel1"],
      "Leichtmetallfelge Typ 1 in 5,5x13 ET24, Lochkreis 4/98, max. Bereifung 185/65. Mit TÜV-Gutachten für Trabant 1.1.", "Trabant 1.1", None, True),
    p("KUTSSF1", "Mattig-Stahl-Sportfelge 6x13 Trabant 1.1", "raeder", "Stahlfelgen", "Mattig", 81.30, "3-5 Tage", IMG["wheel1"],
      "Mattig-Stahl-Sportfelge 6x13 ET30, Lochkreis 4/98 und 4/100. Optional mit Mittenabdeckung oder in verchromter Ausführung.", "Trabant 1.1", None, False),
    p("RHTOPLINE11", "RH-Topline Alufelge 6x14 Trabant 1.1", "raeder", "Alufelgen", "RH", None, "nach Absprache", IMG["wheel2"],
      "RH-Topline-Leichtmetallfelge 6x14, silber mit poliertem Horn, Lochkreis 4/100. Auf Wunsch als Komplettrad mit Markenreifen 185/50 R14.", "Trabant 1.1", "Neu", True),
    p("RHCUPRAD11", "RH-CUPRAD Alufelge 6x14 Trabant 1.1", "raeder", "Alufelgen", "RH", None, "nach Absprache", IMG["wheel2"],
      "Sportliche RH-CUPRAD-Felge 6x14, silber, Lochkreis 4/100 – auch als Komplettrad erhältlich.", "Trabant 1.1", "Neu", False),
    p("BORBETE11", "BORBET Design E Alufelge 6x14 Trabant 1.1", "raeder", "Alufelgen", "BORBET", None, "nach Absprache", IMG["wheel1"],
      "BORBET Design-E-Leichtmetallfelge 6x14, silber mit poliertem Horn, Lochkreis 4/98 und 4/100.", "Trabant 1.1", "Neu", True),
    p("KUT95015", "Lochkreis-Adapterplatten 4/160 auf 4/100 (Satz)", "raeder", "Lochkreisumbau", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "CNC-gefertigte Adapterplatten (Satz je Achse) zur Lochkreisreduzierung des Trabant 601 auf 4/100 mit M12x1,5 – breitere Optik und bessere Straßenlage.", "Trabant 601", None, False),
    p("95030", "Lochkreisumbau Trabant 1.1 auf 4/100 (VW/Opel)", "raeder", "Lochkreisumbau", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "Umbau des Trabant 1.1 auf den VW-/Opel-Lochkreis 4/100 (M12x1,5) durch geänderte Bremstrommeln und Radmitnehmer – enorme Felgenauswahl.", "Trabant 1.1", None, False),
    p("KUTSV49820", "Spurverbreiterung Trabant 1.1 – 20 mm/Achse", "raeder", "Spurverbreiterung", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "Aluminium-Spurverbreiterung 20 mm pro Achse (Lochkreis 4/98). Mit Mustergutachten – für breitere Optik und satte Straßenlage.", "Trabant 1.1", None, False),
    p("KUT95031S", "Rendelbolzen-Satz (16 Stück)", "raeder", "Radbolzen", "Kupke-Tuning", None, "1-2 Tage", IMG["carparts"],
      "Satz Rendelbolzen (50 mm) für die sichere Montage von Spurverbreiterungen und Aluminiumrädern.", "Trabant 601 / 1.1", None, False),

    # ---------------- SICHERHEIT ----------------
    p("KUTUEB601ST", "Überrollbügel Stahl ST52 Trabant 601 / 1.1", "sicherheit", "Überrollbügel", "Heigo/Wiechers/Matter", None, "bis zu 3 Monate", IMG["rollcage2"],
      "Überrollbügel aus Stahl ST52 (40x2 mm) komplett mit Befestigungsplatten und Schrauben. Passend für Trabant 601 und 1.1.", "Trabant 601 / 1.1", "Sicherheit", False),
    p("KUTUEK601CR", "Überrollkäfig Chromstahl (Motorsport, ONS)", "sicherheit", "Überrollkäfig", "Heigo/Wiechers/Matter", None, "bis zu 3 Monate", IMG["rollcage1"],
      "Überrollkäfig aus Chromstahl (Cromo 4) für den Renneinsatz – einzeln gefertigt und mit ONS-Zertifikat. Maximaler Insassenschutz.", "Trabant 601 / 1.1", "Motorsport", True),
    p("KUTFS601ST", "Flankenschutz herausnehmbar Stahl", "sicherheit", "Überrollkäfig", "Heigo/Wiechers/Matter", None, "bis zu 3 Monate", IMG["rollcage1"],
      "Herausnehmbarer Flankenschutz aus Stahl zur Erweiterung von Bügel und Käfig – zusätzlicher Seitenaufprallschutz.", "Trabant 601 / 1.1", None, False),
    p("KUT95005V2AP", "Edelstahl-Domstrebe vorn poliert Trabant 1.1", "sicherheit", "Domstreben", "Kupke-Tuning", None, "1-2 Wochen", IMG["engine"],
      "Polierte Edelstahl-Domstrebe für die Vorderachse – versteift die Karosserie für präziseres Einlenken. Empfohlen mit den Kupke-Befestigungsplatten.", "Trabant 1.1", None, False),
    p("KUT95006V2A", "Edelstahl-Domstrebe hinten Trabant 1.1", "sicherheit", "Domstreben", "Kupke-Tuning", None, "1-2 Wochen", IMG["engine"],
      "Edelstahl-Domstrebe für die Hinterachse zur zusätzlichen Karosserieversteifung.", "Trabant 1.1", None, False),
    p("KUT95017", "Befestigungsplatten f. Domstrebe (Satz)", "sicherheit", "Domstreben", "Kupke-Tuning", None, "1-2 Tage", IMG["carparts"],
      "Kupke-Befestigungsplatten für die vordere Domstrebe – gleichmäßige Kraftverteilung auf die Federdomoberfläche. 2 Stück je Strebe.", "Trabant 1.1", None, False),
    p("KUTVS11", "Karosserie-Versteifungssatz Trabant 1.1", "sicherheit", "Versteifung", "Kupke-Tuning", None, "nach Absprache", IMG["carparts"],
      "Speziell entwickelter Versteifungssatz für den Fahrzeugboden – leitet Kräfte vom Hilfsrahmen bis zur Hinterachse. Für Leistungen bis 200 PS ausgelegt (einzuschweißen).", "Trabant 1.1", None, False),

    # ---------------- TUNING ----------------
    p("KUT9702", "KUPKE-POWER-Rohr Komplettsystem (Edelstahl + K&N)", "tuning", "Ansaugung", "Kupke-Tuning / K&N", None, "1-2 Wochen", IMG["engine"],
      "Hochglanzpoliertes Edelstahl-Ansaugrohr mit K&N-Sportfilter. Saugt frische statt warme Luft an – besserer Füllungsgrad und gutes Drehmoment schon im unteren Bereich. Für 1,1- und 1,3-Liter-Vergasermotoren.", "Trabant 1.1", "Eigenentwicklung", True),
    p("KUT9703", "Edelstahl-Power-Ansaugrohr", "tuning", "Ansaugung", "Kupke-Tuning", None, "1-2 Wochen", IMG["engine"],
      "Einzelnes hochglanzpoliertes Edelstahl-Power-Ansaugrohr aus eigener Fertigung für eine optimierte Luftversorgung.", "Trabant 1.1", None, False),
    p("KUT9704", "K&N Chrom-Sportluftfilter", "tuning", "Luftfilter", "K&N", None, "1-2 Tage", IMG["filter"],
      "K&N-Sportluftfilter mit hochglanzpolierter Edelstahl-Kappe – auswaschbar und neu ölbar, hoher Luftdurchsatz.", "Trabant 1.1", "Tuning", False),
    p("KNPAF11", "K&N Austausch-Plattenfilter Trabant 1.1", "tuning", "Luftfilter", "K&N", None, "1-2 Tage", IMG["filter"],
      "K&N-Austauschfilter, der einfach gegen den Serienluftfilter getauscht wird – mehr Luftdurchlass bei Serienoptik.", "Trabant 1.1", None, False),
    p("KN62-2480", "K&N Entlüftungsfilter", "tuning", "Luftfilter", "K&N", None, "1-2 Tage", IMG["filter"],
      "K&N-Entlüftungsfilter für die Kurbelgehäuseentlüftung – hält Blow-by aus dem Ansaugtrakt fern und verhindert Verölung.", "Trabant 1.1 / 601", None, False),
    p("KUTVWGBSMATW", "VW-Polo 5-Gang-Getriebe-Umbausatz Trabant 1.1 (neue Wellen)", "tuning", "Getriebe", "Kupke-Tuning", None, "ca. 2 Wochen", IMG["engine"],
      "Umbausatz für das VW-Polo-5-Gang-Getriebe im Trabant 1.1 – ermöglicht den Einbau vieler Polo-Motoren. Inkl. Motor-/Getriebehalter und 2 neuen Antriebswellen. Bessere Schaltung, geringerer Verbrauch.", "Trabant 1.1", "Eigenentwicklung", True),
    p("ZT0002", "Doppelvergaseranlage 72 PS (Weber) komplett", "tuning", "Leistungssteigerung", "Weber", None, "nach Absprache", IMG["engine"],
      "Komplette Doppelvergaseranlage mit Weber-Vergasern für 1,3-Liter-IFA-/VW-Motoren – ca. 72 PS. Mit TÜV-Mustergutachten.", "Trabant 1.1", None, False),
    p("ZT005A", "Leistungssteigerungskit 90 PS", "tuning", "Leistungssteigerung", "Kupke-Tuning", None, "nach Absprache", IMG["engine"],
      "90-PS-Komplettkit: Doppelvergaseranlage, bearbeiteter Zylinderkopf, Spezialventile, doppelte Ventilfedern, bearbeitetes Saugrohr, Mahle-Kolben, Fächerkrümmer und Dichtungssatz.", "Trabant 1.1", "Motorsport", False),
    p("KUTNWS", "Schrick-Sportnockenwelle Trabant 1.1", "tuning", "Nockenwellen", "Schrick", None, "nach Absprache", IMG["engine"],
      "Schrick-Sportnockenwelle für bis zu 15% mehr Leistung. Empfehlung: Kombination mit Fächerkrümmer. Renn-Nockenwellen auf Anfrage.", "Trabant 1.1", None, False),
    p("RX52", "Leichtbau-Aluminium-Ölkühler 95 mm (13 Reihen)", "tuning", "Kühlung", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "Leichtbau-Aluminium-Ölkühler in Schichtbauweise mit innenliegenden Wirbelblechen. Reduziert die Öltemperatur um 20–30 °C. Standard für getunte Motoren.", "Trabant 1.1", None, False),
    p("KUTELBZ", "Elektrische Benzinpumpe Mitsuba", "tuning", "Leistungssteigerung", "Mitsuba", None, "1-2 Tage", IMG["carparts"],
      "Elektrische Benzinpumpe für alle Vergasermotoren – seit Jahrzehnten im Motorsport bewährt.", "Trabant 1.1 / 601", None, False),

    # ---------------- DESIGN ----------------
    p("KUTDESIGN-SK", "Aluminium-Schaltknauf Kupke-Tuning", "design", "Innenraum", "Kupke-Tuning", None, "1-2 Tage", IMG["steering"],
      "Massiver Aluminium-Schaltknauf für ein sportliches Cockpit-Feeling im Trabant.", "Trabant 1.1 / 601", "Design", False),
    p("KUTDESIGN-ZS", "Chrom-Zierteile-Set Trabant 601", "design", "Zierteile", "Kupke-Tuning", None, "1-2 Wochen", IMG["carparts"],
      "Hochwertiges Chrom-Zierteile-Set für den individuellen Look Eures Trabant 601.", "Trabant 601", None, False),

    # ---------------- MOTORSPORT ----------------
    p("KUTMS-SS", "Racing-Schalensitz inkl. Konsole", "motorsport", "Schalensitze", "SANDTLER", None, "nach Absprache", IMG["bucketseat"],
      "Ergonomischer Schalensitz inkl. passender Konsole – optimaler Seitenhalt für den Renneinsatz. Über SANDTLER/ISA-RACING beziehbar.", "Trabant 1.1 / 601", "Motorsport", False),
    p("KUTMS-LR", "Sportlenkrad 3-Speichen (Wildleder)", "motorsport", "Lenkräder", "SANDTLER", None, "1-2 Wochen", IMG["steering"],
      "3-Speichen-Sportlenkrad mit Wildledergriff für ein direktes Lenkgefühl.", "Trabant 1.1 / 601", None, False),
    p("KUTMS-4PG", "4-Punkt-Sicherheitsgurt (Hosenträger)", "motorsport", "Sicherheitstechnik", "SANDTLER", None, "1-2 Wochen", IMG["bucketseat"],
      "4-Punkt-Hosenträgergurt für sicheren Halt auf der Rennstrecke. Über SANDTLER beziehbar.", "Trabant 1.1 / 601", None, False),
]


# ---------------- Varianten (Ausfuehrungen je Produkt) ----------------
VARIANTS = {
    "KUTFW113535KR": [
        {"name": "Dämpfer", "options": ["KONI-Rot", "KONI-Gelb", "KONI-Sport"]},
        {"name": "Tieferlegung VA/HA", "options": ["35/35 mm", "55/35 mm", "55/55 mm", "75/35 mm", "75/55 mm"]},
    ],
    "KUTSF1-R": [
        {"name": "Dämpfer", "options": ["KONI-Rot", "KONI-Gelb", "KONI-Sport"]},
        {"name": "Fahrwerkstyp", "options": ["Typ 1 (sportlich)", "Typ 2 (mehr Tieferlegung)", "Typ 3 (komfortabel)"]},
    ],
    "KUTTL11HA35": [
        {"name": "Tieferlegung", "options": ["35 mm", "55 mm", "75 mm"]},
        {"name": "Achse", "options": ["Vorderachse", "Hinterachse"]},
    ],
    "KUTUEB601ST": [
        {"name": "Material", "options": ["Stahl ST52", "Chromstahl Cromo4", "Aluminium"]},
        {"name": "Polsterung", "options": ["ohne", "fertig gepolstert"]},
    ],
    "KUTUEK601CR": [
        {"name": "Material", "options": ["Stahl ST52", "Chromstahl Cromo4", "Aluminium"]},
        {"name": "Strebe", "options": ["Diagonalstrebe", "Kreuzstrebe"]},
        {"name": "Polsterung", "options": ["ohne", "fertig gepolstert"]},
    ],
    "KUTALU1": [
        {"name": "Lochkreis", "options": ["4/98", "4/100"]},
    ],
    "KUTSSF1": [
        {"name": "Lochkreis", "options": ["4/98", "4/100"]},
        {"name": "Ausführung", "options": ["ohne Mittenabdeckung", "mit Mittenabdeckung", "verchromt (+50 €)"]},
    ],
    "KUTSV49820": [
        {"name": "Breite pro Achse", "options": ["10 mm", "20 mm", "30 mm", "40 mm", "50 mm", "60 mm"]},
        {"name": "Lochkreis", "options": ["4/98", "4/100", "4/160"]},
    ],
    "KUTBSR20": [
        {"name": "Scheibengröße", "options": ["239x10", "239x12", "239x20 (innenbelüftet)"]},
    ],
}

for _pr in PRODUCTS:
    _pr["variants"] = VARIANTS.get(_pr["art_nr"], [])
