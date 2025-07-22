'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-md border bg-muted p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('system')}
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}
