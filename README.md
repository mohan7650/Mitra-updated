# 🐾 Mitra — A world for pets

A Next.js (App Router) + React + TypeScript UI built from the Mitra design screens.
Styled with Tailwind CSS, icons by `lucide-react`, fonts **Fredoka** (display/logo) and
**Nunito** (body) via `next/font`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Screens / routes

| Route                      | Screen                                             |
| -------------------------- | -------------------------------------------------- |
| `/`                        | Welcome / Create Account                           |
| `/onboarding/pet-type`     | Step 1 — "Let's add your pet" (pet type selection) |
| `/onboarding/pet-details`  | Step 2 — "Tell us about your dog" (details form)   |
| `/home`                    | Home feed                                          |
| `/community`               | Community — pets near you, requests, meetups       |
| `/shop`                    | Mitra Shop — categories, top picks                 |
| `/profile`                 | Rocky's profile — Pet ID, health, parent           |
| `/care`                    | Mitra Care — services hub (opens from the paw FAB) |

**Onboarding flow:** Welcome → Create Account → pet-type → pet-details → Home.
(Sign In / Skip jump straight to Home for the demo.)

**Bottom nav** (shared, route-aware): Home · Community · 🐾 · Shop · Profile.
The centre paw FAB opens **Mitra Care**, which isn't a bottom-nav tab.

## Where things live

```
app/
  page.tsx                     Welcome screen
  onboarding/pet-type/         Step 1
  onboarding/pet-details/      Step 2
  home/                        Home feed
  community/                   Community
  shop/                        Mitra Shop
  profile/                     Pet profile
  care/                        Mitra Care hub
components/
  Logo.tsx                     Reusable "mitra" wordmark (forest | dark | coral variants)
  Qr.tsx                       Decorative Pet-ID QR placeholder
  welcome/FeatureStrip.tsx
  onboarding/ProgressBar.tsx, PetTypeCard.tsx
  home/StoryRail.tsx, PostCard.tsx, BottomNav.tsx  (BottomNav is shared app-wide)
lib/data.ts                    All mock content (feed, shop, care, community, profile)
tailwind.config.ts             Brand tokens (forest / coral / amber / cream / bark)
```

## Notes

- Pet photos are represented with emoji + gradient placeholders so the project runs
  offline with no external image dependencies. Swap them for real `<Image>` assets
  by dropping files in `public/` and updating `lib/data.ts`.
- The logo's animal-letter treatment from the welcome art is rendered as a styled
  wordmark (the photographic version was a static asset in the mockups).
