import { notFound } from 'next/navigation';
import Image from 'next/image';
import { initialWishes } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ShareButton } from '@/components/share-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function WishDetailPage({ params }: { params: { id: string } }) {
  const wish = initialWishes.find((w) => w.id === params.id);

  if (!wish) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={wish.imageUrl || `https://picsum.photos/seed/${wish.id}/1200/675`}
                  alt={wish.description}
                  fill
                  className="object-cover"
                  data-ai-hint={wish.imageHint || "wish item"}
                />
              </div>
              <CardTitle className="font-headline text-4xl">{wish.description}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-base">
                <Badge variant="secondary" className="gap-2 py-1 px-3 text-sm">
                  <wish.category.icon className="h-4 w-4" />
                  {wish.category.name}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Wished on {format(wish.createdAt, 'MMMM d, yyyy')}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wish.url && (
                <a
                  href={wish.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-foreground hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Product/Link</span>
                </a>
              )}
              <ShareButton />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
