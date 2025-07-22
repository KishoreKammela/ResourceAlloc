'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Header } from '@/components/app/header';
import { Nav } from '@/components/app/nav';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar>
          <SidebarHeader className="sticky top-0 z-10 flex h-14 items-center border-b px-3">
            <div className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6 text-primary" />
              <h1 className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">
                ResourceAlloc
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Nav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
