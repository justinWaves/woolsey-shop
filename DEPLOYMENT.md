# Deployment Checklist for Woolsey Creations

## Pre-Deployment

### 1. Environment Variables (`.env.local`)

Make sure your `.env.local` file has all required variables:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2024-07

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
REVALIDATE_SECRET=random_long_secret_string
```

### 2. Test Locally

```bash
# Run the dev server
npm run dev

# Test these pages:
# - Home page: http://localhost:3000
# - Shop: http://localhost:3000/shop
# - Artists: http://localhost:3000/artists
# - A product page (if you have products)
# - A collection page (if you have collections)

# Test the build
npm run build
npm start
```

### 3. Verify Shopify Setup

- [ ] Custom app created with Storefront API enabled
- [ ] Storefront API permissions: read products, variants, collections
- [ ] At least one product created and active
- [ ] Products published to your custom app's sales channel
- [ ] At least one collection created (for artist)
- [ ] Shopify Payments (or another gateway) configured
- [ ] Shipping rates configured

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Production, Preview |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Your token | Production, Preview |
| `SHOPIFY_API_VERSION` | `2024-07` | Production, Preview |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://[branch]--your-domain.vercel.app` | Preview |
| `REVALIDATE_SECRET` | Generate a random string | Production, Preview |

**Generate random secret:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

### Step 5: Test Production

- [ ] Home page loads
- [ ] Product pages load with correct images and prices
- [ ] Variant selection works
- [ ] "Buy Now" redirects to Shopify checkout
- [ ] Open Graph images work (test with Facebook/Twitter debugger)
- [ ] Mobile responsiveness

## Post-Deployment

### Set Up Custom Domain (Optional)

1. Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### Configure Webhooks for Auto-Revalidation

1. In Shopify Admin → Apps → Your custom app → Webhooks
2. Add these webhooks:

| Event | URL |
|-------|-----|
| `products/create` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| `products/update` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| `products/delete` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| `collections/create` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| `collections/update` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| `collections/delete` | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |

Replace `YOUR_SECRET` with your `REVALIDATE_SECRET` value.

3. Format: JSON
4. API version: 2024-07

### Test Webhooks

1. Update a product in Shopify
2. Check Vercel deployment logs for webhook receipt
3. Verify product page updates

## Monitoring

### Vercel Analytics (Optional)

1. Vercel Project Settings → Analytics
2. Enable Web Analytics
3. Monitor page views, performance

### Error Tracking

Check Vercel Functions logs for:
- Failed Shopify API calls
- Webhook errors
- Build errors

## Troubleshooting

### Products not showing?

- Verify products are published to your custom app's sales channel
- Check Storefront API permissions
- Test GraphQL queries in Shopify GraphiQL explorer

### Checkout not working?

- Ensure `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is set
- Verify Shopify Payments is configured
- Check shipping rates are configured

### Images not loading?

- Verify `cdn.shopify.com` is in `next.config.ts` `remotePatterns`
- Check product images exist in Shopify

### Webhook revalidation not working?

- Verify `REVALIDATE_SECRET` matches webhook URL
- Check Vercel function logs
- Test webhook manually with curl:

```bash
curl -X POST https://your-domain.com/api/revalidate?secret=YOUR_SECRET \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Topic: products/update" \
  -d '{"handle":"test-product"}'
```

## Performance Tips

1. **Image Optimization**: Already configured with Next.js Image
2. **Caching**: ISR set to 1 hour (3600s) - adjust as needed
3. **Bundle Size**: Monitor with `npm run build`
4. **Edge Functions**: Consider upgrading Vercel plan for edge runtime

## Security

- [ ] Never commit `.env.local` to git
- [ ] Rotate secrets periodically
- [ ] Keep Shopify API access tokens secure
- [ ] Use webhook signature validation (already implemented)

## Next Steps

1. Add more products and collections
2. Customize design tokens in `globals.css`
3. Add product filtering/sorting
4. Implement search functionality
5. Add cart functionality (instead of direct checkout)
6. Set up analytics/conversion tracking
7. Optimize SEO metadata per product
8. Add customer reviews/testimonials

---

**Need Help?** Check the README.md or create an issue on GitHub.

