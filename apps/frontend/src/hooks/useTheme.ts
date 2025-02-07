import { useEffect, useState } from 'react';

const THEME_KEY = 'board_theme';

export function useTheme() {
  const [theme, setTheme] = useState<string | null>(
    window.localStorage.getItem(THEME_KEY)
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [theme]);

  return { theme, setTheme };
}
