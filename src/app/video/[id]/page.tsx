import { createClient } from '@/lib/supabase/server';
import TopNav from '@/components/TopNav';
import SummaryTabs from '@/components/SummaryTabs';
import ChatBox from '@/components/ChatBox';
import QuizList from '@/components/QuizList';
import { redirect } from 'next/navigation';
import { BookOpen, HelpCircle, FileText } from 'lucide-react';

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
            <div className="min-h-screen bg-black text-white p-12 text-center text-red-500 font-bold text-2xl">
                Video not found or you don't have access.
            </div>
        );
    }

    const summaryData = video.summaries[0];

    return (
        <div className="min-h-screen bg-black text-white">
            <TopNav />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl md:text-5xl font-black mb-8 line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    {video.title}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="aspect-video bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                            <iframe
                                src={`https://www.youtube.com/embed/${video.youtube_id}`}
                                className="w-full h-full absolute inset-0 rounded-3xl"
                                allowFullScreen
                                title={video.title}
                            />
                        </div>

                        <section id="summary" className="scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FileText className="text-blue-500" size={24} />
                                </div>
                                <h2 className="text-3xl font-bold">AI Analysis</h2>
                            </div>
                            <SummaryTabs summary={summaryData} />
                        </section>

                        <section id="quiz" className="scroll-mt-24 pt-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <BookOpen className="text-emerald-500" size={24} />
                                </div>
                                <h2 className="text-3xl font-bold">Knowledge Check</h2>
                            </div>
                            {summaryData.quiz_questions && summaryData.quiz_questions.length > 0 ? (
                                <QuizList questions={summaryData.quiz_questions} />
                            ) : (
                                <p className="text-gray-500 italic bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">Quiz not available for this video yet.</p>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-1 border-l border-gray-800 pl-8 h-full sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <HelpCircle className="text-purple-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">Ask AI</h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Got questions that weren't answered in the summary? Ask the AI directly below.</p>
                        <ChatBox videoId={video.id} />
                    </div>
                </div>
            </main>
        </div>
    );
}
