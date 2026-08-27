# VIVA — Refactor Blueprint (Codebase-Grounded)

> Implementation roadmap for the existing Vite + React 19 + TypeScript SPA. This replaces the original's generic Phase 0–12 plan with steps grounded in the actual stack: Zustand + localStorage state, fully local/hardcoded product data, no backend.

---

## Guiding Hierarchy (unchanged principle, still correct)

```text
REAL BUSINESS
    ↓
REAL CUSTOMER JOURNEYS
    ↓
REAL BUSINESS CAPABILITIES
    ↓
INFORMATION ARCHITECTURE
    ↓
CONTENT / DATA MODEL
    ↓
UI/UX
    ↓
CODE IMPLEMENTATION
```

Every phase below assumes the five documents that precede this one are the source of truth. Nothing here should be started before that sequence — starting from the existing e-commerce UI and relabeling it is the one thing to explicitly avoid.

---

## Phase 0 — Repository Audit

Before any change:
1. Inventory the current Vite/React/TS SPA: routes, page components, shared/reusable components (cards, grids, layout shell, nav, footer).
2. Inventory the Zustand store(s): what's cart-related (to be removed) vs. genuinely reusable UI state (filters, active tab, etc.).
3. Inventory the current product data shape and where it lives (local file(s)/constants).
4. Confirm the styling approach actually in use (Tailwind / CSS Modules / styled-components / plain CSS) — this wasn't specified and shouldn't be assumed; check the repo directly.
5. Produce a migration map:
```text
KEEP     — layout shell, routing setup, reusable card/grid primitives, styling system
CHANGE   — data shapes, page composition, CTA components
REUSE    — image handling, responsive utilities, any existing design tokens worth keeping
REPLACE  — product data model, homepage composition
REMOVE   — cart store/slice, checkout flow, add-to-cart UI, cart persistence in localStorage
```

---

## Phase 1 — Business Configuration Layer

Create a single `config/business.ts` (or equivalent) as the one source of truth for: brand name, legal name (RIMS), address, phone, WhatsApp, hours, social links, Google Business link, brand tokens (color/type). Every page/component reads from this — nothing about VIVA's identity gets hardcoded more than once anywhere in the codebase.

---

## Phase 2 — Data Model Refactor

Replace the e-commerce `Product` shape (with cart/quantity/stock fields) with the three content entities defined in `04-viva-website-architecture.md`: `Project`, `Service`, `Product` (redefined). Given there's no backend, these remain local TypeScript/JSON data files — same pattern as today's product data, just reshaped and split by entity. This is the pragmatic v1 answer to "manually maintained" content: editing a structured data file and redeploying, not a CMS. If that workflow proves too heavy for whoever ends up maintaining content day-to-day, a lightweight admin interface or headless CMS is a reasonable phase-2 addition — not needed to launch.

---

## Phase 3 — Strip E-Commerce Conversion Logic

Remove the cart Zustand slice and its `localStorage` persistence, the checkout flow, and every Add to Cart / Buy Now / Cart icon in the UI. Zustand itself can stay for genuinely useful lightweight UI state (active filters, mobile menu open/close) — it's the cart-specific usage that goes, not the tool. Replace commerce CTAs with the Call/WhatsApp CTA component (with the pre-filled-message deep-link pattern from `05-viva-ui-ux-direction.md`).

---

## Phase 4 — Build the Projects System

Implement the `Project` data shape from `04-viva-website-architecture.md`, the category filter (client-side, since the dataset is small), the grid, and the detail page supporting both rich and visual-only records. Populate with whatever real, usable project photography exists at the time — small and real beats large and placeholder.

---

## Phase 5 — Build the Services Layer

Implement the six fixed services as structured data (consistent with Projects/Products) rather than hardcoded components, so all three content types are edited the same way.

---

## Phase 6 — Refactor the Product Catalog

New `Product` shape: no quantity/stock/cart fields; category, brand, model, price (nullable → renders "Contact for price"), specs, use-cases, optional linked project id. Category filter chips. Call/WhatsApp CTA in place of purchase actions.

---

## Phase 7 — Homepage Composition

Build the eight-block sequence from `04-viva-website-architecture.md`, driven by real (even if currently small) Projects/Services/Products data — including the trust-block empty-state logic (no reviews yet → lead with range-of-work + founder narrative; swappable later without a rebuild once real reviews exist).

---

## Phase 8 — About & Contact

Business-config-driven content; the RIMS legal-name line placed per the confirmed location from `04-viva-website-architecture.md`; sticky mobile Call/WhatsApp bar implemented once, used globally.

---

## Phase 9 — Visual System

Implement the color/type direction from `05-viva-ui-ux-direction.md` as design tokens (CSS variables, or Tailwind theme config — depends on what Phase 0's audit finds already in place). Structured so swapping the provisional blue for a confirmed brand blue later is a token change, not a rewrite.

---

## Phase 10 — Content Population Workflow

Define a simple, repeatable format for adding a project/product/service (a template object to copy/fill), so content can be added incrementally as photography and pricing get collected — without needing to touch component code each time. Recommend launching with a curated, honest subset rather than delaying for the full 100+ archive.

---

## Phase 11 — Local SEO Groundwork *(net-new — absent from the original plan)*

- `schema.org` `LocalBusiness` structured data sourced from the Phase 1 business-config file, including `alternateName: "RIMS"` for NAP consistency.
- Page titles/meta descriptions reflecting real local search intent (e.g., "Car Audio Installation — Kottakkal, Malappuram" rather than generic titles).
- Sitemap and clean heading structure across Projects/Services/Products.
- Google Business Profile creation and linking, once set up (see `03-viva-business-context.md` §8).

---

## Phase 12 — Measurement *(net-new)*

At minimum, event tracking on every Call and WhatsApp click (which page, which button) — the site's entire purpose is those two actions, so it needs to be measurable from day one. Doesn't need to be elaborate: a lightweight analytics setup is enough for phase 1.

---

## Phase 13 — Quality Assurance

**Functional:** all routes work · every project/service/product link works · Call/WhatsApp actions dial/open correctly to the right number · zero cart/checkout paths remain anywhere · prices (or "Contact for price") display correctly.

**Content truthfulness:** no fake projects · no fake testimonials · no fake stock status · no invented technical claims · no invented prices.

**Responsive:** verified on mobile, tablet, and desktop — mobile first, given the audience.

**Business truth check:** *Does this website represent how VIVA actually works today?* If any page reads like a generic electronics shop rather than an expert solutions business, it goes back for revision before launch.

---

## Launch Readiness

Cross-check against the Open Items Log in `03-viva-business-context.md` §8 before publishing — every row should be either resolved or intentionally shipped as a clearly-labeled placeholder, never silently guessed.
