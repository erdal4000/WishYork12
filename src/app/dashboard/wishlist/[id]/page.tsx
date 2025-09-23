'use client';
export const dynamic = 'force-dynamic';

import { AuthContext } from '@/context/AuthContext';
import { db } from '../../../../lib/firebase/config'; // Düzeltilmiş yol
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Tip tanımlamaları
interface Wishlist {
  id: string;
  title?: string;
  ownerId?: string;
  coverImageUrl?: string;
}

interface WishlistOwner {
    username?: string;
    avatarUrl?: string;
}

export default function WishlistDetailPage() {
  const params = useParams();
  const wishlistId = params?.id;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null); // 'anull' hatası düzeltildi
  const [owner, setOwner] = useState<WishlistOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          const wishlistData = { id: docSnap.id, ...docSnap.data() } as Wishlist;
          setWishlist(wishlistData);

           // Fetch owner data
           if (wishlistData.ownerId) {
            const ownerRef = doc(db, 'users', wishlistData.ownerId);
            const ownerSnap = await getDoc(ownerRef);
            if (ownerSnap.exists()) {
              setOwner(ownerSnap.data() as WishlistOwner);
            }
          }
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
  }, [wishlistId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Link href="/dashboard/wishlist" className="text-sm hover:underline mb-4 block">
        &larr; Back to Wishlists
      </Link>
      <div className="bg-card p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{wishlist?.title || 'Wishlist Details'}</h1>
        <p className="text-muted-foreground">Wishlist ID: {wishlist?.id}</p>
        {owner?.username && <p className="text-sm">Created by: {owner.username}</p>}
      </div>
    </div>
  );
}