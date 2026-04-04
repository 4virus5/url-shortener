import { useState, useEffect } from "react";
import { Copy, Filter, Edit2, Trash2, LinkIcon, ExternalLink, Loader2 } from "lucide-react";

export default function MyLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard/stats`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if(res.ok) {
          const data = await res.json();
          setLinks(data.recentLinks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/url/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setLinks(links.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id, currentOriginal) => {
    const newUrl = window.prompt("Edit original URL:", currentOriginal);
    if (!newUrl || newUrl === currentOriginal) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/url/${id}`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ originalUrl: newUrl })
      });
      if (res.ok) {
        setLinks(links.map(l => l.id === id ? { ...l, original: newUrl } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if(loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Links</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and organize all your shortened URLs.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Original URL</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Date Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {links.length > 0 ? links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-brand-50 dark:bg-brand-500/10 rounded-md text-brand-600 dark:text-brand-400">
                        <LinkIcon size={14} />
                      </div>
                      <a href={link.short} target="_blank" rel="noreferrer" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">{link.shortCode}</a>
                      <button 
                        onClick={() => handleCopy(link.id, link.short)}
                        className="text-slate-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                      >
                        {copiedId === link.id ? <span className="text-xs bg-slate-800 text-white px-1.5 py-0.5 rounded">Copied!</span> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{link.original}</span>
                      <a href={link.original} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-slate-500"><ExternalLink size={12} /></a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {link.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500 dark:text-slate-400">
                     {new Date(link.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(link.id, link.original)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(link.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    You haven't created any links yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
