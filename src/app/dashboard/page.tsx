import { createClient } from '@/lib/supabase/server';
import TopNav from '@/components/TopNav';
import Link from 'next/link';
import { PlayCircle, Clock, ArrowRight, Video, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: videos, error } = await supabase
        .from('videos')
        .select('*, summaries(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-600/30">
            <TopNav />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-500 font-black text-xs tracking-[0.3em] uppercase">
                            <Video size={14} className="fill-blue-500" /> Member Workspace
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                             Video Library
                        </h1>
                    </div>
                    
                    <Link
                        href="/"
                        className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-tight transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
                    >
                        NEW ANALYSIS
                        <div className="p-1 bg-white/10 rounded-lg group-hover:rotate-12 transition-transform">
                            <PlayCircle size={18} />
                        </div>
                    </Link>
                </div>

                {error ? (
                    <div className="bg-red-500/5 border border-red-500/10 text-red-400 p-8 rounded-[32px] backdrop-blur-3xl text-center">
                        <p className="font-bold tracking-tight">System disruption detected: {error.message}</p>
                    </div>
                ) : !videos || videos.length === 0 ? (
                    <div className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-[48px] backdrop-blur-3xl">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 text-gray-700">
                             <Clock size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-3 tracking-tight">No Insights Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
                            Paste a YouTube link on the command center to generate your first elite AI analysis.
                        </p>
                        <Link href="/" className="text-blue-400 font-black tracking-widest text-xs uppercase hover:text-blue-300 transition-colors">
                            Return to Command Center &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {videos.map((video) => (
                            <Link
                                href={`/video/${video.id}`}
                                key={video.id}
                                className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:-translate-y-2 flex flex-col h-full backdrop-blur-3xl"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-950">
                                    <img
                                        src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                        alt={video.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 grayscale-[0.5] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    
                                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-[10px] font-black text-blue-400 tracking-widest uppercase flex items-center gap-1.5">
                                        <Sparkles size={10} className="fill-blue-400" /> AI ANALYZED
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-400 transition-all">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                        <span className="text-[11px] font-black text-gray-600 tracking-widest uppercase">
                                            {new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-2 text-blue-500 font-black text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                                            ACCESS <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
