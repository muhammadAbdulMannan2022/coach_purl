# CLAUDE.md — Developer Guidelines

## Build & Dev Commands
- **Development Server**: `yarn dev`
- **Production Build**: `yarn build`
- **Start Production**: `yarn start`
- **Lint Check**: `yarn lint`
- **Type Check**: `yarn tsc --noEmit`

## Project Structure
```
coach_purl_web/
├── app/                  # Next.js App Router (Layouts, Pages, APIs)
│   ├── favicon.ico
│   ├── globals.css       # Core Tailwind CSS configuration & Theme variables
│   ├── layout.tsx        # App wrapper, Google Font setup
│   └── page.tsx          # Home Page
├── components/           # Reusable UI & Feature components
├── hooks/                # Custom React client hooks
├── lib/                  # Library utilities (e.g., mock-data.ts)
├── public/               # Static assets (images, SVGs)
├── types/                # Shared TypeScript models and definitions
├── tsconfig.json         # TypeScript configuration (uses @/* alias to root)
└── package.json          # Node dependencies and scripts
```

## Styling & Design System
- **Theme Variables**: Style components using standard Tailwind CSS v4 variables mapped to our custom theme. Note that **there is no dark mode** (strictly light/colored theme).
  - Background/Foreground: `bg-background`, `text-foreground` (primary text is `#6D6D6D`)
  - Brand/Primary: `bg-primary` (active buttons/items are `#0DA34C`), `text-primary-foreground`
  - Cards/Containers: `bg-card`, `text-card-foreground`
  - Borders/Dividers: `border-border`
  - Focus Ring: `ring-ring`
- **Sidebar Tokens**:
  - Background: `bg-sidebar-gradient` (an angular/conic gradient of forest green tones: `#213320`, `#395736`, `#78A873`)
  - Shadows: `shadow-sidebar` (a custom drop shadow `1px 0px 8px rgba(0,0,0,0.05)`)
- **Premium Aesthetics**: Ensure page design looks highly professional. Avoid raw primary/secondary CSS colors like `bg-blue-500` or `bg-red-500` without custom styling. Use gradients, rounded edges (`rounded-2xl`, `rounded-full`), custom transitions, and subtle hover scale animations.
- **Typography**:
  - Sans-serif (Main text): `font-sans` (resolves to `"Segoe UI"`)
  - Monospace (Code/Data): `font-mono` (resolves to `Geist Mono`)
  - Use appropriate typographic hierarchy: readable `h1` headings with `tracking-tight` and `font-semibold`.

## Reusable UI Components
- **Modal**: [components/ui/modal.tsx](file:///c:/Users/native/Desktop/projects/coach_purl_web/components/ui/modal.tsx) — Lightweight `<dialog>` wrapper. Props: `isOpen`, `onClose`, `title`, `size`, `children`.
- **Button**: [components/ui/button.tsx](file:///c:/Users/native/Desktop/projects/coach_purl_web/components/ui/button.tsx) — Customized button support for default, outline, secondary variants using `#0DA34C` primary.


## React & Data Fetching Guidelines
- **Server Components (RSC)**: By default, all Next.js pages/components are Server Components. Fetch mock data directly inside RSCs where possible.
- **Client Components**: Mark files with `"use client"` only when user interaction is required (e.g., forms, buttons, client state, or hooks like `useState`/`useEffect`).
- **Data Fetching / API Integrations**:
  - For now, use the mock data layer defined in [mock-data.ts](file:///c:/Users/native/Desktop/projects/coach_purl_web/lib/mock-data.ts).
  - Data queries must simulate async delays (`400ms - 800ms`) to test loading spinners, skeleton UI states, and async flow.
  - Design API models cleanly with proper TypeScript types, preparing for a future migration to Redux RTK Query (RTK).
