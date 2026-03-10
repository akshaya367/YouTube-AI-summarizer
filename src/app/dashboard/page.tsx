import { createClient } from '@/lib/supabase/server';
import TopNav from '@/components/TopNav';
import Link from 'next/link';
import { PlayCircle, Clock, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen bg-black text-white">
            <TopNav />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Your Library
                    </h1>
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <PlayCircle size={20} />
                        Analyze New Video
                    </Link>
                </div>

                {error ? (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-6 rounded-2xl">
                        Error loading your history: {error.message}
                    </div>
                ) : !videos || videos.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-2xl">
                        <Clock className="mx-auto h-16 w-16 text-gray-600 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No videos yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            Paste a YouTube link on the home page to generate your first AI summary.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <Link
                                href={`/video/${video.id}`}
                                key={video.id}
                                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-800">
                                    <img
                                        src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                        alt={video.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 mt-auto pt-4 flex items-center justify-between">
                                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                            View Notes <ArrowRight size={16} />
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
