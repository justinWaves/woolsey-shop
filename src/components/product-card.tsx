import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type ShopifyProduct } from '@/lib/shopify';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images.edges.map((edge) => edge.node);
  const image = images[0];
  
  // Debug logging
  console.log('ProductCard:', {
    title: product.title,
    hasImages: images.length > 0,
    firstImageUrl: image?.url,
    imageCount: images.length,
  });
  
  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  const compareAtPrice =
    product.compareAtPriceRange.minVariantPrice.amount !== '0.0'
      ? formatPrice(
          product.compareAtPriceRange.minVariantPrice.amount,
          product.compareAtPriceRange.minVariantPrice.currencyCode
        )
      : null;

  const collections = product.collections.edges.map((edge) => edge.node);

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block space-y-3 transform transition-transform hover:scale-105"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface shadow-md group-hover:shadow-xl transition-shadow">
        {image && image.url ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover object-center transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-sm text-muted">No image</span>
          </div>
        )}
        
        {!product.availableForSale && (
          <div className="absolute top-2 right-2">
            <Badge variant="danger">Sold Out</Badge>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        
        {collections.length > 0 && (
          <p className="text-sm font-medium text-muted group-hover:text-accent/70 transition-colors">
            {collections[0].title}
          </p>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{price}</span>
          {compareAtPrice && (
            <span className="text-sm text-muted line-through">{compareAtPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

