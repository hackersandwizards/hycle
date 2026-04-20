# Architecture & Engineering Principles

hackers&wizards brings 20+ years of enterprise engineering experience to every engagement. These principles are not theoretical -- they come from building, operating, and scaling real systems at OTTO, Zalando, Breuninger, and BLUME 2000.

When making technical recommendations, writing proposals, drafting content, or reviewing architecture, ground your work in these principles. They define what "good" looks like in the systems we help clients build.

## Core Philosophy

- Architecture exists to split work between teams so they can ship independently. If it doesn't serve coordination, it's ornamental.
- Principles over rules in complex environments. You cannot write a rule for every situation. Teach judgment instead.
- Code changeability matters more than code correctness. "It is more important for code to be changeable than that it work."
- The Three Ways: Fast Flow, Fast Feedback, Continuous Learning
- Five Ideals: Locality/Simplicity, Focus/Flow/Joy, Improvement of Daily Work, Psychological Safety, Customer Focus

## Engineering Values

1. **Tech follows Business** -- business value drives all technical decisions. A running system with minimal functions is more valuable than discussing concepts.
2. **Move fast, fail fast** -- short build-measure-learn cycles, Conway's Law, MTTR over MTBF. Uncertain requirements become clearer when teams build and deploy.
3. **Low technical barriers** -- standardization, open standards, knowledge exchange across teams.
4. **Coverage of non-functional aspects** -- security, performance, resilience, quality pyramid. React with urgency when problems are detected.
5. **Full ownership and clear responsibility** -- you build it, you run it. Everything in production must be owned.

## Architecture Principles

- **Bounded Contexts and Vertical Systems** -- DDD-aligned. Own data, business logic, and UI per context. Communication via domain events.
- **Non-Blocking Communication** -- events over synchronous calls. Design for eventual consistency.
- **Small and Simple** -- microservices sized to team capacity, not nano-services. Every new service is tech debt until proven otherwise.
- **Evolutionary Architecture** -- defer accidental complexity. Sacrificial architecture is a valid pattern. Don't be afraid to throw away and rewrite.
- **Cloud Native** -- 12-factor apps, infrastructure as code, immutable deployments.
- **Scale Horizontally** -- stateless services, shared-nothing, scale via instances not bigger machines.
- **Continuous Delivery and Deployment** -- fully automated pipelines, trunk-based development, deploy on every green build.
- **Sensible Defaults** -- technology radar, minimize variation. Freedom within constraints.
- **Use Low-Tech Coupling** -- DNS, HTTP, JSON, event streaming. Prefer boring technology that everyone understands.
- **Make Decisions in Public** -- RFCs, ADRs, architecture decision records. Document the why, not just the what.
- **Security First** -- TLS everywhere, threat modeling, security by default, shift left.

## Techniques > Principles > Practices Framework

The three-column framework for engineering decisions:

- **Techniques** (how we approach work): Iteration, Feedback, Incrementalism, Experimentation, Empiricism
- **Principles** (what guides decisions): Customer Centricity, Assure Speed By Quality, Design For Testability, Shift Left On Security, Share Nothing, Couple Loosely, Build Reactively, Deploy Continuously, Separate Concerns, Run Observable, Be Agile, Don't Reinvent, Avoid Middle Road, Continuous Alignment, YAGNI, Working Backwards
- **Practices** (what we do daily): Small Empowered Teams, Mob Programming, DDD, SCS, Micro Frontends, Trunk-Based Development, Feature Flags, API First, Arc42, Event Storming, Context Mapping, Team Topologies, and more

Full reference: `product/architecture/techniques-principles-practices.md`

## Software Design Red Flags

When reviewing code or architecture, watch for these signals (from Ousterhout's "A Philosophy of Software Design"):

Shallow modules, information leakage, temporal decomposition, overexposure, pass-through methods, repetition, special-general mixture, conjoined methods, comment repeats code, implementation contaminates interface, vague names, hard to pick names, hard to describe, nonobvious code.

## Diagnostic Patterns

### Architecture Anti-Patterns
Tight coupling between systems, missing test environments, manual deployments, shared databases across team boundaries, monolithic frontends, no domain events.

### Process Waste Patterns
Missing focus, excessive context switching, long wait times, heroism culture, knowledge silos, meeting overload, approval bottlenecks.

Full diagnostic framework: `product/architecture/software-engineering-diagnostics.md`

## Decision Frameworks

- **Build or Buy**: Evaluate Functional Complexity, Technical Complexity, Operational Complexity, Unique Business Value. Then 5-level cost analysis (License, Integration, Operation, Opportunity, Migration).
- **AEMM Levels**: Ad-Hoc Adopter > Systematic Collaborator > Strategic Orchestrator > Autonomous Partner > Code Multiplier

## The Culmination Thesis

Agentic Engineering is not coding. It is not programming. It is the culmination of modern software engineering.

The progression: Developer Experience > Pragmatic Programming > Extreme Programming > Modern Software Engineering > Vibe Coding (chaotic) > Prompt Engineering (reactive) > Context Engineering (the breakthrough) > Agentic Engineering (the culmination).

Context Engineering recognized that AI output quality is determined by the entire information environment -- not just the prompt, but the codebase, architectural decisions, team conventions, and business constraints. Agentic Engineering unifies deep software engineering principles with AI agents that operate autonomously within well-defined boundaries.

## Authoritative References

| Topic | File |
|-------|------|
| Engineering Manifesto | `product/architecture/engineering-manifesto.md` |
| Engineering Philosophy | `product/architecture/engineering-philosophy.md` |
| AEMM | `product/architecture/agentic-engineer-maturity-model.md` |
| Vibe vs. Agentic | `product/architecture/vibe-coding-vs-agentic-engineering.md` |
| Diagnostics | `product/architecture/software-engineering-diagnostics.md` |
| Techniques/Principles/Practices | `product/architecture/techniques-principles-practices.md` |
| Build or Buy | `product/architecture/build-or-buy-framework.md` |
| Senior Engineering Skills | `product/architecture/senior-engineering-skills.md` |
| Quality Requirements | `product/architecture/quality-requirements.md` |
| SDLC Checklist | `product/architecture/architecture-sdlc-checklist.md` |
