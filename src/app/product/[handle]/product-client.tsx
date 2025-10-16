'use client';

import { useState } from 'react';
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify';
import { formatPrice } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VariantSelector } from '@/components/variant-selector';

interface ProductClientProps {
  product: ShopifyProduct;
  variants: ShopifyProductVariant[];
}

export function ProductClient({ variants }: ProductClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [isLoading, setIsLoading] = useState(false);

  const price = formatPrice(
    selectedVariant.price.amount,
    selectedVariant.price.currencyCode
  );

  const compareAtPrice = selectedVariant.compareAtPrice
    ? formatPrice(
        selectedVariant.compareAtPrice.amount,
        selectedVariant.compareAtPrice.currencyCode
      )
    : null;

  const handleBuyNow = () => {
    setIsLoading(true);
    // Extract variant ID from the full Shopify GID
    const variantId = selectedVariant.id.split('/').pop();
    // Direct checkout URL for single variant - redirects to Shopify checkout
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    if (domain) {
      window.location.href = `https://${domain}/cart/${variantId}:1`;
    }
  };

  const isAvailable = selectedVariant.availableForSale;
  const isLowStock =
    selectedVariant.quantityAvailable !== null &&
    selectedVariant.quantityAvailable > 0 &&
    selectedVariant.quantityAvailable <= 5;

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{price}</span>
        {compareAtPrice && (
          <span className="text-lg text-muted line-through">{compareAtPrice}</span>
        )}
      </div>

      {/* Availability badges */}
      <div className="flex flex-wrap gap-2">
        {!isAvailable && <Badge variant="danger">Sold Out</Badge>}
        {isLowStock && isAvailable && (
          <Badge variant="warning">Only {selectedVariant.quantityAvailable} left</Badge>
        )}
        {isAvailable && !isLowStock && <Badge variant="success">In Stock</Badge>}
      </div>

      {/* Variant selector */}
      <VariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
      />

      {/* Buy button */}
      <div className="space-y-3">
        <Button
          onClick={handleBuyNow}
          disabled={!isAvailable || isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? 'Redirecting...' : isAvailable ? 'Buy Now' : 'Sold Out'}
        </Button>
        <p className="text-xs text-center text-muted">
          Secure checkout powered by Shopify
        </p>
      </div>
    </div>
  );
}

