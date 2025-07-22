'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function PreferencesForm() {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Preferences</CardTitle>
        <CardDescription>
          Customize your experience across the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="theme-switch" className="text-base">
              Theme
            </Label>
            <p className="text-sm text-muted-foreground">
              Dark mode is not yet available.
            </p>
          </div>
          <Switch id="theme-switch" disabled />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="email-switch" className="text-base">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Notification settings are not yet implemented.
            </p>
          </div>
          <Switch id="email-switch" disabled />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button disabled>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
