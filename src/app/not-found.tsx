import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background text-center">
      <h1 className="text-8xl font-bold text-accent font-headline">404</h1>
      <h2 className="text-3xl font-semibold tracking-tight">Wish Not Found</h2>
      <p className="max-w-sm text-muted-foreground">
        It seems the wish you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to My Wishlist</Link>
      </Button>
    </div>
  );
}
