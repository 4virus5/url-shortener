import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Shield, QrCode, Link2, Globe } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Landing() {
  const features = [
    {
      icon: <Zap className="text-brand-500" size={24} />,
      title: "Lightning Fast",
      description: "Create short links in milliseconds. Our global CDN ensures rapid redirects worldwide."
    },
    {
      icon: <BarChart3 className="text-brand-500" size={24} />,
      title: "Real-time Analytics",
      description: "Track clicks, geographic data, and referring channels in a modern unified dashboard."
    },
    {
      icon: <Shield className="text-brand-500" size={24} />,
      title: "Secure & Reliable",
      description: "SSL encrypted links with 99.99% uptime guarantee. Your links are always active."
    },
    {
      icon: <QrCode className="text-brand-500" size={24} />,
      title: "Dynamic QR Codes",
      description: "Generate customized QR codes instantly for offline marketing campaigns."
    },
    {
      icon: <Link2 className="text-brand-500" size={24} />,
      title: "Custom Short Codes",
      description: "Brand your links with custom aliases to increase click-through rates and trust."
    },
    {
      icon: <Globe className="text-brand-500" size={24} />,
      title: "Custom Domains",
      description: "Use your own brand domain for shortened links. E.g., link.yourbrand.com."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar />

      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
            Linkify 2.0 is now live
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Shorten, Track, and Manage Your Links <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Effortlessly</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The premium URL shortener designed for modern teams. Boost your brand, track engagement, and analyze performance all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="text-slate-400" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Paste your long link here..." 
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow text-slate-800 placeholder-slate-400"
              />
            </div>
            <motion.button 
              onClick={() => {
                const token = localStorage.getItem('token');
                if(!token) {
                  window.location.href = '/login';
                } else {
                  window.location.href = '/dashboard';
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              Shorten URL <ArrowRight size={18} />
            </motion.button>
          </div>
          <p className="mt-4 text-sm text-slate-500 font-medium">100% Free forever. Shorten unlimited links.</p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform provides industry-leading features wrapped in an elegant, minimal user interface.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[200%] rounded-full bg-brand-600/20 blur-[80px]" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 relative z-10">Ready to take control of your links?</h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto relative z-10">Join thousands of modern teams building their brand through better link management.</p>
            <Link to="/dashboard" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors">
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
