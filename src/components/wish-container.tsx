'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WishList } from '@/components/wish-list';
import { CreateWishForm } from '@/components/create-wish-form';
import type { Wish } from '@/lib/types';

interface WishContainerProps {
  initialWishes: Wish[];
}

export function WishContainer({ initialWishes }: WishContainerProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [isCreateOpen, setCreateOpen] = useState(false);

  const handleWishCreated = (newWish: Wish) => {
    setWishes((prevWishes) => [newWish, ...prevWishes]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Wishlist</h1>
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Add Wish</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Make a new wish</DialogTitle>
              <DialogDescription>
                What are you dreaming of? Add it to your list.
              </DialogDescription>
            </DialogHeader>
            <CreateWishForm onWishCreated={handleWishCreated} setOpen={setCreateOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <WishList wishes={wishes} />
    </div>
  );
}
