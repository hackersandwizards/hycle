# hycle — Project Rules

## What This Is

A manifesto for product development organizations navigating the shift from process-driven to decision-driven work in the age of AI agents. Published at hycle.org.

## Tech Stack

Plain HTML/CSS. No frameworks. No build step. No JavaScript. Keep it that way.

```
index.html       ← Current manifesto (always the latest version)
changelog.html   ← Version history (same styling as manifesto)
style.css        ← Single stylesheet, shared by all pages
versions/        ← Archived previous versions (v1.html, v2.html, ...)
```

## Tone & Voice

- English language, always
- Honest, open, not dogmatic — "We do not have answers. We have hypotheses."
- Direct and precise. No hedging when certainty exists, no false certainty when it doesn't
- No jargon, no buzzwords, no emojis
- hycle is always lowercase, even at the start of a sentence

## Content Architecture

### The Observation (opening section)
- Universal framing: technology removes constraints, decision bottleneck becomes visible
- Software is ONE manifestation, not the only one. Acknowledge other industries knew this first
- Lead with the universal, illustrate with the specific

### What We See (observations)
- Each observation: short, equal length, one point per observation
- These are practice-based — from software/product development organizations
- Do not make them artificially cross-industry. The honesty is in the specificity

### What We Believe (hypotheses)
- Short, equal length — headline carries the thesis, body is one clarifying statement
- Grouped: foundation → dimensions of decisions → navigation → maturity path → opportunity
- "Held loosely and tested rigorously" — do not present hypotheses as facts

### The Model (Levels 0–4)
- This is the strongest part of the manifesto. Do not change the level structure without explicit author consensus
- Two co-evolving dimensions: Decision Authority and Human-AI Trust
- Levels 0–1 are "Observed", Levels 2–4 are "Hypothesized"
- Progression is not monotonic — regression is real and must be acknowledged

### The Roles / The Language
- Both are "Coming soon" — the direction is identified, the specifics are not ready
- Do not fill these with placeholder content. Empty honesty beats premature answers

### Walk the Talk
- "Coming soon" — this is content work, not website work
- Do not change this section until real case studies exist

## Foundational References

- Herbert Simon (1978): Organizations are systems of decisions
- Manfred Eigen (1971): Hypercycles — self-sustaining cycles enabling emergent complexity
- These two references anchor "The Name" section. Do not remove or dilute them

## Versioning Protocol

When making content changes to the manifesto:

1. Archive the current index.html to `versions/vN.html` before overwriting
2. Fix relative paths in archived version (CSS: `../style.css`, links: `../changelog.html`)
3. Update `changelog.html` with a new section — version header links to the version file
4. Update footer in index.html to include link to new previous version
5. Update README.md counts (observations, hypotheses) if they changed

## Footer Convention

Every page links to: Changelog · previous versions (v1, v2, ...) · Source on GitHub.
Archived versions additionally link back to the current version.

## Authors

Sven Christian Andrä, Jens Himmelreich, Johannes Schmidt, Andreas Stephan, Benedikt Stemmildt.
