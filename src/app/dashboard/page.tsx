'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/feed/PostCard';
import { useAuth } from '@/hooks/use-auth';

const getInitials = (email: string | null | undefined) => {
  if (!email) return 'U';
  return email.substring(0, 2).toUpperCase();
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <Input placeholder="What's on your mind?" className="flex-1" />
          <Button>Post</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <PostCard
          user={{
            name: 'Alice',
            handle: '@alice',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          }}
          post={{
            content: "Just got back from a week-long trip to the mountains. The views were breathtaking! Can't wait to share more photos.",
            image: 'https://picsum.photos/seed/feed1/800/600',
            timestamp: '2 hours ago',
            comments: 12,
            likes: 45,
            shares: 8,
          }}
        />
        <PostCard
          user={{
            name: 'Bob',
            handle: '@bob',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          }}
          post={{
            content: 'Excited to announce that I will be speaking at the Next.js Conf this year! Hope to see you all there. #nextjs #webdev',
            image: 'https://picsum.photos/seed/feed2/800/600',
            timestamp: '1 day ago',
            comments: 88,
            likes: 231,
            shares: 42,
          }}
        />
         <PostCard
          user={{
            name: 'Charlie',
            handle: '@charlie',
            avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          }}
          post={{
            content: 'My wish for a new camera finally came true! Thanks to everyone who contributed. Time to take some amazing shots.',
            image: 'https://picsum.photos/seed/feed3/800/600',
            timestamp: '3 days ago',
            comments: 34,
            likes: 150,
            shares: 15,
          }}
        />
      </div>
    </div>
  );
}
