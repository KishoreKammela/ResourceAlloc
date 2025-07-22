'use client';

import ThemeSwitcher from '@/components/app/theme-switcher';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PreferencesPage() {
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
            <Label className="text-base">Theme</Label>
            <p className="text-sm text-muted-foreground">
              Select your preferred color scheme for the application.
            </p>
          </div>
          <ThemeSwitcher />
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
    </Card>
  );
}
