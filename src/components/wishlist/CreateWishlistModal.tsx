'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Image as ImageIcon, Globe, Users, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { createWishlist } from '@/lib/firebase/firestore';
import type { Wishlist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import placeholderData from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(3, 'Wishlist name must be at least 3 characters long.'),
  description: z.string().optional(),
  category: z.string({ required_error: 'Please select a category.' }),
  privacy: z.enum(['public', 'friends', 'private'], {
    required_error: 'You need to select a privacy setting.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateWishlistModalProps {
    children: React.ReactNode;
    onWishlistCreated: (newWishlist: Wishlist) => void;
}

export function CreateWishlistModal({ children, onWishlistCreated }: CreateWishlistModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      privacy: 'public',
      category: 'other',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to create a wishlist.',
        });
        return;
    }
    
    setIsLoading(true);
    try {
        const coverImageUrl = placeholderData.wishlistCover.template.replace(
          '{seed}',
          encodeURIComponent(values.name)
        );

        const newWishlistData = {
            ...values,
            ownerId: user.uid,
            coverImageUrl,
            createdAt: serverTimestamp(),
        };
        const newWishlist = await createWishlist(newWishlistData);
        onWishlistCreated(newWishlist);

        toast({
            title: 'Wishlist Created!',
            description: `Your new wishlist "${values.name}" has been successfully created.`,
        });

        form.reset();
        setIsOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to create wishlist',
            description: 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Wishlist</DialogTitle>
          <DialogDescription>
            Give your new wishlist a name and some details to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wishlist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. My Birthday Wishlist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of what this wishlist is for."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label>Cover Image</Label>
                 <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-sm text-muted-foreground">
                            A cover image will be generated automatically.
                        </p>
                    </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="category"
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
                        {['Birthday', 'Wedding', 'Travel', 'Hobby', 'Charity', 'Other'].map(cat => (
                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Privacy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <RadioGroupItem value="public" className="sr-only" />
                            <Globe className="mb-3 h-6 w-6" />
                            Public
                        </Label>
                         <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <RadioGroupItem value="friends" className="sr-only" />
                            <Users className="mb-3 h-6 w-6" />
                            Friends
                        </Label>
                         <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                            <RadioGroupItem value="private" className="sr-only" />
                            <Lock className="mb-3 h-6 w-6" />
                            Private
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-end gap-2 pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
