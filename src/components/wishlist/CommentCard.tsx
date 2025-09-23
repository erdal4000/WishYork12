
'use client';

import type { Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={comment.author?.avatarUrl} alt={comment.author?.name} />
        <AvatarFallback>{getInitials(comment.author?.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{comment.author?.name || 'Anonymous'}</p>
          <p className="text-xs text-muted-foreground">
            {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : ''}
          </p>
        </div>
        <p className="mt-1 text-sm text-foreground">{comment.text}</p>
      </div>
    </div>
  );
}
