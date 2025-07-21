'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { useEffect } from 'react';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup');
  const isAppPath = !isPublicPath;

  useEffect(() => {
    if (loading) return;

    if (user && isPublicPath) {
      router.push('/dashboard');
    } else if (!user && isAppPath) {
      router.push('/login');
    }
  }, [user, loading, isPublicPath, isAppPath, pathname, router]);

  if (loading || (user && isPublicPath) || (!user && isAppPath)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontInter.variable} ${fontSpaceGrotesk.variable}`}
    >
      <head>
        <title>ResourceAlloc</title>
        <meta
          name="description"
          content="AI-Powered Resource Allocation and Management"
        />
      </head>
      <body className={cn('font-body antialiased', 'bg-background')}>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <AuthRedirect>{children}</AuthRedirect>
          </MotionConfig>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
