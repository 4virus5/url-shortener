import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-500 text-white p-1.5 rounded-lg">
              <Link2 size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-900">Linkify</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Pricing</a>
            <Link to="/dashboard" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Dashboard</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden sm:inline-flex text-slate-600 hover:text-brand-600 font-medium transition-colors">
              Log in
            </Link>
            <Link to="/login" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
