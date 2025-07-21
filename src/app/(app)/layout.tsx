'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/app/header';
import { Nav } from '@/components/app/nav';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
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
    </SidebarProvider>
  );
}
