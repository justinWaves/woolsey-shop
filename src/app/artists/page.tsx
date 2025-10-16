import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Artists | Woolsey Creations',
  description: 'Discover independent artists and their unique apparel collections.',
};

export const revalidate = 3600;

export default async function ArtistsPage() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Our Artists
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Meet the independent artists and musicians behind our unique apparel.
        </p>
      </div>

      {/* Artists grid */}
      {collections.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
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
                <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted">No artists available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

