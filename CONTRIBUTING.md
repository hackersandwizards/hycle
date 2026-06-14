# Mitwirken an hycle

hycle ist ein Diskussionsangebot, kein fertiges Modell. Erfahrungen, Korrekturen und Vorschläge sind willkommen, über [GitHub Discussions](https://github.com/hackersandwizards/hycle/discussions) oder als Pull Request.

## Inhaltliche Regeln

- **Quellen belegen.** Aussagen über Praxis, Studien oder Referenzen brauchen eine nachvollziehbare Quelle. Primärquellen vor Sekundärquellen.
- **Deutsch.** Die Seite ist auf Deutsch, mit korrekten Umlauten (ä ö ü) und ß. hycle wird kleingeschrieben, auch am Satzanfang.
- **Nüchtern.** Kein Jargon, keine Buzzwords, keine Heilsversprechen. Hypothesen bleiben als Hypothesen kenntlich, nicht als Fakten.

## Technische Regeln

- **Schlichtes HTML und CSS.** Kein Framework, kein Build-Schritt, kein JavaScript auf der Seite. Das Tooling im Repo prüft nur Qualität, es baut die Seite nicht.
- **Vor dem Push:** `npm ci`, dann `npm run check` (Prettier, Lint, interne Links, Sitemap). Dieselben Checks laufen in CI.
- **Frühere Versionen sind eingefroren.** Dateien unter `versions/` werden nicht nachformatiert oder geändert.

## Eine neue Version veröffentlichen

1. Aktuelle `index.html` nach `versions/vN.html` kopieren, relative Pfade anpassen (`../style.css`, `../changelog.html`).
2. `changelog.html` um einen Abschnitt ergänzen, die Überschrift verlinkt auf die Versionsdatei.
3. Footer in `index.html` um den Link zur neuen Vorversion ergänzen.
4. `npm run gen:sitemap` ausführen und `rss.xml` um die neue Version ergänzen.
5. `npm run check` laufen lassen.
