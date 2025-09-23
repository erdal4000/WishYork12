'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideOnPaths = ['/login', '/signup'];
  const showPublicLayout = !hideOnPaths.includes(pathname) && !pathname.startsWith('/dashboard');

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        {showPublicLayout && <Header />}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        {showPublicLayout && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
