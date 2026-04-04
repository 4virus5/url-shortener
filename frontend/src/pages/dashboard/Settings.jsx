import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your preferences and account configuration.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor size={20} className="text-brand-500" />
            Appearance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize the interface theme to your liking.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch between light and dark themes.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}>
                {theme === 'dark' ? <Moon size={14} className="text-brand-500" /> : <Sun size={14} className="text-amber-500" />}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
