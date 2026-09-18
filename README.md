# ChoppersRC — Public frontend

Public storefront for ChoppersRC (RC helicopters, kits, spare parts).
Built with Next.js (App Router) + TypeScript + Tailwind CSS.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **i18n**: next-intl — Spanish (default, no URL prefix), English (`/en`),
  Portuguese (`/pt`)
- **Animation**: Motion (`motion/react`)
- **Auth**: httpOnly-cookie sessions (access + refresh tokens), proxied
  through the frontend's own route handlers so the browser never sees a
  token directly

## What it does

- **Catalog**: product listing with filters (category, brand, stock) and
  sorting, product detail pages, blog listing and post detail — all
  server-rendered against the real API.
- **Cart**: guest cart in `localStorage` for anonymous visitors, merged into
  the account's real cart on login/register; a session is only required at
  checkout, not to browse or add items.
- **Checkout**: delivery address selection, payment method (bank transfer or
  cash), coupon codes, order placement.
- **Account area**: profile, password change, addresses, order history and
  detail, stock alerts, returns.
- **Marketing pages**: home, about, FAQ, contact (with WhatsApp CTA), terms
  and privacy.
- **Site settings** (contact info, social links, shipping/payment copy) are
  admin-editable in the backend and fetched at render time.

## Structure

```
frontend-publico/
├── docs/                        # notes on the backend API contract
├── messages/                    # es.json / en.json / pt.json — all user-facing copy
├── public/images/               # static brand assets
└── src/
    ├── proxy.ts                 # Next's proxy hook: locale routing + session refresh/guard
    ├── i18n/                    # next-intl routing + request config
    ├── app/
    │   ├── [locale]/            # every page, under the locale segment
    │   │   ├── (marketing)/     # about, contact, faq, terms, privacy
    │   │   ├── (auth)/          # login, register, password recovery
    │   │   ├── account/         # profile, orders, addresses, returns, stock alerts
    │   │   ├── products/, blog/, cart/, checkout/
    │   │   ├── not-found.tsx    # custom 404
    │   │   └── [...rest]/       # catch-all that triggers the 404 above
    │   └── api/
    │       ├── auth/            # login/register/logout/refresh — set the httpOnly cookies
    │       └── backend/[...path]/  # generic authenticated proxy to the backend
    ├── components/              # one folder per feature area (product, cart, checkout, account, ...)
    ├── lib/                     # api client, auth, cart, catalog, settings, utils
    ├── types/                   # types mirroring the backend's API contracts
    └── config/                  # site name/nav — everything else comes from the API
```

## Conventions

- **Code in English** (files, identifiers, docs); **user-facing copy in
  Spanish by default**, translated via next-intl for `/en` and `/pt`.
- No inline code comments — code is expected to read clearly on its own;
  non-obvious context lives in `docs/` instead.
- A handful of `lib/mock/*` files remain for content that intentionally
  isn't going through the API yet (e.g. FAQ items, legal page copy still
  pending real/reviewed text) — each one says why in its own file.
