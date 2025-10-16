# Woolsey Creations

A headless Shopify storefront for artist-made apparel and merchandise, built with Next.js 15, Tailwind CSS v4, and the Shopify Storefront API.

## Features

- 🎨 **Clean, minimalist design** optimized for sharing product pages on social media
- ⚡ **Lightning-fast** with Next.js App Router, ISR, and Turbopack
- 🛒 **Direct-to-checkout** flow powered by Shopify
- 🖼️ **Artist-focused** collections (artists mapped as Shopify collections)
- 📱 **Fully responsive** with mobile-first approach
- 🔍 **SEO-optimized** with Open Graph tags and product schema
- 🎯 **Webhook-driven revalidation** for real-time updates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Commerce**: Shopify Storefront API
- **Deployment**: Vercel
- **Fonts**: Inter (body), Space Grotesk (display)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Shopify store with custom app created
- Shopify Storefront API access token

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create `.env.local` file with your Shopify credentials:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2024-07

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: for webhook revalidation
REVALIDATE_SECRET=your_random_secret_string
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## Project Structure

```
src/
├── app/
│   ├── api/revalidate/       # Webhook handler for cache revalidation
│   ├── artists/              # Artists (collections) listing page
│   ├── collections/[handle]/ # Individual artist/collection pages
│   ├── product/[handle]/     # Product detail pages
│   ├── shop/                 # All products page
│   ├── layout.tsx            # Root layout with header/footer
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components (Button, Badge)
│   ├── header.tsx            # Site header
│   ├── footer.tsx            # Site footer
│   ├── product-card.tsx      # Product card component
│   ├── product-gallery.tsx   # Product image gallery
│   └── variant-selector.tsx  # Product variant selector
└── lib/
    └── shopify/              # Shopify API client and types
        ├── index.ts          # Main API functions
        ├── client.ts         # Fetch client and utilities
        ├── queries.ts        # GraphQL queries
        └── types.ts          # TypeScript types
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables in Project Settings → Environment Variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_API_VERSION`
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
   - `REVALIDATE_SECRET` (optional, for webhooks)
3. Deploy!

### 3. Set Up Webhooks (Optional)

To automatically revalidate cached pages when products/collections change:

1. In Shopify Admin → Apps → Your custom app → Webhooks
2. Add webhooks for:
   - `products/create` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `products/update` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `products/delete` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/create` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/update` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/delete` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`

## Shopify Setup

### Collections as Artists

Each artist should have their own collection in Shopify:

1. Create a collection (e.g., "Artist: Bailey")
2. Add a description (artist bio)
3. Upload a collection image (artist photo/artwork)
4. Assign products to the collection

### Product Configuration

For apparel products:

1. Add multiple product images
2. Create variants for Size (S, M, L, XL, etc.)
3. Optional: add Color variants
4. Set proper inventory tracking
5. Add descriptive tags
6. Ensure products are published to your custom app's sales channel

## Customization

### Design Tokens

Edit design tokens in `src/app/globals.css`:

```css
:root {
  --background: #FFFFFF;
  --foreground: #0A0A0A;
  --accent: #5E8BF7;  /* Change brand color here */
  /* ... */
}
```

### Revalidation Time

Adjust ISR revalidation in page files:

```typescript
export const revalidate = 3600; // 1 hour (in seconds)
```

## Performance

- **ISR (Incremental Static Regeneration)**: Pages cached for 1 hour by default
- **Image Optimization**: Next.js Image component with Shopify CDN
- **Edge-ready**: Can be deployed to Vercel Edge
- **Webhook revalidation**: Real-time updates without waiting for cache expiry

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
