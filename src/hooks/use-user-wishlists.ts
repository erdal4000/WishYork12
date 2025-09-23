'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToUserWishlists } from '@/lib/firebase/firestore';
import type { Wishlist } from '@/lib/types';

export default function useUserWishlists(ownerId?: string) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe: () => void;

    try {
      unsubscribe = subscribeToUserWishlists(ownerId, (fetchedWishlists) => {
        setWishlists(fetchedWishlists);
        setLoading(false);
      });
    } catch (err) {
      setError('Failed to fetch wishlists.');
      setLoading(false);
      console.error(err);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [ownerId]);

  const addWishlist = useCallback((newWishlist: Wishlist) => {
    // This is an optimistic update. The real-time listener will correct it if needed.
    // By using a function with previous state, we avoid potential race conditions
    setWishlists((prevWishlists) => {
      // Avoid adding if it already exists from a rapid snapshot update
      if (prevWishlists.some(w => w.id === newWishlist.id)) {
        return prevWishlists;
      }
      return [newWishlist, ...prevWishlists];
    });
  }, []);

  return { wishlists, loading, error, addWishlist };
}
