import Link from 'next/link';
import { getProducts, getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const revalidate = 3600;

export default async function HomePage() {
  const { products } = await getProducts(8);
  const collections = await getCollections(6);

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Artist-Made Apparel & Merchandise
            </h1>
            <p className="text-lg font-medium text-gray-700 md:text-xl">
              Festival-style clothing and artisan apparel by independent artists and musicians.
              <span className="block mt-2 text-accent font-semibold">Streetwear that your mom would wear.</span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/shop">
                <Button size="lg">Shop All</Button>
              </Link>
              <Link href="/artists">
                <Button size="lg" variant="outline">
                  Meet Our Artists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-600 font-medium">Discover our latest drops</p>
            </div>
            <Link
              href="/shop"
              className="hidden text-sm font-medium text-accent hover:underline md:block"
            >
              View all →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted">Products coming soon...</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists/Collections */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Featured Artists
            </h2>
            <p className="mt-2 text-gray-600 font-medium">
              Independent creators bringing you unique designs
            </p>
          </div>

          {collections.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 6).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
                    {collection.image ? (
                      <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        className="object-cover object-center transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted">Artists coming soon...</p>
            </div>
          )}

          {collections.length > 6 && (
            <div className="mt-12 text-center">
              <Link href="/artists">
                <Button variant="outline">View All Artists</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
