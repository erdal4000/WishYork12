import Link from 'next/link';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../icons';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} WishYork. All rights reserved.
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter" prefetch={false}>
            <TwitterIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="Facebook" prefetch={false}>
            <FacebookIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="Instagram" prefetch={false}>
            <InstagramIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
