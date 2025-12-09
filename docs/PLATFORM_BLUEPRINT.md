# 🎨 OurCreativity Platform — Complete Blueprint

> **Document Type**: Master Planning & Prompting Guide  
> **Version**: 1.0  
> **Date**: December 2025  
> **Purpose**: Full context, design language, and prompting instructions for building the OurCreativity Social Platform

---

## Table of Contents

1. [Brand Context & Identity](#1-brand-context--identity)
2. [Platform Vision](#2-platform-vision)
3. [Design Language & Aesthetics](#3-design-language--aesthetics)
4. [Feature Specification](#4-feature-specification)
5. [User Experience Philosophy](#5-user-experience-philosophy)
6. [Design Inspirations](#6-design-inspirations)
7. [Technical Guidelines](#7-technical-guidelines)
8. [AI Prompting Instructions](#8-ai-prompting-instructions)

---

# 1. Brand Context & Identity

## 1.1 Who is OurCreativity?

**OurCreativity** (stylized as *"Our Creativity."* with a period) is a next-generation creative community platform designed to be the ultimate home for creators across all disciplines. It is an **Indonesian-born digital ecosystem** that celebrates imagination, artistry, and collaborative creation.

### Core Philosophy
> *"Merangkai Imajinasi, Menghidupkan Karya."*  
> (Weaving Imagination, Bringing Creations to Life.)

### Brand Personality
- **Premium** — Everything feels high-end, polished, and intentional
- **Fluid** — Smooth animations, seamless transitions, no jarring interactions
- **Dark & Luminous** — Deep dark backgrounds with glowing accents
- **Inclusive** — Welcomes all forms of creativity without hierarchy
- **Futuristic yet Warm** — Modern tech aesthetic with human touch

### The Five Creative Divisions

| Division | Indonesian | Description | Icon Concept |
|----------|-----------|-------------|--------------|
| **Graphics** | Grafis | Digital art, UI/UX, illustration | 🖼️ Frame/Canvas |
| **Coding** | Coding | Software engineering, creative coding | 💻 Terminal |
| **Video** | Video | Film, motion graphics, cinematography | 🎬 Clapperboard |
| **Writing** | Menulis | Literature, journalism, poetry | ✍️ Quill/Pen |
| **Meme** | Meme | Internet culture, humor, trends | 😂 Comedy mask |

---

## 1.2 Existing Brand Assets

### Logo Concept
- **Symbol**: An asterisk (*) inside a circle — represents a spark of creativity
- **Wordmark**: "Our Creativity." in serif font (Playfair Display)
- **Usage**: Symbol for compact spaces, full wordmark for hero sections

### Taglines
- Primary: *"Merangkai Imajinasi, Menghidupkan Karya."*
- Secondary: *"Platform Komunitas Kreatif Generasi Berikutnya"*
- Short: *"Where creators come alive."*

### Color Palette (Design Tokens)

```
┌─────────────────────────────────────────────────────────┐
│  CORE COLORS                                            │
├─────────────────────────────────────────────────────────┤
│  Background        #030303   (Near-black)               │
│  Surface           #0f0f0f   (Elevated dark)            │
│  Surface Highlight #1a1a1a   (Cards, hover states)      │
│  Primary Text      #ffffff   (Pure white)               │
│  Secondary Text    #a1a1aa   (Muted gray)               │
├─────────────────────────────────────────────────────────┤
│  ACCENT COLORS                                          │
├─────────────────────────────────────────────────────────┤
│  Accent Rose       #e11d48   (Energy, CTAs)             │
│  Accent Purple     #a855f7   (Creative, magic)          │
│  Accent Emerald    #10b981   (Success, growth)          │
│  Accent Amber      #f59e0b   (Warning, highlight)       │
│  Accent Blue       #3b82f6   (Info, links)              │
└─────────────────────────────────────────────────────────┘
```

### Typography

| Use Case | Font | Weights |
|----------|------|---------|
| **Sans-Serif (Primary)** | Inter | 300, 400, 500, 600, 700 |
| **Serif (Accent/Display)** | Playfair Display | 400, 600, 700, 400 italic |

**Typographic Hierarchy**:
- Hero titles: Playfair Display, 48-72px, 600-700 weight
- Section headings: Inter, 24-36px, 600 weight
- Body text: Inter, 16px, 400 weight
- Captions: Inter, 12-14px, 400 weight, secondary color

---

# 2. Platform Vision

## 2.1 What We're Building

**OurCreativity Platform** (codename: *"Creativities"*) is a standalone social platform that extends the OurCreativity brand into an interactive, user-generated content ecosystem.

### Platform vs. Portfolio Site

| Aspect | Portfolio Site (Current) | Platform (New) |
|--------|-------------------------|----------------|
| **Purpose** | Showcase, landing, team info | User interaction, creation, socializing |
| **Users** | Visitors (read-only) | Registered members (read/write) |
| **Content** | Curated by team | User-generated |
| **Features** | Static pages | Auth, Feed, Posting, Studio |
| **Domain** | ourcreativities.com | app.ourcreativities.com |

### Core Platform Pillars

```
                    ┌─────────────────────┐
                    │   CREATIVITIES      │
                    │   PLATFORM          │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐         ┌─────────────┐       ┌───────────┐
   │ SOCIAL  │         │  CREATION   │       │ DISCOVERY │
   │  FEED   │         │   STUDIO    │       │  & SEARCH │
   └─────────┘         └─────────────┘       └───────────┘
        │                     │                     │
   Tweet-style           Tools for              Pinterest-style
   interactions          making art              exploration
```

---

## 2.2 Target Users

### Primary Audience
- **Indonesian Gen-Z creators** (15-25 years old)
- Digital artists, writers, coders, video editors, meme lords
- Students exploring creative expression
- Hobbyists and professionals alike

### User Personas

**1. Luna (17, High School Student)**
- Posts digital art and sketches
- Follows other artists for inspiration
- Wants recognition and feedback

**2. Raka (22, CS Student)**
- Shares coding projects and experiments
- Writes technical articles
- Wants to build a portfolio

**3. Dian (19, Content Creator)**
- Creates memes and short-form content
- High engagement, follows trends
- Wants virality and community

---

# 3. Design Language & Aesthetics

## 3.1 Design Philosophy

### The "Luminous Dark" Paradigm

OurCreativity embraces a **dark-first design** that isn't gloomy—it's *luminous*. Think of it as walking through a premium gallery at night with carefully placed spotlights highlighting each artwork.

**Key Principles**:

1. **Darkness as Canvas** — The dark background is a neutral canvas that makes content pop
2. **Light as Accent** — Strategic glows, gradients, and whites draw attention
3. **Depth Through Layers** — Multiple surface levels create hierarchy
4. **Movement as Life** — Subtle animations make the UI feel alive

### Visual Metaphors

- **Gallery Walls**: Content cards as framed artworks
- **Spotlights**: Hover effects and focus states as illumination
- **Glass Cases**: Glassmorphism elements for premium interactions
- **Ambient Lighting**: Background gradients as mood lighting

---

## 3.2 Component Design Guidelines

### Cards (The Building Block)

All content in the platform lives in cards. Cards should feel like:
- **Framed artwork** — Subtle border, lifted from background
- **Touchable** — Clear affordance for interaction
- **Breathing** — Generous padding, content has room

**Card Anatomy**:
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │         [Media/Image]           │    │ ← Visual first
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Author Avatar    Author Name    Time   │ ← Attribution
│                                         │
│  "Post content or caption text..."      │ ← Content
│                                         │
│  [♡ Like] [💬 Comment] [↗ Share]        │ ← Actions
│                                         │
└─────────────────────────────────────────┘
```

**Card States**:
- Default: `bg-surface` with `border-white/5`
- Hover: Scale 1.02, `border-white/10`, subtle glow
- Active: Border accent color
- Loading: Skeleton with shimmer animation

### Buttons

| Type | Use Case | Style |
|------|----------|-------|
| **Primary** | Main CTAs | Solid white bg, black text |
| **Secondary** | Alt actions | Transparent bg, white border |
| **Ghost** | Tertiary | Transparent, white text only |
| **Accent** | Special | Gradient bg (rose → purple) |
| **Icon** | Actions | Circle, subtle bg, centered icon |

**Button Behavior**:
- Hover: Slight scale up (1.05), background shift
- Active: Scale down (0.98)
- Loading: Replace text with spinner
- Disabled: 50% opacity, no pointer events

### Input Fields

**Design**:
- Dark background (`bg-surface`)
- Subtle border (`border-white/10`)
- Focus: Border accent color, subtle glow
- Placeholder: Secondary text color
- Error: Red border, error message below

**Types**:
- Text input
- Textarea (multi-line)
- Select/Dropdown
- Toggle/Switch
- Checkbox
- File upload (drag-and-drop zone)

### Navigation

**Top Navigation Bar**:
- Floating pill design (from portfolio site)
- Glassmorphism background
- Collapses to icon-only on scroll
- Reveals on hover

**Bottom Navigation (Mobile)**:
- Fixed bottom bar
- 4-5 primary destinations
- Active state with accent color
- Subtle backdrop blur

### Modals & Dialogs

- Centered, max-width 500px
- Dark surface with enhanced blur
- Smooth scale-in animation
- Dimmed backdrop
- Clear close affordance

---

## 3.3 Animation Guidelines

### Timing & Easing

| Type | Duration | Easing |
|------|----------|--------|
| **Micro** (hover, tap) | 150-200ms | ease-out |
| **Navigation** | 200-300ms | ease-out |
| **Page Transitions** | 300-500ms | ease-in-out |
| **Reveal/Entrance** | 400-600ms | ease-out |
| **Background/Ambient** | 4-8s | linear (loop) |

### Common Animations

**Fade In Up**:
```
Initial: opacity 0, translateY 20px
Animate: opacity 1, translateY 0
```

**Scale In**:
```
Initial: opacity 0, scale 0.9
Animate: opacity 1, scale 1
```

**Stagger Children**:
```
Container triggers children with 50-100ms delay each
```

### Performance Rules
- Only animate `transform` and `opacity`
- Never animate `width`, `height`, or `margin`
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

---

## 3.4 Responsive Design

### Breakpoints

| Name | Width | Description |
|------|-------|-------------|
| **xs** | < 480px | Small phones |
| **sm** | ≥ 480px | Large phones |
| **md** | ≥ 768px | Tablets |
| **lg** | ≥ 1024px | Laptops |
| **xl** | ≥ 1280px | Desktops |
| **2xl** | ≥ 1536px | Large screens |

### Layout Adaptation

**Feed Grid**:
- xs-sm: 1 column, full width cards
- md: 2 columns, masonry layout
- lg: 3 columns, masonry layout
- xl+: 4 columns, masonry layout

**Navigation**:
- xs-md: Bottom tab bar
- lg+: Top floating navbar

---

# 4. Feature Specification

## 4.1 Core Features

### Authentication System

| Feature | Description |
|---------|-------------|
| **Sign Up** | Email + Password, or OAuth (Google, GitHub) |
| **Login** | Email + Password, or OAuth |
| **Password Reset** | Email-based reset flow |
| **Profile Setup** | Username, avatar, bio (post-signup) |

**UX Flow**:
```
Landing → Sign Up → Verify Email → Complete Profile → Feed
                           ↓
                    Login → Feed
```

### User Profiles

**Profile Data**:
- Display name
- Username (unique, @-prefixed)
- Avatar image
- Bio (max 200 chars)
- Division badge(s)
- Join date
- Follower/Following counts
- Portfolio link (optional)

**Profile Actions**:
- Follow/Unfollow
- View posts
- View collections
- Message (future)

### Social Feed

**The "Creativities" Feed**:
- Pinterest-style masonry grid
- Tweet-style cards (image + caption)
- Infinite scroll
- Real-time updates

**Feed Types**:
1. **For You** — Algorithmic mix (future)
2. **Following** — Posts from followed users
3. **Trending** — High engagement posts
4. **Division Feed** — Filter by division (Graphics, Coding, etc.)

### Posts (Karya)

**Post Types**:

| Type | Content | Visual |
|------|---------|--------|
| **Image** | Single or multiple images | Gallery/Carousel |
| **Text** | Long-form text, markdown | Formatted reader |
| **Code** | Code snippets | Syntax-highlighted |
| **Video** | Video embed (YouTube, etc.) | Embedded player |
| **Link** | URL with preview | Link card |

**Post Actions**:
- ❤️ Like
- 💬 Comment
- 🔖 Save to collection
- ↗️ Share (copy link)
- ⋮ More (report, delete if owner)

### Creation Studio

**Post Composer**:
- Rich text editor
- Image upload (drag-and-drop)
- Division selector
- Tag input
- Preview mode
- Draft saving

**Advanced Studio** (Future):
- Canvas for quick graphics
- Code playground
- Collaborative editing

### Discovery & Search

**Explore Page**:
- Trending posts
- Featured creators
- Division showcases
- Hashtag clouds

**Search**:
- Users
- Posts
- Tags
- Divisions

---

## 4.2 Interaction Flows

### Posting Flow

```
┌─────────┐    ┌─────────────┐    ┌──────────────┐    ┌────────┐
│ Tap (+) │ →  │ Select Type │ →  │ Create/Edit  │ →  │ Review │ → Post!
└─────────┘    └─────────────┘    └──────────────┘    └────────┘
                    │                    │
                    │                    │
               [Image]              [Upload]
               [Text]               [Write]
               [Code]               [Paste]
```

### Engagement Flow

```
See Post → Like ❤️ → Show animation
        → Comment 💬 → Open comment drawer → Type → Submit
        → Save 🔖 → Add to collection
        → Share ↗️ → Copy link / Open share sheet
```

---

# 5. User Experience Philosophy

## 5.1 UX Principles

### 1. **Content First**
The UI should disappear. When users browse, they should feel immersed in the content, not the interface. Minimize chrome, maximize art.

### 2. **Instant Feedback**
Every action should have immediate visual feedback. Taps ripple, buttons respond, loading states are clear. No dead clicks.

### 3. **Progressive Disclosure**
Show only what's needed. Hide complexity behind menus. Reveal advanced features as users explore.

### 4. **Forgiving Interactions**
Confirm destructive actions. Allow undo. Never lose user work. Auto-save drafts.

### 5. **Delightful Moments**
Micro-animations on likes, confetti on milestones, satisfying sounds (optional). Small joys that make users smile.

---

## 5.2 Accessibility Requirements

- **WCAG 2.1 Level AA** compliance
- Keyboard navigable
- Screen reader compatible
- Color contrast ≥ 4.5:1
- Focus indicators visible
- Motion respects system preference
- Alt text for all images

---

# 6. Design Inspirations

## 6.1 Visual References

### Primary Inspirations

| Platform | What to Learn |
|----------|---------------|
| **Pinterest** | Masonry grid, visual discovery, pin-to-board |
| **Twitter/X** | Card-based posts, quick interactions, real-time feel |
| **Dribbble** | Creator profiles, shot cards, appreciation culture |
| **Behance** | Project case studies, premium feel, portfolio integration |
| **Linear App** | Dark UI excellence, micro-animations, keyboard shortcuts |
| **Vercel Dashboard** | Glassmorphism, minimal yet informative |
| **Stripe Docs** | Typography, spacing, polish |
| **Arc Browser** | Playful animations, space efficiency |

### Aesthetic Keywords

```
Premium   •   Minimal   •   Dark Mode   •   Luminous
Fluid     •   Glass     •   Elevated    •   Breathing
Editorial •   Gallery   •   Curated     •   Intentional
```

---

## 6.2 UI Patterns to Adopt

### From Pinterest
- Masonry grid layout
- Save to board/collection
- Visual-first cards
- Endless scroll

### From Twitter
- Timeline feed concept
- Like/Reply/Repost triad
- Creator verification
- Notification center

### From Dribbble
- Full-bleed images in cards
- View/Like/Save counts
- "Following" tab
- Shot of the day

### From Linear
- Command palette (Cmd+K)
- Subtle borders
- Motion that conveys meaning
- Keyboard-first

---

# 7. Technical Guidelines

## 7.1 Recommended Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | Next.js 14+ (App Router) | SSR, routing, performance |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS + CSS Variables | Consistency, theming |
| **Animation** | Framer Motion | Declarative, performant |
| **Backend** | Supabase | Auth, DB, Storage, Realtime |
| **State** | Zustand or Jotai | Lightweight, simple |
| **Forms** | React Hook Form + Zod | Validation, UX |
| **Icons** | Lucide React | Consistent, customizable |

## 7.2 Project Structure

```
ourcreativities-platform/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   ├── (main)/          # Authenticated pages
│   │   │   ├── feed/
│   │   │   ├── explore/
│   │   │   ├── create/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # Primitive UI components
│   │   ├── features/        # Feature-specific components
│   │   └── layouts/         # Layout components
│   ├── lib/
│   │   ├── supabase/        # Supabase client & helpers
│   │   ├── utils/           # Utility functions
│   │   └── hooks/           # Custom hooks
│   ├── styles/
│   │   └── globals.css
│   └── types/               # TypeScript types
├── public/
├── supabase/
│   └── migrations/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 7.3 Database Schema (Conceptual)

```
┌─────────────────┐       ┌─────────────────┐
│    profiles     │       │     posts       │
├─────────────────┤       ├─────────────────┤
│ id (FK auth)    │───┐   │ id              │
│ username        │   │   │ author_id       │←──┐
│ display_name    │   │   │ type            │   │
│ avatar_url      │   │   │ content         │   │
│ bio             │   │   │ image_urls[]    │   │
│ division        │   │   │ division        │   │
│ created_at      │   │   │ likes_count     │   │
└─────────────────┘   │   │ created_at      │   │
                      │   └─────────────────┘   │
                      │                         │
                      │   ┌─────────────────┐   │
                      │   │     likes       │   │
                      │   ├─────────────────┤   │
                      │   │ user_id         │───┘
                      └──▶│ post_id         │
                          │ created_at      │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    follows      │       │   collections   │
├─────────────────┤       ├─────────────────┤
│ follower_id     │       │ id              │
│ following_id    │       │ owner_id        │
│ created_at      │       │ name            │
└─────────────────┘       │ post_ids[]      │
                          └─────────────────┘
```

---

# 8. AI Prompting Instructions

## 8.1 How to Prompt for This Project

When asking an AI (Claude, GPT, Cursor, etc.) to help build this platform, use the following structured prompts:

---

### Prompt Template: Initial Setup

```
I am building a social creative platform called "OurCreativity" (stylized "Our Creativity.").

BRAND CONTEXT:
- Indonesian creative community platform
- "Luminous Dark" design philosophy: dark backgrounds (#030303), white text, accent colors (rose #e11d48, purple #a855f7, emerald #10b981)
- Typography: Inter (sans) + Playfair Display (serif)
- Premium, fluid, minimal aesthetic inspired by Pinterest + Twitter + Linear
- Five creative divisions: Graphics, Coding, Video, Writing, Meme

TECH STACK:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Auth, Database, Storage)
- Lucide React icons

CURRENT TASK:
[Describe what you want to build]

REQUIREMENTS:
- Must match the dark, premium aesthetic
- Smooth animations with Framer Motion
- Mobile-first responsive design
- Accessible (WCAG 2.1 AA)

Please [build/design/debug/explain] [specific component/feature].
```

---

### Prompt Template: Component Building

```
Create a [ComponentName] for the OurCreativity platform.

DESIGN SPECS:
- Background: #0f0f0f (surface)
- Border: 1px solid rgba(255,255,255,0.05)
- Border radius: 12px
- Hover: scale 1.02, border-white/10
- Font: Inter for body, Playfair Display for titles
- Accent: Rose (#e11d48) for primary actions

FUNCTIONALITY:
[Describe what the component does]

REQUIREMENTS:
- Use TypeScript
- Use Tailwind CSS classes
- Add Framer Motion animations
- Make it responsive
- Include proper accessibility attributes

Return the full component code.
```

---

### Prompt Template: Page Layout

```
Build the [PageName] page for OurCreativity platform.

PAGE PURPOSE:
[Describe the page's purpose]

SECTIONS:
1. [Section 1]
2. [Section 2]
3. [Section 3]

LAYOUT:
- Desktop: [describe layout]
- Mobile: [describe layout]

COMPONENTS TO USE:
- [Component1]
- [Component2]

DATA:
- Fetched from Supabase table: [table_name]
- [Describe data structure]

Follow the OurCreativity design system: dark backgrounds, luminous accents, 
fluid animations, premium feel.
```

---

### Prompt Template: Debugging/Fixing

```
I have an issue with [component/feature] in my OurCreativity platform.

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What's happening instead]

RELEVANT CODE:
\```tsx
[paste code here]
\```

ERROR MESSAGE (if any):
[paste error]

Please identify the issue and provide a fix that:
- Maintains the premium dark aesthetic
- Keeps any existing animations
- Follows TypeScript best practices
```

---

## 8.2 Key Phrases for Consistency

When prompting, use these phrases to maintain brand consistency:

| Phrase | Meaning |
|--------|---------|
| "Luminous Dark aesthetic" | Dark bg with glowing accents |
| "Premium, fluid feel" | High-quality, smooth animations |
| "Pinterest × Twitter hybrid" | Masonry grid + social cards |
| "Gallery-like experience" | Content as artwork |
| "OurCreativity design system" | The full brand guidelines |
| "Surface-level hierarchy" | Using #0f0f0f vs #1a1a1a for depth |
| "Breathing spacing" | Generous padding/margins |

---

## 8.3 Prompts for Specific Components

### Post Card
```
Create a PostCard component for the OurCreativity feed.

Features:
- Show post image (if exists) at top, full width
- Author avatar + name + time below image
- Caption text (truncated if long)
- Action bar: Like, Comment, Save, Share
- Like animation on tap (scale + particles)

Style: Dark surface, subtle border, hover lift effect.
Use Framer Motion for animations.
```

### Navigation Bar
```
Create a floating NavBar for OurCreativity.

Desktop behavior:
- Full width on load, shows all links
- Shrinks to pill on scroll
- Expands on hover

Mobile behavior:
- Fixed bottom tab bar
- 5 tabs: Feed, Explore, Create (+), Notifications, Profile

Style: Glassmorphism, dark with white links, accent on active.
Use Framer Motion layout animations.
```

### Auth Pages
```
Create Login and Signup pages for OurCreativity.

Design:
- Split layout: Left side decoration/illustration, right side form
- On mobile: Form only, stacked
- Dark background with subtle gradient glow
- Form inputs: dark surface, white text, accent focus ring
- "Our Creativity." logo at top
- OAuth buttons for Google and GitHub
- Link to switch between login/signup

Use Supabase Auth for backend integration.
```

### Create Post Modal
```
Create a CreatePostModal for OurCreativity.

Features:
- Full-screen on mobile, centered modal on desktop
- Image upload zone (drag-and-drop)
- Caption textarea with character count
- Division selector (Graphics, Coding, Video, Writing, Meme)
- Tag input (comma separated)
- Post button (disabled until content added)
- Cancel button with confirmation if content exists

Animations: Fade in + scale up, backdrop blur.
```

---

## 8.4 Quality Checklist

Before finalizing any AI-generated code, verify:

- [ ] **Dark Theme**: Uses #030303, #0f0f0f, #1a1a1a correctly
- [ ] **Typography**: Inter for body, Playfair for display
- [ ] **Accents**: Rose/Purple/Emerald used appropriately
- [ ] **Animations**: Framer Motion with proper easing
- [ ] **Responsive**: Works on mobile (xs) through desktop (xl)
- [ ] **Accessible**: Focus states, aria labels, keyboard nav
- [ ] **TypeScript**: Proper types, no `any`
- [ ] **Performance**: No layout-triggering animations
- [ ] **Consistency**: Matches other components in the system

---

# Appendix: Quick Reference

## Color Palette Copy-Paste

```css
/* Core */
--background: #030303;
--surface: #0f0f0f;
--surface-highlight: #1a1a1a;
--text-primary: #ffffff;
--text-secondary: #a1a1aa;

/* Accents */
--accent-rose: #e11d48;
--accent-purple: #a855f7;
--accent-emerald: #10b981;
--accent-amber: #f59e0b;
--accent-blue: #3b82f6;

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.05);
--border-medium: rgba(255, 255, 255, 0.1);
--border-strong: rgba(255, 255, 255, 0.2);
```

## Font Import

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

## Tailwind Config Snippet

```js
colors: {
  background: '#030303',
  surface: '#0f0f0f',
  surfaceHighlight: '#1a1a1a',
  primary: '#ffffff',
  secondary: '#a1a1aa',
  accentRose: '#e11d48',
  accentPurple: '#a855f7',
  accentEmerald: '#10b981',
},
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  serif: ['Playfair Display', 'serif'],
}
```

---

**Document End**

*This blueprint is a living document. Update as the platform evolves.*

---

*Created for OurCreativity*  
*December 2025*
