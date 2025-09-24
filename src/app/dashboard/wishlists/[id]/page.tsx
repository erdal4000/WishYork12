'use client';
export const dynamic = 'force-dynamic';

import { useAuth } from '../../../../context/AuthContext';
import { db } from '../../../../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AddItemModal } from '@/components/items/AddItemModal';
import { ItemCard } from '@/components/items/ItemCard';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Card'ın alt bileşenlerini de import edelim
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

// Tip tanımlamaları
interface Wishlist {
  id: string;
  title?: string;
  description?: string;
  ownerId?: string;
  coverImageUrl?: string;
  category?: string;
  privacy?: string;
}

interface UserProfile {
    username?: string;
    avatarUrl?: string;
}

interface Item {
  id: string;
  name: string;
  url?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export default function WishlistDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const wishlistId = params?.id;
  
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!wishlistId) {
      setError("Wishlist ID not found in URL.");
      setLoading(false);
      return;
    }

    const fetchWishlistData = async () => {
      setLoading(true);
      try {
        const wishlistRef = doc(db, 'wishlists', wishlistId as string);
        const wishlistSnap = await getDoc(wishlistRef);

        if (wishlistSnap.exists()) {
          const wishlistData = { id: wishlistSnap.id, ...wishlistSnap.data() } as Wishlist;
          setWishlist(wishlistData);

          if (wishlistData.ownerId) {
            const ownerRef = doc(db, 'users', wishlistData.ownerId);
            const ownerSnap = await getDoc(ownerRef);
            if (ownerSnap.exists()) {
              setOwner(ownerSnap.data() as UserProfile);
            }
          }
        } else {
          setError('Wishlist not found.');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();

    // Items dinleyicisi
    const q = query(collection(db, 'items'), where('wishlistId', '==', wishlistId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData: Item[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(itemsData);
    });
    return () => unsubscribe();
  }, [wishlistId]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!wishlist) return <div className="text-center p-8">No wishlist data available.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/wishlists" className="text-sm hover:underline">
          &larr; Back to My Wishlists
        </Link>
        <Button variant="outline">Actions</Button>
      </div>

      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
        {wishlist.coverImageUrl && (
            <Image src={wishlist.coverImageUrl} alt={wishlist.title || 'Wishlist cover'} layout="fill" objectFit="cover" sizes="100vw" />
        )}
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={wishlist.coverImageUrl} />
                    <AvatarFallback>{wishlist.title?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold">{wishlist.title}</h1>
                    <div className="mt-1 flex items-center gap-2">
                        {wishlist.category && <Badge variant="secondary">{wishlist.category}</Badge>}
                        {wishlist.privacy && <Badge variant="outline">{wishlist.privacy}</Badge>}
                    </div>
                    {owner?.username && <p className="mt-1 text-sm text-muted-foreground">by {owner.username}</p>}
                </div>
            </div>
            <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                    <span>0 of 4 Units fulfilled</span>
                    <span>0%</span>
                </div>
                <Progress value={0} />
            </div>
        </CardContent>
        <CardFooter className="flex items-center justify-start gap-4 border-t pt-4">
            <span className="text-sm text-muted-foreground">Like, Comment, Share icons...</span>
        </CardFooter>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Items ({items.length})</h2>
            <AddItemModal wishlistId={wishlistId as string}>
              <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">+ Add Item</Button>
            </AddItemModal>
        </div>
        {items.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
              <p>No items yet!</p>
              <p className="text-sm">Click 'Add Item' to start building your wishlist.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Replies (0)</h2>
        <div className="flex items-start gap-4">
            <Avatar>
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <Textarea placeholder="Post your reply..." />
                <div className="mt-2 flex justify-end">
                    <Button>Reply</Button>
                </div>
            </div>
        </div>
        <div className="border-t pt-4 text-center text-muted-foreground">
            <p>No comments yet. Be the first to reply!</p>
        </div>
      </div>
    </div>
  );
}