import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Filter, Plus, Copy, 
  Trash2, Edit2, Link2, MousePointerClick, 
  Activity, Clock, Loader2, Link as LinkIcon
} from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";

export default function Overview() {
  const [copiedId, setCopiedId] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // URL Shortening state
  const [showCreate, setShowCreate] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/url/shorten`, {
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
      fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setShortening(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-brand-500/25"
        >
          <Plus size={18} /> Create Link
        </button>
      </div>

      {showCreate && (
         <motion.div 
           initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
           className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-brand-500/10"
         >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shorten a new URL</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleCreateLink} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
                <input 
                  type="url" required value={longUrl} onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://your-very-long-url.com/path" 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <button 
                disabled={shortening}
                className="bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-75 flex items-center justify-center min-w-[120px]"
              >
                {shortening ? <Loader2 className="animate-spin" size={18} /> : 'Shorten'}
              </button>
            </form>
         </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Links" value={stats?.totalLinks || 0} icon={<Link2 className="text-blue-500" />} trend="All Time" className="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard title="Total Clicks" value={stats?.totalClicks || 0} icon={<MousePointerClick className="text-indigo-500" />} trend="All Time" className="bg-indigo-50 dark:bg-indigo-500/10" />
        <StatCard title="Active Links" value={stats?.activeLinks || 0} icon={<Activity className="text-emerald-500" />} trend="Live" className="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard title="Expired Links" value={(stats?.totalLinks || 0) - (stats?.activeLinks || 0)} icon={<Clock className="text-amber-500" />} trend="Archived" className="bg-amber-50 dark:bg-amber-500/10" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Clicks Overview</h3>
            <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300">
              Last 7 days
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.clickData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', backgroundColor: '#fff', color: '#000' }}
                />
                <Line type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Traffic Sources</h3>
          <div className="h-[220px] flex items-center justify-center text-slate-400">
            {stats?.totalClicks === 0 ? (
              <p>No clicks yet</p>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: "Direct", value: stats?.totalClicks || 1, color: "#0ea5e9" }]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#0ea5e9" />
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Original URL</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats?.recentLinks && stats.recentLinks.length > 0 ? stats.recentLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a href={link.short} target="_blank" rel="noreferrer" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">{link.shortCode}</a>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-sm text-slate-600 dark:text-slate-300">
                    {link.original}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {link.clicks.toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No links yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, trend, className }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${className}`}>{icon}</div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400`}>{trend}</span>
      </div>
      <div>
        <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      </div>
    </motion.div>
  );
}
