
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/app/header';
import { Nav } from '@/components/app/nav';
import { AuthProvider } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import PublicLayout from './(public)/layout';
import { MotionConfig } from 'framer-motion';


function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPublicPage = pathname === '/';

  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <Nav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ResourceAlloc</title>
        <meta name="description" content="AI-Powered Resource Allocation and Management" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'bg-background')}>
        <AuthProvider>
            <MotionConfig reducedMotion="user">
                <AppLayout>{children}</AppLayout>
            </MotionConfig>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
