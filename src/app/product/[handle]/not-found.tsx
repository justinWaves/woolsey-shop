import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <p className="text-muted mb-8">
        Sorry, we couldn&apos;t find the product you&apos;re looking for.
      </p>
      <Link href="/shop">
        <Button>Browse All Products</Button>
      </Link>
    </div>
  );
}

