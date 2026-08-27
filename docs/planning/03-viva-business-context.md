# VIVA — Business Context & Ground-Truth Reference

> Concrete facts, current status, and phase-1 scope decisions. This is the document that gets updated when a real-world detail changes (a new phone number, a finished logo, a launched Instagram) — everything else should reference this rather than repeating these facts.

---

## 1. Identity & Contact

| Field | Value |
|---|---|
| Public brand name | VIVA Business Team |
| Registered/trade name | RIMS (same business — see §5 for display handling) |
| Location | Kottakkal, Malappuram district, Kerala — 676501 |
| Phone | 9633334786 |
| WhatsApp | 9995880059 (separate number from Call) |
| Operating days | 7 days a week |
| Operating hours | Long daily hours ("12x7") — **exact open/close time not yet confirmed** (see Open Items, §8) |
| Domain | Not yet registered |
| Google Business Profile | Not yet set up |
| Instagram | Not yet created / no content |
| Facebook | Not yet created / no content |

Because Call and WhatsApp use **different numbers**, every CTA across the site must be explicit about which action dials which number — never assume one number covers both.

---

## 2. Brand Assets

| Asset | Status |
|---|---|
| Brand color | Blue (general direction only — no confirmed hex code) |
| Logo | Not designed yet — to be done later |
| Typography | Not decided |

`05-viva-ui-ux-direction.md` proposes a *starting* palette and type direction to build against now, explicitly flagged as provisional until a real logo exists. Nothing there should be treated as final brand identity.

---

## 3. Content Readiness (as of this planning phase)

| Content type | Status |
|---|---|
| Past projects (100+ estimated) | Real, but photos/video largely **not yet collected/organized** — to be gathered |
| Testimonials/reviews | None collected yet — no written, video, or Google reviews exist |
| Product + pricing list | Does not exist yet in usable form — to be built during development, with real data from VIVA |
| Google Business Profile | Needs to be created from scratch |
| Instagram / Facebook | No content on either |

This is the single most important table in this document for scoping phase 1 realistically. The site is launching **before** most of its intended trust content exists. `04-viva-website-architecture.md` and `06-viva-refactor-blueprint.md` both design around this explicitly rather than assuming a mature archive is ready to populate on day one.

---

## 4. Phase-1 Scope Decisions (confirmed)

- **Priority:** Balanced across portfolio/credibility, Call/WhatsApp leads, and search visibility — no single goal dominates the design.
- **Language:** English only for now. Architecture should not make bilingual support structurally difficult later, but Malayalam is not being built in phase 1.
- **Interaction level:** Purely informational. Call and WhatsApp buttons are the only conversion mechanism — **no enquiry forms, no quote-request forms, no photo-upload forms** in phase 1.

---

## 5. RIMS / VIVA Naming — Display Rule

RIMS is the registered/legal trade name behind the public VIVA Business Team brand — same business, not a related or separate entity. Handling:

- **Public-facing brand everywhere:** VIVA Business Team.
- **RIMS appears only** in the About/Contact page fine print or footer legal line (e.g., *"VIVA Business Team is operated under the registered trade name RIMS."*) and in structured data (`schema.org` `alternateName`) — for search-engine and record consistency, not as a marketing name.
- RIMS is **never** used as a page heading, nav item, or primary CTA label.

---

## 6. Explicit Out-of-Scope for Phase 1

Carried forward and reaffirmed:

- Shopping cart / online checkout / payment gateway
- Live inventory synchronization
- Customer accounts / order management
- Online quotation workflows (multi-step configurators, etc.)
- AI recommendation engines
- Mandatory technical requirement forms
- Fake product-availability indicators
- Multi-language toggle (English only for now)

These can be revisited later against real demonstrated need — not built preemptively.

---

## 7. Technical Environment (for `06-viva-refactor-blueprint.md` — not to be acted on yet)

- **Stack:** Vite + React 19 + TypeScript, single-page application.
- **State management:** Zustand, with `localStorage` persistence.
- **Data:** All product data is currently local/hardcoded — no backend.
- The existing skeleton is a generic e-commerce build (cart/checkout patterns) that needs to be audited and refactored, not rebuilt from zero.

---

## 8. Open Items Log

*(Nothing here is guessed. Each line is either filled in when confirmed, or intentionally shipped as a placeholder with a clear plan.)*

| Item | Status | Needed before |
|---|---|---|
| Exact daily opening/closing hours | Unconfirmed ("12x7" given, no clock times) | Publishing Contact page / GBP |
| Brand hex code | Not decided | Building the visual design system |
| Logo | Not designed | Header/favicon/social assets |
| Typeface | Not decided | Visual design system |
| Real project photos/video | To be collected | Populating Projects pages |
| Testimonials / reviews | None exist yet | Trust-signal sections |
| Real product names + prices | To be built during development | Populating Products catalog |
| Google Business Profile link | Not created | Contact page, footer |
| Instagram / Facebook links | Not created | Footer, social icons |
| Domain name | Not registered | Launch |

No page should silently invent a value for anything in this table. Where content is genuinely missing at build time, the relevant section should be omitted or shown as a clearly-labeled "coming soon" state (defined per-page in `04-viva-website-architecture.md`) rather than filled with a placeholder that looks real.
