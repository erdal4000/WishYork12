import { WishContainer } from '@/components/wish-container';
import { initialWishes } from '@/lib/data';

export default function WishlistPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <WishContainer initialWishes={initialWishes} />
      </main>
    </div>
  );
}
