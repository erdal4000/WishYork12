'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, Users, Lock, MoreHorizontal, Heart, MessageCircle, Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Wishlist } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface WishlistCardProps {
  wishlist: Wishlist;
}

const privacyIcons = {
  public: <Globe className="h-3.5 w-3.5" />,
  friends: <Users className="h-3.5 w-3.5" />,
  private: <Lock className="h-3.5 w-3.5" />,
};

const privacyText = {
    public: "Public",
    friends: "Friends Only",
    private: "Private"
}

export function WishlistCard({ wishlist }: WishlistCardProps) {

  // Placeholder values
  const itemsCount = 0;
  const fulfilledCount = 0;
  const progress = itemsCount > 0 ? (fulfilledCount / itemsCount) * 100 : 0;

  let formattedDate: string | null = null;
  if (wishlist.createdAt instanceof Date) {
    formattedDate = `Created ${formatDistanceToNow(wishlist.createdAt, { addSuffix: true })}`;
  }

  return (
    <Card>
  <Link href={`/dashboard/wishlists/${wishlist.id}`} className="block rounded-t-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[16/9] w-full bg-muted rounded-t-lg">
            {wishlist.coverImageUrl && (
              <Image
                  src={wishlist.coverImageUrl}
                  alt={wishlist.name}
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint="wishlist theme"
              />
            )}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm" onClick={(e) => e.preventDefault()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{wishlist.name}</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
             <Badge variant="outline" className="capitalize">{wishlist.category}</Badge>
             <Badge variant="secondary" className="gap-2">
                {privacyIcons[wishlist.privacy]}
                {privacyText[wishlist.privacy]}
            </Badge>
        </div>
        <div className="space-y-1 text-sm">
             <div className="flex justify-between">
                <span className="text-muted-foreground">{itemsCount} items</span>
                <span className="text-muted-foreground">{fulfilledCount} fulfilled</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
       <CardFooter className="px-4 py-2 flex justify-between border-t">
        <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-red-500">
                <Heart className="h-5 w-5" />
                <span>0</span>
            </Button>
             <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span>0</span>
            </Button>
             <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                <Share2 className="h-5 w-5" />
            </Button>
        </div>
        {wishlist.createdAt instanceof Date ? (
          <p className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(wishlist.createdAt, { addSuffix: true })}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
