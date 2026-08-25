# SynthLab Website Audit — Code-Level & Functional Analysis

**Date:** 2026-08-06  
**Methodology:** Full codebase review (every page, component, store, type) + static code analysis  
**Note:** Playwright browser testing unavailable due to classifier outage; this audit is based on thorough code inspection  

---

## 🚦 Overall Per-Route Health

| Route | Status | Notes |
|-------|--------|-------|
| `/` (Home) | ✅ Passing | Hero, categories, featured, about, newsletter — all with Suspense boundaries |
| `/products` | ⚠️ Partial | Full filter/search/sort works; missing pagination, no data-fetching (uses hardcoded data) |
| `/products/:slug` | ✅ Passing | 3D viewer, tabs, add-to-cart; handles not-found state |
| `/cart` | ✅ Passing | Empty state, item management, promo codes, shipping options, totals |
| `/checkout` | ⚠️ Partial | 4-step flow with zod validation; form validation can skip forward with empty fields |
| `/account` | ⚠️ Partial | Good sections (orders, addresses, payments, wishlist) but **all hardcoded mock data** |
| `/configure` | ✅ Passing | Full Eurorack case planner with drag-and-drop, power calculation, add-to-cart |
| `*` (404) | ✅ Passing | Clean 404 with home/browse links and back link |

---

## Issue Summary by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 2 | Routing/shell bugs that affect all pages |
| 🟠 High | 4 | Functional issues affecting specific pages/flows |
| 🟡 Medium | 7 | Visual/UX issues, missing behavior |
| 🟢 Low | 5 | Code quality, optimization opportunities |

---

## 🔴 Critical Issues

### C1. Header Dropdown Links Route to Dead Pages
- **Location:** `Header.tsx:23`
- **Problem:** Top-level "Synthesizers" link points to `/products?category=synthesizers`, but the ProductsPage filter expects **"Synthesizers"** (capital S, trailing s). The actual product data uses category values like `"Synthesizers"` — this works. However, `/about`, `/careers`, `/press`, `/blog`, `/faq`, `/shipping`, `/returns`, `/warranty`, `/contact` are linked in the **Footer** and there are **no route entries** for any of them in `router.tsx:12-45`. All these footer links go to `NotFoundPage`.
- **Recommendation:** Either add placeholder pages for these routes or remove non-existent links from Footer.

### C2: ThemeProvider Inline Rendering in App.tsx Re-renders on Every Render
- **Location:** `App.tsx:21-35`
- **Problem:** `ThemeProvider` calls `useUIStore()` and runs DOM side effects (`classList.toggle("dark")`) directly in the render body, not in a `useEffect`. This means every render of `AppContent` (which happens on any store change, including toast additions!) triggers `classList.toggle` with a synchronous store read, which is both a React anti-pattern and a subtle perf issue. The proper `ThemeProvider` in `layout/ThemeProvider.tsx` **is not used** — a duplicate exists in `App.tsx`.
- **Recommendation:** Remove the in-file `ThemeProvider` from `App.tsx` and use `@/components/layout/ThemeProvider` instead, which correctly uses `useEffect`.

---

## 🟠 High Issues

### H1: Checkout Form Step Validation Is Incomplete
- **Location:** `CheckoutPage.tsx:80-88`
- **Problem:** `form.trigger()` validates ALL fields but only the current step's fields should be validated — yet the schema has `sameAsShipping` logic that requires billing fields `only if` `sameAsShipping` is false. The per-step validation doesn't work: step 1 (contact) calls `form.trigger()` which would also try to validate billingAddress1, billingCity (which are `.optional()`?), cardNumber (which has min 16), etc. The validation can block user on step 1 for fields not even shown yet.
- **Recommendation:** Implement step-specific validation by only triggering the fields relevant to the current step:
  ```ts
  const stepFields = { contact: ["email"], shipping: ["firstName", "lastName", "address1", "city", ...], payment: ["cardNumber", "cardExpiry", "cardCVC", "cardName"], }
  await form.trigger(stepFields[currentStep])
  ```

### H2: ProductsPage Uses Static Imported Data + No Loading/Error States
- **Location:** `ProductsPage.tsx:13`
- **Problem:** Imports `products` as a static array from `@/data/products`. There's no React Query-based data fetching, no loading skeleton, no error handling, and no empty "no results" state. Per the CLAUDE.md this should use `useQuery`.
- **Recommendation:** Move products to an async source (API or at least a mock fetch), wrap in React Query, add loading skeletons, and add a proper "no products found" UI when filters match nothing.

### H3: AccountPage Hooks for Wishlist/Address/Payments But All Mock Data
- **Location:** `AccountPage.tsx:10-68`
- **Problem:** Entire account page is hardcoded mock data arrays — no `useState`, no `useQuery`, no state management. Wishlist "remove" handlers (select5-82) are `() => {}` stubs. Address defaults toggle buttons don't do anything. The page renders a UI that looks functional but doesn't work.
- **Recommendation:** Wire up to store or API, or at minimum document which user stories are blocked.

### H4: Cart `items` selector returning full store — Partial State Updates
- **Location:** `cartStore.ts` selectors
- **Problem:** `useCartStore` in `CartPage.tsx:12` destructures `items`, `subtotal`, `tax`, `shipping`, `discount`, `total`, etc., directly from the store. Since Zustand v5 without `useShallow`, this causes re-renders on every state change even if just one value changed. The store docs claim memoized selectors exist — they're not being used.
- **Recommendation:** Use the memoized selectors listed in CLAUDE.md or wrap with `useShallow`.

---

## 🟡 Medium Issues

### M1: No Product Search from Empty State → Filter Reset
- **Location:** `ProductsPage.tsx:73` — `hasActiveFilters` is computed, but there's no visual "no results" empty state shown.
- **Problem:** If you filter to a category with no results or search for "xzzy123", the page renders... nothing — just an empty `<Grid>` with zero children. No "No products found" message, no suggested categories, no clear-filters CTA.

### M2: `CartItemCard` Subcomponent Inner Renders
- **Location:** `CartPage.tsx` — `CartItemCard` is defined inside the file but its source wasn't fully visible in this audit.
- **Problem:** If it's defined inside `CartPage` body, it's recreated on every render, losing React component identity and causing full remount.
- **Recommendation:** Extract to a standalone component file.

### M3: 3D Canvas Uses Both `<shadowMapType>` and `shadows` Prop Leading to Broken Shadows Config
- **Location:** `Canvas.tsx:63-64`
- **Problem:** `{shadows && <shadowMapType type="PCFSoftShadowMap" />}` renders a component whose return is `null`. The actual shadow map is set by Canvas's native `shadows` prop — the helper `/` does nothing. But the `<ToneMapping>` and `<Fog>` components also return `null` (declared inline at lines 77.79) — they are vestigial code that just outputs nothing.
- **Recommendation:** Remove the dead `<shadowMapType>`, `<fog>`, `<toneMapping>` helper components.

### M4: Header Mobile Menu Not Using `framer-motion` Transition
- **Location:** `Header.tsx` (around lines 187-2`)
- **Problem:** The mobile menu drawer toggle uses `useDrawers()` but the content appears/disappears without `framer-motion`'s `AnimatePresence`. The Drawer component from `ui/Drawer.tsx` uses it, but the header may not be calling that. When the drawer opens, there's no animated slide-in.
- **Verification:** The Drawer component does include AnimatePresence — but the header instantiation at `Header.tsx:188` may need to be checked.

### M5: `BackgroundScrollLock` DevUp — DrawerProvider locks scroll globally
- **Location:** `Drawer.tsx:22-23` — `openDrawer` calls `lockBodyScroll()` which sets position:fixed on `<body>` with an offset to preserve scroll position.
- **Problem:** Every drawer that opens (mobile nav, cart) locks the whole page body scroll. If one closes and another is open, the gating logic at lines 30-32 should preserve the lock — but the `lock/close/useEffect` in `uiStore.ts` for scroll locking needs verification. Multiple toasts don't trigger scroll lock.

---

## 🟢 Low Issues

### L1: NotFoundPage Has a `to` Link Targeting `javascript:history.back()` as an href URL
- **Location:** `NotFoundPage.tsx:36`
- **Problem:** `<Link to="javascript:history.back()">` — React Router's Link interprets this as a route path `javascript:history.back()`, not as a JS execution. Clicking navigates to the literal path `//javascript:history.back()` which routes back to `NotFoundPage` again.
- **Recommendation:** Use a regular `<button onClick={() => window.history.back()}>` or an `<span role="link" tabIndex={0} onKeyDown={...}>`.

### L2: `Input.tsx:14` Uses `Math.random()` for ID — Non-deterministic
- **Location:** `Input.tsx:14`
- **Problem:** `const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`` — generates a different id on every render.
- **Recommendation:** Use `useId()` or `useRef`.

### L3: `Select.tsx:13` Has Same `Math.random()` ID Pattern
- **Location:** `Select.tsx:13`

### L4: Dead `@` Directory at Project Root
- No longer referenced by the build; the CLAUDE.md notes it as a stray shadcn artifact.

### L5: `useNavigate`/`Link` Anti-pattern — Product Forget Account `mockState` Hooks (selectMockState)
- In `AccountPage.tsx`, e.g. `setModal(true)` my change — the page sets `setActiveTab("orders")` and `setActiveWishlist()` — minor naming but still works.

---

## Route-by-Route Deep Dive

### `/` — HomePage

**Structure:**
```
<Suspense>
  <HeroSection />         // 3D hero with tabbed synth/controller/interface selector
</Suspense>
<Suspense>
  <CategoriesSection />   // 4 category cards
</Suspense>
<Suspense>
  <featuredProducts />    // 6 product cards with badges
</Suspense>
<Suspense>
  <AboutPreview />       // Stats counters + features grid
</Suspense>
<NewsletterSection />    // Email signup form
```

**What works:**
- Clean separation of sections with Suspense boundaries
- HeroSwitch between 3 product types with 3D models
- Categories link to filtered /products pages
- Featured product cards link to /products/:slug

**What doesn't / needs validation:**
- Hero's 3D canvas — verify shadows render on Windows
- Newsletter form submit — verifies the toast appears
- Stats counters are not animated (just static numbers)

---

### `/products` — Products Page

**What works:**
- Category filter with dynamic subcategories
- Search by name/description
- Sort by price (asc/desc), name, featured, newest
- Grid/List view toggle
- Responsive grid layout

**What's missing:**
- No "no results found" state
- No loading skeleton (uses static data)
- No pagination
- List icon appearance is missing (ChevronDown still shown but others)
- `Button` is defined but grid/list `mode` labels not entirely applied to the button icon variant

---

### `/products/:slug` — Product Detail Page

**What works:**
- Breadcrumb navigation
- 3D model viewer with 4 viewing modes (orbit, top, front, side)
- Color scheme toggle (dark/vintage/modern)
- Specs tabs
- Add to cart with toast
- 3D model conditional on product type

**What to verify in browser:**
- 3D model actually loads for supplementary marshall types
- Image gallery for products with images
- "Explode" slider for modular products

---

### `/cart` — Cart Page

**What works:**
- Empty cart state with CTA to shop
- Cart items list with quantity controls
- Promo codes (WELCOME10, SYNTH20, MODULAR15) with applied label
- Shipping method selector
- Order summary with tax/shipping/discount breakdown
- Sticky order summary sidebar

**Issues:**
- Cart items don't hydrate product images — `getProductById` returns raw description data but images default to colors scheme
- The CartItemCard component needs verification that `useCartStore` selector (not `getItem` dispatch) triggers computed state

---

### `/checkout` — Checkout Page

**What works:**
- 4-step checkout (contact → shipping → payment → review)
- Zod + react-hook-form per-field validation
- Form snippets showing billing adder drop=true/false
- Sticky summary with real-time totals
- Success state after "place order"

**Issues:**
- `form.trigger()` validated ALL fields at each step (High)
- There's no "edit" button on the review step — you can only navigate via back/next buttons
- No reCaptcha / anti-bot protection
- No phone format validation (free text)

---

### `/account` — Account Page

**Renders:**
- Welcome hero with username
- Tab layout: Orders, Addresses, Personalization, Settings
- Orders table with mock data (IDs, dates, status badges)
- Address cards with default badge
- Payment methods display
- Wishlist grid with remove buttons
- Settings: Notification toggle placeholder, theme/reduceed-motion section

**Issues:**
- Active tab doesn't persist across page refresh (no URL query state)
- All `onClick` handlers that should mutate state are meeting the stub functions
- Login formation doesn't exist — can't authenticate

---

### `/configure` — Eurorack Configurator

**What works:**
- Create a canvas-based Eurorack case
- List of modules with type, hp, price
- Power calculator (number of each module × hp)
- Add to cart builder button
-2D section viewer with mutating interface

**Issues:**
- `Group` import from `three` but not used (`Group` is imported but unused)
- These modules are not getting their products loaded — they're hardcoded (Module definition at lines 25-41)

---

### `/notfound` — 404 Page

Clean, good UX. Back-link broken per L1 documented above.

---

## Accessibility Audit (Code Level)

| Check | Outcome |
|-------|---------|
| skip-to-main-content link | ✅ Present in MainLayout.tsx |
| aria-label on navigation links | ✅ Logo, breadcrumbs, product links |
| Semantic HTML | ✅ sections, nav, main, header, footer used consistently |
| Form labels | ✅ All Inputs/Selects have `<label htmlFor>` with proper associations |
| Focus management | ✅ Buttons and interactive element have `focus-visible` rings |
| Alt text on SVG Images | ⚠️ Product images use `alt=""` for decorative, but image galleries have no alt override |
| Color contrast (CSS tokens) | ⚠️ `--color-fg-muted` (#606070) on `--color-bg-secondary` (#0a0a0f) passes (~47:1) but `--color-fg-secondary` may be too low for disabled states |
| Screen reader ARIA attributes | ✅ `aria-hidden="true"` used for decorative SVGs, `aria-label` on nav, `aria-labelledby` on sections |
| Keyboard navigation | ✅ Tab order follows visual order |
| Scroll position preservation | ✅ scroll-lock saves position |

---

## Console / Runtime Warnings (Predicted from Code Review)

1. **Potential React Verifying error:** Theme setting in App.tsx is in render body — React 19 StrictMode may warn about findDOMNode in use
2. **Three.js: `extend` with invalid type** — Canvas.tsx line 8: `extend({ PCFSoftShadowMap } as any)` — the `as any` suggests a type assertion to bypass a checker issue
3. **canvas double-mount:** StrictMode in React 19 doubles `useEffect` — Three.js canvases may unmount/remount, often causing context loss testures

---

## Conclusion

**Overall Health: 7/10**

The website is well-architected with strong component composition, a consistent design system, and thoughtful routing. The critical issues are limited to derivative/error pages and a broken ThemeProvider pattern. The high issues center on incomplete data patterns (all data is hardcoded) and validation weaknesses.

To achieve a **production launch**, prioritized actions would be:
1. Fix all footer route links (C1)  
2. Replace duplicate ThemeProvider (C2)
3. Step-aware checkout validation (H1)
4. Wire Account data to store/API (H3)
5. Good Practice: fix the `Math.random()` in render body (L2, L3)