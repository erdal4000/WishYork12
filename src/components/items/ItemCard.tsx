
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: {
    name: string;
    imageUrl?: string;
    purchaseUrl?: string;
    description?: string;
    priority?: string;
    quantity?: number;
    createdAt?: Date | string;
    price?: number;
  };
}

function timeAgo(date?: any) {
  if (!date) return '';
  let d = date;
  // Firestore Timestamp check
  if (d && typeof d.toDate === 'function') {
    d = d.toDate();
  } else if (typeof d === 'string') {
    d = new Date(d);
  }
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return d.toLocaleDateString();
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Card className="grid grid-cols-[120px_1fr] gap-4 p-4 items-start relative">
      {/* Left: Image */}
      <div className="w-[120px] h-[120px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-4xl">🖼️</span>
        )}
      </div>
      {/* Right: Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <a
            href={item.purchaseUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-lg hover:underline"
          >
            {item.name}
          </a>
          <Button size="icon" variant="ghost" className="ml-2">
            <span className="text-xl">⋯</span>
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">added {timeAgo(item.createdAt)}</span>
        <div className="flex gap-2 flex-wrap">
          <Badge>{item.priority || 'Medium'}</Badge>
          <Badge variant="secondary">Qty: {item.quantity ?? 1}</Badge>
          {item.price !== undefined && (
            <Badge variant="outline">${item.price}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description || 'No description available.'}
        </p>
        <a
          href={item.purchaseUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm font-medium hover:underline mt-1"
        >
          View Product
        </a>
      </div>
    </Card>
  );
};
