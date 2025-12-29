# SEO Meta Tag Checker - Design Guidelines

## Design Approach: Utility-First Design System
**Selected Framework:** Modern developer tool aesthetic (Linear/Vercel/Raycast inspired)
**Rationale:** Information-dense application requiring clarity, efficiency, and professional polish for developers and marketers

## Core Design Principles
1. **Immediate Value**: URL input prominently featured; results displayed instantly
2. **Visual Hierarchy**: Clear separation between input, analysis results, and preview sections
3. **Scannable Data**: Tag information presented in digestible, color-coded cards
4. **Real Previews**: High-fidelity mockups of how content appears on Google/social platforms

## Typography System
- **Primary Font**: Inter (400, 500, 600 weights)
- **Monospace Font**: JetBrains Mono for meta tag code snippets
- **Hierarchy**:
  - Page title: text-3xl font-semibold
  - Section headers: text-xl font-semibold
  - Card titles: text-base font-medium
  - Body text: text-sm
  - Meta tag labels: text-xs uppercase tracking-wide

## Layout & Spacing
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16
- Component padding: p-6 or p-8
- Section gaps: gap-8 or gap-12
- Card spacing: space-y-4
- Grid gaps: gap-6

**Container System**:
- Max-width: max-w-6xl for main content
- Full-width preview cards at max-w-4xl

## Component Library

### Input Section
- Large, prominent URL input field with "Analyze" button
- Search icon prefix, loading state indicator
- Recent searches dropdown (5 most recent URLs)
- Example URLs as placeholder suggestions

### Results Dashboard (Post-Analysis)
**Three-Column Layout** (desktop: grid-cols-3, tablet: grid-cols-2, mobile: grid-cols-1):

**Column 1: Meta Tags Overview**
- Status cards showing: Title, Description, OG Tags, Twitter Cards, Canonical, Robots
- Each card displays: tag name, current value, character count, status indicator (success/warning/error)
- Character count progress bars (green when optimal, yellow when too long/short, red when missing)

**Column 2: SEO Score & Recommendations**
- Overall SEO score with circular progress indicator
- Expandable recommendation cards with:
  - Issue severity badges (Critical, Warning, Suggestion)
  - Before/after code snippets
  - Character count guidance
  - Quick fix suggestions

**Column 3: Tag Details Panel**
- Syntax-highlighted code view of all meta tags
- Copy-to-clipboard buttons for each tag
- Tag presence checklist with visual checkmarks

### Preview Section (Full-Width Below Dashboard)
**Tabbed Interface**: Google Search | Facebook | Twitter | LinkedIn

Each tab contains pixel-perfect mockups:
- **Google Preview**: Search result card with title (blue), URL (green), description
- **Facebook Preview**: Card with image placeholder, title, description, domain
- **Twitter Preview**: Card (summary/large image variants)
- **LinkedIn Preview**: Professional card format

Preview cards have subtle elevation (shadow-lg) and responsive padding

### Additional Components
- **Export Button**: Download report as PDF/JSON
- **Comparison Mode**: Side-by-side before/after when re-analyzing
- **History Sidebar**: Collapsible panel showing analysis history with timestamps

## Navigation
- Simple top bar with logo/title left, documentation link right
- No complex navigation needed - single-page application focus

## Visual Enhancements
- **Status Indicators**: Green (✓), Yellow (⚠), Red (✗) with semantic icons
- **Progress Bars**: Horizontal bars showing character count (0-160 for description, 0-60 for title)
- **Badges**: Pill-shaped badges for tag types (Required, Recommended, Optional)
- **Code Blocks**: Syntax highlighting for HTML/meta tags with line numbers

## Responsive Behavior
- Desktop (lg): Three-column dashboard layout
- Tablet (md): Two-column layout with reordered priority
- Mobile: Single column stack, preview tabs as full-width cards

## Images
**No large hero image needed** - utility tool prioritizes immediate functionality.

**Small Icon/Illustration Assets**:
- Logo/tool icon in top-left (32x32px)
- Empty state illustration when no URL analyzed (400x300px centered graphic showing "Enter URL to begin")
- Social platform logos (16x16px) for preview tabs
- Status icons throughout (Heroicons library)

## Interaction Patterns
- Smooth transitions between states (loading → results)
- Expandable/collapsible recommendation cards
- Hover states on preview cards showing "This is how it appears to users"
- Copy-to-clipboard feedback (checkmark animation)
- Tab switching with subtle fade transitions

## Performance Considerations
- Skeleton loaders during URL fetch/analysis
- Progressive rendering: show meta tags first, then previews
- Debounced real-time validation if editing suggestions inline