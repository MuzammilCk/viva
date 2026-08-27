@AGENTS.md

## Claude Code specifics

- The seven files in `docs/planning/` are deliberately **not** imported here — importing them would load all of them into every single session's context. Open the specific one you need with the Read tool at the start of each phase (see the table above for which one).
- Run `/context` after reading this file to confirm `AGENTS.md` loaded under Memory files. It confirms this file loaded — it won't show the planning docs, since those load on demand, not at launch.
- Use plan mode (`Shift+Tab` until `⏸ plan mode on`) for any phase touching the data model, routing, or more than ~3 files. Skip it for small, obviously-scoped fixes.
- Finish and verify one phase, then run `/clear` before starting the next — don't carry all 13 phases of history in one session.
- Before marking a structural phase done (Phase 3, 8, or 13 from the blueprint especially), delegate to a subagent in a fresh context: "Review this diff against docs/planning/04-viva-website-architecture.md and docs/planning/03-viva-business-context.md. Report gaps only, not style preferences." A fresh-context reviewer catches invented facts the implementing session has stopped noticing.
- `scripts/verify-content.sh` is written as a plain script so it works as evidence in any tool. In Claude Code specifically, it can also be wired up as a Stop hook so it's a deterministic gate instead of something you have to remember to run — worth doing once things stabilize, but not required to start. (This file intentionally doesn't point you to further project documentation beyond `docs/planning/` — the operating manual is held by the person, not the repo.)
