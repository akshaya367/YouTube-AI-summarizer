'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User, LogOut, LayoutDashboard, Sparkles, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopNav() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  return (
    <nav className="fixed top-6 z-[100] left-0 right-0 mx-auto max-w-5xl px-4 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <Link href="/" className="flex items-center gap-2.5 group pl-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all">
            <Youtube className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">LEXICON.</span>
            <span className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase mt-1">ELITE AI ANALYZER</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3 pr-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black text-gray-500 tracking-[0.1em] uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
            CORE READY
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="p-3 bg-white/[0.03] hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all active:scale-95 group"
              >
                <LayoutDashboard size={20} className="group-hover:text-blue-400 transition-colors" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-3 bg-red-500/5 hover:bg-red-500/15 text-red-500 rounded-2xl border border-red-500/10 transition-all active:scale-95 group"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="w-11 h-11 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 flex items-center justify-center text-white ring-2 ring-transparent hover:ring-blue-500/50 transition-all overflow-hidden p-0.5">
                   <div className="w-full h-full bg-gray-900 rounded-[14px] flex items-center justify-center">
                    <User size={18} className="text-gray-400" />
                   </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] font-black transition-all shadow-xl shadow-blue-600/30 active:scale-95 text-sm tracking-tight"
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
