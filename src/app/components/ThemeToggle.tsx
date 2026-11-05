import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button aria-label="Toggle theme" disabled className="portfolio-theme-toggle">
        <span className="opacity-0">.</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="portfolio-theme-toggle"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
