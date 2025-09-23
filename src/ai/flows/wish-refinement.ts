'use server';

/**
 * @fileOverview Refines wish descriptions using AI to help users express their wishes more clearly.
 *
 * - refineWish - A function that refines the wish description.
 * - RefineWishInput - The input type for the refineWish function.
 * - RefineWishOutput - The return type for the refineWish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineWishInputSchema = z.object({
  wishDescription: z
    .string()
    .describe('The original description of the wish provided by the user.'),
});
export type RefineWishInput = z.infer<typeof RefineWishInputSchema>;

const RefineWishOutputSchema = z.object({
  refinedDescription: z
    .string()
    .describe('The AI-refined description of the wish.'),
  reasoning: z
    .string()
    .describe('Explanation of why the description was refined.'),
});
export type RefineWishOutput = z.infer<typeof RefineWishOutputSchema>;

export async function refineWish(input: RefineWishInput): Promise<RefineWishOutput> {
  return refineWishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineWishPrompt',
  input: {schema: RefineWishInputSchema},
  output: {schema: RefineWishOutputSchema},
  prompt: `You are an AI assistant designed to help users refine their wish descriptions.

  The user will provide an initial wish description, and your goal is to improve it by making it clearer, more specific, and more engaging.

  Consider the user's original intent and try to capture the essence of their wish while enhancing its expression.

  Provide a 'reasoning' for the refinement, explaining why the new description is better.

  Original Wish Description: {{{wishDescription}}}

  Refined Wish Description:`,
});

const refineWishFlow = ai.defineFlow(
  {
    name: 'refineWishFlow',
    inputSchema: RefineWishInputSchema,
    outputSchema: RefineWishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
