import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { tema, toggleTema } = useTheme();

  return (
    <button
      onClick={toggleTema}
      className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
      title={tema === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      aria-label="Cambiar tema"
    >
      {tema === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}