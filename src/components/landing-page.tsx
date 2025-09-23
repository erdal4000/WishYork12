'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartIcon, UsersIcon, UserIcon, ShareIcon, GiftIcon, Wand2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Turn Wishes into Reality.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  WishYork is the social platform where personal dreams, group gifts, and community causes connect. Share your wishes, support others, and make a real impact, together.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/wishlist">Start Your First Wish</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#">Explore Causes</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/landing-hero/800/600"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                width={800}
                height={600}
                data-ai-hint="scenic landscape"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  A Platform for Every Dream
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you are an individual with a personal goal, a group of friends, or a non-profit organization, WishYork has the tools you need.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <UserIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>For Individuals</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Create and share personal wishlists for any occasion. From life goals to little gifts, let your dreams be known and turn them into reality with the help of your community.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <UsersIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>For Groups & Communities</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Organize group gifts seamlessly. Pool resources with friends and family for a bigger impact, whether for a shared present or a community project.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <HeartIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>For Causes & NGOs</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                   Simplify your impact with transparent, hyper-focused campaigns. Verified organizations can directly list their needs, ensuring every contribution is meaningful and direct.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple Steps to a Fulfilled Wish
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Getting started is as easy as one, two, three.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:max-w-none mt-12 text-center">
              <div className="grid gap-1">
                <div className="flex justify-center items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold">1. Create Your Wish</h3>
                <p className="text-sm text-muted-foreground">
                  Build a wishlist for any goal, add items manually, or automatically from product details from any website just by pasting a link.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex justify-center items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ShareIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold">2. Share with Your World</h3>
                <p className="text-sm text-muted-foreground">
                  Easily share your list via a unique link. Control who sees it, from a private group of friends to the public.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex justify-center items-center mb-4">
                   <div className="p-3 bg-primary/10 rounded-full">
                    <GiftIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-bold">3. Receive & Give</h3>
                <p className="text-sm text-muted-foreground">
                  Watch your community come together to fulfill wishes. Contribute to public causes and make a tangible difference in the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted">
           <div className="container px-4 md:px-6">
             <Card className="p-6 md:p-12">
               <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                 <div className="flex flex-col justify-center space-y-2">
                   <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                      <Wand2 className="h-6 w-6 text-primary" />
                   </div>
                   <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                     Discover Your Next Wish
                   </h2>
                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Stuck for ideas? Our AI-powered Inspiration Box helps you find new and exciting products based on your interests and current trends.
                   </p>
                    <Button variant="link" className="p-0 h-auto justify-start">
                      Get inspired
                    </Button>
                 </div>
                 <Image
                   src="https://picsum.photos/seed/discover-wish/800/600"
                   alt="Discover"
                   className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                   width={800}
                   height={600}
                   data-ai-hint="person sunset"
                 />
               </div>
             </Card>
           </div>
        </section>
      </main>
    </div>
  );
}
