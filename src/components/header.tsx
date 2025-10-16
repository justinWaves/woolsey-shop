import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/woolsey-logo-main.png"
              alt="Woolsey Creations"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/shop" 
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/artists" 
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Artists
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart will go here later */}
        </div>
      </div>
    </header>
  );
}

