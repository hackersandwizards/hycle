# hycle — Projektregeln

**Widersprich laut.** Wenn du eine bessere Sicht auf Rahmen, Struktur oder Formulierung siehst, sprich es an, bevor du handelst. Die redaktionelle Disziplin hier ist bewusst streng — aber widersprich, wenn eine Regel gegen den Inhalt arbeitet.

## Was das ist

Ein Manifest, ein Reifegradmodell und ein Framework für Produktentwicklungsorganisationen, die den Wandel von prozessgetriebener zu entscheidungsgetriebener Arbeit im Zeitalter der KI-Agenten navigieren. Veröffentlicht auf hycle.org. Drei eigenständige Teile auf einer Seite.

## Tech-Stack

Schlichtes HTML/CSS. Keine Frameworks. Kein Build-Schritt. Kein JavaScript. Das bleibt so.

```
index.html       ← Aktuelle Version: Manifest + Modell + Umkehrung (immer der jüngste Stand)
changelog.html   ← Versionshistorie (gleiches Styling)
style.css        ← Ein Stylesheet, gemeinsam für alle Seiten
versions/        ← Archivierte frühere Versionen (v1.html, v2.html, ...)
drafts/          ← Diskussionsentwürfe für die Autorengruppe (HTML, gleiches Styling)
```

## Ton und Stimme

- Deutsche Sprache, immer
- Ehrlich, offen, undogmatisch — "Wir haben keine Antworten. Wir haben Hypothesen."
- Direkt und präzise. Keine Weichmacher, wo Sicherheit besteht; keine falsche Sicherheit, wo keine besteht
- Kein Jargon, keine Buzzwords, keine Emojis
- Jeder Satz muss sein Gewicht tragen. Wenn ein Satz beim Streichen keine Bedeutung verliert, streich ihn. Wiederholungen der Überschrift, Übergänge ("Was neu ist, ist..."), illustrierende Beispiele ohne Mehrwert — das sind die Erstkandidaten zum Kürzen
- Gleichgewicht: Beobachtungen müssen untereinander ähnlich lang sein, Hypothesen ebenso. Keine Aufsätze neben Einzeilern. Tiefe gehört in spätere Inhalte (Walk the Talk, Blog-Posts), nicht in Beobachtungen oder Hypothesen
- hycle ist immer kleingeschrieben, auch am Satzanfang
- Englische Fachbegriffe (Backlog, Sprint, Retrospective, Pair, Scrum, Trunk-based Development, Cooldown, Stakeholder, Discovery, Framework) bleiben im Original, wenn sie etablierte Eigennamen sind

## Inhaltsarchitektur

hycle hat drei Teile, präsentiert auf einer Seite mit visuellen Trennern:

### Teil I: Das Manifest

#### Die Beobachtung (Eröffnung)
- Universeller Einstieg: Technologie beseitigt Beschränkungen, der Entscheidungsengpass wird sichtbar
- Software ist EINE Ausprägung, nicht die einzige. Anerkennen, dass andere Branchen das zuerst wussten
- Mit dem Universellen führen, mit dem Spezifischen illustrieren

#### Der Name
- Simon + Eigen als geistige Anker. In voller Länge bewahren

#### Die Begriffe
- Definitionen von Entscheidung, Strategie, Autorität — platziert zwischen Der Name und Was wir sehen
- Das sind Manifest-Definitionen, nicht operatives Vokabular
- Entscheidung: vor allem Was und Warum, nicht Wie. Aber wo die Was/Wie-Grenze verläuft, ist selbst eine Entscheidung
- Strategie: Diagnose + leitende Politik + kohärente Handlungen (Rumelt, ohne Zitat)
- Autorität: tatsächlich vs. erklärt. Die Lücke ist das erste Symptom

#### Was wir sehen (Beobachtungen)
- Jede Beobachtung: kurz, gleich lang, ein Punkt pro Beobachtung
- Diese sind praxisbasiert — aus Software- und Produktentwicklungsorganisationen
- Spezifisch zur Software- und Produktentwicklungspraxis halten. Die Ehrlichkeit liegt in der Spezifität

#### Was wir glauben (Hypothesen)
- Kurz, gleich lang — die Überschrift trägt die These, der Body ist eine klärende Aussage
- Gruppiert: Fundament → Entscheidungsdimensionen → Navigation → Reifepfad → Chance
- "Locker gehalten und rigoros geprüft" — Hypothesen als Hypothesen darstellen, nicht als Fakten

#### Was hycle nicht ist
- Enthält Meta-Prinzip: hycle bietet Prinzipien, Diagnose und Referenzmuster. Operationalisierung ist kontextspezifisch — wird von Menschen und KI in diesem Kontext entwickelt

### Teil II: Das Reifegradmodell

#### Das Modell (Reifegrade 0–4)
- Die Reifegradstruktur ändert sich nur mit explizitem Konsens der Autoren
- Zwei sich gemeinsam entwickelnde Dimensionen: Entscheidungsautorität und Mensch-KI-Vertrauen
- Reifegrade 0–1 sind "Beobachtet", Reifegrade 2–4 sind "Hypothetisch"
- Fortschritt ist nicht monoton — Rückschritt ist real und muss benannt werden
- Jeder Reifegrad enthält "Wahrgenommene Entscheidungsqualität in den Teams" — wie Teams die Qualität der sie erreichenden Entscheidungen erleben
- Reifegrade 1–3 enthalten "Weiterkommen" — Voraussetzungen für den Fortschritt, mit konkreten Mustern als Illustration (keine Vorschriften)

### Teil III: Das Framework

#### Die Rollen / Die Sprache / Walk the Talk
- Alle stehen unter "Folgt" — die Richtung ist erkennbar, die Details noch nicht reif
- Diese leer lassen, bis echte Substanz vorliegt. Leere Ehrlichkeit schlägt verfrühte Antworten
- Das Framework ist explizit als Sammlung von Referenzmustern positioniert, keine vorschreibende Methodik
- Operatives Vokabular (Die Sprache) gehört hierher, nicht ins Manifest
- Die Rollen und Walk the Talk: unverändert lassen, bis echte Substanz da ist

## Charakteristische Sätze pro Reifegrad

Diese Sätze fangen die Stimme jedes Reifegrads ein. Bei Bearbeitungen am Modell bewahren.

- Reifegrad 0 — "Sag mir, was ich bauen soll"
- Reifegrad 1 — "Ich sehe das eigentliche Problem"
- Reifegrad 2 — "Ich beabsichtige..."
- Reifegrad 3 — "Ich habe..."
- Reifegrad 4 — emergent (kein einzelner Satz — das System spricht)

## Grundlegende Referenzen

- Herbert Simon (1978): Organisationen sind Systeme aus Entscheidungen
- Manfred Eigen (1971): Hyperzyklen — selbsterhaltende Kreisläufe, die emergente Komplexität ermöglichen
- Diese beiden Referenzen verankern den Abschnitt "Der Name". In voller Länge bewahren

## Nicht zitierte, aber prägende Einflüsse

Diese haben das Denken hinter hycle geprägt, sind aber bewusst nicht auf der Website referenziert. Bei ihnen Zitate weglassen.

- David Marquet: Ladder of Leadership / "Turn the Ship Around!" — inspirierte das Zwei-Dimensionen-Modell (Entscheidungsautorität + Mensch-KI-Vertrauen als sich gemeinsam entwickelnde Dimensionen)
- Djordje Babic: "The Loom" (Substack, März 2026) — Auslöser für das Konzept der Ko-Evolution
- Theory of Constraints / Toyota — Ursprung der Wasserstand-Metapher ("den Wasserstand senken legt die Felsen frei")
- Agile Fluency Model — Vorbild für Reifegrad-Denken mit Investitionsprofilen
- Alistair Cockburn: "Alles, was wir je geschrieben haben und was für Menschen zu diszipliniert ist, ist perfekt für KI"
- Richard Rumelt: "Good Strategy Bad Strategy" — der Kernel of Strategy (Diagnose, leitende Politik, kohärente Handlungen) prägt, wie hycle in den Begriffen "Strategie" definiert
- Stephen Bungay: "The Art of Action" — directed opportunism, Autonomie + Alignment. Prägt Reifegrad 3 (Teams besitzen Entscheidungen im strategischen Rahmen) und die Spannung zwischen Kohärenz und Autonomie im gesamten Modell
- Itamar Gilad: "Evidence Guided" — evidenzgetriebene Produktentscheidungen, hypothesenbasierte Entwicklung

## Lehren aus dem Agile Manifest

Was bei Agile schiefging — und was hycle vermeiden muss:

- Zu abstrakt — jeder hat seine eigene Auslegung gemacht, die Kohärenz ging verloren
- Sofort kommerzialisiert (Certified Scrum Master usw.) — hycle muss Zertifizierungskultur widerstehen
- Kein Reifegradmodell — das Manifest hatte keinen Pfad, keinen Fortschritt. Das Reifegradmodell von hycle ist die direkte Antwort auf diese Lücke
- Das Format "X über Y" war viral, aber für hycle verfrüht — die Gruppe ist noch nicht zuversichtlich genug bei den Trade-offs, um sich auf diese Struktur festzulegen

## Designentscheidungen

Bewusste Entscheidungen mit Begründung. Nur mit Konsens der Autoren neu öffnen.

- **Drei-Teile-Struktur**: Manifest (Prinzipien) / Reifegradmodell (Diagnose) / Framework (Referenzmuster). Trennt, was hycle vorschreibt, von dem, was es kontextspezifischer Ableitung überlässt
- **Format**: "Problem-Aussage + Hypothesen" ("Wir beobachten... Wir glauben...") — gewählt gegenüber "X über Y" (zu früh, sich auf Trade-offs festzulegen) und nummerierten Prinzipien (noch nicht reif)
- **Begriffe-Verortung**: Zwischen Der Name und Was wir sehen. Begriffe müssen definiert sein, bevor sie ausgiebig verwendet werden. Kein operatives Vokabular — das gehört ins Framework
- **Simon/Eigen-Verortung**: Callout nach der Eröffnung, nicht die Eröffnung selbst. Die Eröffnung adressiert das Problem; der Callout liefert die geistige Verankerung
- **Stil der Autoren-Bios**: Keine Firmennamen. Kurz, rollen-fokussiert. Kein "20+ Jahre Erfahrung"-Muster
- **Sprache**: Deutsch
- **Domains**: hycle.org ist primär. hycle.ai und hycle.dev leiten auf .org weiter
- **Meta-Prinzip**: hycle liefert das Denken, nicht das Tun. Operationalisierung ist kontextspezifisch. Das verhindert, dass hycle das nächste Scrum wird

## Strategische Positionierung

- hycle will "Taktgeber der Diskussion" sein, nicht die endgültige Antwort
- Community-Standard, kein Produkt. Vorbild: scs-architecture.org
- "Wir gestehen uns ein, dass wir nur auf Sicht fahren"
- Praktische Anwendbarkeit — vor allem durch die Autoren selbst — für unmittelbaren Nutzen
- Bedarfsgetrieben, nicht von oben. Die Arbeit folgt dort, wo der Bedarf ist

## Arbeitsdokumente

Quellmaterial für die Autorengruppe:

- Fathom-Aufzeichnung: Gründungssitzung, 27. Februar 2026 (153 Minuten)
- Google Doc: https://docs.google.com/document/d/1IY_5XbKPO1Lbj4QV-cpJ7s60EPZ_a6NTiByhe0ZkqKY/edit
- E-Mail-Thread: "Follow-up codename hycle" (zwischen allen Autoren)

## Versionierungs-Protokoll

Bei inhaltlichen Änderungen am Manifest:

1. Aktuelle index.html nach `versions/vN.html` archivieren, bevor sie überschrieben wird
2. Relative Pfade in der archivierten Version anpassen (CSS: `../style.css`, Links: `../changelog.html`)
3. `changelog.html` mit einem neuen Abschnitt aktualisieren — Versionsüberschrift verlinkt auf die Versionsdatei
4. Footer in index.html um den Link zur neuen Vorversion ergänzen
5. README.md-Zählungen (Beobachtungen, Hypothesen) aktualisieren, falls geändert

## Footer-Konvention

Jede Seite verlinkt: Changelog · frühere Versionen (v1, v2, ...) · Quelltext auf GitHub.
Archivierte Versionen verlinken zusätzlich zurück auf die aktuelle Version.

## Autoren

Andreas Stephan, Benedikt Stemmildt, Björn Rochel, Jens Himmelreich, Johannes Schmidt, Sven Christian Andrä.
