# CivitAI Model Manager - Design Guidelines

## Design Approach

**Selected Approach:** Design System + Productivity Tool Inspiration

Drawing from modern productivity applications like Linear, Notion, and specialized download managers, focusing on clean data presentation, efficient workflows, and visual clarity for technical users.

**Core Principles:**
- Information hierarchy over decoration
- Instant visual feedback for all operations
- Organized, scannable layouts
- Technical precision with approachable UI

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Default):**
- Background Base: 222 14% 8% (deep slate)
- Surface: 222 12% 12% (elevated panels)
- Surface Hover: 222 10% 15% (interactive states)
- Border: 222 10% 18% (subtle divisions)
- Text Primary: 0 0% 95% (high contrast)
- Text Secondary: 0 0% 65% (metadata, labels)

**Accent Colors:**
- Primary Action: 210 100% 58% (vibrant blue for downloads, CTAs)
- Success: 142 76% 45% (completed downloads, confirmations)
- Warning: 38 92% 58% (queue status, storage alerts)
- Error: 0 84% 60% (failed downloads, validation)

**Status Indicators:**
- Downloading: 210 100% 58% (animated)
- Queued: 38 92% 58% (static)
- Complete: 142 76% 45% (checkmark)
- Failed: 0 84% 60% (alert icon)

### B. Typography

**Font System:**
- Primary: Inter (via Google Fonts) - clean, technical readability
- Monospace: JetBrains Mono (file paths, technical data)

**Scale:**
- Display (Page Headers): text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Body: text-base font-normal (16px)
- Metadata/Labels: text-sm font-medium (14px)
- Captions/Technical: text-xs font-mono (12px)

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent component padding: p-6
- Section spacing: space-y-8
- Card gaps: gap-4 for grids
- Form field spacing: space-y-4

**Container Strategy:**
- Sidebar Navigation: fixed w-64 (256px)
- Main Content: max-w-7xl mx-auto px-8
- Modal/Settings: max-w-2xl
- Gallery Grid: Responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)

---

## Component Library

### Navigation
**Sidebar (Fixed Left):**
- Background: Surface color
- Active state: Primary accent with left border (border-l-4)
- Icons: Heroicons (outline for inactive, solid for active)
- Sections: Dashboard, Gallery, Queue, Settings, Statistics

### Dashboard Page
**URL Input Card:**
- Prominent search-style input with paste button
- Validation indicator (checkmark/error icon inline)
- Large "Download" button (primary accent, w-full)
- Recent URLs dropdown below

**Active Downloads Panel:**
- List of download cards with progress bars
- Each card shows: thumbnail preview, model name, file size, progress percentage
- Progress bar: gradient from primary to success on completion
- Speed/time remaining in monospace font

**Quick Stats Row:**
- 4-column grid of metric cards
- Each card: number (text-3xl font-bold), label (text-sm text-secondary)
- Metrics: Total Models, Total Size, Active Downloads, Queue Length

### Gallery View
**Model Cards (Grid Layout):**
- Aspect ratio 3:4 thumbnail images
- Hover: slight scale transform (1.02) with shadow increase
- Overlay on hover: quick action buttons (View Details, Delete)
- Bottom section: Model name (truncated), type badge, file size

**Type Badges:**
- Rounded pills with category colors
- Examples: LORA (blue), Checkpoint (purple), Embedding (green)
- Small size (text-xs px-2 py-1)

### Model Detail Page
**Hero Section:**
- Large preview image carousel (max-h-96)
- Title and metadata row (type, version, file size)
- Primary action: Download Again button
- Secondary actions: Delete, Open Folder

**Tabbed Content:**
- Description tab: rich text formatting, preserve line breaks
- Activation Tags tab: copyable tag chips (click to copy)
- Gallery tab: masonry grid of downloaded images
- Files tab: list of associated files with paths

### Settings Page
**Form Sections:**
- Section headers with dividers
- API Key: password input with show/hide toggle
- ComfyUI Path: file path input with browse button (displays in monospace)
- Category Mappings: expandable accordion for each model type
- Action buttons: sticky bottom bar (Save, Cancel, Reset to Defaults)

### Queue Management
**Queue List:**
- Draggable cards (visual grab handle on left)
- Each item: thumbnail, name, priority badge, remove button
- Empty state: centered illustration with "No queued downloads"

### Statistics Page
**Storage Breakdown:**
- Donut chart showing space by model type
- Legend with percentages and absolute sizes
- Bar chart: models count by category
- Data table: detailed breakdown (sortable columns)

---

## Data Displays

**Progress Indicators:**
- Linear progress bars (h-2, rounded-full)
- Circular progress for dashboard widgets
- Percentage text overlay (centered, font-medium)

**Tables:**
- Striped rows (odd rows with subtle background)
- Sortable headers with arrow indicators
- Sticky headers on scroll
- Row hover state with slight background change

---

## Interactions & States

**Button States:**
- Primary: solid background, hover darkens
- Secondary: outline style, hover fills
- Disabled: 50% opacity, no pointer events

**Loading States:**
- Skeleton screens for gallery while loading
- Spinner for download operations
- Shimmer effect on placeholder cards

**Animations:** Minimal, functional only
- Progress bar smooth transitions
- Card hover transforms (0.2s ease)
- Page transitions: simple fade
- Toast notifications: slide in from top-right

---

## Responsive Behavior

**Desktop First (1280px+):**
- Sidebar always visible
- 4-column gallery grid
- Split-pane layouts where appropriate

**Tablet (768px-1279px):**
- Collapsible sidebar (hamburger menu)
- 2-3 column gallery grid
- Stacked form layouts

**Mobile (<768px):**
- Hidden sidebar, bottom navigation
- Single column gallery
- Full-width cards and forms

---

## Images

No hero images required. This is a utility application focused on functionality.

**Image Usage:**
- Model thumbnails in gallery (user-uploaded content from CivitAI)
- Empty state illustrations (simple, minimal SVG illustrations)
- Icon system: Heroicons throughout for consistency