'use client';
export const dynamic = 'force-dynamic';

import { PlusCircle, ListPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import useUserWishlists from '@/hooks/use-user-wishlists';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { Button } from '@/components/ui/button';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function WishlistsPage() {
  const { user } = useAuth();
  const { wishlists, loading, error, addWishlist } = useUserWishlists(user?.uid);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlists</h1>
        <CreateWishlistModal onWishlistCreated={addWishlist}>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Wishlist
            </Button>
        </CreateWishlistModal>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
        </div>
      )}

      {error && (
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && wishlists.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96">
          <ListPlus className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold tracking-tight">You haven't created any wishlists yet.</h3>
          <p className="text-sm text-muted-foreground">Click the button above to start!</p>
        </div>
      )}
        
      {!loading && !error && wishlists.length > 0 && (
        <div className="space-y-6">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      )}
    </div>
  );
}
