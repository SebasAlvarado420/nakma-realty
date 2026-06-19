# NAKMA Realty — Project Context & Handoff

> Read this first when continuing on another machine. It captures **exactly where the project is**, how to run it, how everything is wired, and what's left to do.

Last updated: this doc is maintained as the project evolves.

---

## 1. What this is

**NAKMA Realty** is a luxury Costa Rica real-estate website (bilingual EN/ES) inspired by [lxcostarica.com](https://lxcostarica.com). It has a public marketing site + a property catalog with filters + an **admin dashboard** where the owner uploads/edits/deletes properties (with photo upload) **without touching code**.

- **Live site:** https://nakma-realty.vercel.app
- **Admin:** https://nakma-realty.vercel.app/admin (login required)
- **Aesthetic:** natural + heavy luxury, elegant serif headlines.

---

## 2. Tech stack

| Layer | Tech |
|---|---|
| Framework | **Next.js 16.2.1** (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Styling | **Tailwind CSS v4** (`app/globals.css` with CSS variables) |
| Fonts | `next/font/google` — Cormorant Garamond (brand), **Playfair Display** (headings), Plus Jakarta Sans (body) |
| Animation | framer-motion |
| Icons | lucide-react |
| Backend / DB | **Supabase** (Postgres + Storage + Auth) |
| Map | **Leaflet** + CARTO light tiles (free, no API key) |
| Hosting | **Vercel** |

> ⚠️ **This is a customized Next.js 16** — `AGENTS.md` says to read the guides in `node_modules/next/dist/docs/` before using Next APIs (font/image/metadata are standard but verify).

---

## 3. Run it locally (after cloning)

```bash
npm install          # .npmrc forces legacy-peer-deps (lucide vs React 19)
npm run dev          # → http://localhost:3000  (network: 0.0.0.0:3000)
```

- **No env vars required** — the Supabase URL + anon key are hard-coded as fallbacks in `lib/supabase.ts` (the anon key is public by design, protected by RLS). You can override with `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` if desired.
- **Videos:** `public/videos/nakma-hero.mp4` (house, 62 MB) and `public/videos/videohero-web.mp4` (beach bg, 3.9 MB) are in the repo. The **original 304 MB `videohero.MP4` is gitignored** (too big for GitHub, and unused) — keep a local copy if you need it.
- Windows note: `next build`/`next dev` can lock `.next` (OneDrive). If a build fails with `EPERM rmdir`, kill node and clean: `Get-Process node | Stop-Process -Force; Remove-Item .next -Recurse -Force; npm run build`.

---

## 4. Supabase (backend)

- **Project ID / ref:** `hiqmowapbdaspcxgoduv`
- **URL:** `https://hiqmowapbdaspcxgoduv.supabase.co`
- **anon public key:** in `lib/supabase.ts` (safe to commit). The **`service_role` key is secret** — never commit it.
- **Admin login user:** `info@nakmarealty.com` (Supabase Auth → Users). The admin dashboard logs in with this.

### Table `public.properties` (RLS enabled)
Public can **read**; only authenticated (logged-in admin) can **write**. Columns (snake_case in DB ↔ camelCase in app via `lib/properties-api.ts`):

`id` (uuid), `created_at`, `code`, `slug` (unique), `title`, `location`, `province`, `price` (text), `listing_type` ('sale'|'rent'), `rent_price`, `bedrooms` (**numeric** — allows 2.5), `bathrooms` (**numeric**), `land_size` (text), `construction_size` (text), `year_built`, `hoa`, `image`, `gallery` (jsonb[]), `video`, `video_url`, `featured` (bool), `exclusive` (bool), `highlights` (jsonb[]), `features` (jsonb {internal,external,community,lifestyle}), `community_info` (jsonb), `geo` (jsonb {address,lat,lng}), `agent_id`, `description`.

- **Storage bucket:** `property-media` (public read; authenticated upload). Photos uploaded from the admin land here.
- Full schema lives in `supabase/schema.sql`.

### How data flows
- `lib/propertiescontext.tsx` (`PropertiesProvider`) loads properties from Supabase on mount. **If the DB is empty**, it falls back to the demo seed in `data/properties.ts` (so the site is never blank).
- The DB currently holds **14 demo properties (NK01–NK14)**. To start the real catalog: delete the demos in `/admin/properties` → the auto code restarts at **NK01**.

---

## 5. Admin dashboard (`/admin`)

- **Auth gate:** `app/admin/layout.tsx` — Supabase Auth email/password. Sign out button when logged in.
- **List:** `/admin/properties` → table with **View / Edit / Delete** + an "Import demo listings" button (only when DB empty).
- **Create:** `/admin/properties/new` → `PropertyForm` (`components/admin/PropertyForm.tsx`).
- **Edit:** `/admin/properties/[id]/edit` → same `PropertyForm` with an `existing` prop (pre-filled, calls `updateProperty`).

**Form behavior (important):**
- **Property code is automatic** and fills the **first free NK slot** (delete NK01 → next new is NK01).
- **Only Title + Province are required**; everything else optional.
- **Province** = dropdown of 6 CR provinces (**Limón removed** by request).
- **Agent** = dropdown of the 4 agents (see below).
- **Price** has a fixed `$` prefix; **Land/Construction** have a fixed `m²` suffix.
- **Bedrooms/Bathrooms** accept decimals (2.5 = half bath).
- **Photos**: "Upload photos" (multiple → Supabase Storage) with a thumbnail manager (set main / remove); or paste URLs.
- **Features**: 4 textareas (Internal/External/Community/Lifestyle) → `features` jsonb.
- Verified end-to-end: inserts with all fields (features, geo, etc.) work.

---

## 6. Data model

`types/property.ts` — the `Property` type is the single source of truth and maps 1:1 to the DB. Key optional fields: `gallery[]`, `videoUrl`, `highlights[]`, `features{}`, `communityInfo{}`, `geo{address,lat,lng}` (for the map), `agentId`, `yearBuilt`, `hoa`, `listingType`, `rentPrice`, `exclusive`.

**Agents** (`data/team.ts`, double as the team page + listing agents):
- id `1` = **Sergio Rodríguez**
- id `2` = **Jose Mario Alvarado**
- id `3` = **Marcel Torres**
- id `4` = **Jenny Chaverri**

---

## 7. Frontend structure

### Home (`components/home/homepageclient.tsx`)
Order: **Hero → Featured carousel → Where We Work (regions) → Search → The Portfolio (grid) → Why Invest (parallax) → Brand Story → Final CTA**.
- `HeroVideo` → `scroll-expansion-hero.tsx`: cinematic scroll-to-expand video (house expands over beach bg) + the big "NAKMA" lockup at the end.
- `ListingsCarousel` (Featured) — real moving carousel, arrows on the **edges**, hover-reveal cards (`PropertyHoverCard`).
- `RegionsSection` — 3 regions: **Central Pacific, Central Valley, Pacific Coast** (link to `/listings?province=…`).
- `HomeSearch` — functional search (price slider works) → navigates to `/listings?…`.
- `ListingsGridSection` (Portfolio) — 3×4 grid of `PropertyCard`.
- `ParallaxNatureSection` (Why Invest) + `NatureIntroSection` (brand story) + `CTASection`.

### Listings (`/listings` → `ListingsExplorer`)
LX-style search bar (text search, Locations, Sale/Rent, price slider, beds, baths, exclusive, more filters) + **List / Map toggle**. Reads URL params (`?q&province&type&maxPrice&beds&baths`) via `useSearchParams` (wrapped in `Suspense`). Map = **Leaflet** (`PropertiesMap.tsx`) with a pin per property's `geo`.

### Property detail (`/listings/[slug]` → `PropertyDetailLX`)
LX-style: gallery (main photo **auto-rotates** + arrows + thumbnails + **fullscreen lightbox** on click), specs bar, Highlights, Description (show more), Features (4 columns), Community, a **connected Leaflet mini-map**, the Real Estate Agent card, and a "Properties you might like" carousel.

### Cards
- `PropertyCard` — minimalist LX card with **image carousel** (`CardImageCarousel`: dots + hover arrows).
- `PropertyHoverCard` — image shrinks on hover to reveal info + CTA (used in the Featured carousel).

### Cross-cutting
- **Navbar** (`components/layout/Navbar.tsx`): frosted, gets more translucent as you scroll; **EN/ES toggle**.
- **i18n** (`lib/i18n.tsx`): `useLang()` + `LanguageProvider` (localStorage `nakma-lang`). Translated: navbar, hero, footer, and home sections (Featured/Regions/Portfolio/Search/CTA). **Inner pages + Parallax + NatureIntro are still English-only — expand `DICT` to finish.**
- **WhatsApp** floating button, **contact form** (mailto), Reveal scroll animations, page transitions (`app/template.tsx`), reduced-motion support.

---

## 8. Deployment (Vercel)

- Project: `nakma-realty` under scope `nakmarealty-5086s-projects` (account `nakmarealty-5086`).
- Redeploy after changes:
  ```bash
  npx vercel --prod --yes --scope nakmarealty-5086s-projects
  ```
- The dir is already linked (`.vercel/`, gitignored). On a fresh clone, run `npx vercel login` then `npx vercel link` (pick the existing `nakma-realty` project) before deploying.
- `next.config.ts` whitelists image hosts (Unsplash + the Supabase storage domain) and tunnel origins.
- The 304 MB hero video can't go on Vercel/GitHub — it's gitignored and the hero uses the 3.9 MB compressed version. The bg video URL is configurable via `NEXT_PUBLIC_HERO_BG_VIDEO` (point to a CDN for full quality).

---

## 9. Known placeholders & next steps

- **Demo data**: 14 demo properties in the DB. Delete them to start the real catalog at NK01.
- **i18n**: finish translating inner pages (About/Team/Contact/Listings/Admin) + the Parallax & Brand-Story home sections (add keys to `lib/i18n.tsx`).
- **Map**: uses Leaflet/CARTO tiles. For literal Google Maps tiles, add a Google Maps API key.
- **Fonts**: Cormorant/Playfair/Plus Jakarta are high-quality stand-ins for the brand's commercial fonts (Tan Mon Cheri / Agrandir / Gordita). Swap via `next/font/local` when licensed files are available.
- **Placeholder contact info**: WhatsApp `50600000000`, email `info@nakma.cr` (footer/contact). Agents have placeholder photos/phones.
- **Property photos**: demo photos are real Unsplash luxury homes. Real listings + photos get uploaded via the admin.

---

## 10. Gotchas (learned the hard way)

- **Tailwind v4 cascade**: unlayered element rules (`h1{color}`, `a{color:inherit}`) **beat** `text-*` utilities. Put all base element styles inside `@layer base` in `globals.css`, or utilities silently fail (made headings/buttons invisible twice).
- **Google Drive / Unsplash "page" URLs are not images** — pasting `drive.google.com/file/.../view` or `unsplash.com/photos/...` as an image breaks. Upload files (→ Supabase Storage) or use the direct `images.unsplash.com/photo-...` URL.
- **lucide-react vs React 19** peer-dep conflict → `.npmrc` has `legacy-peer-deps=true` (needed for Vercel/clean installs too).
- **Supabase numeric columns** come back as strings — the mapper coerces with `Number()`.

---

## 11. Key file map

```
app/
  layout.tsx              fonts, metadata, JSON-LD, Providers
  page.tsx                → HomePageClient
  template.tsx            page transitions
  globals.css             Tailwind v4 + CSS vars + @layer base
  listings/page.tsx       Suspense → ListingsExplorer
  listings/[slug]/page.tsx → PropertyDetailLX
  admin/layout.tsx        auth gate
  admin/properties/...    list / new / [id]/edit
components/
  home/                   hero, carousels, regions, search, parallax, CTA…
  listings/               ListingsExplorer, PropertiesMap
  property/               PropertyCard, PropertyHoverCard, PropertyDetailLX, CardImageCarousel
  admin/                  PropertyForm, PropertiesTable
  layout/                 Navbar, Footer
  providers.tsx           LanguageProvider + PropertiesProvider
lib/
  supabase.ts             client (URL + anon key)
  properties-api.ts       mappers + CRUD + uploadMedia
  propertiescontext.tsx   data provider (Supabase + seed fallback)
  i18n.tsx                EN/ES
  constants.ts            blur placeholder
data/
  properties.ts           14-property seed
  team.ts                 4 agents
types/property.ts         Property type
supabase/schema.sql       DB schema reference
```
