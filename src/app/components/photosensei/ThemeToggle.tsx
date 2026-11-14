import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full hover:bg-accent"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600" />
      )}
    </Button>
  );
}