# Implementation Plan - Galaxy AI Hub (Full-Stack Production Application)

Build a complete, production-grade full-stack platform called **Galaxy AI Hub** combining AI feature discovery, interactive on-device AI demos, Galaxy device marketplace, user account system, and full admin dashboard.

## User Review Required

> [!IMPORTANT]
> The application will be built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Framer Motion**, **Prisma ORM** (with zero-config SQLite for instant out-of-the-box local execution, easily switchable to PostgreSQL via `DATABASE_URL`), and a **JWT/Session Auth System** with bcrypt password hashing.
> 
> A demo admin account (`admin@galaxyai.hub` / `Admin@123456`) and user account (`user@galaxyai.hub` / `User@123456`) will be pre-seeded.

## Features & Architecture Overview

### 1. Futuristic Dark UI Design System
- Galaxy-inspired obsidian theme with neon cyan (`#00F0FF`), deep space blue (`#0B0F19`), electric indigo (`#6366F1`), and glassmorphism.
- Responsive navigation with search bar, AI features dropdown, category navigation, cart drawer badge, wishlist badge, user dropdown, and admin indicator.
- Floating Galaxy AI Chat Assistant with intelligent contextual advice and device recommendation.
- Dynamic toast notification system for all major user actions.

### 2. Interactive AI Demo Suite (`/ai/demos`)
- **Photo Edit Demo**: Upload or pick sample photo, choose AI actions (Remove Object, Enhance Image, Erase Reflections, Generative Background, Sketch to Image), interactive before/after split slider, real-time canvas processing simulation with step-by-step NPU indicators.
- **Live Translation Demo**: 10+ languages (English, Korean, Japanese, Spanish, German, French, Chinese, Hindi, Arabic, Italian), real-time bidirectional audio/text simulation with voice playback synthesis.
- **Writing Assist Demo**: Real-time rewriting engine with 6 tone modifiers (Professional, Casual, Concise, Engaging, Academic, Bullet Points) and grammar fixing.
- **Note Assist Demo**: Converts unformatted lecture/meeting scribbles into executive summaries, bulleted takeaways, and actionable to-do lists with checklist toggles.
- **Circle to Search Demo**: Interactive visual viewport search with Google AI summary, key insights, and related specs.

### 3. AI Personalization Engine ("Galaxy AI for You")
- Dynamic persona picker: *Student, Professional, Creator, Traveler, Everyday User*.
- Computes matching AI tools, recommended Galaxy hardware, tailored tutorials, and allows 1-click saving to user account preferences.

### 4. Device Marketplace & Comparison
- `/devices`: Rich catalog with real-time filters (category: Smartphones, Tablets, Watches, Audio; price range; AI Tier; storage), sorting, and grid/list view.
- `/devices/[id]`: Interactive gallery, color variant selector, storage selector, quantity counter, specs matrix, AI capability breakdown, customer reviews, Add to Cart & Buy Now.
- `/compare`: Side-by-side comparison matrix for up to 3 devices across Display, NPU, Camera, Battery, Storage, Knox Security, and OS support.

### 5. Learning Center & Offers
- `/learn` & `/learn/[slug]`: Rich articles with categories (AI Guides, Tips & Tricks, Hardware, Security), table of contents, author badges, and related articles.
- `/offers`: Live promotional campaign cards with coupon code copying, countdown timers, trade-in bonus estimator, and direct eligible device links.

### 6. Cart, Wishlist & Demo Checkout
- `/cart`: Interactive cart with quantity adjustment, promo code calculation, item removal, tax/shipping computation, and seamless checkout link.
- `/wishlist`: Save favorite devices with 1-click "Move to Cart" and localStorage/database sync.
- `/checkout`: Multi-step checkout (Review -> Shipping Address -> Payment Method -> Order Summary) with instant order creation and receipt generation.

### 7. Authentication & User Account
- `/login`, `/register`, `/account`, `/account/orders`, `/account/profile`, `/account/saved-ai`.
- Secure password hashing (bcrypt), JWT cookie sessions, protected route middleware.
- Full order tracking timeline (Pending -> Processing -> Shipped -> Delivered).

### 8. Full-Featured Admin Portal (`/admin`)
- `/admin`: Real-time KPI stats (Total Sales, Total Orders, Active Users, Inventory Status, Sales Charts).
- `/admin/products`: Product CRUD with image, price, stock, category, specs management.
- `/admin/orders`: Order management with customer details and status update dropdown.
- `/admin/users`: User role management (promote to ADMIN / demote to USER).
- `/admin/ai-features`: Add/edit AI features and demo parameters.
- `/admin/content`: Publish/edit learning articles.

---

## Proposed Project Structure

```
galaxy-ai-hub/
├── prisma/
│   ├── schema.prisma        # Prisma models: User, Product, Order, AIFeature, Article, Offer, etc.
│   └── seed.ts              # Rich seed script with 8+ devices, 9 AI features, 6 articles, 5 offers, admin user
├── public/
│   └── images/              # High-res product images & icons
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Navbar, Footer, AI Assistant, Toaster
│   │   ├── page.tsx         # Homepage with Hero, Persona Selector, AI Features, Top Devices, Knox Security
│   │   ├── ai/
│   │   │   ├── page.tsx     # AI Overview
│   │   │   ├── features/
│   │   │   │   ├── page.tsx # All AI Features list
│   │   │   │   └── [id]/page.tsx # Feature detail page
│   │   │   └── demos/page.tsx # Interactive AI Demo Lab
│   │   ├── devices/
│   │   │   ├── page.tsx     # Device Marketplace
│   │   │   └── [id]/page.tsx # Product Detail Page
│   │   ├── compare/page.tsx # 3-Device Comparison Matrix
│   │   ├── learn/
│   │   │   ├── page.tsx     # Learning Center
│   │   │   └── [slug]/page.tsx # Article Detail
│   │   ├── offers/page.tsx  # Deals & Promotions
│   │   ├── search/page.tsx  # Global Search Results
│   │   ├── cart/page.tsx    # Shopping Cart
│   │   ├── wishlist/page.tsx # Wishlist
│   │   ├── checkout/page.tsx # Checkout flow & demo payment
│   │   ├── login/page.tsx   # Login page
│   │   ├── register/page.tsx # Register page
│   │   ├── account/
│   │   │   ├── page.tsx     # User Dashboard
│   │   │   ├── orders/page.tsx # User Orders
│   │   │   └── profile/page.tsx # Profile edit
│   │   ├── admin/
│   │   │   ├── layout.tsx   # Admin Layout & Sidebar
│   │   │   ├── page.tsx     # Admin KPI Dashboard
│   │   │   ├── products/page.tsx # Admin Product Management
│   │   │   ├── orders/page.tsx   # Admin Order Management
│   │   │   ├── users/page.tsx    # Admin User Management
│   │   │   ├── ai-features/page.tsx # Admin AI Feature Management
│   │   │   └── content/page.tsx  # Admin Article Management
│   │   └── api/
│   │       ├── auth/        # Login, register, me, logout endpoints
│   │       ├── products/    # Product CRUD endpoints
│   │       ├── orders/      # Order creation and status update endpoints
│   │       ├── ai-features/ # AI feature endpoints
│   │       ├── search/      # Global search endpoint
│   │       ├── ai/          # AI demo API endpoints (translate, write, notes, search)
│   │       └── admin/       # Admin analytics & role update endpoints
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AIAssistant.tsx   # Floating interactive AI helper
│   │   ├── Toast.tsx         # Toast notification manager
│   │   ├── AIDemoPhoto.tsx   # Photo edit demo component
│   │   ├── AIDemoTranslate.tsx # Translation demo component
│   │   ├── AIDemoWriting.tsx # Writing assist demo component
│   │   ├── AIDemoNotes.tsx   # Note assist demo component
│   │   ├── AIDemoSearch.tsx  # Search demo component
│   │   ├── PersonaRecommender.tsx # Galaxy AI for You persona matcher
│   │   └── ProductCard.tsx
│   ├── context/
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # JWT token signing/verification & password hashing
│   │   ├── mockAI.ts        # Mock/Realistic AI Service Interface with LLM fallback
│   │   └── initialData.ts   # Seed dataset fallback
├── .env.example
├── README.md
└── package.json
```

---

## Verification Plan

### Automated Verification
1. `npm.cmd run build` or Next.js build compilation to verify zero TypeScript or syntax errors.
2. Prisma migration/db push and seed execution (`npx.cmd prisma db push`, `npx.cmd prisma db seed`).
3. API endpoint verification (Health, Auth, Products, Orders, AI Demos).

### Manual & Interactive Verification
1. **Homepage & Navigation**: Test all navbar links, hero buttons, search bar modal, persona switcher.
2. **AI Demos**: Test Photo Edit (image actions, slider), Live Translate (switching languages & voice play), Writing Assist (all 6 tone transformations), Note Assist (summarize & tasks), and Search demo.
3. **Marketplace & Products**: Test filtering, sorting, selecting color & storage variants, Add to Cart, Add to Wishlist.
4. **Compare**: Select 3 devices and verify dynamic comparison matrix.
5. **Cart & Checkout Flow**: Add items -> View Cart -> Apply discount -> Proceed to Checkout -> Enter shipping & demo payment -> Confirm Order -> Verify order in Account orders and Admin orders.
6. **Authentication & Admin Dashboard**: Test Register -> Login as User -> Logout -> Login as Admin (`admin@galaxyai.hub` / `Admin@123456`) -> Verify Admin KPI metrics, product creation/editing, order status update, and user role modification.
7. **AI Assistant**: Test floating chat with custom questions and quick prompts.
