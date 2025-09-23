'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Plus } from 'lucide-react';

const trendingWishlists = [
  { id: 1, name: 'Adventure Gear', items: 12 },
  { id: 2, name: 'Kitchen Upgrades', items: 8 },
  { id: 3, name: 'Home Office Setup', items: 15 },
];

const usersToFollow = [
  { id: 1, name: 'David', handle: '@david', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d' },
  { id: 2, name: 'Eve', handle: '@eve', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 3, name: 'Frank', handle: '@frank', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
];


export function RightSidebar() {
  return (
    <aside className="border-l bg-background p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trending Wishlists</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {trendingWishlists.map(list => (
              <li key={list.id} className="flex items-center gap-4">
                <div className="bg-muted p-2 rounded-md">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{list.name}</div>
                  <div className="text-sm text-muted-foreground">{list.items} items</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Who to Follow</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {usersToFollow.map(user => (
              <li key={user.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.handle}</div>
                </div>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Follow
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
