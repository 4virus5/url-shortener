import { SidebarComponent } from "../components/Sidebar";
import { Bell, Search, User } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans transition-colors duration-300">
      <SidebarComponent />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10 shrink-0 transition-colors duration-300">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search links, tags, or analytics..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 relative text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name || 'User'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-auto bg-[#f8fafc] dark:bg-slate-950 p-6 lg:p-8 transition-colors duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
