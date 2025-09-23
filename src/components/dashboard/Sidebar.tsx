'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Bookmark, Wand2, User, Settings, PlusCircle } from 'lucide-react';
import { WishForgeLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/wishlists', icon: List, label: 'My Wishlists' },
  { href: '/dashboard/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/dashboard/inspiration', icon: Wand2, label: 'Inspiration Box' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r bg-background flex flex-col">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <WishForgeLogo className="h-6 w-6 text-primary" />
          <span className="">WishYork</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              pathname === item.href && 'bg-muted text-primary'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Button size="sm" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Wishlist
        </Button>
      </div>
    </aside>
  );
}
