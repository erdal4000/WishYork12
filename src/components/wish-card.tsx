import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

import type { Wish } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WishCardProps {
  wish: Wish;
}

export function WishCard({ wish }: WishCardProps) {
  return (
    <Link href={`/wish/${wish.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
        <CardHeader>
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={wish.imageUrl || `https://picsum.photos/seed/${wish.id}/600/400`}
              alt={wish.description}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={wish.imageHint || "wish item"}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="mb-2 text-lg font-headline leading-snug">
            {wish.description}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2">
            <wish.category.icon className="h-3.5 w-3.5" />
            <span>{wish.category.name}</span>
          </Badge>
          <span>{formatDistanceToNow(wish.createdAt, { addSuffix: true })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
