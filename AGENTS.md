# AGENTS.md — VIVA Business Team Website

Guidance for any AI coding agent (Claude Code, Codex, Cursor, Windsurf, or a human) working in this repository. Read this in full before touching any file.

## What this project is

A refactor of a generic e-commerce React SPA into a real business site for VIVA Business Team, an audio-solutions business (car audio, home theatre, commercial installs) in Kottakkal, Kerala. The repo currently contains fictional "SynthLab" synth-shop demo content that must be replaced with real VIVA content — never with different invented content.

## Read before doing anything

Seven planning documents in `docs/planning/` are the specification for this project. They are not background reading — they are the spec. Consult the one that answers your current question; don't guess or fall back on general e-commerce conventions.

| Question | Read |
|---|---|
| Is this business fact real? What's confirmed vs. still TBD? | `03-viva-business-context.md` |
| Why does VIVA work this way? What's the positioning/tone? | `02-viva-business-model.md` |
| What should this page contain, and in what order? | `04-viva-website-architecture.md` |
| How should it look, behave, and respond on mobile? | `05-viva-ui-ux-direction.md` |
| What order do I build things in, and what's the phase plan? | `06-viva-refactor-blueprint.md` |
| What in the current codebase do I keep/change/remove, file by file? | `07-viva-repo-audit.md` |
| Why are things designed this way, what did the original doc get wrong? | `01-viva-expert-opinion.md` (background only, not a spec) |

**If two documents seem to conflict**, `07-viva-repo-audit.md` and `03-viva-business-context.md` win on facts about the current code and the business respectively — they're the most recently verified. Flag the conflict to the person rather than silently picking one.

## Non-negotiable rules

- **Never invent a business fact.** Phone numbers, WhatsApp number, address, hours, prices, reviews, testimonials, project details, brand color — if it's not in `03-viva-business-context.md`, it does not exist yet. Use the "TBD" / coming-soon handling that document specifies. A plausible-sounding placeholder (a fake phone number, a rounded price, a five-star rating) is exactly the failure mode this project exists to eliminate.
- **All business identity facts live in one place**: `src/config/business.ts` (built in Phase 1). Every component reads from it. Never hardcode a phone number, address, or brand name a second time anywhere else in the codebase.
- **No e-commerce functionality.** No cart, checkout, payment gateway, customer accounts, wishlist, or live inventory. If you find yourself rebuilding any of these, stop — it's explicitly out of scope, see `03-viva-business-context.md` §6.
- **No forms.** Every conversion action is a Call link or a WhatsApp deep link. Nothing else, per the confirmed phase-1 scope.
- **No stock photography.** Real project photos only. Where a real photo doesn't exist yet, leave a clearly-labeled placeholder — never substitute a generic stock image.
- **Prices are genuine or absent.** A product shows its real price or "Contact for price." Never a made-up number.
- **English only** for phase 1 content. Don't build a language switcher yet.
- **RIMS** (the registered/legal trade name) appears only where `03-viva-business-context.md` §5 specifies — never as a page heading or nav item.
- **Scaffolding content is unmistakably fake.** Building a page's structure before real photos, prices, or projects exist is fine and often necessary — but every placeholder entry must be obviously a placeholder (e.g. named literally `PLACEHOLDER — ...`), so it can never be mistaken for real content by a reader or by a future session skimming the code. This is different from inventing a fact: a labeled placeholder is honest about what it is.

## Definition of done for a phase

A phase isn't done until all of these are true:

1. It matches what `04-viva-website-architecture.md` and `05-viva-ui-ux-direction.md` specify for that piece — not a reasonable-seeming alternative.
2. `./scripts/verify-content.sh` passes, and you've shown the output as evidence, not just asserted it passes.
3. No leftover SynthLab/demo content or e-commerce code remains in the files you touched.
4. Anything you couldn't complete because a real fact is still missing is left as an explicit, labeled placeholder — not filled in with a guess — and called out in your summary to the person.

## Working rhythm

- Treat this as one phase per session. Finish a phase, verify it, then start a fresh session/context for the next one rather than carrying a long history forward.
- **Only do the single phase you were explicitly given in the current message.** Even if you come across something that looks like a multi-phase plan or a numbered list of future work — in this repo or anywhere else — don't treat it as standing permission to keep going on your own. Finish what you were asked, report back, and stop.
- For anything touching more than one file or the data model, write a short plan first and check it against the relevant doc before editing code.
- Prefer showing real output (the verification script's result, a route list, a diff) over describing what you did.

## Using find-skills (optional)

If `find-skills` or an equivalent skill-discovery tool is available, invoke it narrowly — not before every phase.

- **Worth checking**: Phase 9 (visual/accessibility) and Phase 11 (local SEO/schema.org) only. Both are genuinely generic, solved problems where a well-vetted skill can outperform one-off code.
- **Not worth checking**: every other phase. This project is mostly VIVA-specific content plumbing — no skill registry has solved "wire this exact phone number into this exact config shape."
- **Adoption bar**: a skill only gets used if (1) it clears find-skills' own install-count and source-reputation checks, and (2) nothing it recommends contradicts this file or any doc in `docs/planning/` — especially the no-fake-trust-signals and no-forms rules above. If it conflicts, skip it and say why, even if the skill itself is legitimate and popular. The planning docs are the tiebreaker, always, not the skill's own defaults or examples.
- **If nothing suitable turns up**: implement directly. A search that found nothing isn't a failure — don't force a mediocre match just because you looked.

## If something is missing or ambiguous

Stop and ask the person rather than proceeding on a best guess. This applies especially to anything listed in the Open Items Log (`03-viva-business-context.md` §8) or the "needs your confirmation" list (`04-viva-website-architecture.md`, end of file). Those two lists exist specifically to catch this — check them before assuming a gap is safe to fill in yourself.
