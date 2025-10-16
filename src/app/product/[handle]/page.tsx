import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduct, formatPrice } from '@/lib/shopify';
import { ProductGallery } from '@/components/product-gallery';
import { ProductClient } from './product-client';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const images = product.images.edges.map((edge) => edge.node);

  return {
    title: product.seo.title || `${product.title} | Woolsey Creations`,
    description: product.seo.description || product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: images.length > 0 ? [{ url: images[0].url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: images.length > 0 ? [images[0].url] : [],
    },
    other: {
      'product:price:amount': product.priceRange.minVariantPrice.amount,
      'product:price:currency': product.priceRange.minVariantPrice.currencyCode,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);
  const collections = product.collections.edges.map((edge) => edge.node);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        {collections.length > 0 && (
          <>
            <Link
              href={`/collections/${collections[0].handle}`}
              className="hover:text-foreground transition-colors"
            >
              {collections[0].title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Product content */}
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={images} title={product.title} />
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.title}
            </h1>
            {collections.length > 0 && (
              <Link
                href={`/collections/${collections[0].handle}`}
                className="mt-2 inline-block text-sm text-muted hover:text-foreground transition-colors"
              >
                by {collections[0].title}
              </Link>
            )}
          </div>

          <ProductClient product={product} variants={variants} />

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                className="text-muted"
              />
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

