import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  orderBy,
  doc,
  getDoc,
  FieldValue,
} from 'firebase/firestore';
import { db } from './config';
import type { Wishlist, PrivacySetting, User, Comment } from '../types';

type WishlistData = {
  name: string;
  description?: string;
  category: string;
  privacy: PrivacySetting;
  ownerId: string;
  coverImageUrl: string;
  createdAt: FieldValue;
};

// Function to create a new wishlist
export async function createWishlist(
  wishlistData: WishlistData
): Promise<Wishlist> {
  const docRef = await addDoc(collection(db, 'wishlists'), wishlistData);

  return {
    id: docRef.id,
    name: wishlistData.name,
    description: wishlistData.description,
    category: wishlistData.category,
    privacy: wishlistData.privacy,
    ownerId: wishlistData.ownerId,
    coverImageUrl: wishlistData.coverImageUrl,
    createdAt: Timestamp.now(), // Return a client-side timestamp for optimistic updates
  };
}

// Function to get wishlists for a specific user
export async function getWishlistsByOwner(
  ownerId: string
): Promise<Wishlist[]> {
  const q = query(collection(db, 'wishlists'), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const wishlists: Wishlist[] = [];
  querySnapshot.forEach((doc) => {
    wishlists.push({ id: doc.id, ...doc.data() } as Wishlist);
  });
  return wishlists;
}

// Function to subscribe to real-time updates for a user's wishlists
export const subscribeToUserWishlists = (
  ownerId: string,
  callback: (wishlists: Wishlist[]) => void
) => {
  const q = query(collection(db, 'wishlists'), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const wishlists: Wishlist[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      wishlists.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null
      } as Wishlist);
    });
    callback(wishlists);
  });
  return unsubscribe;
};

// Function to get a single wishlist by its ID
export async function getWishlistById(id: string): Promise<Wishlist | null> {
  const docRef = doc(db, 'wishlists', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Wishlist;
  } else {
    return null;
  }
}

// Function to get a user's profile
export async function getUserProfile(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
    return null;
}

// Function to add a comment to a wishlist
export async function addCommentToWishlist(
  wishlistId: string,
  authorId: string,
  text: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'comments'), {
      wishlistId,
      authorId,
      text,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw new Error("Failed to add comment.");
  }
}


// Function to subscribe to comments for a wishlist
export const subscribeToWishlistComments = (
  wishlistId: string,
  callback: (comments: Comment[]) => void
) => {
  const q = query(
    collection(db, 'comments'),
    where('wishlistId', '==', wishlistId),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const commentPromises = querySnapshot.docs.map(async (doc) => {
      const commentData = { id: doc.id, ...doc.data() } as Comment;
      if (commentData.authorId) {
        const author = await getUserProfile(commentData.authorId);
        if (author) {
          commentData.author = author;
        }
      }
      return commentData;
    });
    
    const resolvedComments = await Promise.all(commentPromises);
    callback(resolvedComments);
  });

  return unsubscribe;
};
