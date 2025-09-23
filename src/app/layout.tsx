'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header'; // Doğru yol
import { Footer } from '@/components/layout/Footer'; // Doğru yol
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideOnPaths = ['/login', '/signup'];
  const showPublicLayout = !hideOnPaths.includes(pathname) && !pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {showPublicLayout && <Header />}
          <main className="flex-grow">{children}</main> {/* Eklendi: main içeriğin büyümesini sağlar */}
          {showPublicLayout && <Footer />}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}