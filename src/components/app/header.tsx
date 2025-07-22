'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const pathname = usePathname();

  // A simple function to derive a title from the pathname
  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';

    // Handle nested routes like /employees/[id]/edit
    if (segments.includes('edit')) {
      const resource = segments[segments.length - 2];
      return `Edit ${resource.charAt(0).toUpperCase() + resource.slice(1, -1)}`;
    }
    if (segments.includes('new')) {
      const resource = segments[segments.length - 2];
      return `New ${resource.charAt(0).toUpperCase() + resource.slice(1, -1)}`;
    }

    const lastSegment = segments[segments.length - 1];
    // Check if last segment is a potential ID (e.g., UUID or number), show parent route
    if (
      segments.length > 1 &&
      /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(lastSegment)
    ) {
      const parentSegment = segments[segments.length - 2];
      return (
        parentSegment.charAt(0).toUpperCase() +
        parentSegment.slice(1).replace('-', ' ')
      );
    }

    return (
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace('-', ' ')
    );
  };

  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-headline text-2xl font-bold">{title}</h1>
      </div>
    </header>
  );
}
