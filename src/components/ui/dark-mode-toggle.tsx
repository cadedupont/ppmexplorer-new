'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'scale-0' : 'scale-100'}`} />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          isDark ? 'scale-100' : 'scale-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkModeToggle;
