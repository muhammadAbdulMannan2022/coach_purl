<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guidelines for Styling, Colors, Fonts, & API Mocking

- **Tailwind CSS v4 & Theme Colors**: Always use the design tokens mapped in `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `bg-card`, `text-card-foreground`, `border-border`, and `ring-ring`). Do not write raw hardcoded hex codes or default Tailwind color classes (like `bg-blue-600`) unless explicitly asked. Note that **there is no dark mode** (the theme is exclusively light/colored).
- **Sidebar Styling**: Use `bg-sidebar-gradient` (an angular gradient with forest greens `#213320`, `#395736`, `#78A873`) for sidebar backgrounds and `shadow-sidebar` (a custom drop shadow `1px 0px 8px rgba(0,0,0,0.05)`) for its border/container shadows.
- **Typography & Font Rules**: Ensure font styling resolves correctly to "Segoe UI" (`font-sans`) and Geist Mono (`font-mono`). Default text color is `#6D6D6D` (`text-foreground`). Do not define inline font sizes or import foreign fonts unless instructed.
- **Active State Styling**: Active buttons, selected navigation tabs, or active action items must use the vibrant green `#0DA34C` (`bg-primary` or `text-primary` depending on context).
- **Reusable UI Components**: Use pre-built components located under `components/ui/`:
  - `Modal` from [modal.tsx](file:///c:/Users/native/Desktop/projects/coach_purl_web/components/ui/modal.tsx) for overlays and dialog popups.
  - `Button` from [button.tsx](file:///c:/Users/native/Desktop/projects/coach_purl_web/components/ui/button.tsx) for general interface buttons.


- **Mock Data Layer Usage**: For UI mockups and client-side interactions, utilize the typed fetchers in `lib/mock-data.ts`. Do not write static hardcoded UI arrays inside components. Always simulate network latencies and design skeleton loaders for premium async UX.
- **Redux RTK Query Migration Prep**: Design types and mock functions such that they can easily map to endpoints in a future RTK Query store integration.
