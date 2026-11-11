# hycle

hycle ist eine Hypothese darüber, wie sich Arbeit verschiebt, wenn agentische Softwareentwicklung das Bauen billig macht. [hycle.org](https://hycle.org) sammelt, was wir sehen, formuliert Hypothesen und skizziert ein Betriebsmodell, auf Deutsch. Dieses Repository enthält den Quelltext der Seite.

| Ihr wollt                                      | Hier entlang                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| das Manifest lesen                             | [hycle.org](https://hycle.org)                                               |
| sehen, was sich von Version zu Version ändert  | [Changelog](https://hycle.org/changelog.html)                                |
| Erfahrungen teilen oder widersprechen          | [GitHub Discussions](https://github.com/hackersandwizards/hycle/discussions) |
| einen Fehler korrigieren oder Text vorschlagen | [Seite ändern](#seite-ändern)                                                |
| eine neue Version veröffentlichen              | [CONTRIBUTING.md](CONTRIBUTING.md#eine-neue-version-veröffentlichen)         |
| eine Schwachstelle melden                      | [SECURITY.md](SECURITY.md)                                                   |

## Seite ändern

Ihr braucht [Bun](https://bun.sh) und für den Commit-Hook [gitleaks](https://github.com/gitleaks/gitleaks#installing).

```sh
bun install
bun run dev
```

`bun run dev` zeigt die Seite lokal. Der Text des Manifests steht als HTML in `src/body/index.html`, die übrigen Seiten liegen daneben. Frühere Versionen liegen eingefroren unter `public/versions/` (v1 bis v9). Vor dem Pull Request prüft `bun run check` alles.

Regeln für Inhalt und Technik stehen in [CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

Die Texte stehen unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Wer sie geschrieben hat, steht unter [Die Autoren](https://hycle.org/#authors).
