import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart2, 
  Settings, 
  LogOut,
  Link2
} from "lucide-react";

export function SidebarComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Links", path: "/dashboard/links", icon: <LinkIcon size={20} /> },
    { name: "Analytics", path: "/dashboard/analytics", icon: <BarChart2 size={20} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full z-20 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand-500 text-white p-1.5 rounded-lg shadow-sm">
            <Link2 size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-brand-900 dark:text-white">Linkify</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/dashboard/');
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`${isActive ? 'text-brand-600 dark:text-brand-500' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 pt-0">

        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium">
          <LogOut size={20} className="text-slate-400 dark:text-slate-500" />
          Logout
        </button>
      </div>
    </aside>
  );
}
