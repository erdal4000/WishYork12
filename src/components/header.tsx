import Link from 'next/link';
import { WishForgeLogo } from '@/components/icons';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <WishForgeLogo className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">WishYork</span>
        </Link>
        <div className='flex items-center gap-2'>
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
