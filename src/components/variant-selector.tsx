'use client';

import type { ShopifyProductVariant } from '@/lib/shopify';

interface VariantSelectorProps {
  variants: ShopifyProductVariant[];
  selectedVariant: ShopifyProductVariant;
  onVariantChange: (variant: ShopifyProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  // Group variants by option name (e.g., Size, Color)
  const options = variants[0]?.selectedOptions || [];
  
  // Create a map of option combinations
  const optionNames = options.map((opt) => opt.name);
  
  if (variants.length === 1) {
    return null; // No need to show selector for single variant
  }

  return (
    <div className="space-y-6">
      {optionNames.map((optionName) => {
        // Get unique values for this option
        const uniqueValues = Array.from(
          new Set(
            variants.map(
              (v) =>
                v.selectedOptions.find((opt) => opt.name === optionName)?.value || ''
            )
          )
        );

        return (
          <div key={optionName} className="space-y-3">
            <label className="text-sm font-medium">
              {optionName}
              <span className="ml-2 text-muted">
                {selectedVariant.selectedOptions.find((opt) => opt.name === optionName)?.value}
              </span>
            </label>
            
            <div className="flex flex-wrap gap-2">
              {uniqueValues.map((value) => {
                // Find variant that matches current selections except this option
                const matchingVariant = variants.find((v) => {
                  const otherOptions = v.selectedOptions.filter(
                    (opt) => opt.name !== optionName
                  );
                  const selectedOtherOptions = selectedVariant.selectedOptions.filter(
                    (opt) => opt.name !== optionName
                  );
                  
                  const otherOptionsMatch = otherOptions.every((opt, index) =>
                    opt.value === selectedOtherOptions[index]?.value
                  );
                  
                  const thisOptionMatches =
                    v.selectedOptions.find((opt) => opt.name === optionName)?.value === value;
                  
                  return otherOptionsMatch && thisOptionMatches;
                });

                const isSelected =
                  selectedVariant.selectedOptions.find((opt) => opt.name === optionName)
                    ?.value === value;
                
                const isAvailable = matchingVariant?.availableForSale ?? true;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      if (matchingVariant && isAvailable) {
                        onVariantChange(matchingVariant);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                      ${isSelected
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-background hover:bg-surface'
                      }
                      ${!isAvailable
                        ? 'opacity-50 cursor-not-allowed line-through'
                        : 'cursor-pointer'
                      }
                    `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

