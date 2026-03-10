'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, Sparkles, BookOpen, Brain, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (!res.ok) throw new Error(data.error);

      router.push(`/video/${data.videoId}`);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 blur-[120px] rounded-full point-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-900/20 blur-[100px] rounded-full point-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 mb-8 backdrop-blur-xl"
          >
            <Sparkles size={16} /> The Future of Video Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            Turn Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">YouTube</span> Video<br />
            Into A <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Study Guide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Instantly generate detailed summaries, study notes, quizzes, and ask questions about the video content using powerful AI.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="relative max-w-2xl mx-auto mt-12 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            <div className="relative flex items-center bg-gray-900 rounded-2xl border border-gray-800 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-2">
              <div className="absolute left-6 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                <Link2 size={24} />
              </div>
              <input
                type="url"
                required
                placeholder="Paste YouTube Video URL here..."
                className="w-full pl-14 pr-40 py-4 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 flex items-center gap-2 overflow-hidden"
              >
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="animate-pulse" size={18} /> Analyzing
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-2"
                    >
                      Generate <Sparkles size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.form>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left max-w-5xl mx-auto"
          >
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Summaries</h3>
              <p className="text-gray-400 leading-relaxed">Get concise bullet points, detailed explanations, and key takeaways instantly from any long-form video.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Interactive Quizzes</h3>
              <p className="text-gray-400 leading-relaxed">Test your understanding right after watching with AI-generated multi-choice questions covering core concepts.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Chat with Video</h3>
              <p className="text-gray-400 leading-relaxed">Got specific questions? Ask our AI assistant anything about the video content and get answers with exact context.</p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
