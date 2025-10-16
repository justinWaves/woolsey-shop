import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product-card';

export const metadata: Metadata = {
  title: 'Shop | Woolsey Creations',
  description: 'Browse our collection of artist-made apparel and merchandise.',
};

export const revalidate = 3600;

export default async function ShopPage() {
  const { products } = await getProducts(50);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Shop All
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Discover unique apparel and merchandise from independent artists.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted">No products available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

