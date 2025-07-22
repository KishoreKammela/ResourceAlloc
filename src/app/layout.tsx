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
import { ThemeProvider } from 'next-themes';

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

    const isPublicPath =
      pathname === '/' ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/invite');

    if (user) {
      if (!user.emailVerified) {
        if (!pathname.startsWith('/verify-email')) {
          router.push('/verify-email');
        }
      } else if (!user.onboardingCompleted) {
        if (!pathname.startsWith('/onboarding/create-profile')) {
          router.push('/onboarding/create-profile');
        }
      } else if (isPublicPath) {
        router.push('/dashboard');
      }
    } else {
      if (!isPublicPath) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading && !pathname.startsWith('/invite')) {
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
