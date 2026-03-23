'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, Sparkles, BookOpen, Brain, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '@/components/TopNav';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      
      if (res.status === 401) {
        router.push('/login?message=Please sign in to analyze videos');
        return;
      }

      if (!res.ok) throw new Error(data.error);
      router.push(`/video/${data.videoId}`);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
      <TopNav />
      
      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-20 overflow-hidden">

        {/* Dynamic Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full point-events-none animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full point-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full point-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-bold tracking-widest text-blue-400 mb-4 backdrop-blur-3xl shadow-xl uppercase"
          >
            <Sparkles size={14} className="animate-spin-slow" /> The Future of Video Micro-Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
          >
            Master Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">YouTube</span> Video In Seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Our elite AI extracts deep insights, generates study guides, and tests your knowledge instantly. Save hours of watching and start mastering content.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="relative max-w-3xl mx-auto mt-16 group"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50" />

            <div className="relative flex items-center bg-gray-950/80 rounded-[28px] border border-white/10 focus-within:border-blue-500/50 backdrop-blur-2xl shadow-2xl p-2.5 transition-all">
              <div className="absolute left-8 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                <Link2 size={28} />
              </div>
              <input
                type="url"
                required
                placeholder="Paste YouTube Video URL here..."
                className="w-full pl-16 pr-44 py-5 bg-transparent text-white placeholder-gray-600 outline-none text-xl font-medium"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3.5 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2 group/btn active:scale-95"
              >
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2 tracking-tighter"
                    >
                      <Sparkles className="animate-spin" size={20} /> ANALYZING...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2 group-hover/btn:gap-3 transition-all"
                    >
                      GENERATE <Sparkles size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.form>

          {/* Feature Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 text-left max-w-6xl mx-auto"
          >
            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 backdrop-blur-lg hover:bg-white/[0.05] hover:border-blue-500/20 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <BookOpen size={30} />
              </div>
              <h3 className="text-2xl font-black mb-4">Elite Analysis</h3>
              <p className="text-gray-400 leading-relaxed font-medium">Deep insights, magnetic summaries, and actionable steps using state-of-the-art AI architecture.</p>
            </div>

            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 backdrop-blur-lg hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Brain size={30} />
              </div>
              <h3 className="text-2xl font-black mb-4">Cognitive Tests</h3>
              <p className="text-gray-400 leading-relaxed font-medium">Automated quizzes that challenge your retention and mastery of the video core concepts.</p>
            </div>

            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 backdrop-blur-lg hover:bg-white/[0.05] hover:border-purple-500/20 transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <MessageSquare size={30} />
              </div>
              <h3 className="text-2xl font-black mb-4">Contextual Chat</h3>
              <p className="text-gray-400 leading-relaxed font-medium">Chat directly with the video content. Get precise answers based on the transcript seamlessly.</p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
