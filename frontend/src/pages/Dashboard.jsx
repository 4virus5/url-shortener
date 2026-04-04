import { useState, useEffect } from "react";
import { SidebarComponent } from "../components/Sidebar";
import { motion } from "framer-motion";
import { 
  Bell, Search, Filter, Plus, Copy, 
  Trash2, Edit2, Link2, MousePointerClick, 
  Activity, Clock, Loader2, Link as LinkIcon
} from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";

const sourceData = [
  { name: "Direct", value: 100, color: "#0ea5e9" }, 
];

export default function Dashboard() {
  const [copiedId, setCopiedId] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // URL Shortening state
  const [showCreate, setShowCreate] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if(res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setShortening(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:3000/api/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ originalUrl: longUrl })
      });
      
      if(!res.ok) throw new Error("Failed to shorten URL");
      
      setLongUrl("");
      setShowCreate(false);
      fetchStats(); // refresh dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setShortening(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      <SidebarComponent />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100 z-10 shrink-0">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search links, tags, or analytics..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back. Here's what's happening today.</p>
            </div>
            <button 
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-brand-500/25"
            >
              <Plus size={18} /> Create Link
            </button>
          </div>

          {/* Create Modal overlay */}
          {showCreate && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-brand-500/10"
             >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Shorten a new URL</h3>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <form onSubmit={handleCreateLink} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="url" 
                      required
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://your-very-long-url.com/path" 
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm outline-none"
                    />
                  </div>
                  <button 
                    disabled={shortening}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-75 flex items-center justify-center min-w-[120px]"
                  >
                    {shortening ? <Loader2 className="animate-spin" size={18} /> : 'Shorten'}
                  </button>
                </form>
             </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Links" value={stats?.totalLinks || 0} icon={<Link2 className="text-blue-500" />} trend="All Time" className="bg-blue-50" />
            <StatCard title="Total Clicks" value={stats?.totalClicks || 0} icon={<MousePointerClick className="text-indigo-500" />} trend="All Time" className="bg-indigo-50" />
            <StatCard title="Active Links" value={stats?.activeLinks || 0} icon={<Activity className="text-emerald-500" />} trend="Live" className="bg-emerald-50" />
            <StatCard title="Expired Links" value={(stats?.totalLinks || 0) - (stats?.activeLinks || 0)} icon={<Clock className="text-amber-500" />} trend="Archived" className="bg-amber-50" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Clicks Overview</h3>
                <span className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 text-slate-600">
                  Last 7 days
                </span>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.clickData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} allowDecimals={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
              <h3 className="font-bold text-slate-900 mb-6">Traffic Sources</h3>
              <div className="h-[220px] flex items-center justify-center text-slate-400">
                {stats?.totalClicks === 0 ? (
                  <p>No clicks yet</p>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "Direct", value: stats?.totalClicks || 1, color: "#0ea5e9" }]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#0ea5e9" />
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-500" />
                    <span className="text-slate-600">Direct Tracking</span>
                  </div>
                  <span className="font-medium text-slate-900">{stats?.totalClicks || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Links</h3>
              <button className="flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">
                <Filter size={16} className="mr-1" /> Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Short URL</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Original URL</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentLinks && stats.recentLinks.length > 0 ? stats.recentLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a href={link.short} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline">{link.shortCode}</a>
                          <button 
                            onClick={() => handleCopy(link.id, link.short)}
                            className="text-slate-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            title="Copy link"
                          >
                            {copiedId === link.id ? <span className="text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded">Copied!</span> : <Copy size={14} />}
                          </button>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{new Date(link.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-sm text-slate-600">
                        {link.original}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {link.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          link.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        You haven't created any links yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, className }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${className}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-slate-50 text-slate-600`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
      </div>
    </motion.div>
  );
}
