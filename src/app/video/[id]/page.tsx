import { createClient } from '@/lib/supabase/server';
import TopNav from '@/components/TopNav';
import SummaryTabs from '@/components/SummaryTabs';
import ChatBox from '@/components/ChatBox';
import QuizList from '@/components/QuizList';
import { redirect } from 'next/navigation';
import { BookOpen, HelpCircle, FileText, Sparkles, Zap, Brain, Target } from 'lucide-react';
import MagneticSummary from '@/components/MagneticSummary';

export default async function VideoPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: video, error } = await supabase
        .from('videos')
        .select('*, summaries(*)')
        .eq('id', params.id)
        .single();

    if (error || !video) {
        return (
            <div className="min-h-screen bg-black text-white p-12 text-center">
                <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-3xl">
                    <h2 className="text-3xl font-black text-red-500 mb-4">Error 404</h2>
                    <p className="text-gray-400 font-medium">Video not found or access denied.</p>
                </div>
            </div>
        );
    }

    const summaryData = video.summaries[0];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-600/30">
            <TopNav />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-32">
                <div className="flex flex-col space-y-2 mb-12">
                   <div className="flex items-center gap-2 text-blue-400 font-black text-xs tracking-[0.3em] uppercase">
                    <Zap size={14} className="fill-blue-400" /> Analysis Complete
                   </div>
                   <h1 className="text-5xl md:text-6xl font-black tracking-tighter line-clamp-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 max-w-4xl">
                        {video.title}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-16">
                        {/* Video Player Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[40px] blur-2xl opacity-10 group-hover:opacity-25 transition-all duration-1000" />
                            <div className="relative aspect-video bg-gray-950 rounded-[36px] overflow-hidden border border-white/10 shadow-2xl">
                                <iframe
                                    src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=0&rel=0`}
                                    className="w-full h-full absolute inset-0 rounded-[35px]"
                                    allowFullScreen
                                    title={video.title}
                                />
                            </div>
                        </div>

                        {/* Magnetic Summary Hook */}
                        <section id="magnetic-summary" className="scroll-mt-44">
                            <MagneticSummary content={summaryData.short_summary} />
                        </section>

                        {/* Tabs content */}
                        <section id="summary" className="scroll-mt-44 bg-white/[0.02] border border-white/5 rounded-[48px] p-10 backdrop-blur-3xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Brain className="text-blue-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none mb-1">Elite Insights</h2>
                                    <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Deep Understanding & Roadmap</p>
                                </div>
                            </div>
                            <SummaryTabs summary={summaryData} />
                        </section>

                        {/* Quiz Section */}
                        <section id="quiz" className="scroll-mt-44 p-2">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Target className="text-emerald-500" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-none mb-1">Knowledge Check</h2>
                                    <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Test Your Retention</p>
                                </div>
                            </div>
                            {summaryData.quiz_questions && summaryData.quiz_questions.length > 0 ? (
                                <QuizList questions={summaryData.quiz_questions} />
                            ) : (
                                <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[40px] text-center">
                                    <p className="text-gray-500 font-bold italic">AI Assessment not generated for this video yet.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Chat */}
                    <div className="lg:col-span-1 border-l border-white/10 pl-10 h-full relative">
                        <div className="sticky top-44 space-y-10">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                        <HelpCircle className="text-purple-500" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Contextual Chat</h2>
                                </div>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                                    Ask anything specifically about the concepts discussed in this video. Our AI has the full transcript context.
                                </p>
                                <ChatBox videoId={video.id} />
                            </div>

                            {/* Sidebar Ad/Callout */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-emerald-500/10 border border-white/10 p-6 rounded-3xl">
                                <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] tracking-widest uppercase mb-3">
                                    <Sparkles size={12} /> Mastery Level
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-emerald-500" />
                                </div>
                                <p className="text-[11px] text-gray-500 mt-3 font-medium">Keep analyzing videos to increase your knowledge score.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
