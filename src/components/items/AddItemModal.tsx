'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Form şeması (Zod ile doğrulama)
const itemSchema = z.object({
  url: z.string().url().optional().or(z.literal('')),
  name: z.string().min(1, 'Item name is required'),
  image: z.string().optional(),
  itemImageUrl: z.string().url().optional(),
  priority: z.string().optional(),
  recurrence: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number().optional(),
  purchaseUrl: z.string().url().optional().or(z.literal('')),
  neededBy: z.union([z.string(), z.date()]).optional(),
  description: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// Bileşenin alacağı props'lar
interface AddItemModalProps {
  wishlistId: string;
  children: React.ReactNode;
  onItemAdded?: () => void;
}

export function AddItemModal({ wishlistId, children, onItemAdded }: AddItemModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // Fetch from URL handler
  const handleFetchFromUrl = async () => {
    const url = (document.querySelector('input[name="url"]') as HTMLInputElement)?.value;
    if (!url) return;
    setIsFetching(true);
    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
  if (data.name) setValue('name', data.name);
  if (data.price) setValue('price', Number(data.price) || undefined);
  if (data.imageUrl) setValue('itemImageUrl', data.imageUrl);
  if (data.description) setValue('description', data.description);
  if (data.url) setValue('purchaseUrl', data.url);
  if (data.image) setValue('image', data.image);
    } catch (e) {
      // Hata durumunda toast veya alert eklenebilir
      console.error('Fetch failed', e);
    } finally {
      setIsFetching(false);
    }
  };
  const onSubmit: SubmitHandler<ItemFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'items'), {
        wishlistId: wishlistId,
        name: data.name,
        url: data.url || '',
        image: data.image || '',
        itemImageUrl: data.itemImageUrl || '',
        priority: data.priority || '',
        recurrence: data.recurrence || '',
        quantity: data.quantity,
        price: data.price || null,
        purchaseUrl: data.purchaseUrl || '',
        neededBy: data.neededBy || '',
        description: data.description || '',
        createdAt: serverTimestamp(),
        isFulfilled: false,
      });
      console.log('Item added successfully!');
      if (onItemAdded) {
        onItemAdded();
      }
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new item in your wishlist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[70vh] space-y-6">
          {/* Fetch from URL */}
          <div>
            <Label className="block font-medium mb-1">Fetch from URL (optional)</Label>
            <div className="flex gap-2">
              <Input {...register('url')} placeholder="Paste product link here" />
              <Button type="button" size="icon" variant="secondary" onClick={handleFetchFromUrl} disabled={isFetching}>
                {isFetching ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <span role="img" aria-label="sparkle">✨</span>
                )}
              </Button>
            </div>
            {/* Hidden field for itemImageUrl from scraper */}
            <input type="hidden" {...register('itemImageUrl')} />
          </div>

          {/* Separator */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-muted" />
            <span className="text-xs text-muted-foreground font-semibold">OR ENTER MANUALLY</span>
            <div className="flex-1 h-px bg-muted" />
          </div>

          {/* Item Name */}
          <div>
            <Label className="block font-medium mb-1">Item Name</Label>
            <Input {...register('name')} placeholder="e.g., Wireless Headphones" required />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          {/* Item Image Dropzone */}
          <div>
            <Label className="block font-medium mb-1">Item Image (optional)</Label>
            <div className="border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center py-8 mb-2 bg-background">
              <span className="text-4xl text-muted-foreground mb-2" role="img" aria-label="image">🖼️</span>
              <span className="text-muted-foreground mb-2">No image provided</span>
              <Button type="button" variant="outline" className="mt-2">Upload Image</Button>
              <input id="item-image-upload" type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Priority & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block font-medium mb-1">Priority</Label>
              <select {...register('priority')} className="w-full border rounded p-2">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <Label className="block font-medium mb-1">Recurrence (optional)</Label>
              <Input {...register('recurrence')} placeholder="e.g., Monthly" />
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block font-medium mb-1">Quantity</Label>
              <Input type="number" {...register('quantity', { valueAsNumber: true })} placeholder="1" min={1} />
            </div>
            <div>
              <Label className="block font-medium mb-1">Price (optional)</Label>
              <Input type="number" {...register('price', { valueAsNumber: true })} placeholder="e.g., 199" min={0} />
            </div>
          </div>

          {/* Purchase URL & Needed By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block font-medium mb-1">Purchase URL (optional)</Label>
              <Input {...register('purchaseUrl')} placeholder="e.g., https://amazon.com/product" />
            </div>
            <div>
              <Label className="block font-medium mb-1">Needed By (optional)</Label>
              <Input type="date" {...register('neededBy')} />
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <Label className="block font-medium mb-1">Description / Notes (optional)</Label>
            <Textarea {...register('description')} placeholder="Add any notes or details here..." />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}