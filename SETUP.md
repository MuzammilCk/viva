# Developer Setup & Deployment Guide

This guide provides step-by-step instructions for setting up, developing, testing, and deploying the **VIVA Business Team** website.

---

## 📋 1. System Requirements

Before you begin, ensure you have the following installed on your machine:

| Requirement | Minimum Version | Recommended Version | Check Command |
|---|---|---|---|
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` (LTS) | `node -v` |
| **npm** | `v9.0.0` | `v10.x` | `npm -v` |
| **Git** | `v2.30.0` | Latest | `git --version` |
| **Bash** (Optional for verification script on Windows) | Git Bash / WSL | Git Bash | `bash --version` |

---

## 💻 2. Local Development Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/MuzammilCk/viva.git
cd viva
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```

The application will start with Hot Module Replacement (HMR) enabled:
* **Local URL**: `http://localhost:5173`
* **Network URL**: displayed in terminal if running on a local network

---

## 📜 3. Available npm Scripts

| Script | Command | Description |
|---|---|---|
| **`dev`** | `npm run dev` | Starts the Vite development server with hot-reloading. |
| **`build`** | `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds the production bundle in `dist/`. |
| **`lint`** | `npm run lint` | Runs the high-performance Oxlint linter across the project. |
| **`preview`** | `npm run preview` | Starts a local static web server to preview the built `dist/` directory. |

---

## ⚙️ 4. Configuration & Business Facts

All business identity details and contact points are centralized in a single configuration file:
* **Location**: [`src/config/business.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/config/business.ts)

```typescript
export const BUSINESS_CONFIG = {
  name: "VIVA Business Team",
  legalName: "RIMS",
  legalNotice: "VIVA Business Team is operated under the registered trade name RIMS.",
  contact: {
    phone: {
      number: "9633334786",
      display: "+91 96333 34786",
      tel: "tel:+919633334786",
    },
    whatsapp: {
      number: "9995880059",
      display: "+91 99958 80059",
      url: "https://wa.me/919995880059",
      defaultMessage: "Hi VIVA team, I would like to enquire about audio solutions.",
    },
    address: {
      town: "Kottakkal",
      district: "Malappuram",
      state: "Kerala",
      pincode: "676501",
      full: "Kottakkal, Malappuram district, Kerala — 676501",
    },
  },
  // ...
}
```

> ⚠️ **Important**: Never hardcode phone numbers, WhatsApp links, or address strings in React components. All components import from `BUSINESS_CONFIG`.

---

## 🧪 5. Testing & Verification

Before opening a pull request or deploying to production, execute the automated test suite:

### 1. Content Truthfulness Gate
Checks for banned demo terms (e.g. SynthLab, Portland), ensures removed e-commerce routes are absent, and verifies required business facts.
```bash
# On Linux / macOS / Git Bash on Windows:
./scripts/verify-content.sh

# On Windows PowerShell via Git Bash:
& "C:\Program Files\Git\bin\bash.exe" ./scripts/verify-content.sh
```

### 2. Data Model & Cross-Reference QA Check
Validates that all project components match catalog entries, prices are truthful (genuine or null), and services match the 6 core areas:
```bash
npx tsx scripts/qa-phase13.ts
```

### 3. Production Build Validation
Ensures zero TypeScript compiler errors and produces optimized bundles:
```bash
npm run build
```

---

## 🚀 6. Production Deployment

The project builds into pure static HTML, CSS, and JS assets located in the `dist/` directory.

### Option A: Vercel (Recommended)
1. Import the repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Ensure Single Page Application (SPA) routing is handled (Vercel handles Vite SPAs automatically).

### Option B: Netlify
Create or verify `netlify.toml` or set up redirects for SPA routing:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: Cloudflare Pages
1. Connect repository in Cloudflare Dashboard → Pages.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Routing: Add a `_redirects` file in `public/` containing: `/* /index.html 200`.

### Option D: Nginx / Traditional Linux Server
For custom VPS hosting (Ubuntu/Debian with Nginx):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/viva/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
```

---

## 🛠️ 7. Troubleshooting

* **Issue: `verify-content.sh` cannot be found on Windows**
  * *Fix*: Run the script using Git Bash (`& "C:\Program Files\Git\bin\bash.exe" ./scripts/verify-content.sh`) or execute `npx tsx scripts/qa-phase13.ts`.
* **Issue: Port 5173 is already in use**
  * *Fix*: Run `npm run dev -- --port 3000` to bind to an alternative port.
* **Issue: TypeScript type mismatch after editing data files**
  * *Fix*: Check [`src/types/index.ts`](file:///c:/Users/THINKPAD%20L13/Projects/New%20folder/music-electronics-shop/src/types/index.ts) to verify your data conforms to `Project`, `Product`, or `Service` type definitions.
