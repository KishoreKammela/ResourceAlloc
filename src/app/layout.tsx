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
import PublicLayout from '@/app/(public)/layout';
import AppLayout from '@/app/(app)/layout';

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
  const isVerifyEmailPath = pathname.startsWith('/verify-email');
  const isOnboardingPath = pathname.startsWith('/onboarding');
  const isAppPath = !isPublicPath && !isVerifyEmailPath && !isOnboardingPath;

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (!user.emailVerified && !isVerifyEmailPath) {
        router.push('/verify-email');
      } else if (user.emailVerified && (isPublicPath || isVerifyEmailPath)) {
        router.push('/dashboard');
      }
    } else if (!user && isAppPath) {
      router.push('/login');
    }
  }, [
    user,
    loading,
    isPublicPath,
    isAppPath,
    isVerifyEmailPath,
    pathname,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Determine which layout to render
  if (!user && isPublicPath) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  if (user && !user.emailVerified) {
    return isVerifyEmailPath ? <PublicLayout>{children}</PublicLayout> : null;
  }
  if (user && isOnboardingPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        {children}
      </div>
    );
  }

  if (user && user.emailVerified && !isOnboardingPath) {
    return <AppLayout>{children}</AppLayout>;
  }

  // Fallback for logged-out users on non-public pages (e.g. verify, onboarding)
  return <PublicLayout>{children}</PublicLayout>;
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
