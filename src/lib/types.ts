import type { LucideIcon } from 'lucide-react';
import type { Timestamp, FieldValue } from 'firebase/firestore';

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type Wish = {
  id: string;
  description: string;
  url?: string;
  imageUrl?: string;
  imageHint?: string;
  category: Category;
  createdAt: Date;
  refinedDescription?: string;
  refinementReasoning?: string;
};

export type PrivacySetting = 'public' | 'friends' | 'private';

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  category: string;
  privacy: PrivacySetting;
  ownerId: string;
  createdAt: Timestamp | FieldValue;
  coverImageUrl?: string;
}

export interface User {
    uid: string;
    email: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
    accountType: 'individual' | 'ngo';
    createdAt: Timestamp;
}

export interface Comment {
    id: string;
    text: string;
    authorId: string;
    wishlistId: string;
    createdAt: Timestamp;
    author?: User; // Will be populated after fetching
}
