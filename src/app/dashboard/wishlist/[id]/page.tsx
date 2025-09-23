'use client';
export const dynamic = 'force-dynamic';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Tip tanımlamaları
interface Wishlist {
  id: string;
  name?: string;
  ownerId?: string;
  // Diğer alanlar eklenebilir
}

export default function WishlistDetailPage() {
  const params = useParams();
  const wishlistId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
    }

    if (!wishlistId) {
      setLoading(false);
      setError("Wishlist ID not found.");
      return;
    }

    const fetchWishlist = async () => {
      try {
        const docRef = doc(db, 'wishlists', wishlistId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWishlist({ id: docSnap.id, ...docSnap.data() } as Wishlist);
        } else {
          setError('Wishlist not found.');
        }
      } catch (err) {
        setError('Failed to load wishlist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlistId, user, authLoading]);

  if (loading || authLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Link href="/dashboard/wishlists" className="text-sm hover:underline mb-4 block">
        &larr; Back to Wishlists
      </Link>
      <div className="bg-card p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{wishlist?.name || 'Wishlist Details'}</h1>
        <p className="text-muted-foreground">Wishlist ID: {wishlist?.id}</p>
      </div>
    </div>
  );
}
