'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { Inter, Space_Grotesk } from 'next/font/google';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import FullPageLoader from '@/components/app/full-page-loader';

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

  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/invite');

  const [isRedirecting, setIsRedirecting] = useState(!isPublicPath);

  useEffect(() => {
    if (loading) {
      setIsRedirecting(true);
      return;
    }

    let isRedirectingNow = false;

    if (user) {
      if (!user.emailVerified && !pathname.startsWith('/verify-email')) {
        router.push('/verify-email');
        isRedirectingNow = true;
      } else if (
        user.emailVerified &&
        !user.onboardingCompleted &&
        !pathname.startsWith('/onboarding/create-profile')
      ) {
        router.push('/onboarding/create-profile');
        isRedirectingNow = true;
      } else if (
        user.emailVerified &&
        user.onboardingCompleted &&
        isPublicPath
      ) {
        router.push('/dashboard');
        isRedirectingNow = true;
      }
    } else {
      if (!isPublicPath) {
        router.push('/login');
        isRedirectingNow = true;
      }
    }

    if (!isRedirectingNow) {
      setIsRedirecting(false);
    }
  }, [user, loading, pathname, router, isPublicPath]);

  if (loading || isRedirecting) {
    return <FullPageLoader />;
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MotionConfig reducedMotion="user">
              <RootLayoutContent>{children}</RootLayoutContent>
            </MotionConfig>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
