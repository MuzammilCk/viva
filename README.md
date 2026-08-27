# VIVA Business Team — Website

Official web application for **VIVA Business Team** (operated under registered trade name **RIMS**), an expert audio solutions business specializing in custom car audio, bus & heavy vehicle sound, acoustic home theatre calibration, commercial audio systems, and component-level repairs in **Kottakkal, Malappuram district, Kerala**.

---

## 🎯 Project Overview

This website is custom-engineered for an **expert-led solutions model** rather than a generic e-commerce storefront:

* **Solutions & Capabilities First**: Outlines real capabilities across 6 core service areas and 6 diverse acoustic environments.
* **Direct High-Touch Conversion**: Frictionless conversion via direct **Phone Call** and **WhatsApp deep-links** pre-populated with item context. No complex forms or quote calculators.
* **Truthful Data Model**: No fabricated ratings, synthetic reviews, fake stock counters, or invented prices. Unconfirmed items render as *"Contact for price"*.
* **Single-Specialist Craftsmanship**: Accurately reflects VIVA's one-expert operating model—from consultation and space analysis to bench repair and precision acoustic tuning.
* **Mobile-First & Fast**: Optimized for speed, low data consumption on mobile networks, and crisp readability on all screen sizes.

---

## 🛠️ Tech Stack

* **Core**: React 19, TypeScript, Vite
* **Routing**: React Router DOM 7 (with lazy-loaded route chunks)
* **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`) + OKLCH design tokens
* **Typography**: Geist Variable (UI sans) + Newsreader Variable (display headings)
* **Components**: shadcn/ui primitives + Radix UI + Lucide Icons
* **State Management**: Zustand 5 with `localStorage` persistence (UI preferences)
* **SEO & Structured Data**: `schema.org` `LocalBusiness` JSON-LD with geo-coordinates and NAP consistency
* **Linter**: Oxlint

---

## 📂 Project Structure

```text
├── docs/
│   └── planning/                # Ground-truth specifications & architecture blueprints
│       ├── 01-viva-expert-opinion.md
│       ├── 02-viva-business-model.md
│       ├── 03-viva-business-context.md
│       ├── 04-viva-website-architecture.md
│       ├── 05-viva-ui-ux-direction.md
│       ├── 06-viva-refactor-blueprint.md
│       └── 07-viva-repo-audit.md
├── scripts/
│   ├── verify-content.sh        # Truthfulness & leftover demo content gate
│   └── qa-phase13.ts            # Automated QA & data integrity check script
├── src/
│   ├── config/
│   │   └── business.ts          # Single source of truth for business identity & contact
│   ├── data/
│   │   ├── products.ts          # Product catalog data layer
│   │   ├── projects.ts          # Portfolio & case studies data layer
│   │   └── services.ts          # 6 core services data layer
│   ├── components/
│   │   ├── catalog/             # ProductCard and catalog components
│   │   ├── layout/              # Header, Footer, MainLayout, StickyContactBar
│   │   ├── sections/            # Homepage sections (Hero, Capabilities, Trust, etc.)
│   │   └── ui/                  # Accessible UI primitives (shadcn/ui + Radix)
│   ├── hooks/
│   │   └── usePageSeo.ts        # Dynamic page title and meta description updates
│   ├── lib/
│   │   ├── analytics.ts         # Lightweight Call & WhatsApp click tracking
│   │   ├── format.ts            # Price and text formatting helpers
│   │   ├── schema.ts            # LocalBusiness structured data generator
│   │   └── utils.ts             # Tailwind class merging utility (cn)
│   ├── pages/                   # Route page components
│   ├── store/
│   │   └── uiStore.ts           # Theme & banner UI state
│   ├── types/
│   │   └── index.ts             # TypeScript entity models & interfaces
│   ├── App.tsx                  # Root application wrapper
│   ├── index.css                # Tailwind 4 theme & OKLCH color token definition
│   ├── main.tsx                 # Application entry point
│   └── router.tsx               # Client-side router configuration
├── CONTRIBUTING-content.md      # Guide for adding real photos, products & projects
├── SETUP.md                     # Step-by-step developer setup & deployment guide
└── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone repository
git clone https://github.com/MuzammilCk/viva.git
cd viva

# Install dependencies
npm install
```

### 3. Development
```bash
# Start local development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build & Production Preview
```bash
# Type check and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Quality & Truthfulness Verification

Before publishing or committing changes, run the automated verification scripts:

```bash
# 1. Content truthfulness gate (checks for banned demo strings, fake numbers, and removed routes)
./scripts/verify-content.sh

# 2. Automated data layer and schema integrity check
npx tsx scripts/qa-phase13.ts

# 3. Linter
npm run lint
```

---

## 📝 Content Management

All business details, portfolio projects, product items, and services are managed via straightforward TypeScript data files. 

For instructions on adding real project photography, new catalog products, or customer testimonials without touching UI layout code, refer to [CONTRIBUTING-content.md](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/CONTRIBUTING-content.md).

For step-by-step installation, environment, and hosting deployment instructions, refer to [SETUP.md](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/SETUP.md).

---

## 📄 License & Legal Notice

© VIVA Business Team. All rights reserved.  
*VIVA Business Team is operated under the registered trade name RIMS.*
