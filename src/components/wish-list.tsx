import type { Wish } from '@/lib/types';
import { WishCard } from './wish-card';

interface WishListProps {
  wishes: Wish[];
}

export function WishList({ wishes }: WishListProps) {
  if (wishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
        <h3 className="text-xl font-bold tracking-tight">You have no wishes yet</h3>
        <p className="text-sm text-muted-foreground">Start by creating your first wish!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wishes.map((wish) => (
        <WishCard key={wish.id} wish={wish} />
      ))}
    </div>
  );
}
