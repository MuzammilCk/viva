# Adding Real Content to the VIVA Website

This guide explains how to add or update real **Projects**, **Products**, and **Testimonials** on the VIVA Business Team website. 

You do **not** need to touch any design or layout code to add content. Everything is maintained in simple data files located in `src/data/`.

---

## Non-Negotiable Content Rules

1. **Real data only**: Never invent project specifications, prices, or customer testimonials.
2. **Real photography only**: Use authentic photos from actual installations, workshop builds, or genuine hardware. Never use stock photos.
3. **Prices**: Enter the exact INR price (e.g., `14500`) or set `price: null` to display **"Contact for price"**.
4. **Replace Placeholders**: When real content arrives from VIVA, replace the corresponding `PLACEHOLDER — ...` entry in the file.

---

## 1. Adding a Project (Installation / Build)

### Where files live
- **Data File**: [`src/data/projects.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/data/projects.ts)
- **Image Folder**: `public/images/projects/` (create folder if not present)

### Allowed Categories
`"Vehicles"` | `"Home & Theatre"` | `"Cafés & Restaurants"` | `"Commercial & Business"` | `"Custom Work"` | `"Repair & Restoration"` | `"Other"`

### Step-by-Step
1. Copy your real project photos into `public/images/projects/` (e.g., `creta-sound-upgrade-1.jpg`).
2. Open [`src/data/projects.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/data/projects.ts).
3. Copy the template below and paste it into the `PROJECTS` array (or replace an existing placeholder entry):

```typescript
{
  id: "hyundai-creta-door-damping-stage",
  slug: "hyundai-creta-door-damping-stage",
  title: "Hyundai Creta Stage 2 Sound Damping & Component Upgrade",
  category: "Vehicles",
  environmentTags: ["Car", "SUV", "Cabin Damping"],
  summary: "4-door dual-layer butyl acoustic damping paired with 2-way front component speakers and clean under-seat amplifier integration.",
  requirement: "Vehicle owner reported severe road noise and muddy vocal clarity on highway drives.",
  solution: "Applied 2.0mm butyl damping sheets on inner and outer door skins, installed custom wooden speaker spacers, and tuned the front soundstage.",
  componentsUsed: [
    "Pioneer TS-Z65CH 6.5\" 2-Way Components",
    "4-Channel Class-D Amplifier",
    "2.0mm Butyl Acoustic Damping Sheets",
    "Pure Copper OFC Power Wiring Kit",
  ],
  relatedProductIds: [
    // Optional: add product IDs from products.ts that were used in this build
  ],
  media: [
    {
      url: "/images/projects/creta-sound-upgrade-1.jpg",
      type: "image",
      alt: "Hyundai Creta door damping and component speaker installation",
      caption: "Inner door skin acoustic treatment",
    },
  ],
  featured: true, // true to feature on homepage, false otherwise
  order: 1,
},
```

---

## 2. Adding a Product (Audio Equipment)

### Where files live
- **Data File**: [`src/data/products.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/data/products.ts)
- **Image Folder**: `public/images/products/` (create folder if not present)

### Allowed Categories
`"Speakers"` | `"Amplifiers"` | `"Woofers/Subwoofers"` | `"Tweeters"` | `"Microphones"` | `"Wiring & Accessories"` | `"Other"`

### Step-by-Step
1. Copy your product photo into `public/images/products/` (e.g., `pioneer-ts-z65ch.jpg`).
2. Open [`src/data/products.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/data/products.ts).
3. Copy the template below and paste it into the `PRODUCTS` array (or replace an existing placeholder entry):

```typescript
{
  id: "pioneer-ts-z65ch",
  slug: "pioneer-ts-z65ch",
  name: "Pioneer TS-Z65CH 6.5\" 2-Way Component Speaker Package",
  brand: "Pioneer",
  model: "TS-Z65CH",
  category: "Speakers",
  price: 18500, // Exact INR price, or null to show "Contact for price"
  description: "High-resolution audio certified 6.5-inch 2-way component speaker package featuring Twaron aramid fiber cone and swivel dome tweeters.",
  specs: [
    { name: "Speaker Size", value: "6.5\" (165mm)" },
    { name: "Max Power Output", value: "330 W" },
    { name: "Nominal RMS Power", value: "110 W" },
    { name: "Frequency Response", value: "30 Hz to 96 kHz" },
    { name: "Impedance", value: "4 Ohms" },
  ],
  useCases: [
    "Car Front Soundstage Upgrade",
    "Precision Vocal & Instrument Clarity",
    "High-Resolution Audio Systems",
  ],
  images: [
    "/images/products/pioneer-ts-z65ch.jpg",
  ],
  featured: true, // true to feature on homepage, false otherwise
},
```

---

## 3. Adding Real Reviews / Testimonials

### Ground Truth Requirement
No testimonials or star ratings are currently displayed because none have been collected yet. **Do not fabricate review scores or testimonials.**

When real customer reviews are gathered from Google Business Profile (GBP) or direct client feedback:
1. Store confirmed quotes with real customer names/locations.
2. If adding a GBP review link, update `googleBusinessProfile.url` in [`src/config/business.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/config/business.ts).

---

## 4. Updating Business Identity (Phone, Address, Hours)

All core business facts live in one place:
- **File**: [`src/config/business.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/config/business.ts)

When phone numbers, opening hours, or social links change, update them in that file and every page across the website will update automatically.

---

## 5. How to Test Your Changes

After editing any data file, verify that the project builds cleanly by running in your terminal:

```bash
# 1. Check for valid formatting & TypeScript types
npm run build

# 2. Run the content truthfulness verification script
./scripts/verify-content.sh
```
