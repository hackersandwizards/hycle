# Mitwirken an hycle

hycle ist ein Diskussionsangebot, kein fertiges Modell. Erfahrungen, Korrekturen und Vorschläge sind willkommen, über [GitHub Discussions](https://github.com/hackersandwizards/hycle/discussions) oder als Pull Request.

## Inhaltliche Regeln

- **Quellen belegen.** Aussagen über Praxis, Studien oder Referenzen brauchen eine nachvollziehbare Quelle. Primärquellen vor Sekundärquellen.
- **Deutsch.** Die Seite ist auf Deutsch, mit korrekten Umlauten (ä ö ü) und ß. hycle wird kleingeschrieben, auch am Satzanfang.
- **Nüchtern.** Kein Jargon, keine Buzzwords, keine Heilsversprechen. Hypothesen bleiben als Hypothesen kenntlich, nicht als Fakten.

## Technische Regeln

- **HTML und CSS, gebaut mit Astro.** Der Inhalt jeder Seite steht als HTML in `src/body/` (`index.html`, `changelog.html`, `talks.html`, `impressum.html`, `datenschutz.html`, `404.html`), Titel und Meta-Angaben in `src/pages/`, der gemeinsame Kopf in `src/layouts/Layout.astro`. `bun run build` schreibt die Seite nach `dist/`. Auf der ausgelieferten Seite bleibt kein JavaScript.
- **bun statt npm.** `bun install` einmal pro Klon, `bun run dev` zeigt die Seite lokal, `bun run check` prüft alles (Prettier, Build, html-validate auf `dist/`, Stylelint, Sitemap, interne Links auf jeder Seite, die Tests in `scripts/`). `bun run lighthouse` und `bun run audit` laufen zusätzlich in CI.
- **Git-Hooks (lefthook).** Nach `bun install` sind sie installiert: pre-commit sucht mit [gitleaks](https://github.com/gitleaks/gitleaks) nach Zugangsdaten ([Installation](https://github.com/gitleaks/gitleaks#installing), ohne gitleaks scheitert der Commit) und formatiert geänderte Dateien automatisch (Prettier, Stylelint), pre-push führt `bun run check` aus. `bun run check` läuft auch in CI, und GitHub weist Pushes mit erkannten Tokens bekannter Anbieter ab.
- **Frühere Versionen sind eingefroren.** Dateien unter `public/versions/` werden nicht nachformatiert oder geändert und so ausgeliefert, wie sie dort liegen. Die zwei Ausnahmen: Jeder Footer verlinkt Impressum und Datenschutz, und v1 bis v6 laden keine Google Fonts mehr, sondern die Schriften aus `style.css` (das Bild bleibt pixelgleich). Alles in `public/` (Fonts, Icons, `style.css`, `rss.xml`, PDF) landet unverändert unter demselben Pfad.

## Eine neue Version veröffentlichen

Diese Liste nennt jede Stelle, die eine neue Version ändert. N ist die bisherige Version, N+1 die neue.

1. **Archivieren.** `bun run build`, dann `cp dist/index.html public/versions/vN.html`. In der Kopie bekommt jeder relative Link ein `../` (`../style.css`, `../changelog.html`, `../talks/`, `../impressum/`, `../datenschutz/`), nur Links auf frühere Versionen werden Geschwister (`versions/v3.html` wird `v3.html`). Links mit `/`, `#` oder `https:` am Anfang bleiben. Der Titel verlinkt auf die aktuelle Version (`<h1 class="hero-title"><a href="../index.html">hycle</a>…`), der Footer beginnt mit `<a href="../index.html">aktuelle Version</a>` und listet nur v1 bis vN−1.
2. **Neue Fassung einsetzen.** Ihr Body ersetzt `src/body/index.html`. Titel, Beschreibung und `og:`-Angaben stehen in `src/pages/index.astro`, dort auch `version` in den schema.org-Daten: N+1. Ein Entwurf unter `public/drafts/` wird gelöscht, sein `noindex` nicht übernommen.
3. **Changelog.** In `src/body/changelog.html` oben einen Abschnitt für vN+1, dessen Überschrift auf `index.html` verlinkt. Die Überschrift von vN verlinkt nun auf `versions/vN.html`.
4. **Versionslisten.** vN ergänzen im Footer von `src/body/index.html` (`versions/vN.html`), im Footer von `src/body/talks.html` (`../versions/vN.html`) und oben unter „Frühere Versionen“ in `public/llms.txt`.
5. **Feed.** In `public/rss.xml` oben ein `<item>` für vN+1: `link` auf `https://hycle.org/`, `<guid isPermaLink="false">` mit der künftigen Archivadresse `https://hycle.org/versions/vN+1.html`, `description` „Aktuelle Version des Manifests.“ Beim Eintrag von vN zeigt `link` nun auf `https://hycle.org/versions/vN.html`, die `description` entfällt. Die `guid` eines bestehenden Eintrags bleibt, wie sie ist.
6. **README.md.** Hinter `public/versions/` die Spanne (v1 bis vN) fortschreiben.
7. **Prüfen.** `bun run check`. Der Link-Check liest jede gebaute Seite, das neue Archiv eingeschlossen, und `scripts/versions.test.mjs` gleicht Archiv, schema.org-Version, Feed, README und Versionslisten mit dem Changelog ab. Die Sitemap bleibt gleich, weil der Generator ein Archiv mit Canonical auf `https://hycle.org/` nicht aufnimmt.
