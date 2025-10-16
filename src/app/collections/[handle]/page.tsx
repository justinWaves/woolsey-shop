import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCollection } from '@/lib/shopify';
import { ProductCard } from '@/components/product-card';

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: collection.seo.title || `${collection.title} | Woolsey Creations`,
    description: collection.seo.description || collection.description,
    openGraph: {
      title: collection.title,
      description: collection.description,
      images: collection.image ? [{ url: collection.image.url }] : [],
      type: 'website',
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) {
    notFound();
  }

  const products = collection.products.edges.map((edge) => edge.node);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/artists" className="hover:text-foreground transition-colors">
          Artists
        </Link>
        <span>/</span>
        <span className="text-foreground">{collection.title}</span>
      </nav>

      {/* Collection header */}
      <div className="mb-12 space-y-6">
        {collection.image && (
          <div className="relative h-48 w-48 mx-auto md:mx-0 overflow-hidden rounded-lg">
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {collection.title}
          </h1>
          {collection.description && (
            <div
              className="mt-4 max-w-3xl text-lg text-muted"
              dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
            />
          )}
        </div>
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted">No products available in this collection yet.</p>
        </div>
      )}
    </div>
  );
}

