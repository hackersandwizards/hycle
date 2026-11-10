# Mitwirken an hycle

hycle ist ein Diskussionsangebot, kein fertiges Modell. Erfahrungen, Korrekturen und Vorschläge sind willkommen, über [GitHub Discussions](https://github.com/hackersandwizards/hycle/discussions) oder als Pull Request.

## Inhaltliche Regeln

- **Quellen belegen.** Aussagen über Praxis, Studien oder Referenzen brauchen eine nachvollziehbare Quelle. Primärquellen vor Sekundärquellen.
- **Deutsch.** Die Seite ist auf Deutsch, mit korrekten Umlauten (ä ö ü) und ß. hycle wird kleingeschrieben, auch am Satzanfang.
- **Nüchtern.** Kein Jargon, keine Buzzwords, keine Heilsversprechen. Hypothesen bleiben als Hypothesen kenntlich, nicht als Fakten.

## Technische Regeln

- **HTML und CSS, gebaut mit Astro.** Der Inhalt jeder Seite steht als HTML in `src/body/` (`index.html`, `changelog.html`, `talks.html`, `impressum.html`, `datenschutz.html`, `404.html`), Titel und Meta-Angaben in `src/pages/`, der gemeinsame Kopf in `src/layouts/Layout.astro`. `bun run build` schreibt die Seite nach `dist/`. Auf der ausgelieferten Seite bleibt kein JavaScript.
- **bun statt npm.** `bun install` einmal pro Klon, `bun run dev` zeigt die Seite lokal, `bun run check` prüft alles (Prettier, Build, html-validate auf `dist/`, Stylelint, Sitemap, interne Links). `bun run lighthouse` und `bun run audit` laufen zusätzlich in CI.
- **Git-Hooks (lefthook).** Nach `bun install` sind sie installiert: pre-commit sucht mit [gitleaks](https://github.com/gitleaks/gitleaks) nach Zugangsdaten (Installation: `brew install gitleaks`) und formatiert geänderte Dateien automatisch (Prettier, Stylelint), pre-push führt `bun run check` aus. `bun run check` läuft auch in CI, und GitHub weist Pushes mit erkannten Zugangsdaten ab.
- **Frühere Versionen sind eingefroren.** Dateien unter `public/versions/` werden nicht nachformatiert oder geändert und so ausgeliefert, wie sie dort liegen. Die zwei Ausnahmen: Jeder Footer verlinkt Impressum und Datenschutz, und v1 bis v6 laden keine Google Fonts mehr, sondern die Schriften aus `style.css` (das Bild bleibt pixelgleich). Alles in `public/` (Fonts, Icons, `style.css`, `rss.xml`, PDF) landet unverändert unter demselben Pfad.

## Eine neue Version veröffentlichen

1. `bun run build`, dann die gebaute `dist/index.html` nach `public/versions/vN.html` kopieren, relative Pfade anpassen (`../style.css`, `../changelog.html`, `../impressum/`, `../datenschutz/`).
2. `src/body/changelog.html` um einen Abschnitt ergänzen, die Überschrift verlinkt auf die Versionsdatei.
3. Footer in `src/body/index.html` um den Link zur neuen Vorversion ergänzen.
4. `bun run build && bun run gen:sitemap` ausführen und `public/rss.xml` um die neue Version ergänzen.
5. `bun run check` laufen lassen.
