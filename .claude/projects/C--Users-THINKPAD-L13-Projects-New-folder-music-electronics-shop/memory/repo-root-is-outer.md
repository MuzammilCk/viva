---
name: repo-root-is-outer
description: The live SynthLab app lives at the outer repo root, NOT the music-electronics-shop/ subdirectory CLAUDE.md describes
metadata:
  type: project
---

The real Vite app root is `C:/Users/THINKPAD L13/Projects/New folder/music-electronics-shop/` (outer). `src/main.tsx` and `src/App.tsx` both `import "./index.css"`, resolving to the **outer** `src/index.css`. The `music-electronics-shop/` subdir contains only an orphan `src/index.css` (759 lines) — nothing imports it.

CLAUDE.md is stale on this point: it claims the app "lives in the `music-electronics-shop/` subdirectory." That caused the previous session's Phase 1.1 work to strand its premium cybernetic CSS in the orphan file. On 2026-08-15 the premium tokens (glass-cyan, bg-scanline, audio scrollbar, glow shadows, ambient body gradient, pulse-glow/shimmer/float/spin-slow keyframes) were merged by hand into the live outer `src/index.css`.

Also: repo is **not a git repository** (no `.git`). Worktree isolation for parallel write-agents is unavailable — parallel Workflow agents must write strictly disjoint file sets or they clobber.

**Why:** A refactor that edits the orphan file edits nothing the build uses; treating the subdir as the app wastes the whole session.
**How to apply:** All file paths target the outer root (`src/...`, `vite.config.ts`, `package.json`). Ignore CLAUDE.md's "lives in subdirectory" claim. For parallel agents, partition by disjoint files, not by worktree.
