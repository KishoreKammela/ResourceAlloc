import Link from 'next/link';
import { Icons } from '@/components/icons';

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">ResourceAlloc</span>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ResourceAlloc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
