'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const renderButton = () => {
    if (!action) return null;

    const content = (
      <>
        <PlusCircle className="mr-2 h-4 w-4" />
        {action.label}
      </>
    );

    if (action.href) {
      return (
        <Button asChild className="mt-6">
          <Link href={action.href}>{content}</Link>
        </Button>
      );
    }

    if (action.onClick) {
      return (
        <Button onClick={action.onClick} className="mt-6">
          {content}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="font-headline text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      {renderButton()}
    </div>
  );
}
