# VIVA — Website Architecture

> Every section below states its purpose, what it contains, how it behaves with today's thin content, and what it needs from the data model. Nothing here is final — flag anything you want changed and only that section gets revised.

---

## Guiding Shift

```text
FROM:  Products → Cart → Checkout
TO:    Projects + Services + Products + Direct Contact
```

Four pillars, unchanged in spirit from the original blueprint, each finally given a concrete page behind it:

1. **Projects** — proof of what VIVA has actually done.
2. **Services** — what VIVA can solve and provide.
3. **Products** — what VIVA stocks, supplies, and recommends.
4. **Contact** — direct access via Call and WhatsApp.

---

## Global Structure (applies to every page)

- **Primary navigation:** Home · Projects · Services · Products · About · Contact — six items, no more. No dedicated "Environments" or "Reviews" nav item (reasoning under Home and Projects below).
- **Persistent contact affordance:** a sticky Call + WhatsApp bar/button visible on every page, not just the footer — these are the site's only two conversion actions, so they should never be more than one tap away, especially on mobile.
- **Footer:** business identity, address, phone, WhatsApp, hours (once confirmed), social links (once they exist), Google Business link (once created) — pulled entirely from the business-config data source, never hand-typed per page.
- **URL/slug convention:** `/projects/[slug]`, `/services/[slug]`, `/products/[slug]` — human-readable, not numeric IDs, for both usability and SEO.

---

## 1. Home

**Purpose:** Establish VIVA as a capable, experienced audio solutions business within seconds — and do it credibly with the content that exists *today*, not the content that will exist eventually.

**Structure (in order):**

1. **Brand statement / value proposition** — one clear line + supporting sentence, in the register of *"Tell us what you want to achieve. We design the system and make it work."* (from the business model's differentiation section) — not a generic hero tagline.
2. **What VIVA solves** — the entry-mode range (product / guidance / full solution / repair / custom) shown as short, scannable outcomes, not a features list.
3. **Featured work** — a curated set of real projects. **Not** framed as "100+ projects" (the count isn't meant to be public per the business model) — framed as quality, not volume. Launches with however many real, well-photographed projects exist at build time (see Empty-State below), designed to look intentional at 8 projects and still work at 80.
4. **Capabilities / service categories** — the six service areas as short cards, outcome-led (see Services below).
5. **Environments served** — vehicles and non-vehicle spaces, shown as a simple icon/text row, not a separate page (see reasoning below).
6. **Selected products** — a small curated set, not the full catalog, each linking through to the Products page.
7. **Trust/expertise signals** — see Empty-State handling directly below. This block adapts as real content becomes available; it does not sit empty or fake.
8. **Direct Call/WhatsApp CTA** — closing section, reinforcing the persistent sticky bar.

**Empty-state / bootstrapping behavior:**
Reviews and testimonials don't exist yet. Rather than an empty "What customers say" section or a fabricated one, step 7 leads with what's real *right now*: range of environments served, breadth of past work (described qualitatively — "cars, buses, cafés, home theatres, and everything between," not a number), and the founder's hands-on-every-job model. Once real GBP/written reviews exist, this section is replaced with actual quotes — the layout is built to accept that swap without a redesign.

**Why no dedicated "Environments" page:** Vehicles vs. non-vehicle spaces are better used as a *filter/tag* inside Projects and Services than as a seventh nav item. A dedicated page would either duplicate Projects content or sit thin on its own. Flag this if you'd rather have it as a standalone page.

**Why no dedicated "Reviews" page:** With zero reviews currently, a standalone nav item would launch empty. Testimonials live as a block on Home/About and get promoted to their own page later, once there's enough real content to justify one.

---

## 2. Projects

**Purpose:** The strongest asset the business has — real evidence, not claims.

**Structure:**
- Filterable grid by category: Vehicles (Cars / Buses / Auto Rickshaws), Home & Theatre, Cafés & Restaurants, Commercial/Business, Custom Work, Repair/Restoration, Other. Filtering is a simple client-side tag filter — the dataset is small enough that it doesn't need a backend search.
- Each project card: cover image, title, category tag, one-line summary.
- **Project detail page** supports flexible depth per project:
  - *Rich record:* requirement, challenge, solution approach, components used, full media gallery.
  - *Visual-only record:* title, category, short description, images/video — nothing fabricated to fill gaps where only photos exist.
- Where relevant, a project can link to specific Products used in it (optional relationship, not mandatory).

**Empty-state / bootstrapping behavior:** Launches with whatever real projects have usable photos at build time — even if that's a small first batch. New projects get added incrementally as photography is collected (a `06-viva-refactor-blueprint.md` content-workflow question, not a design problem). The grid layout should look complete at any count above roughly 6–8, not require a "full" archive to look finished.

**CTA on every project:** "Discuss a similar project" → WhatsApp, pre-filled with the project name as context.

---

## 3. Services

**Purpose:** Communicate what VIVA can solve, described from the customer's outcome, not as a purchasable SKU.

**The six services** (from the business model, Modes A–E plus after-sales):
1. Complete Audio Solutions
2. Product Recommendation & Supply
3. Installation & Integration
4. Repair & Diagnosis
5. Custom Solutions
6. Tuning, Upgrades & Maintenance

**Per-service content:** name, one-line outcome summary, longer description (what it involves, when a customer needs it), applicable environments, relevant real project examples pulled from Projects (if tagged), and a Call/WhatsApp CTA specific to that service (e.g., "Discuss Installation" vs. "Discuss a Repair").

**Data model note:** Given there are only six, fixed, rarely-changing services, this can be a small structured data file like Projects/Products (for consistency and easy editing) rather than hardcoded components — recommend the same pattern across all three content types so updating any of them feels the same.

---

## 4. Products

**Purpose:** Show what VIVA stocks, supplies, and recommends — a curated catalog, explicitly not a shopping experience.

**Structure:**
- Category browsing: Speakers, Amplifiers, Woofers/Subwoofers, Tweeters, Microphones, Wiring & Accessories, Other Components.
- Product card: image, name, brand, model, price (or "Contact for price" if not yet documented — see `02-viva-business-model.md` §12).
- Product detail: specifications, suitable use-cases/applications, optional link to a Project it was used in.
- CTA: "Call to Enquire" / "Ask on WhatsApp" / "Discuss Installation" — never "Add to Cart" or "Buy Now."

**Empty-state / bootstrapping behavior:** Real product data is being built during development per `03-viva-business-context.md`. The catalog should launch with a smaller, genuinely accurate set rather than a large placeholder-filled one — a shorter honest list outperforms a long list with guessed prices.

---

## 5. About VIVA

**Purpose:** Business identity and expertise — not a founder's personal blog, but honest about the fact that one expert executes everything.

**Structure:** Business identity and positioning · practical expertise and range of work (drawing on Projects) · service philosophy (the "tell us the outcome, we handle the rest" model) · the RIMS/legal-name line (see `03-viva-business-context.md` §5).

---

## 6. Contact

**Purpose:** The lowest-friction page on the site.

**Structure:** Prominent Call button · prominent WhatsApp button (both numbers clearly distinguished — see `03-viva-business-context.md` §1) · address (Kottakkal, Malappuram) · hours (once confirmed) · Google Business Profile link (once created, with a map embed) · no long-form technical intake — this page should never ask a visitor to describe their full problem before they can reach VIVA.

---

## Content Entities (data model summary — implementation detail lives in `06-viva-refactor-blueprint.md`)

```text
Project
  slug, title, category, environment tags, summary,
  requirement?, solution?, components used?, media[],
  related product ids?, featured, order

Service
  slug, name, summary, description, applicable environments,
  related project ids?, order

Product
  slug, name, brand, model, category, price | "contact for price",
  specs, use-cases, images[], related project ids?, featured

BusinessConfig (single source of truth)
  brand name, legal name (RIMS), address, phone, whatsapp,
  hours, social links, GBP link, brand tokens
```

---

## What Still Needs Your Confirmation, Section by Section

- **Home:** agree with the 8-block order and the "no visible project count" rule?
- **Projects:** agree with the seven categories, and with launching small rather than waiting for the full archive?
- **Services:** agree the six services map correctly, or is anything missing/wrong?
- **Products:** agree with "Contact for price" as the fallback rather than hiding unpriced products entirely?
- **About:** comfortable with the RIMS line living here (vs. Contact-only, vs. footer-only)?
- **Contact:** anything beyond Call/WhatsApp/address/hours/GBP you want on this page?
