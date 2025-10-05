# CivitAI Model Manager - Professional Design Guidelines

## Design Philosophy

**Inspired by:** Linear, Notion, Google Photos, Dropbox  
**Approach:** Clean, spacious, data-focused design with professional polish

**Core Principles:**
- Maximum white space and breathing room
- Clear visual hierarchy through typography and spacing
- Subtle, professional interactions
- Content-first design
- Consistent, predictable patterns

---

## Color Palette

### Dark Mode (Primary)
```
Background Base:     222 14% 8%    (Deep charcoal)
Surface Elevated:    222 12% 12%   (Card background)
Surface Hover:       222 10% 15%   (Subtle interaction)
Border Subtle:       222 10% 18%   (Dividers)

Text Primary:        0 0% 95%      (High contrast white)
Text Secondary:      0 0% 70%      (Metadata, labels)
Text Tertiary:       0 0% 50%      (Timestamps, hints)

Accent Blue:         210 100% 58%  (Primary actions)
Success Green:       142 76% 45%   (Completed)
Warning Orange:      38 92% 58%    (Queued)
Error Red:           0 84% 60%     (Failed)
```

### Light Mode
```
Background Base:     0 0% 100%     (Pure white)
Surface Elevated:    0 0% 98%      (Off-white cards)
Border Subtle:       220 10% 88%   (Light dividers)

Text Primary:        222 14% 12%   (Near black)
Text Secondary:      222 14% 45%   (Gray)
```

---

## Typography

**Font System:**
- Primary: Inter (clean, professional sans-serif)
- Monospace: JetBrains Mono (paths, technical data)

**Type Scale (Professional Hierarchy):**
```
Page Title:     text-3xl font-bold      (30px / 1.875rem)
Section:        text-xl font-semibold   (20px / 1.25rem)
Card Title:     text-base font-semibold (16px / 1rem)
Body:           text-sm                 (14px / 0.875rem)
Metadata:       text-xs text-muted-fg   (12px / 0.75rem)
Mono:           text-xs font-mono       (12px / 0.75rem)
```

---

## Spacing System

**Professional Padding/Spacing:**
```
Page Container:      px-8 py-8       (Generous breathing room)
Section Gap:         space-y-8       (Clear separation)
Card Padding:        p-6             (Comfortable internal space)
Card Gap:            gap-6           (Not cramped)
Component Gap:       gap-4           (Related elements)
Tight Grouping:      gap-2           (Labels & values)
```

**Grid Systems:**
```
Dashboard Stats:     grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
Gallery:            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
Content + Sidebar:   grid-cols-1 lg:grid-cols-3 gap-8
```

---

## Component Library

### Card Design (Refined)
**Base Card:**
- Background: bg-card
- Border: border border-card-border (subtle)
- Rounded: rounded-lg
- Padding: p-6
- Hover: hover-elevate (subtle lift)
- Shadow: Minimal, built into elevation system

**Gallery Cards (Image-focused):**
- 3:4 aspect ratio images
- NO gap between image and card edge
- Image fills top, metadata below
- Hover: Scale 1.02, increase shadow
- Actions appear on hover (overlay on image)

### Statistics Cards
**Layout:**
```
┌─────────────────────────────┐
│  Label (text-sm muted)      │
│  Value (text-3xl bold)      │
│  Description (text-xs)      │
│                       [Icon]│
└─────────────────────────────┘
```
- Icon: 48×48px in subtle colored circle
- No aggressive borders
- Clean, spacious layout

### Model Gallery Cards
**Structure:**
```
┌─────────────────┐
│                 │
│     Image       │  ← 3:4 aspect ratio
│                 │
├─────────────────┤
│ Model Name      │  ← Truncate with ellipsis
│ [Type] [Base]   │  ← Small badges
│ 2.5 GB    [👁][🗑]│ ← Actions right-aligned
└─────────────────┘
```
- Image edge-to-edge in card
- 24px padding on text section
- Hover shows semi-transparent overlay with actions over image

### Download Progress Cards
**Layout:**
```
[Thumbnail] Model Name           [X]
            [Type] [Base Model]
            ━━━━━━━━━━━━━━━━━━━━ 65%
            2.1 GB • 5.2 MB/s • 7m 20s
```
- Horizontal layout
- Monospace for technical data
- Progress bar height: 8px
- Thumbnail: 64×64px, rounded

### Navigation Sidebar
**Style:**
- Background: sidebar color (slightly different from main bg)
- Active state: Left border accent (4px) + background highlight
- Icon + label layout
- 16px padding per item
- Grouped by function
- Logo/title at top with adequate spacing

---

## Layout Patterns

### Dashboard Page
**Structure:**
1. Page header with title + description (mb-8)
2. 4-column stats grid (gap-6)
3. Two-column layout:
   - Left: URL input card
   - Right: Active downloads list
4. Generous vertical spacing (space-y-8)

### Gallery Page
**Structure:**
1. Sticky header with search (mb-8)
2. Uniform grid (gap-6, not cramped)
3. Infinite scroll or pagination
4. Empty state: Centered with icon + message

### Model Detail Page
**Structure:**
1. Back button + title + actions (mb-8)
2. Two-column layout:
   - Left (1/3): Hero image + metadata card
   - Right (2/3): Tabbed content
3. Breadcrumb navigation above header
4. White space between sections

### Settings Page
**Structure:**
1. Max-width container (max-w-4xl)
2. Card-based sections
3. Sticky save bar at bottom
4. Clear section headings with descriptions
5. Form fields with proper spacing (space-y-4)

---

## Interactions

### Hover States
- Cards: Subtle background shift (hover-elevate)
- Buttons: Built-in elevation system
- Images: Scale 1.02, smooth transition
- Links: Underline on hover

### Active/Pressed States
- Buttons: active-elevate-2
- Cards: Optional for clickable cards
- Toggles: Background fill change

### Micro-interactions
- Smooth transitions: 200ms ease
- Progress bars: Animated fill
- Skeleton loading for async content
- Toast notifications: Slide in from top-right
- Modal overlays: Fade background

### Focus States
- Visible ring on keyboard navigation
- High contrast for accessibility
- Tab order follows visual hierarchy

---

## Data Visualization

### Storage Charts (Recharts)
- Donut charts with center label
- Color: Use chart-1 through chart-5
- Legend: Below chart, horizontal
- Hover tooltips with detailed info
- Responsive: min-height 300px

### Progress Bars
- Height: 8px
- Rounded: rounded-full
- Smooth fill animation
- Color based on status (downloading, queued, complete, failed)

### Tables
- Zebra striping: Subtle (bg-muted/5)
- Header: Sticky, bold, smaller text
- Row hover: bg-muted/10
- Borders: Subtle horizontal lines only
- Monospace for numbers/sizes
- Right-align numeric data

---

## Imagery

### Model Thumbnails
- Aspect ratio: 3:4 (portrait)
- Quality: High-res, optimized
- Loading: Skeleton placeholder
- Error: Fallback pattern

### Icons
- Source: Lucide React (16px or 20px typically)
- Consistent stroke width
- Aligned with text baseline
- Color: text-muted-foreground or primary for actions

---

## Responsive Design

### Breakpoints
```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
```

### Mobile Adaptations
- Sidebar: Collapsible with toggle
- Grid: Single column on mobile
- Touch targets: Minimum 44×44px
- Bottom sheet for actions
- Simplified navigation

---

## Accessibility

- **Contrast:** WCAG AA minimum (4.5:1 for text)
- **Keyboard:** Full navigation without mouse
- **Screen readers:** Proper ARIA labels
- **Focus:** Visible indicators
- **Motion:** Respect prefers-reduced-motion

---

## Professional Polish Checklist

✓ Generous white space (never cramped)  
✓ Consistent spacing (8/16/24/32/48)  
✓ Clear visual hierarchy (size, weight, color)  
✓ Subtle borders (not harsh lines)  
✓ Professional elevation (not heavy shadows)  
✓ Unified icon system (Lucide)  
✓ Cohesive color usage (semantic)  
✓ Smooth micro-interactions  
✓ Loading states for everything  
✓ Empty states with guidance  
✓ Error states with recovery actions  
✓ Responsive across all devices  
✓ Dark mode optimized  

---

## Anti-Patterns to Avoid

❌ Cramped spacing (min 24px between major sections)  
❌ Too many colors (stick to semantic palette)  
❌ Harsh shadows (use elevation system)  
❌ Inconsistent rounding (use theme values)  
❌ Poor contrast (check in both modes)  
❌ Missing empty/loading states  
❌ Unlabeled icon buttons  
❌ Tiny touch targets on mobile  
❌ Cluttered interfaces (progressive disclosure)  

---

This design system creates a professional, polished application that feels modern, clean, and trustworthy - suitable for serious model management workflows.
