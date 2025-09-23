'use server';

import { refineWish as refineWishFlow } from '@/ai/flows/wish-refinement';

export async function refineWish(wishDescription: string) {
  if (!wishDescription || wishDescription.length < 10) {
    throw new Error('Please provide a more detailed description for refinement (at least 10 characters).');
  }
  try {
    const result = await refineWishFlow({ wishDescription });
    return result;
  } catch (error) {
    console.error('AI refinement failed:', error);
    throw new Error('An unexpected error occurred while refining your wish. Please try again later.');
  }
}
