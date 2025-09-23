
'use client';

import { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addCommentToWishlist } from '@/lib/firebase/firestore';

interface CommentInputProps {
  user: FirebaseUser;
  wishlistId: string;
}

export function CommentInput({ user, wishlistId }: CommentInputProps) {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getInitials = (email: string | null): string => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };
  
  const handleReply = async () => {
    if (!commentText.trim()) return;

    setIsLoading(true);
    try {
      await addCommentToWishlist(wishlistId, user.uid, commentText);
      setCommentText(''); // Clear input after successful submission
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to post comment',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={user.photoURL || undefined} />
        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button onClick={handleReply} disabled={isLoading || !commentText.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
