# hycle — Der hyper cycle

**Wenn Softwareentwicklung sofort passiert, zählt nur noch Handlungsfähigkeit.**

hycle ist eine Hypothese darüber, wie sich Arbeit verschiebt, wenn agentische Softwareentwicklung das Bauen billig macht. Der Engpass heißt Handlungsfähigkeit: Was weiß ich, was darf ich, was kann ich? In der Organisation sind das keine Eigenschaften von Personen, sondern Ergebnisse der Struktur.

## Was ist das?

Drei Teile, gerahmt von Präambel, Abgrenzung und Call for Participation. Der Schwerpunkt liegt im Framework:

- **Was wir sehen** — 13 Beobachtungen aus der Praxis der agentischen Entwicklung
- **Was wir glauben** — 8 Hypothesen, aus dem Betriebsmodell abgeleitet
- **Das Framework** — Zielgruppe, Factory, Rollen, Kadenzen, Artefakte, Sonstiges. Das Betriebsmodell für die agentische Software-Entwicklung

Vorangestellt ist die Eröffnung. Zwischen Beobachtungen und Hypothesen steht die Diagnose, am Seitenende die Herkunft des Namens. Den Abschluss bilden die Abgrenzung („Was hycle nicht ist“) und der Call for Participation mit drei Leitfragen: Was klappt bei euch? Was klappt nicht? Wo seid ihr auf die Nase gefallen?

## Die Kernerkenntnis

Der Engpass war immer Handlungsfähigkeit, nicht Execution. KI-Agenten lösen die Execution, und damit liegt offen, wo wirklich entschieden wird und wer überhaupt handeln kann, wer darf und wer genug weiß. Manfred Eigen hat 1971 die Hyperzyklen beschrieben: gekoppelte Kreisläufe, die die Voraussetzungen für etwas Neues schaffen. Wir vermuten, dass Organisationen vor einem ähnlichen Übergang stehen, von prozessgetrieben hin zu entscheidungsgetrieben.

## Die Website

[hycle.org](https://hycle.org)

Schlichtes HTML/CSS. Keine Frameworks. Kein Build-Schritt. Kein JavaScript auf der Seite.

```
index.html       ← Aktuelle Version (Beobachtungen, Hypothesen, Das Framework)
changelog.html   ← Versionshistorie
style.css        ← Minimales Styling, selbst gehostete Fonts
versions/        ← Archivierte frühere Versionen (v1, v2, v3, v4, v5, v6, v7, v8)
fonts/           ← Selbst gehostete Schriften (woff2)
robots.txt, sitemap.xml, rss.xml, llms.txt ← Discovery für Crawler und Agenten
CNAME            ← Konfiguration der Custom-Domain
```

Das Repo enthält ein Tooling-Setup (Prettier, html-validate, Stylelint, Link-Check, Lighthouse), das die Seite nur auf Qualität prüft, nicht baut. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

## Mitwirken

hycle ist nicht fertig. Es ist eine Einladung, gemeinsam zu suchen, was funktioniert. Wenn ihr seht, was wir sehen, wenn eure Praxis Hypothesen bestätigt oder ihnen widerspricht, eröffnet eine Diskussion.

[An der Diskussion teilnehmen](https://github.com/hackersandwizards/hycle/discussions)

## Autoren

- [Andreas Stephan](https://www.linkedin.com/in/andreasstephan/)
- [Benedikt Stemmildt](https://www.linkedin.com/in/benedikt-stemmildt/)
- [Björn Rochel](https://www.linkedin.com/in/bjoern-rochel/)
- [Jens Himmelreich](https://www.linkedin.com/in/jens-himmelreich-a310251/)
- [Johannes Schmidt](https://www.linkedin.com/in/johannes-schmidt-7b84b33/)
- [Sven Christian Andrä](https://www.linkedin.com/in/svenandrae/)

## Lizenz

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
