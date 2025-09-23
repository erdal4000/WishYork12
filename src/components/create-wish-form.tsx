'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { refineWish } from '@/lib/actions';
import { categories } from '@/lib/data';
import type { Wish } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const wishFormSchema = z.object({
  description: z.string().min(10, 'Please enter a description of at least 10 characters.'),
  url: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  categoryId: z.string({ required_error: 'Please select a category.' }),
});

type WishFormValues = z.infer<typeof wishFormSchema>;

interface CreateWishFormProps {
  onWishCreated: (newWish: Wish) => void;
  setOpen: (open: boolean) => void;
}

export function CreateWishForm({ onWishCreated, setOpen }: CreateWishFormProps) {
  const { toast } = useToast();
  const [isRefining, startRefineTransition] = useTransition();
  const [refinement, setRefinement] = useState<{ refinedDescription: string; reasoning: string } | null>(null);

  const form = useForm<WishFormValues>({
    resolver: zodResolver(wishFormSchema),
    defaultValues: {
      description: '',
      url: '',
    },
  });

  const handleRefineWish = () => {
    const description = form.getValues('description');
    startRefineTransition(async () => {
      setRefinement(null);
      try {
        const result = await refineWish(description);
        setRefinement(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description: error instanceof Error ? error.message : 'Could not refine wish.',
        });
      }
    });
  };

  const useRefinedDescription = () => {
    if (refinement) {
      form.setValue('description', refinement.refinedDescription, { shouldValidate: true });
      setRefinement(null);
    }
  };

  function onSubmit(data: WishFormValues) {
    const selectedCategory = categories.find((c) => c.id === data.categoryId);
    if (!selectedCategory) {
      toast({ variant: 'destructive', title: 'Invalid category selected.' });
      return;
    }

    const newWish: Wish = {
      id: new Date().toISOString(),
      ...data,
      category: selectedCategory,
      createdAt: new Date(),
    };
    onWishCreated(newWish);
    toast({
      title: 'Wish created!',
      description: 'Your new wish has been added to your list.',
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Wish</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe what you're wishing for..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefineWish}
            disabled={isRefining || form.watch('description').length < 10}
            className="gap-2"
          >
            {isRefining ? <Loader2 className="animate-spin" /> : <Wand2 />}
            Refine with AI
          </Button>

          {isRefining && <div className="text-sm text-muted-foreground">AI is thinking...</div>}
          
          {refinement && (
             <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI Suggestion</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">{refinement.refinedDescription}</p>
                  <p className="text-xs text-muted-foreground italic">Reasoning: {refinement.reasoning}</p>
                  <Button type="button" size="sm" onClick={useRefinedDescription}>Use this suggestion</Button>
                </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/product/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Create Wish</Button>
      </form>
    </Form>
  );
}
