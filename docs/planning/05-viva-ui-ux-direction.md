# VIVA — UI/UX Direction

> Visual and interaction design direction. No mockups or visualizations here by request — this describes decisions and reasoning; implementation happens directly in the refactored codebase.

---

## Design Principles

1. **Mobile-first, not mobile-adapted.** The customer base — vehicle owners, auto-rickshaw drivers, small business owners — overwhelmingly arrives via phone, often from a WhatsApp share or a Google search on mobile data. Every layout decision starts at a single narrow column and is enhanced upward, not designed for desktop and shrunk down.
2. **Content-led, not template-led.** The current skeleton reads as generic e-commerce because it's built from commerce-template instincts (grids of identical cards, cart iconography, promotional banners). The redesign should look like it was built specifically for an audio solutions business — driven by real project photography and outcome-focused copy, not filler layout.
3. **Honest by design.** No fake urgency patterns (countdown timers, "only 2 left," flash-sale banners), no dark patterns, no manufactured trust signals. If a section doesn't have real content yet, it's hidden — not filled with placeholder-that-looks-real.
4. **Fast and light.** A plain React SPA with local data has no excuse to feel heavy. Keep bundle weight and image payloads lean — a meaningful share of visitors will be on mobile data, not broadband.

---

## Visual Language (proposed starting point — confirm against real signage/logo once it exists)

**Color:** A deep, confident blue as primary — leaning marine/indigo rather than a bright generic "link blue," to read as expertise and trust rather than a tech-startup feel. Something in the direction of a deep navy-blue (around `#16324F`–`#1B3A5C`) paired with warm off-white/neutral grays for background, and a single warm accent (amber/orange works well against navy for CTA buttons — Call/WhatsApp actions should visually stand out from everything else on the page). **This is a proposal, not the established brand color** — swap it the moment a real logo/signage blue is confirmed.

**Typography:** A clean, modern sans-serif for all UI text (legibility on small screens matters more than personality here) — optionally a slightly more distinctive sans for headings only, to avoid the site reading as an unstyled template. Avoid anything condensed or overly geometric that hurts readability on budget Android displays, which is a realistic share of the audience.

**Photography treatment:** Real project photography only — this is one of VIVA's biggest credibility assets, and stock imagery would directly undercut it. Given the photo library is thin right now: fewer, well-shot images consistently beat many mediocre ones. Standardize on consistent aspect ratios (so the Projects grid doesn't look chaotic even with photos shot at different times on different phones), and hold off on any logo watermark treatment until the real logo exists.

**Iconography:** Simple, consistent line icons for service/environment categories (speaker, car, home, café, etc.) — one icon set throughout, not mixed styles.

---

## Layout Patterns by Page Type

- **Home:** single-column narrative flow on mobile (value prop → featured work → capabilities → environments → products → trust → CTA), each section full-width with generous breathing room rather than dense grids — this is a page meant to be scrolled and absorbed, not scanned like a catalog.
- **Project grid / detail:** image-forward cards (photo dominates, minimal text overlay — category tag + title only on the card). Detail page opens with a large hero image/gallery before any text, since the photography *is* the pitch.
- **Service pages:** icon + outcome headline first, detail below the fold — a visitor should understand what a service solves before reading how it works.
- **Product grid / detail:** image, name, brand/model, price prominent (since it's genuine — no reason to hide it), spec details available but not dominant, CTA button visually distinct from "read more" style links.
- **Contact:** Call and WhatsApp presented as equally weighted, large, unmistakably tappable buttons above the fold — not buried under an address block.

---

## Component Patterns

- **Persistent mobile contact bar:** a bottom-fixed bar with Call + WhatsApp buttons, visible while scrolling any page — the single highest-leverage UI element on the whole site given the business model's two conversion actions.
- **WhatsApp deep-links with pre-filled context:** e.g., tapping "Ask on WhatsApp" from a specific product or project opens WhatsApp with the item's name already in the message. This keeps friction at zero (still one tap) while giving VIVA useful context the moment the chat opens — a meaningful upgrade over a bare WhatsApp link, and doesn't violate the "no forms" rule since the customer isn't typing anything into the website.
- **Category filter chips** (Projects, Products) — simple tap-to-filter tabs/chips, not a complex faceted search sidebar; the catalog size doesn't justify that complexity.
- **Empty-state discipline:** any section without real content (reviews, a category with no products yet) is simply not rendered, rather than shown with placeholder text or a "0 results" dead end.
- **Skeleton/loading states for images:** since photos will be added incrementally over time, image-heavy sections (Projects grid especially) should load gracefully rather than jumping/shifting layout as images populate.

---

## Trust Signals Before Reviews Exist

Since there are no testimonials or GBP reviews yet, trust is carried by: breadth of environments served (shown visually, not as a boastful number), the founder-does-every-job narrative, and — once available — a simple strip of manufacturer/brand logos VIVA works with. No star ratings, no review counts, no invented social proof, until the real thing exists to replace this section.

---

## Motion & Interaction Tone

Subtle and professional — gentle hover/tap feedback on cards, smooth (not bouncy) transitions, no e-commerce-style flash-sale animation energy. Motion should communicate polish, not excitement.

---

## Accessibility & Performance

- Alt text on every project/product image — these images are the core credibility asset, so they need to work for screen readers too, not just visually.
- Sufficient color contrast against the navy palette, especially for CTA buttons and body text.
- Lazy-load project galleries and below-the-fold images to keep initial load light on mobile data.

---

## Explicitly Not Doing (Phase 1)

Dark mode, complex faceted search/filtering, animated hero video backgrounds, multi-language toggle UI (English only per scope). None of these serve the actual goal of getting a visitor to Call or WhatsApp faster.
