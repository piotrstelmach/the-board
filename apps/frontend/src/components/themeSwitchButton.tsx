import { useTheme } from '../hooks/useTheme';

export const ThemeSwitchButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg transition-all bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
      >
        Switch theme
      </button>
    </>
  );
};
