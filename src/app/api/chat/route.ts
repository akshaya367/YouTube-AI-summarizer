import { NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { videoId, question } = await req.json();

        const { data: video } = await supabase
            .from('videos')
            .select('transcript')
            .eq('id', videoId)
            .single();

        if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 });

        const answer = await answerQuestion(video.transcript, question);
        return NextResponse.json({ answer });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
