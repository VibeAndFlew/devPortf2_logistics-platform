# FLEETWATCH — Design System

> Tactical dark UI with teal accents. Telemetry-focused operational interface. Command-center density.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0a0f0e` | Page background (tactical dark) |
| `--bg-surface` | `#111817` | Card/surface background |
| `--bg-elevated` | `#1a2220` | Elevated surfaces (modals, dropdowns) |
| `--bg-hover` | `#1f2826` | Hover state |
| `--border` | `#1e2b28` | Subtle borders |
| `--border-active` | `#14b8a6` | Active/focus border |
| `--text-primary` | `#e2e8f0` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary/muted text |
| `--text-muted` | `#64748b` | Placeholder/disabled text |
| `--accent` | `#14b8a6` | Teal accent (primary action) |
| `--accent-hover` | `#0d9488` | Accent hover |
| `--accent-muted` | `rgba(20, 184, 166, 0.15)` | Accent background |
| `--success` | `#22c55e` | Active/online status |
| `--warning` | `#eab308` | Idle/caution status |
| `--danger` | `#ef4444` | Offline/error/alert status |
| `--info` | `#3b82f6` | Information |

---

## Typography

| Element | Family | Weight | Size |
|---|---|---|---|
| Display | `JetBrains Mono` | 700 | 2.25rem / 36px |
| Heading 1 | `JetBrains Mono` | 600 | 1.5rem / 24px |
| Heading 2 | `JetBrains Mono` | 600 | 1.25rem / 20px |
| Heading 3 | `JetBrains Mono` | 500 | 1rem / 16px |
| Body | `Inter` | 400 | 0.875rem / 14px |
| Body Small | `Inter` | 400 | 0.75rem / 12px |
| Caption | `Inter` | 500 | 0.675rem / 11px |
| Code/Data | `JetBrains Mono` | 400 | 0.8125rem / 13px |
| Telemetry | `JetBrains Mono` | 500 | 0.75rem / 12px |

---

## Spacing Scale

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## UI Components

### Cards
Dark surface with subtle border, rounded at `8px`, optional status indicator on the left edge. Used for vehicle cards, driver cards, KPI tiles.

### Data Grids
Telemetry-density data tables with:
- Sticky header row with `--bg-surface` background
- Row hover highlight (`--bg-hover`)
- Monospace font for numeric data
- Color-coded status badges
- Inline sparkline charts

### Status Badges
- **Active** — `bg-success/10 text-success border-success/20`
- **Idle** — `bg-warning/10 text-warning border-warning/20`
- **Offline** — `bg-danger/10 text-danger border-danger/20`
- **Maintenance** — `bg-info/10 text-info border-info/20`

### KPI Tiles
Compact metric display with:
- Metric value in large monospace text
- Label in secondary text
- Trend arrow (up/down) with color indicator
- Optional sparkline chart

### Navigation
Left sidebar with icon + label navigation items. Active item highlighted with teal accent. Collapsed mode shows only icons.

---

## Component Conventions

All shadcn/ui components follow these conventions:
- Use `cva()` for variant definitions
- Use `tailwind-merge` (`cn()`) for class merging
- Support `asChild` prop via Radix Slot for polymorphic composition
- Default to dark theme via Tailwind `dark:` variants
- Consistent border radius (`rounded-lg = 8px`)
- Consistent shadow using `shadow-sm`

### Example: Status Badge Component

```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono font-medium border",
  {
    variants: {
      status: {
        active: "bg-green-500/10 text-green-400 border-green-500/20",
        idle: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        offline: "bg-red-500/10 text-red-400 border-red-500/20",
        maintenance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      },
    },
  }
);
```

---

## Animation Guidelines

- **Duration** — 200ms for micro-interactions (hover, focus, toggle); 300ms for panel transitions
- **Easing** — `cubic-bezier(0.4, 0, 0.2, 1)` for standard motion
- **Framer Motion** — Use `layoutId` for shared layout animations; `AnimatePresence` for enter/exit
- **Sparklines** — SVG path animations with `stroke-dasharray`/`stroke-dashoffset` for drawing effect
- **Map markers** — Pulse animation for active vehicle markers using CSS keyframes

---

## Telemetry Data Visualization

- **Speed gauge** — Arc SVG with animated fill, color transitions (green → yellow → red)
- **Fuel gauge** — Vertical bar with gradient fill, percentage label
- **Engine temp** — Horizontal thermometer-style bar
- **Trip timeline** — Vertical timeline with status dots and time labels
- **Fleet heatmap** — Mapbox heatmap layer with density-based coloring
