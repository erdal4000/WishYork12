'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  post: {
    content: string;
    image?: string;
    timestamp: string;
    comments: number;
    likes: number;
    shares: number;
  };
}

export function PostCard({ user, post }: PostCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">
            {user.handle} &middot; {post.timestamp}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between">
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-red-500">
          <Heart className="h-5 w-5" />
          <span>{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
          <Share2 className="h-5 w-5" />
          <span>{post.shares}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
