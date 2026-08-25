# AGENTS.md

Guidance for Codex (and other agents) working with this repository.
The actual application lives in the [`music-electronics-shop/`](./music-electronics-shop) subdirectory (a Vite + React SPA). This file documents that codebase.

## Project Overview

**SynthLab** is a React 19 single-page application for a music electronics retailer selling synthesizers, MIDI controllers, audio interfaces, Eurorack modular gear, and accessories. It is built as a Vite + TypeScript project and features real-time 3D product configurators (Three.js / `@react-three/*`), a persistent shopping cart, a multi-step checkout flow, and an account area.

- **Name:** `music-electronics-shop` (private, version `0.0.0`)
- **Template:** React + TypeScript + Vite (with Oxlint)
- **App shell:** `src/main.tsx` → `src/App.tsx` → `src/router.tsx`
- **Target:** modern browsers (build target `es2022`, ESM modules)

### Tech Stack

| Area | Tool |
| --- | --- |
| Framework | React 19 (`react`, `react-dom`) |
| Build / Bundler | Vite 8 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) + CSS variables + design tokens |
| Language | TypeScript ~6.0 (`verbatimModuleSyntax`, strict mode) |
| Routing | React Router DOM 7 (`createBrowserRouter`) |
| State | Zustand 5 (`uiStore`, `cartStore`) — persisted to `localStorage` |
| Data fetching | TanStack React Query 5 (`QueryClient`) |
| 3D | Three.js 0.185, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| UI primitives | `@radix-ui/react-select`, `framer-motion`, `lucide-react` |
| Styling utilities | `clsx` + `tailwind-merge` (`cn`) |
| Linting | Oxlint (plugins: `react`, `typescript`, `oxc`) |

## Repository Layout

```
music-electronics-shop/
├── @/                          # note: stray shadcn artifact at repo root (not part of src/ build)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                 # static images (hero.png, react.svg, vite.svg)
│   ├── components/
│   │   ├── layout/             # Header, Footer, MainLayout, ThemeProvider,
│   │   │                      #   ModalProvider, DrawerProvider, QueryProvider
│   │   ├── sections/           # HeroSection, FeaturedProducts, CategoriesSection,
│   │   │                      #   NewsletterSection, AboutPreview
│   │   ├── three/              # 3D canvas wrappers
│   │   │   ├── Canvas.tsx, Lighting.tsx, CameraControls.tsx, PostProcessing.tsx
│   │   │   └── models/products/ # SynthesizerModel, MidiControllerModel,
│   │   │                        #   AudioInterfaceModel, EurorackModuleModel
│   │   └── ui/                 # primitive UI: Badge, Button, Card, Grid, Input,
│   │                            #   Modal, Drawer, Select, Tabs, Skeleton,
│   │                            #   PageSkeleton, Divider, Toaster
│   ├── hooks/                  # (declared as alias, currently empty)
│   ├── lib/
│   │   ├── tokens.ts           # design token system (colors, typography, spacing, 3D, animation)
│   │   └── utils.ts            # utilities: cn(), formatPrice, slugify, debounce, etc.
│   ├── pages/                  # route pages: Home, Products, ProductDetail, Cart,
│   │                            #   Checkout, Account, Configure, NotFound
│   ├── store/
│   │   ├── uiStore.ts          # Zustand UI store (theme, modals, drawers, toasts, loading)
│   │   └── cartStore.ts        # Zustand cart store (items, totals, promo codes, shipping)
│   ├── types/index.ts          # central type definitions (Product, Cart, Order, User, 3D, UI)
│   ├── router.tsx              # route config (createBrowserRouter, root layout route)
│   ├── App.tsx                 # providers: QueryClientProvider + RouterProvider
│   ├── main.tsx                # ReactDOM.createRoot entry
│   └── index.css               # Tailwind directives + global CSS variables
├── package.json
├── vite.config.ts
├── tsconfig.json               # project references (app + node)
├── tsconfig.app.json           # path aliases + strict TS config
├── tsconfig.node.json
├── .oxlintrc.json             # Oxlint config (react/typescript/oxc plugins)
├── components.json            # shadcn-style config (new-york style, no tailwind.config)
└── .mcp.json                  # MCP server configuration
```

### Path Aliases (`vite.config.ts` + `tsconfig.app.json`)

| Alias | Resolves to |
| --- | --- |
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@hooks/*` | `src/hooks/*` (empty) |
| `@store/*` | `src/store/*` |
| `@lib/*` | `src/lib/*` |
| `@types/*` | `src/types/*` |
| `@data/*` | `src/data/*` (not yet present) |
| `@assets/*` | `src/assets/*` |

Imports use the `@/` prefix consistently (e.g. `import { cn } from "@/lib/utils"`).

## Development Commands

From the `music-electronics-shop/` directory:

```bash
npm install      # install dependencies
npm run dev      # start Vite dev server (http://localhost:3000, host: true)
npm run build    # type-check + production build (tsc -b && vite build)
npm run preview  # serve the production build locally
npm run lint     # run Oxlint
```

The dev server runs on **port 3000** with `host: true` (accessible on the local network).

## Architecture

### App shell & providers (`src/App.tsx`, `src/main.tsx`)
- `main.tsx` renders `<App />` into `#root` via `createRoot` under `<StrictMode>`.
- `App.tsx` creates a `QueryClient` (staleTime 5 min, gcTime 30 min, retry 1, no refetch on window focus) and wraps `<AppContent />`.
- `AppContent` applies theme class to `<html>` and renders `<RouterProvider router={router} />`.
- A `ThemeProvider` toggles the `dark` class on `document.documentElement`.

### Routing (`src/router.tsx`)
- React Router DOM 7 `createBrowserRouter`.
- A single **root route** renders `<Header />` + `<MainLayout>` (containing `<Outlet />`) + `<Footer />`.
- Child routes: `/` (Home), `/products`, `/products/:slug`, `/cart`, `/checkout`, `/account`, `/configure`, and a `*` catch-all `NotFoundPage`.
- `MainLayout` wraps `<Outlet />` in a `<Suspense>` with a `PageSkeleton` fallback for lazy-loaded page content.

### State management (`src/store/`)
Two Zustand stores, both persisted to `localStorage` via `persist` + `createJSONStorage`:

- **`uiStore`** (`music-electronics-ui`): theme (`light`/`dark`/`system` + reduced motion), modals/drawer registry (keyed by id), toasts (auto-dismissing), `globalLoading`, `pageTransition`, `scrollLocked` (body-scroll lock with position preservation), and `isOnline`. Exposes slice selectors (`useTheme`, `useDrawers`, `useToasts`, …) and a batched action selector (`useUIActions`). A `toast` convenience object delegates to `getState().addToast()`.
- **`cartStore`** (`music-electronics-cart`): cart items, computed totals (tax `0.08`, free shipping threshold `150`, default shipping `15`), promo codes (`WELCOME10`, `SYNTH20`, `MODULAR15`), and shipping methods. Exposes memoized selectors (`useCartItems`, `useCartTotal`, …) and `useCartActions`.

**Conventions:**
- Stores are typed with an explicit interface (`UIState` / `CartStore extends CartState`).
- `partialize` persists only the fields that need to survive a reload; `onRehydrateStorage` reapplies side effects (re-theme, recalculate totals).
- Prefer the exported selectors over reading the whole store.

### Data fetching (React Query)
- A single `QueryClient` lives in `App.tsx`. There is no centralized `useQuery` wrapper yet — pages that fetch product data call `useQuery` directly. Follow the same pattern and reuse the shared `QueryClient` defaults (5 min stale, 1 retry, no refetch on focus).

### Styling
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin. The config lives as a Tailwind 4 `@theme` block inside `src/index.css` (using `@import "tailwindcss"`), with CSS variables defined on `:root` for light/dark modes. Note there is **no `tailwind.config.js`** despite `components.json` referencing one — `postcss`/`autoprefixer` are present in devDependencies but are vestigial for the Tailwind 4 v4-via-plugin setup.
- A **custom color system** using CSS variables exposed on `:root` (light + dark), consumed like `bg-[var(--color-bg-primary)]`, `text-[var(--color-fg-secondary)]`, `border-[var(--color-border-subtle)]`, etc. Avoid raw hex literals in components; pull from `@/lib/tokens`.
- **Design tokens** (`src/lib/tokens.ts`): a single `tokens` object (`colors`, `typography`, `spacing`, `borderRadius`, `shadows`, `transitions`, `zIndex`, `breakpoints`, `container`, `three`, `animation`, `components`) exported as `as const` with matching types.
- **`cn()`** (`src/lib/utils.ts`) = `twMerge(clsx(...))` — always use it for conditional class composition.
- Utility helpers in `utils.ts`: `formatPrice`, `formatPriceWithDecimals`, `slugify`, `truncate`, `generateId`, `debounce`, `throttle`, `clamp`, `lerp`, `mapRange`, `sleep`, `retry`, `isValidEmail/Url`, query-string helpers, `getInitials`, `classNames`.

### 3D / Three.js
- A `ThreeCanvas` wrapper (`src/components/three/Canvas.tsx`) wraps `@react-three/fiber`'s `<Canvas>` and applies shared camera/lighting/post-processing config from `tokens.three`.
- Product models live in `src/components/three/models/products/` (`SynthesizerModel`, `MidiControllerModel`, `AudioInterfaceModel`, `EurorackModuleModel`) and are procedural — driven by `ProceduralModelConfig` in `src/types/index.ts`.
- The hero uses `@react-three/drei`'s `<Stage>` + `environment="city"` + `<ContactShadows>`.
- Three-specific code uses the `"use client"` directive and is wrapped in `<Suspense>` with a skeleton because model assets load asynchronously.

### Forms
- `react-hook-form` + `zod` schemas + `@hookform/resolvers/zod`. When adding a new form, define the schema in the component (or a co-located `*.schema.ts`), register fields, and pass `resolver={zodResolver(schema)}`.

### Component conventions
- Components are **named function declarations**, exported as named exports: `export function Button() {}`.
- Presentational components sit in `src/components/ui/`; domain sections in `src/components/sections/`; structural pieces in `src/components/layout/`.
- 3D/interactive components carry `"use client"`.
- `lucide-react` icons are imported as named imports.

## Code Style

- **TypeScript** (`tsconfig.app.json`): `strict`, `noImplicitAny`, `strictNullChecks`, `verbatimModuleSyntax`, `moduleResolution: "bundler"`, `allowImportingTsExtensions`. `noUnusedLocals`/`noUnusedParameters` are **off** (relaxed for development).
- **Imports:** type imports use `import type { ... }` or inline `type` qualifiers; runtime imports use bare module specifiers. Prefer `@/` path alias imports over relative `..` paths.
- **Components:** named function components, named exports, PascalCase file names matching the component (`Header.tsx` → `Header`).
- **Class names:** always compose with `cn(...)`; pull colors/spacing from design tokens, never magic hex values.
- **Oxlint:** `npx oxlint` / `npm run lint`. Rules enforced: `react/rules-of-hooks` (error), `react/only-export-components` (warn). Run before committing.

## Testing

There is no test runner or test files configured in this project yet (`package.json` has no `test` script, and no files under `src/` match `*.test.*` / `*.spec.*`). When adding tests, a recommended starting point is:

- **Unit:** Vitest + React Testing Library (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`).
- **3D:** `@react-three/test-renderer` or `@testing-library/react` with mocked `three`/canvas (the canvas needs an offscreen canvas mock under jsdom).
- **E2E:** Playwright (`@playwright/test`) for the full shopping flow (browse → cart → checkout).

## Build & Production

- `npm run build` runs `tsc -b` (type-check across both project references) then `vite build`.
- Vite is configured with `manualChunks` to split the bundle into `three`, `vendor` (React/React-DOM/router/Zustand/Query), `ui` (framer-motion/lucide/clsx/tailwind-merge/cva), and `forms` (react-hook-form/Zod/resolvers) chunks.
- Output target is `es2022` with `esbuild` minification and CSS minification enabled.

## Project Notes

- The `@` directory at the `music-electronics-shop` repo root (containing `components/ui/select.tsx`) is a stray `shadcn/ui` install artifact and is **not** referenced by the app (imports use the `@/` alias to `src/`). Safe to remove.
- The `@hooks/*` and `@data/*` aliases are declared but have no backing directories yet — add modules under `src/hooks/` and `src/data/` if/when those features are needed.
- `.mcp.json` at the repository root configures MCP servers (filesystem, Chrome DevTools, Playwright, GitHub, Context7, 21st, MagicUI, shadcn). Adjust as needed for your environment; it is not read by the app build.
