'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { RightSidebar } from '@/components/dashboard/RightSidebar';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-muted/40">
          <Header />
          <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr_300px]">
              <aside className="hidden md:block">
                <Sidebar />
              </aside>
              <main className="py-6">
                {children}
              </main>
              <aside className="hidden lg:block">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
