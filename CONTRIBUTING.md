# FLEETWATCH — Contributing

> Thank you for considering contributing to FLEETWATCH. This document outlines the development workflow, code standards, and PR process.

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code. Please report unacceptable behavior to dev@fleetwatch.dev.

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

### Setup

```bash
git clone https://github.com/fleetwatch/logistics.git
cd logistics-platform
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

---

## Development Workflow

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — protected, requires PR + CI pass |
| `develop` | Integration branch for feature work |
| `feat/<name>` | Feature branches |
| `fix/<name>` | Bug fix branches |
| `docs/<name>` | Documentation changes |

### Process

1. Create a branch from `develop`
2. Make your changes
3. Run local checks: `npm run typecheck && npm run lint`
4. Push and open a PR against `develop`
5. Ensure CI passes
6. Request review from at least one maintainer

---

## Code Standards

### TypeScript

- **Strict mode** enabled in `tsconfig.json`
- **No `any` types** — use `unknown` if type is truly uncertain
- **Named exports** preferred over default exports
- **Interfaces** for props/state shapes; **types** for unions
- **Zod schemas** for all runtime validation

### React / Next.js

- **Server Components** by default — only add `"use client"` when absolutely needed
- **Framer Motion** for animations; avoid CSS transitions for layout animations
- **shadcn/ui** for all UI primitives — do not create custom button/input/dialog components
- **Lucide icons** — import specific icons, never the entire icon set
- **Server Actions** for mutations that don't require client interactivity

### Styling

- **Tailwind CSS v4** with `@apply` discouraged — use utility classes directly
- **CVA** for component variants
- **`cn()`** from `tailwind-merge` for conditional class merging
- **Dark theme** is default; do not use `dark:` prefix in new components
- Color tokens reference the design system (see `DESIGN_SYSTEM.md`)

### File Structure

```
src/
  app/          # Page files, matching Next.js App Router conventions
  components/   # Shared components, organized by domain
  lib/          # Utilities, hooks, configuration
  providers/    # React context providers
```

### Naming Conventions

- **Files** — `kebab-case.ts`, `kebab-case.tsx`
- **Components** — PascalCase directory: `src/components/fleet/VehicleCard.tsx`
- **Hooks** — `useHookName.ts`
- **Utils** — camelCase: `formatTelemetry.ts`
- **Types/Schemas** — PascalCase: `VehicleTelemetry.ts`

---

## Quality Gates

All contributions must pass these checks before merging:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build
```

### PR Requirements

- [ ] TypeScript strict mode passes
- [ ] ESLint clean (no warnings)
- [ ] Build succeeds
- [ ] New features include Zod schema validation
- [ ] No `console.log` in production code
- [ ] No secrets or API keys committed
- [ ] Components follow shadcn/ui patterns (CVA, cn, asChild)

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `style` | Styling changes (not CSS — formatting, linting) |
| `docs` | Documentation |
| `test` | Adding or fixing tests |
| `chore` | Build, CI, tooling |

### Examples

```
feat(fleet): add telemetry playback scrubber
fix(dispatch): correct driver assignment conflict detection
perf(telemetry): batch websocket writes for 40% throughput improvement
docs(architecture): add telemetry pipeline mermaid diagram
```

---

## Testing

### Unit Tests
- Vitest + React Testing Library for component tests
- Test files co-located with source: `ComponentName.test.tsx`
- Focus on behavior, not implementation

### E2E Tests
- Playwright for critical user flows
- Test files in `tests/e2e/`

---

## Review Process

1. Maintainer reviews within 48 hours
2. Automated checks must pass
3. At least one approval required
4. Squash-merge into `develop`
5. Release branches merged to `main` with version tag

---

## Questions?

Open a [discussion](https://github.com/fleetwatch/logistics/discussions) or email dev@fleetwatch.dev.
