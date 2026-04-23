# hycle — Project Rules

## What This Is

A manifesto, maturity model, and framework for product development organizations navigating the shift from process-driven to decision-driven work in the age of AI agents. Published at hycle.org. Three distinct parts on one page.

## Tech Stack

Plain HTML/CSS. No frameworks. No build step. No JavaScript. Keep it that way.

```
index.html       ← Current version: manifesto + model + framework (always latest)
changelog.html   ← Version history (same styling)
style.css        ← Single stylesheet, shared by all pages
versions/        ← Archived previous versions (v1.html, v2.html, ...)
drafts/          ← Discussion drafts for the author group (HTML, same styling)
```

## Tone & Voice

- English language, always
- Honest, open, not dogmatic — "We do not have answers. We have hypotheses."
- Direct and precise. No hedging when certainty exists, no false certainty when it doesn't
- No jargon, no buzzwords, no emojis
- Every sentence must carry its own weight. If removing a sentence loses no meaning, remove it. Restatements of the headline, transitions ("What is new is that..."), and examples that illustrate without adding are the first to cut
- Equal weight: observations must be similar length to each other, hypotheses must be similar length to each other. No essays next to one-liners. Move depth into future content (Walk the Talk, blog posts), not into observations or hypotheses
- hycle is always lowercase, even at the start of a sentence

## Content Architecture

hycle has three parts, presented on one page with visual separators:

### Part I: The Manifesto

#### The Observation (opening section)
- Universal framing: technology removes constraints, decision bottleneck becomes visible
- Software is ONE manifestation, not the only one. Acknowledge other industries knew this first
- Lead with the universal, illustrate with the specific

#### The Name
- Simon + Eigen intellectual anchoring. Do not dilute

#### The Concepts
- Definitions of Decision, Strategy, Authority — placed between The Name and What We See
- These are manifesto-level definitions, not operative vocabulary
- Decision: primarily what and why, not how. But the what/how boundary is itself a decision
- Strategy: diagnosis + guiding policy + coherent actions (Rumelt sense, uncited)
- Authority: actual vs. declared. The gap is the first symptom

#### What We See (observations)
- Each observation: short, equal length, one point per observation
- These are practice-based — from software/product development organizations
- Do not make them artificially cross-industry. The honesty is in the specificity

#### What We Believe (hypotheses)
- Short, equal length — headline carries the thesis, body is one clarifying statement
- Grouped: foundation → dimensions of decisions → navigation → maturity path → opportunity
- "Held loosely and tested rigorously" — do not present hypotheses as facts

#### What hycle Is Not
- Includes meta-principle: hycle provides principles, diagnosis, and reference patterns. Operationalization is context-specific — developed by people and AI in that context

### Part II: The Maturity Model

#### The Model (Levels 0–4)
- Do not change the level structure without explicit author consensus
- Two co-evolving dimensions: Decision Authority and Human-AI Trust
- Levels 0–1 are "Observed", Levels 2–4 are "Hypothesized"
- Progression is not monotonic — regression is real and must be acknowledged
- Each level includes "Decision quality perceived by teams" — how teams experience the quality of decisions reaching them
- Levels 1–3 include "What it takes to move beyond" — prerequisites for progression, with concrete patterns as illustrations (not prescriptions)

### Part III: The Framework

#### The Roles / The Language / Walk the Talk
- All are "Coming soon" — the direction is identified, the specifics are not ready
- Do not fill these with placeholder content. Empty honesty beats premature answers
- The framework is explicitly positioned as reference patterns, not prescriptive methodology
- Operative vocabulary (The Language) belongs here, not in the manifesto
- The Roles and Walk the Talk: do not change until real substance exists

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
- Richard Rumelt: "Good Strategy Bad Strategy" — the Kernel of Strategy (diagnosis, guiding policy, coherent actions) informs how hycle defines "strategy" in The Concepts
- Stephen Bungay: "The Art of Action" — directed opportunism, Autonomy + Alignment. Informs Level 3 (teams own decisions within strategic frame) and the tension between coherence and autonomy throughout the model
- Itamar Gilad: "Evidence Guided" — evidence-driven product decisions, hypothesis-based development

## Lessons from the Agile Manifesto

What went wrong with Agile — and what hycle must avoid:

- Too abstract — everyone made their own interpretation, coherence was lost
- Immediately commercialized (Certified Scrum Master etc.) — hycle must resist certification culture
- No maturity model — the manifesto had no path, no progression. hycle's maturity model is the direct answer to this gap
- "X over Y" format was viral but premature for hycle — the group is not yet confident enough in the trade-offs to commit to that structure

## Design Decisions

Choices made deliberately, with rationale. Do not revisit without author consensus.

- **Three-part structure**: Manifesto (principles) / Maturity Model (diagnosis) / Framework (reference patterns). Separates what hycle prescribes from what it leaves to context-specific derivation
- **Format**: "Problem-Statement + Hypotheses" ("We observe... We believe...") — chosen over "X over Y" (too early to commit to trade-offs) and numbered principles (not ready)
- **Concepts placement**: Between The Name and What We See. Terms must be defined before they are used extensively. Not operative vocabulary — that belongs in the Framework
- **Simon/Eigen placement**: Callout after the opening section, not the opener itself. The opener goes to the problem; the callout gives the intellectual backing
- **Author bio style**: No company names. Short, role-focused. No "20+ years experience" patterns
- **Language**: English, for international reach
- **Domains**: hycle.org is primary. hycle.ai and hycle.dev redirect to .org
- **Meta-principle**: hycle provides thinking, not doing. Operationalization is context-specific. This prevents hycle from becoming the next Scrum

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

Andreas Stephan, Benedikt Stemmildt, Björn Rochel, Jens Himmelreich, Johannes Schmidt, Sven Christian Andrä.

@.claude/RTK.md
