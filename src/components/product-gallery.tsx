'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square w-full bg-surface rounded-lg flex items-center justify-center">
        <span className="text-muted text-sm">No image available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || title}
          fill
          className="object-cover object-center"
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-surface transition-opacity ${
                index === selectedIndex
                  ? 'ring-2 ring-accent opacity-100'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} - Image ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 25vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

