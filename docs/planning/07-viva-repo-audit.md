# VIVA — Repository Audit (Phase 0)

> Grounded in direct inspection of `github.com/MuzammilCk/viva`, commit `935140f` (current `main`) — not the pre-existing audit docs already sitting in the repo, which are stale (see §0). This document replaces the generic "Phase 0" section of `06-viva-refactor-blueprint.md` with real file paths.

---

## 0. Important: The Repo's Own Audit Docs Are Stale — Don't Trust Them

The repo root already contains five documents that look like audits: `AGENTS.md`, `AUDIT.md`, `CLAUDE.md`, `UI_UX_AUDIT_REPORT.md`, `WEBSITE_AUDIT_PLAYWRIGHT.md`. All five describe an earlier version of this app with a **Three.js 3D product configurator**, procedural 3D models, and a nested `music-electronics-shop/` subdirectory — none of which exist in the current code.

Git history explains why:

```text
4f33acf  first commit
c77fd98  add synthlab app source, config, docs and agent skills   ← these 5 docs were written here
935140f  refactor ui/ux to light editorial theme with shadcn/base-ui, remove three.js   ← current HEAD
```

All three commits landed the same day. The final refactor removed the entire 3D system, but the five docs were never regenerated afterward — they still describe the pre-refactor app in detail (`UI_UX_AUDIT_REPORT.md` and `WEBSITE_AUDIT_PLAYWRIGHT.md` alone mention Three.js/3D/the configurator 27 and 12 times respectively).

**Recommendation:** delete or archive all five before doing real refactor work on this repo — `CLAUDE.md` and `AGENTS.md` in particular are the kind of file a future AI coding session (including a future me) would read as ground truth, and right now they'd be reading fiction. Everything below is verified directly against the actual files, not against these docs.

---

## 1. Confirmed Tech Stack (verified, supersedes `03-viva-business-context.md` §7's summary)

| Area | What's actually there |
|---|---|
| Framework | React 19.2.7, Vite 8.1.1, TypeScript ~6.0 (strict) |
| Routing | React Router DOM 7 (`createBrowserRouter`, lazy-loaded routes) |
| State | Zustand 5 — `cartStore`, `wishlistStore`, `uiStore` (theme, mobile menu, announcement bar), all `localStorage`-persisted |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`, no separate config file) + a genuinely well-built OKLCH design-token system in `src/index.css` |
| Components | shadcn/ui (`style: base-nova`) + Radix UI + `@base-ui/react` primitives — ~28 primitive components already in `src/components/ui/` |
| Forms | react-hook-form + zod + @hookform/resolvers (installed; only currently used in Checkout) |
| Data fetching | TanStack React Query — installed and wired up in `App.tsx`, but there's no real API; everything reads from a local file. Likely unnecessary for a fully static-content site. |
| Animation | Framer Motion |
| Notifications | Sonner (toast) |
| Theming | Already fully wired: light/dark/system toggle via `uiStore`, cycled from the header |
| Fonts | Already installed: **Geist Variable** (sans, UI) + **Newsreader Variable** (serif, display/headings) |

This is a meaningfully more capable starting point than "generic e-commerce skeleton" suggested — the component and design-token layer is solid; it's the **content, data model, and page composition** that are wrong for VIVA, not the engineering foundation.

---

## 2. Current Identity — Confirmed Fully Hardcoded Demo Content

Everything below is real text found in the current code, not a guess:

- Brand name **"SynthLab"** hardcoded directly in `Header.tsx` and `Footer.tsx` JSX (not from a config file).
- Fake US contact details in `Footer.tsx`: phone `+1 (555) 012-8899`, email `support@synthlab.shop`, address `440 Signal Path Ave, Portland, OR 97209`.
- Fake claims: `"Independent music-electronics retailer since 2016"`, `"Free standard shipping on orders over $150 · 30-day returns · 2-year warranty"` (in the header announcement bar), `"Prices include a 2-year SynthLab warranty at no extra cost"` (footer).
- `src/data/products.ts` (729 lines) is a fully fictional synth-shop catalog — products like "SynthLab Pro 8" and "Arturia KeyLab 61 MkII," complete with fabricated star ratings and review counts (e.g. `rating: 4.8, reviewCount: 214`) and finish/color variants.
- Full **Account** page/route (no real auth behind it), a **Wishlist** store + header icon, and a complete **Cart → Checkout** flow with shipping/tax/promo-code logic.

None of this is salvageable content — it's a coherent demo for a different business, which is exactly what `01-viva-expert-opinion.md` predicted before this repo was even opened.

---

## 3. Current Route Map → Disposition

| Route | Current purpose | Disposition |
|---|---|---|
| `/` | Home (Hero → ValueProps → FeaturedProducts → Categories → AboutPreview → Newsletter) | **Rebuild** per `04-viva-website-architecture.md` §1 |
| `/products`, `/products/:slug` | Catalog + detail | **Refactor** — reshape data model, strip cart actions (§4 & §6 of architecture doc) |
| `/cart` | Cart page | **Remove** |
| `/checkout` | Multi-step checkout | **Remove** |
| `/account` | Account/wishlist area | **Remove** |
| `/configure` | Redirects to `/products` (leftover from the removed 3D configurator) | **Remove** the redirect entirely once nothing links to it |
| *(none)* | Projects, Services, About, Contact | **New** — don't exist yet, need building from scratch |

---

## 4. File-Level Migration Map

```text
KEEP AS-IS
  src/components/ui/*                 — shadcn/Radix primitives, not shop-specific
  src/lib/utils.ts                    — cn() helper
  src/index.css (design tokens)       — real system, just needs primary color swapped later
  src/router.tsx (structure)          — lazy-loading pattern, MainLayout wrapper
  vite.config.ts                      — aliases + build config are fine
  src/pages/ErrorPage.tsx, NotFoundPage.tsx

REUSE THE PATTERN, REPLACE THE CONTENT
  src/components/layout/Header.tsx    — nav array, theme toggle, mobile Sheet menu all reusable;
                                         remove Wishlist/Cart icons + announcement bar copy,
                                         replace nav items, replace hardcoded "SynthLab"
  src/components/layout/Footer.tsx    — grid structure reusable; every string in it is fake and
                                         must be replaced with BusinessConfig-driven data
  src/components/layout/MainLayout.tsx
  src/components/catalog/ProductCard.tsx — layout reusable, needs real image instead of
                                         generated "ProductArt", real price/"Contact for price"

REPLACE OUTRIGHT
  src/types/index.ts                  — Product/CartItem/Order/Address/PaymentMethod/User types
                                         are e-commerce-specific; replace with Project/Service/
                                         Product/BusinessConfig from 04-viva-website-architecture.md
  src/data/products.ts                — entire 729-line fake catalog
  src/components/sections/*           — Hero/Categories/FeaturedProducts/AboutPreview/Newsletter
                                         all reference fake data or an out-of-scope feature
                                         (Newsletter isn't part of the VIVA model at all)
  src/components/catalog/ProductArt.tsx — generated placeholder "art"; VIVA uses real photography

REMOVE
  src/pages/CartPage.tsx, CheckoutPage.tsx, AccountPage.tsx
  src/components/shop/CartSheet.tsx
  src/store/cartStore.ts, wishlistStore.ts
  "/cart", "/checkout", "/account", "/configure" routes in router.tsx
  Wishlist + Cart buttons in Header.tsx

NEW (nothing to migrate from)
  src/data/projects.ts, services.ts   — per the Project/Service shapes in the architecture doc
  src/config/business.ts              — BusinessConfig single source of truth (see §5)
  src/pages/ProjectsPage.tsx, ProjectDetailPage.tsx, ServicesPage.tsx,
    AboutPage.tsx, ContactPage.tsx
  A persistent Call/WhatsApp sticky bar component
```

---

## 5. Findings That Update Earlier Documents

- **Dark mode is already fully built and working** (OKLCH tokens for both `:root` and `.dark`, a working theme cycle in the header, `next-themes`-style persistence via `uiStore`). `05-viva-ui-ux-direction.md` listed dark mode as "explicitly not doing" — that was written without knowing this. Since it already exists and costs nothing extra to keep, **recommend keeping it** rather than ripping it out. Flag if you'd rather simplify by removing it anyway.
- **Fonts already installed are Geist Variable (sans) + Newsreader Variable (serif/display)** — this lines up closely with the UI/UX doc's proposed direction (clean sans + a more distinctive display face for headings) without needing to add anything new. Recommend reusing these rather than introducing different fonts, unless a real logo later suggests otherwise.
- **A `SiteConfig`-shaped type already exists** in `types/index.ts` (name, tagline, description, url, email, phone, address, social) — close in spirit to the `BusinessConfig` entity proposed in the architecture doc. Phase 1 of the blueprint can extend this shape (add WhatsApp, legal name/RIMS, hours, GBP link) rather than inventing a parallel structure.
- **The existing primary color token** (`oklch(0.46 0.18 280)`, a blue-violet) is a generic template default, not anything VIVA-specific — it'll be swapped for the real brand blue once confirmed, but the fact that color is already token-based (CSS variables, not hardcoded per-component) means that swap will genuinely be a one-line change, not a hunt through components.
- **Two small cleanups worth doing while in this code anyway, low priority:** a `@hooks` path alias is declared in `vite.config.ts` and `components.json` but `src/hooks/` doesn't exist; and TanStack Query is installed and wired into `App.tsx` but there's no real API behind it — worth a deliberate keep-or-drop decision in Phase 0 rather than carrying it forward by default.

---

## 6. Still Open

This audit covers the **code shell only**. It doesn't change anything in `03-viva-business-context.md` — real photos, real product prices, testimonials, the confirmed hex/logo, and exact hours are still needed before Projects/Products/Home can be populated with anything real (§3 and §8 of that document). The confirmation questions at the end of `04-viva-website-architecture.md` are also still open and worth settling before building pages against them.
