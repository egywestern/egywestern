# Western Store

Next.js storefront and admin dashboard backed by MongoDB Atlas through Mongoose.

## Requirements

- Node.js 22.13 or newer
- A MongoDB Atlas cluster

## Setup

1. In Atlas, create a database user and allow your deployment IP in Network Access.
2. Copy `.env.example` to `.env.local`.
3. Set `MONGODB_URI` to the Atlas connection string. Keep `/localbrand` before the query string to select the database.
4. Configure the admin and Paymob environment variables shown in `.env.example`.
5. Install and start the app:

```bash
npm install
npm run dev
```

Mongoose creates collections and indexes from the schemas in `db/schema.ts` when data is first written. Numeric public IDs are generated with an atomic counters collection so existing storefront IDs and Paymob merchant references remain compatible.

## Commands

- `npm run dev` — run locally
- `npm run build` — create and type-check the production build
- `npm test` — build and run rendered HTML tests
- `npm run lint` — run ESLint

## Production checklist

- Replace every placeholder from `.env.example` in the hosting provider's environment settings.
- Allow the hosting provider's outbound traffic in MongoDB Atlas Network Access.
- Use an Atlas replica set (the default for Atlas) because checkout uses transactions.
- Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS URL.
- Product and site images are stored in MongoDB Atlas GridFS.
- Configure all Paymob values and point the Paymob callback to `/api/payments/paymob/callback`.
- Run `npm test` before each release.
