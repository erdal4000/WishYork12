'use client';

import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function ShareButton() {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        toast({
          title: 'Link Copied!',
          description: "You can now share your wish with others.",
        });
      },
      (err) => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy the link to your clipboard.',
        });
        console.error('Failed to copy text: ', err);
      }
    );
  };

  return (
    <Button variant="outline" onClick={handleShare} className="gap-2">
      <Share2 className="h-4 w-4" />
      Share Wish
    </Button>
  );
}
