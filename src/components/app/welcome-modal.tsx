'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper, Users, Briefcase, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
};

export default function WelcomeModal({
  isOpen,
  onClose,
  userName,
}: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <PartyPopper className="h-6 w-6 text-accent" />
          </div>
          <DialogTitle className="text-center font-headline text-2xl">
            Welcome to ResourceAlloc, {userName}!
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re all set up. Here are a few things you can do to get
            started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Link href="/employees/new" passHref legacyBehavior>
            <a
              onClick={onClose}
              className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Add Your First Employee</p>
                <p className="text-sm text-muted-foreground">
                  Start building your talent pool by adding employee profiles.
                </p>
              </div>
            </a>
          </Link>
          <Link href="/projects/new" passHref legacyBehavior>
            <a
              onClick={onClose}
              className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Create a Project</p>
                <p className="text-sm text-muted-foreground">
                  Define a new project and use AI to find the best talent for
                  it.
                </p>
              </div>
            </a>
          </Link>
          <Link href="/analysis" passHref legacyBehavior>
            <a
              onClick={onClose}
              className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Run a Skill Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Get an AI-powered overview of your company&apos;s skill
                  landscape.
                </p>
              </div>
            </a>
          </Link>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
