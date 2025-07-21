'use client';

import { PublicFooter } from './_components/footer';
import { PublicNavbar } from './_components/navbar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <PublicFooter />
    </div>
  );
}
