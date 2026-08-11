# Vanity Audit

A makeup stash tracker that tells you what to actually throw away.

Beauty apps are good at telling you what to buy next. This one is built for the opposite problem: you already own too much, half of it is expired, and you keep reaching for the same five things. Vanity Audit catalogs what you own, tracks what you actually use, and flags what's dead weight.

## What it does

- **Audit summary** — dead money in expired product, value at risk, money spent on things never once used, and total stash value. Each tile drills into the matching list.
- **Cost per use** — the $68 bronzer you've reached for four times is a $17-per-use bronzer
- **Overstock check** — "you own 3 blushes," surfaced before the next haul
- **Catalog your stash** — product, brand, category, price, photo
- **Expiry tracking** — enter the opened date and PAO shelf life, get an expiry status
- **Usage tracking** — one tap to log a use, so "what do I actually reach for" stops being a guess
- **Declutter statuses** — every product lands in one of five buckets, each filterable:

  | Status | Meaning |
  | --- | --- |
  | Expired | Past its shelf life after opening |
  | Expiring soon | Within 30 days of expiry |
  | Unused 90+ days | Still good, but you don't reach for it |
  | Unopened | Bought, never opened |
  | In rotation | Actively used and not expired |

## Stack

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS · Prisma 7 + SQLite

Runs entirely on your machine. No accounts, no cloud, no data leaving your laptop.

## Running it

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Then open http://localhost:3000.

## Notes

- Photos are stored in `public/uploads/` and the database in `dev.db` — both are gitignored, since they're personal data.
- Date-only fields (purchase, opened) are stored at UTC midnight and formatted in UTC, so the displayed day doesn't shift by timezone.

## Roadmap

- AI photo recognition to auto-fill brand and product from a snapshot
- Usage history over time, not just a last-used date
- "What should I buy next" that accounts for what's already in the drawer
