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

## Characteristic Phrases per Level

These phrases capture the voice of each maturity level. Preserve them when editing the model.

- Level 0 — "Tell me what to build"
- Level 1 — "I see the real problem"
- Level 2 — "I intend to..."
- Level 3 — "I've been doing..."
- Level 4 — emergent (no single phrase — the system speaks)

## Foundational References

- Herbert Simon (1978): Organizations are systems of decisions
- Manfred Eigen (1971): Hypercycles — self-sustaining cycles enabling emergent complexity
- These two references anchor "The Name" section. Do not remove or dilute them

## Uncited but Formative Influences

These shaped the thinking behind hycle but are deliberately NOT referenced on the website. Do not add citations for them.

- David Marquet: Ladder of Leadership / "Turn the Ship Around!" — inspired the two-dimension model (Decision Authority + Human-AI Trust as co-evolving dimensions)
- Djordje Babic: "The Loom" (Substack, March 2026) — catalyst for the co-evolution concept
- Theory of Constraints / Toyota — origin of the water-level metaphor ("lowering the water reveals the rocks")
- Agile Fluency Model — precedent for maturity thinking with investment profiles
- Alistair Cockburn: "Everything we've ever written that is too disciplined for humans is perfect for AI"

## Lessons from the Agile Manifesto

What went wrong with Agile — and what hycle must avoid:

- Too abstract — everyone made their own interpretation, coherence was lost
- Immediately commercialized (Certified Scrum Master etc.) — hycle must resist certification culture
- No maturity model — the manifesto had no path, no progression. hycle's maturity model is the direct answer to this gap
- "X over Y" format was viral but premature for hycle — the group is not yet confident enough in the trade-offs to commit to that structure

## Design Decisions

Choices made deliberately, with rationale. Do not revisit without author consensus.

- **Format**: "Problem-Statement + Hypotheses" ("We observe... We believe...") — chosen over "X over Y" (too early to commit to trade-offs) and numbered principles (not ready)
- **Simon/Eigen placement**: Callout after the opening section, not the opener itself. The opener goes to the problem; the callout gives the intellectual backing
- **Author bio style**: No company names. Short, role-focused. No "20+ years experience" patterns
- **Language**: English, for international reach
- **Domains**: hycle.org is primary. hycle.ai and hycle.dev redirect to .org

## Strategic Positioning

- hycle aims to be "Taktgeber der Diskussion" — pacemaker of the discourse, not the final answer
- Community standard, not a product. Model: scs-architecture.org
- "Wir gestehen uns ein, dass wir nur auf Sicht fahren" — we admit we are navigating by sight
- Practical applicability — especially through the authors themselves — for immediate purpose
- Demand-driven, not top-down. The work follows where the need is

## Working Documents

Source materials for the author group:

- Fathom recording: Founding session, February 27, 2026 (153 minutes)
- Google Doc: https://docs.google.com/document/d/1IY_5XbKPO1Lbj4QV-cpJ7s60EPZ_a6NTiByhe0ZkqKY/edit
- Email thread: "Follow-up codename hycle" (between all authors)

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

Andreas Stephan, Benedikt Stemmildt, Jens Himmelreich, Johannes Schmidt, Sven Christian Andrä.
