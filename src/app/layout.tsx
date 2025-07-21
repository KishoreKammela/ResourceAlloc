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

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthPage =
      pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isVerifyEmailPath = pathname.startsWith('/verify-email');
    const isOnboardingPath = pathname.startsWith('/onboarding');
    const isAppPath = !isAuthPage && !isVerifyEmailPath && !isOnboardingPath;

    if (user) {
      if (!user.emailVerified && !isVerifyEmailPath) {
        router.push('/verify-email');
      } else if (user.emailVerified && !user.onboardingCompleted) {
        if (!isOnboardingPath) {
          router.push('/onboarding/create-profile');
        }
      } else if (
        user.emailVerified &&
        user.onboardingCompleted &&
        (isAuthPage || isVerifyEmailPath)
      ) {
        router.push('/dashboard');
      }
    } else {
      if (isAppPath) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
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
            <RootLayoutContent>{children}</RootLayoutContent>
          </MotionConfig>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
