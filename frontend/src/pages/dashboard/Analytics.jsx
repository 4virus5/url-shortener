import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2, Globe, MapPin, Smartphone } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard/stats`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
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
    fetchStats();
  }, []);

  if(loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your traffic metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-brand-500" size={24} />
            <h3 className="font-bold text-slate-900 dark:text-white">Total Engagements</h3>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{stats?.totalClicks || 0}</div>
          <p className="text-sm text-emerald-500 mt-2 font-medium">+100% since creation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
           <h3 className="font-bold text-slate-900 dark:text-white mb-6">Device Geography</h3>
           <div className="h-[250px]">
             {stats?.totalClicks === 0 ? (
               <p className="text-slate-400 text-center mt-20">No data available yet</p>
             ) : (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "Desktop", clicks: stats?.totalClicks || 0 }, { name: "Mobile", clicks: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="dark:opacity-10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="clicks" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
             )}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft">
           <h3 className="font-bold text-slate-900 dark:text-white mb-6">Operating Systems</h3>
           <div className="flex items-center justify-center h-[250px]">
              {stats?.totalClicks === 0 ? (
                 <p className="text-slate-400 text-center">No data available yet</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={[{ name: "Windows", value: stats?.totalClicks || 1, color: "#8b5cf6" }]} innerRadius={60} outerRadius={80} dataKey="value">
                            <Cell fill="#8b5cf6" />
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
